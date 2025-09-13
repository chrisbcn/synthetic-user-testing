import { type NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
})

export async function POST(request: NextRequest) {
  try {
    const { conversation, persona, scenario } = await request.json()

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "Claude API key not configured" }, { status: 500 })
    }

    // Build conversation transcript
    const transcript = conversation
      .map((turn: any) => `${turn.speaker === "moderator" ? "Researcher" : persona.name}: ${turn.message}`)
      .join("\n")

    const analysisPrompt = `Analyze this user research interview transcript and provide insights:

INTERVIEW CONTEXT:
Persona: ${persona.name} (${persona.type})
Scenario: ${scenario.name}
Background: ${persona.background}

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

Ensure the analysis is thorough, actionable, and focuses on UX insights that would be valuable for product teams.`

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

    const analysisText = response.content[0].type === "text" ? response.content[0].text : ""

    // Extract JSON from the response
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Failed to parse analysis response")
    }

    const analysis = JSON.parse(jsonMatch[0])

    return NextResponse.json({
      analysis,
      success: true,
    })
  } catch (error) {
    console.error("Analysis API error:", error)
    return NextResponse.json({ error: "Failed to analyze interview data" }, { status: 500 })
  }
}
