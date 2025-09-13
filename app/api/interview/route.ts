import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"

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

async function makeClaudeAPICallWithRetry(systemPrompt: string, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[v0] Making Claude API call (attempt ${attempt}/${maxRetries})`)

      const result = await generateText({
        model: anthropic("claude-3-haiku-20240307"),
        prompt: systemPrompt,
        maxTokens: 1000,
      })

      console.log("[v0] Claude API response received successfully")
      console.log("[v0] Response text length:", result.text?.length || 0)

      return result.text
    } catch (error) {
      console.error(`[v0] Claude API error (attempt ${attempt}):`, error)

      if (error instanceof Error) {
        console.error(`[v0] Error message: ${error.message}`)
        console.error(`[v0] Error stack: ${error.stack}`)
      } else {
        console.error(`[v0] Non-Error object thrown:`, typeof error, error)
      }

      if (attempt === maxRetries) {
        throw error
      }

      const delay = 2000 * attempt // 2s, 4s, 6s
      console.log(`[v0] API call failed, retrying in ${delay}ms (attempt ${attempt}/${maxRetries})`)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Interview API called")

    const clientId = request.headers.get("x-forwarded-for") || "default"
    const rateLimitCheck = checkRateLimit(clientId)

    if (!rateLimitCheck.allowed) {
      console.log(`[v0] Rate limit exceeded for client ${clientId}`)
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

    const body = await request.json()
    const { persona, scenario, message, conversationHistory } = body

    if (!persona || !scenario || !message) {
      return NextResponse.json({ error: "Missing required fields: persona, scenario, or message" }, { status: 400 })
    }

    console.log("[v0] Request validated successfully")

    const personaName = persona.name || "User"
    const personaType = persona.type || "customer"
    const personaBackground = persona.background || "General user"
    const personaAge = persona.age || "30"
    const personaLocation = persona.location || "Unknown"
    const personaQuotes = persona.keyQuotes || []

    const scenarioName = scenario.name || "Interview"
    const scenarioDescription = scenario.description || "General interview"

    console.log("[v0] Persona and scenario data processed")

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "Claude API key not configured" }, { status: 500 })
    }

    console.log("[v0] API key found, making Claude API call")

    let conversationContext = ""
    if (conversationHistory && conversationHistory.length > 0) {
      conversationContext = conversationHistory
        .map((turn: any) => {
          const speaker = turn.speaker === "moderator" ? "Researcher" : personaName
          return `${speaker}: ${turn.message || ""}`
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

    const claudeResponse = await makeClaudeAPICallWithRetry(systemPrompt)

    const personaResponse = claudeResponse || "I'm sorry, I couldn't generate a response."

    return NextResponse.json({
      response: personaResponse,
      success: true,
    })
  } catch (error) {
    console.error("[v0] API Error:", error)

    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    console.error("[v0] Error details:", errorMessage)

    if (errorMessage.includes("rate_limit") || errorMessage.includes("429")) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please wait a moment before continuing the conversation.",
          details: "The API is temporarily rate limited. Try again in a few seconds.",
          success: false,
          retryAfter: 15000,
        },
        { status: 429 },
      )
    }

    return NextResponse.json(
      {
        error: "Failed to generate persona response",
        details: errorMessage,
        success: false,
      },
      { status: 500 },
    )
  }
}
