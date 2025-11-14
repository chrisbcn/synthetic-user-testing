import { type NextRequest, NextResponse } from "next/server"
import { logger, AppError, createErrorResponse, sanitizeString } from "@/lib/utils"
import { getGoogleCloudConfig, buildVertexAIEndpoint, getVertexAIHeaders } from "@/lib/google-cloud"

/**
 * Google Cloud Vertex AI Veo 3 Video Generation API
 * 
 * Endpoint: https://aiplatform.googleapis.com/v1/projects/{PROJECT_ID}/locations/{LOCATION}/publishers/google/models/veo-3.1-generate-preview:generateContent
 * 
 * Required environment variables:
 * - GOOGLE_CLOUD_PROJECT_ID: Your GCP project ID
 * - GOOGLE_APPLICATION_CREDENTIALS: Path to service account JSON (or use ADC)
 * - Or GOOGLE_CLOUD_ACCESS_TOKEN: Access token for authentication
 */

interface Veo3Request {
  prompt: string
  persona?: {
    name?: string
    character_bible?: {
      veo3_delivery_characteristics?: {
        speaking_pace?: string
        facial_expressions?: string
        hand_gestures?: string
        voice_tone?: string
        posture?: string
      }
      setting?: {
        primary_location?: string
        lighting_style?: string
        mood_atmosphere?: string
      }
    }
  }
  responseText?: string
  duration?: number // Duration in seconds (default: 10)
  aspectRatio?: "16:9" | "9:16" | "1:1" // Default: 16:9
}

export async function POST(request: NextRequest) {
  try {
    logger.info("Veo 3 video generation API called")

    const config = await getGoogleCloudConfig()
    if (!config) {
      throw new AppError(
        "GOOGLE_CLOUD_PROJECT_ID environment variable is required",
        500,
        "MISSING_PROJECT_ID"
      )
    }

    // Parse request body
    let body: Veo3Request
    try {
      body = await request.json()
    } catch (error) {
      throw new AppError("Invalid JSON in request body", 400, "INVALID_JSON")
    }

    const { prompt, persona, responseText, duration = 10, aspectRatio = "16:9" } = body

    if (!prompt) {
      throw new AppError("Prompt is required", 400, "MISSING_PROMPT")
    }

    // Build comprehensive Veo 3 prompt
    let veo3Prompt = sanitizeString(prompt, 5000)

    // Add video specifications to prompt (since API doesn't support videoConfig)
    veo3Prompt = `${veo3Prompt}

VIDEO SPECIFICATIONS:
- Duration: ${duration} seconds
- Aspect Ratio: ${aspectRatio}
- Format: High quality video`

    // Enhance prompt with persona characteristics if available
    if (persona?.character_bible?.veo3_delivery_characteristics) {
      const delivery = persona.character_bible.veo3_delivery_characteristics
      const setting = persona.character_bible.setting

      veo3Prompt = `${veo3Prompt}

DELIVERY CHARACTERISTICS:
- Speaking pace: ${delivery.speaking_pace || "natural"}
- Facial expressions: ${delivery.facial_expressions || "warm and engaging"}
- Hand gestures: ${delivery.hand_gestures || "natural and expressive"}
- Voice tone: ${delivery.voice_tone || "confident and clear"}
- Posture: ${delivery.posture || "relaxed and professional"}

SETTING:
- Location: ${setting?.primary_location || "professional interview setting"}
- Lighting: ${setting?.lighting_style || "warm, natural lighting"}
- Mood: ${setting?.mood_atmosphere || "professional yet approachable"}`
    }

    // Build Vertex AI API endpoint
    // Veo 3 model IDs (as of July 2025):
    // - veo-3.0-generate-001 (standard)
    // - veo-3.0-fast-generate-001 (faster)
    // The -preview versions may require allowlist access
    const modelName = process.env.VERTEX_AI_MODEL_VEO3 || "veo-3.0-generate-001"
    const endpoint = buildVertexAIEndpoint(config.projectId, config.location, modelName)
    
    logger.debug("Veo 3 endpoint", { 
      endpoint, 
      modelName,
      projectId: config.projectId, 
      location: config.location 
    })

    logger.debug("Calling Veo 3 API", {
      projectId: config.projectId,
      location: config.location,
      promptLength: veo3Prompt.length,
    })

    // Prepare request payload for Veo 3
    // Note: Vertex AI generateContent API doesn't support videoConfig field
    // Video parameters (duration, aspectRatio) should be included in the prompt
    const requestPayload = {
      contents: [
        {
          parts: [
            {
              text: veo3Prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2000, // Increased for video generation
      },
    }
    
    logger.debug("Veo 3 request payload", {
      promptLength: veo3Prompt.length,
      hasGenerationConfig: !!requestPayload.generationConfig,
    })

    // Get authorization headers
    const headers = await getVertexAIHeaders()

    const veoResponse = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(requestPayload),
    })

    if (!veoResponse.ok) {
      const errorText = await veoResponse.text()
      logger.error("Veo 3 API error", { status: veoResponse.status, error: errorText })
      throw new AppError(
        `Veo 3 API error: ${veoResponse.status} - ${errorText}`,
        veoResponse.status,
        "VEO3_API_ERROR"
      )
    }

    const veoResult = await veoResponse.json()

    // Extract video URL or task ID from response
    // Note: Veo 3 API response structure may vary - adjust based on actual API response
    const videoUrl = veoResult.videoUrl || veoResult.video?.uri || null
    const taskId = veoResult.taskId || veoResult.operation?.name || null
    const status = videoUrl ? "completed" : "generating"

    logger.info("Veo 3 video generation initiated", { taskId, status })

    return NextResponse.json({
      success: true,
      message: status === "completed" 
        ? "Video generated successfully with Veo 3!" 
        : "Video generation started with Veo 3. This may take a few minutes.",
      videoUrl,
      taskId,
      status,
      provider: "veo-3",
      prompt: veo3Prompt,
      duration,
      aspectRatio,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    logger.error("Veo 3 video generation error", error)
    const errorResponse = createErrorResponse(error, "Failed to generate video with Veo 3")
    return NextResponse.json(errorResponse, { status: errorResponse.statusCode || 500 })
  }
}

