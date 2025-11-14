import { type NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { logger, AppError, createErrorResponse, sanitizeString, validateRequired, isArray, isObject, isString } from "@/lib/utils"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
})

interface ConversationTurn {
  speaker: "moderator" | "persona"
  message: string
  timestamp?: string | Date
}

interface AnalyzeRequestBody {
  conversation?: ConversationTurn[]
  persona?: {
    name?: string
    type?: string
    background?: string
  }
  scenario?: {
    name?: string
  }
}

export async function POST(request: NextRequest) {
  try {
    logger.info("Analyze API called")

    // Parse and validate request body
    let body: AnalyzeRequestBody
    try {
      body = await request.json()
    } catch (error) {
      throw new AppError("Invalid JSON in request body", 400, "INVALID_JSON")
    }

    // Validate required fields
    const validation = validateRequired(body, ["conversation", "persona", "scenario"])
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

    // Validate and sanitize data
    const conversation = body.conversation!
    const persona = body.persona!
    const scenario = body.scenario!

    if (!isArray(conversation) || conversation.length === 0) {
      throw new AppError("Conversation must be a non-empty array", 400, "INVALID_CONVERSATION")
    }

    const personaName = sanitizeString(persona.name || "User", 100)
    const personaType = sanitizeString(persona.type || "customer", 50)
    const personaBackground = sanitizeString(persona.background || "", 2000)
    const scenarioName = sanitizeString(scenario.name || "Interview", 100)

    // Build conversation transcript with validation
    const transcript = conversation
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

    if (!transcript) {
      throw new AppError("No valid conversation turns found", 400, "INVALID_CONVERSATION")
    }

    const analysisPrompt = sanitizeString(
      `Analyze this user research interview transcript and provide insights:

INTERVIEW CONTEXT:
Persona: ${personaName} (${personaType})
Scenario: ${scenarioName}
Background: ${personaBackground}

TRANSCRIPT:
${transcript}

Please provide a comprehensive analysis in the following JSON format:
{
  "keyInsights": [
    "List 3-5 key insights from the interview",
    "Focus on actionable findings about user behavior and preferences"
  ],
  "sentiment": {
    "overall": "positive|neutral|negative",
    "confidence": 0.85,
    "reasoning": "Brief explanation of sentiment assessment"
  },
  "authenticityScore": 0.92,
  "painPoints": [
    "List specific pain points mentioned or implied"
  ],
  "opportunities": [
    "List potential opportunities or solutions suggested"
  ],
  "quotes": [
    "Extract 2-3 most impactful quotes from the persona"
  ],
  "recommendations": [
    "Provide 3-4 actionable recommendations based on the insights"
  ]
}

Ensure the analysis is thorough, actionable, and focuses on UX insights that would be valuable for product teams.`,
      50000
    )

    logger.debug("Calling Claude API for analysis")

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1500,
      temperature: 0.3,
      messages: [
        {
          role: "user",
          content: analysisPrompt,
        },
      ],
    })

    const analysisText = response.content[0]?.type === "text" ? response.content[0].text : ""

    if (!analysisText) {
      throw new AppError("Empty response from Claude API", 500, "EMPTY_RESPONSE")
    }

    // Extract JSON from the response
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      logger.error("Failed to parse analysis response", { analysisText: analysisText.substring(0, 200) })
      throw new AppError("Failed to parse analysis response", 500, "PARSE_ERROR")
    }

    let analysis: unknown
    try {
      analysis = JSON.parse(jsonMatch[0])
    } catch (parseError) {
      logger.error("JSON parse error", parseError)
      throw new AppError("Failed to parse analysis JSON", 500, "JSON_PARSE_ERROR")
    }

    logger.info("Analysis completed successfully")

    return NextResponse.json({
      analysis,
      success: true,
    })
  } catch (error) {
    logger.error("Analysis API error", error)
    const errorResponse = createErrorResponse(error, "Failed to analyze interview data")
    return NextResponse.json(errorResponse, { status: errorResponse.statusCode || 500 })
  }
}
