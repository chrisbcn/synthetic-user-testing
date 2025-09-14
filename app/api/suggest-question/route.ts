import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { lastInterviewerMsg, lastPersonaResponse, persona, scenario } = body

    if (!lastInterviewerMsg || !lastPersonaResponse) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "Claude API key not configured" }, { status: 500 })
    }

    const personaName = persona?.name || "the participant"
    const scenarioDescription = scenario?.description || "this topic"

    const systemPrompt = `You are an expert UX researcher conducting an interview about ${scenarioDescription}.

Based on this recent exchange with ${personaName}:

INTERVIEWER: ${lastInterviewerMsg}
PARTICIPANT: ${lastPersonaResponse}

Generate a natural follow-up question that:
- Builds directly on what the participant just shared
- Uses conversational techniques like "Tell me more about..." or "Walk me through..."
- Shows genuine curiosity about their perspective
- Probes deeper into their experience or reasoning
- Feels natural and unscripted

Respond with ONLY the suggested question - no quotes, no explanations, no stage directions.`

    const result = await generateText({
      model: anthropic("claude-3-haiku-20240307"),
      prompt: systemPrompt,
      maxTokens: 200,
    })

    const suggestedQuestion = result.text?.replace(/['"]/g, "").trim() || ""

    return NextResponse.json({
      suggestedQuestion,
      success: true,
    })
  } catch (error) {
    console.error("Question suggestion API error:", error)
    return NextResponse.json({ error: "Failed to generate question suggestion" }, { status: 500 })
  }
}
