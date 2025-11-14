import { type NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { logger, AppError, createErrorResponse, sanitizeString, validateRequired, isString } from "@/lib/utils"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
})

interface SuggestQuestionRequestBody {
  lastInterviewerMsg?: string
  lastPersonaResponse?: string
  persona?: {
    name?: string
  }
  scenario?: {
    description?: string
  }
}

export async function POST(request: NextRequest) {
  try {
    logger.info("Suggest question API called")

    // Parse and validate request body
    let body: SuggestQuestionRequestBody
    try {
      body = await request.json()
    } catch (error) {
      throw new AppError("Invalid JSON in request body", 400, "INVALID_JSON")
    }

    // Validate required fields
    const validation = validateRequired(body, ["lastInterviewerMsg", "lastPersonaResponse"])
    if (!validation.isValid) {
      throw new AppError(
        `Missing required fields: ${validation.missing.join(", ")}`,
        400,
        "MISSING_REQUIRED_FIELDS",
        { missing: validation.missing }
      )
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      throw new AppError("Claude API key not configured", 500, "API_KEY_MISSING")
    }

    // Sanitize inputs
    const lastInterviewerMsg = sanitizeString(body.lastInterviewerMsg!, 2000)
    const lastPersonaResponse = sanitizeString(body.lastPersonaResponse!, 2000)
    const personaName = sanitizeString(body.persona?.name || "the participant", 100)
    const scenarioDescription = sanitizeString(body.scenario?.description || "this topic", 500)

    if (!lastInterviewerMsg || !lastPersonaResponse) {
      throw new AppError("Messages cannot be empty", 400, "EMPTY_MESSAGE")
    }

    const systemPrompt = sanitizeString(
      `You are an expert UX researcher conducting an interview about ${scenarioDescription}.

Based on this recent exchange with ${personaName}:

INTERVIEWER: ${lastInterviewerMsg}
PARTICIPANT: ${lastPersonaResponse}

Generate a natural follow-up question that:
- Builds directly on what the participant just shared
- Uses conversational techniques like "Tell me more about..." or "Walk me through..."
- Shows genuine curiosity about their perspective
- Probes deeper into their experience or reasoning
- Feels natural and unscripted

Respond with ONLY the suggested question - no quotes, no explanations, no stage directions.`,
      5000
    )

    logger.debug("Calling Claude API for question suggestion")

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514", // Latest Claude Sonnet 4 model
      max_tokens: 300,
      temperature: 0.8, // Higher for more creative question suggestions
      messages: [
        {
          role: "user",
          content: systemPrompt,
        },
      ],
    })

    const suggestedQuestion = sanitizeString(
      (response.content[0]?.type === "text" ? response.content[0].text : "").replace(/['"]/g, "").trim() || "",
      500
    )

    if (!suggestedQuestion) {
      throw new AppError("Failed to generate question suggestion", 500, "EMPTY_RESPONSE")
    }

    logger.info("Question suggestion generated successfully")

    return NextResponse.json({
      suggestedQuestion,
      success: true,
    })
  } catch (error) {
    logger.error("Question suggestion API error", error)
    const errorResponse = createErrorResponse(error, "Failed to generate question suggestion")
    return NextResponse.json(errorResponse, { status: errorResponse.statusCode || 500 })
  }
}
