import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"
import { logger, AppError, createErrorResponse, sanitizeString, validateRequired, isObject, isArray, isString } from "@/lib/utils"

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

async function makeClaudeAPICallWithRetry(systemPrompt: string, maxRetries = 3): Promise<string> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      logger.debug(`Making Claude API call (attempt ${attempt}/${maxRetries})`)

      const result = await generateText({
        model: anthropic("claude-3-haiku-20240307"),
        prompt: systemPrompt,
        maxTokens: 1000,
      })

      const responseText = result.text || ""
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
  speaker: "moderator" | "persona"
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
  }
  scenario?: {
    name?: string
    description?: string
  }
  message?: string
  conversationHistory?: ConversationTurn[]
  interviewer?: unknown
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
      ? persona.keyQuotes.filter(isString).map(q => sanitizeString(q, 500))
      : []

    const scenarioName = sanitizeString(scenario.name || "Interview", 100)
    const scenarioDescription = sanitizeString(scenario.description || "General interview", 1000)

    logger.debug("Request validated successfully", { personaName, scenarioName })

    // Build conversation context
    let conversationContext = ""
    if (isArray(body.conversationHistory) && body.conversationHistory.length > 0) {
      conversationContext = body.conversationHistory
        .filter((turn): turn is ConversationTurn => 
          isObject(turn) && 
          (turn.speaker === "moderator" || turn.speaker === "persona") &&
          isString(turn.message)
        )
        .map((turn) => {
          const speaker = turn.speaker === "moderator" ? "Researcher" : personaName
          const message = sanitizeString(turn.message, 5000)
          return `${speaker}: ${message}`
        })
        .join("\n")
    }

    const systemPrompt = `You are ${personaName}, a ${personaAge}-year-old ${personaType} from ${personaLocation}.

Background: ${personaBackground}

${personaQuotes.length > 0 ? `Key quotes that represent your perspective: ${personaQuotes.join("; ")}` : ""}

You are having a thoughtful conversation with a researcher about ${scenarioName}: ${scenarioDescription}

CRITICAL INSTRUCTIONS - READ CAREFULLY:

You are an intelligent, sophisticated person. Your responses must be:
- DIRECT SPEECH ONLY - no actions, no stage directions, no "*anything*"
- NATURAL and CONVERSATIONAL - like you're sitting across from someone having coffee
- SUBSTANTIVE but CONCISE - 2-4 sentences that show real thought
- CONFIDENT without being verbose - smart people don't need to prove it with big words

SPEAKING STYLE:
- Use everyday language with natural contractions: "I'm," "don't," "can't," "it's"
- Be specific and concrete - share real examples from your experience
- Express opinions clearly - you have well-formed views
- If you disagree, say so directly and explain why
- Sound like a real person, not a character in a play

ABSOLUTELY NEVER:
- Use stage directions: NO "*smiles*", "*chuckles*", "*leans forward*", "*pauses*"
- Use theatrical language: NO "indeed," "one might say," "as it were"
- Be overly formal or pretentious
- Ramble or use unnecessary words
- Sound like you're performing or acting

EXAMPLE OF GOOD RESPONSE:
"I don't think that approach would work for my lifestyle. I need pieces that transition from day to evening, and most of those suggestions are too casual for client meetings."

EXAMPLE OF BAD RESPONSE:
"*chuckles softly* Well, one might indeed consider that approach, though I must confess it doesn't quite align with my particular lifestyle requirements. *leans forward thoughtfully*"

${conversationContext ? `Previous conversation:\n${conversationContext}\n\nContinue the conversation naturally:` : "Respond thoughtfully to:"}

Researcher: ${message}

Your response (direct speech only, no stage directions):`

    // Sanitize the prompt to prevent injection
    const sanitizedPrompt = sanitizeString(systemPrompt, 50000)
    
    const claudeResponse = await makeClaudeAPICallWithRetry(sanitizedPrompt)
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
