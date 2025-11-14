import { type NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { logger, AppError, createErrorResponse, sanitizeString, validateRequired, isObject, isArray, isString } from "@/lib/utils"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
})

const requestTracker = new Map<string, { count: number; resetTime: number; lastRequest: number }>()
const RATE_LIMIT_WINDOW = 60000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10 // Increased from 5 to 10 requests per minute
const MIN_REQUEST_INTERVAL = 3000 // Reduced from 10 seconds to 3 seconds between requests

function checkRateLimit(clientId: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now()
  const tracker = requestTracker.get(clientId)

  if (!tracker || now > tracker.resetTime) {
    // Reset or initialize tracker
    requestTracker.set(clientId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW, lastRequest: now })
    return { allowed: true }
  }

  const timeSinceLastRequest = now - tracker.lastRequest
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const retryAfter = Math.ceil((MIN_REQUEST_INTERVAL - timeSinceLastRequest) / 1000)
    return { allowed: false, retryAfter }
  }

  if (tracker.count >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfter = Math.ceil((tracker.resetTime - now) / 1000)
    return { allowed: false, retryAfter }
  }

  tracker.count++
  tracker.lastRequest = now
  return { allowed: true }
}

async function makeClaudeAPICallWithRetry(
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  systemPrompt: string,
  maxRetries = 3
): Promise<string> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      logger.debug(`Making Claude API call (attempt ${attempt}/${maxRetries})`)

      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514", // Latest Claude Sonnet 4 model
        max_tokens: 2000, // Increased for more in-depth responses
        temperature: 0.7, // Slightly higher for more natural conversation
        system: systemPrompt,
        messages: messages as any,
      })

      const responseText = response.content[0]?.type === "text" ? response.content[0].text : ""
      logger.debug(`Claude API response received successfully`, { length: responseText.length })

      return responseText
    } catch (error) {
      logger.error(`Claude API error (attempt ${attempt}/${maxRetries})`, error)

      if (attempt === maxRetries) {
        throw new AppError(
          "Failed to generate persona response after retries",
          500,
          "CLAUDE_API_ERROR",
          error
        )
      }

      const delay = 2000 * attempt // 2s, 4s, 6s
      logger.warn(`API call failed, retrying in ${delay}ms (attempt ${attempt}/${maxRetries})`)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw new AppError("Failed to generate response", 500, "CLAUDE_API_ERROR")
}

interface ConversationTurn {
  speaker: "moderator" | "persona" | "interviewer"
  message: string
  timestamp?: string | Date
}

interface InterviewRequestBody {
  persona?: {
    name?: string
    type?: string
    background?: string
    age?: number | string
    location?: string
    keyQuotes?: string[]
    personality_profile?: {
      core_traits?: string[]
      communication_style?: string
    }
  }
  scenario?: {
    name?: string
    description?: string
  }
  interviewer?: {
    name?: string
    specialization?: string
    interview_style?: string
    expertise?: string[]
  }
  message?: string
  conversationHistory?: ConversationTurn[]
  apiKey?: string
}

export async function POST(request: NextRequest) {
  try {
    logger.info("Interview API called")

    // Rate limiting
    const clientId = sanitizeString(request.headers.get("x-forwarded-for") || "default", 100)
    const rateLimitCheck = checkRateLimit(clientId)

    if (!rateLimitCheck.allowed) {
      logger.warn(`Rate limit exceeded for client ${clientId}`)
      return NextResponse.json(
        {
          error: "Too many requests. Please slow down the conversation pace.",
          details: `Rate limit exceeded. Please wait ${rateLimitCheck.retryAfter} seconds before continuing.`,
          success: false,
          retryAfter: (rateLimitCheck.retryAfter || 10) * 1000,
        },
        { status: 429 },
      )
    }

    // Parse and validate request body
    let body: InterviewRequestBody
    try {
      body = await request.json()
    } catch (error) {
      throw new AppError("Invalid JSON in request body", 400, "INVALID_JSON")
    }

    // Validate required fields
    const validation = validateRequired(body, ["persona", "scenario", "message"])
    if (!validation.isValid) {
      throw new AppError(
        `Missing required fields: ${validation.missing.join(", ")}`,
        400,
        "MISSING_REQUIRED_FIELDS",
        { missing: validation.missing }
      )
    }

    // Validate API key
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new AppError("Claude API key not configured", 500, "API_KEY_MISSING")
    }

    // Sanitize and extract data
    const persona = body.persona!
    const scenario = body.scenario!
    const message = sanitizeString(body.message!, 5000) // Max 5000 chars per message

    if (!message) {
      throw new AppError("Message cannot be empty", 400, "EMPTY_MESSAGE")
    }

    const personaName = sanitizeString(persona.name || "User", 100)
    const personaType = sanitizeString(persona.type || "customer", 50)
    const personaBackground = sanitizeString(persona.background || "General user", 2000)
    const personaAge = typeof persona.age === "number" ? persona.age : Number.parseInt(String(persona.age || "30"))
    const personaLocation = sanitizeString(persona.location || "Unknown", 100)
    const personaQuotes = isArray(persona.keyQuotes)
      ? persona.keyQuotes.filter(isString).map((q) => sanitizeString(q, 500))
      : []
    const personaCommunicationStyle = persona.personality_profile?.communication_style || "natural and conversational"
    const personaTraits = persona.personality_profile?.core_traits || []

    const scenarioName = sanitizeString(scenario.name || "Interview", 100)
    const scenarioDescription = sanitizeString(scenario.description || "General interview", 1000)

    const interviewer = body.interviewer
    const interviewerName = interviewer?.name ? sanitizeString(interviewer.name, 100) : null
    const interviewerSpecialization = interviewer?.specialization ? sanitizeString(interviewer.specialization, 200) : null
    const interviewerStyle = interviewer?.interview_style ? sanitizeString(interviewer.interview_style, 500) : null

    logger.debug("Request validated successfully", { personaName, scenarioName, interviewerName })

    // Build conversation history using proper Messages API format with clear speaker distinction
    const messages: Array<{ role: "user" | "assistant"; content: string }> = []

    if (isArray(body.conversationHistory) && body.conversationHistory.length > 0) {
      for (const turn of body.conversationHistory) {
        if (
          isObject(turn) &&
          (turn.speaker === "moderator" || turn.speaker === "interviewer" || turn.speaker === "persona") &&
          isString(turn.message)
        ) {
          const sanitizedMessage = sanitizeString(turn.message, 5000)

          if (turn.speaker === "moderator" || turn.speaker === "interviewer") {
            // Interviewer messages are "user" role with name label
            const interviewerLabel = interviewerName || "Researcher"
            messages.push({
              role: "user",
              content: `${interviewerLabel}: ${sanitizedMessage}`,
            })
          } else if (turn.speaker === "persona") {
            // Persona responses are "assistant" role
            messages.push({
              role: "assistant",
              content: sanitizedMessage,
            })
          }
        }
      }
    }

    // Add current interviewer message with name
    const currentInterviewerLabel = interviewerName || "Researcher"
    messages.push({
      role: "user",
      content: `${currentInterviewerLabel}: ${message}`,
    })

    // Build comprehensive system prompt with interviewer context
    let systemPrompt = `You are ${personaName}, a ${personaAge}-year-old ${personaType} from ${personaLocation}.

BACKGROUND:
${personaBackground}

${personaTraits.length > 0 ? `CORE PERSONALITY TRAITS: ${personaTraits.join(", ")}` : ""}
${personaQuotes.length > 0 ? `KEY QUOTES THAT REPRESENT YOUR PERSPECTIVE:\n${personaQuotes.map(q => `- "${q}"`).join("\n")}` : ""}

COMMUNICATION STYLE: ${personaCommunicationStyle}

INTERVIEW CONTEXT:
You are participating in a professional user research interview about: ${scenarioName}
${scenarioDescription ? `\nScenario Details: ${scenarioDescription}` : ""}

${interviewerName ? `INTERVIEWER: You are being interviewed by ${interviewerName}` : ""}
${interviewerSpecialization ? `, a specialist in ${interviewerSpecialization}` : ""}
${interviewerStyle ? `\nInterviewer Style: ${interviewerStyle}` : ""}

CRITICAL INSTRUCTIONS:

1. RESPONSE STYLE:
   - Use DIRECT SPEECH ONLY - no actions, no stage directions, no "*anything*"
   - Be NATURAL and CONVERSATIONAL - like you're having a thoughtful discussion
   - Be SUBSTANTIVE and THOROUGH - provide detailed, thoughtful responses (3-8 sentences typically)
   - Share SPECIFIC EXAMPLES from your experience when relevant
   - Express your OPINIONS CLEARLY - you have well-formed views based on your background

2. SPEAKING STYLE:
   - Use everyday language with natural contractions: "I'm," "don't," "can't," "it's"
   - Be specific and concrete - reference real situations, preferences, and experiences
   - If you disagree with something, say so directly and explain your reasoning
   - Sound like a real person having a genuine conversation, not performing

3. DEPTH AND ENGAGEMENT:
   - Provide thoughtful, detailed responses that show real consideration
   - Elaborate on your reasoning when asked follow-up questions
   - Reference your background and experiences naturally
   - Show engagement with the interviewer's questions

4. ABSOLUTELY NEVER:
   - Use stage directions: NO "*smiles*", "*chuckles*", "*leans forward*", "*pauses*"
   - Use theatrical language: NO "indeed," "one might say," "as it were"
   - Be overly formal or pretentious
   - Give one-word or very short answers (unless specifically asked for a brief response)
   - Sound like you're performing or acting

EXAMPLE OF GOOD RESPONSE:
"I've actually had mixed experiences with TheRealReal. On one hand, I appreciate the convenience and the wide selection - I've found some amazing vintage pieces there that I couldn't get anywhere else. But I've also had issues with how they handle authentication and presentation. I once received a Chanel bag that was clearly authentic but was presented so poorly that it made me question the whole process. That's why I'm interested in brand-managed resale - I think having the brand's direct involvement would give me more confidence in both authenticity and quality."

EXAMPLE OF BAD RESPONSE:
"*chuckles softly* Well, one might indeed consider that approach, though I must confess it doesn't quite align with my particular lifestyle requirements. *leans forward thoughtfully*"

Remember: You are ${personaName}. Respond naturally as this person would, drawing on their background, values, and experiences.`

    const claudeResponse = await makeClaudeAPICallWithRetry(messages, systemPrompt)
    const personaResponse = sanitizeString(claudeResponse || "I'm sorry, I couldn't generate a response.", 5000)

    logger.info("Interview response generated successfully")

    return NextResponse.json({
      response: personaResponse,
      success: true,
    })
  } catch (error) {
    logger.error("Interview API error", error)

    const errorResponse = createErrorResponse(error, "Failed to generate persona response")

    // Handle rate limit errors specifically
    if (error instanceof Error && (error.message.includes("rate_limit") || error.message.includes("429"))) {
      return NextResponse.json(
        {
          ...errorResponse,
          error: "Rate limit exceeded. Please wait a moment before continuing the conversation.",
          retryAfter: 15000,
        },
        { status: 429 },
      )
    }

    return NextResponse.json(
      errorResponse,
      { status: errorResponse.statusCode || 500 },
    )
  }
}
