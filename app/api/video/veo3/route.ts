import { type NextRequest, NextResponse } from "next/server"
import { logger, AppError, createErrorResponse, sanitizeString } from "@/lib/utils"
import { getGoogleCloudConfig, buildVertexAIEndpoint, getVertexAIHeaders } from "@/lib/google-cloud"

/**
 * Google Cloud Vertex AI Veo 3 Video Generation API
 * 
 * Veo 3 uses a long-running operation pattern:
 * 1. POST to :predictLongRunning to start generation
 * 2. Poll :fetchPredictOperation to check status
 * 
 * Endpoint: https://{LOCATION}-aiplatform.googleapis.com/v1/projects/{PROJECT_ID}/locations/{LOCATION}/publishers/google/models/veo-3.0-generate-preview:predictLongRunning
 * 
 * Required environment variables:
 * - GOOGLE_CLOUD_PROJECT_ID: Your GCP project ID
 * - GOOGLE_APPLICATION_CREDENTIALS: Path to service account JSON (or use ADC)
 * - Or GOOGLE_CLOUD_ACCESS_TOKEN: Access token for authentication
 * 
 * Optional:
 * - VERTEX_AI_STORAGE_BUCKET: GCS bucket for video storage (if not provided, base64 is returned)
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

    // Build Vertex AI API endpoint for Veo 3
    // Model name from documentation: veo-3.0-generate-preview
    const modelName = process.env.VERTEX_AI_MODEL_VEO3 || "veo-3.0-generate-preview"
    const endpoint = buildVertexAIEndpoint(config.projectId, config.location, modelName, "predictLongRunning")
    
    // Map aspect ratio to resolution
    // Veo 3 supports: "1024x768", "768x1024", "1280x768", "768x1280", "1280x1024", "1024x1280"
    const resolutionMap: Record<string, string> = {
      "16:9": "1280x768",
      "9:16": "768x1280",
      "1:1": "1024x1024", // May need to use closest supported
    }
    const resolution = resolutionMap[aspectRatio] || "1280x768"
    
    // Optional: GCS bucket for video storage
    // If not provided, base64 encoded video bytes are returned
    const storageUri = process.env.VERTEX_AI_STORAGE_BUCKET 
      ? `gs://${process.env.VERTEX_AI_STORAGE_BUCKET}/veo3-videos/`
      : undefined
    
    logger.debug("Veo 3 endpoint", { 
      endpoint, 
      modelName,
      projectId: config.projectId, 
      location: config.location,
      resolution,
      hasStorageUri: !!storageUri
    })

    // Prepare request payload for Veo 3 predictLongRunning API
    // Format: { instances: [{ prompt: "..." }], parameters: { ... } }
    const requestPayload: {
      instances: Array<{ prompt: string }>
      parameters: {
        storageUri?: string
        sampleCount: number
        resolution: string
      }
    } = {
      instances: [
        {
          prompt: veo3Prompt,
        },
      ],
      parameters: {
        sampleCount: 1, // Generate 1 video (can be 1-2)
        resolution,
      },
    }
    
    // Add storage URI if configured
    if (storageUri) {
      requestPayload.parameters.storageUri = storageUri
    }
    
    logger.debug("Veo 3 request payload", {
      promptLength: veo3Prompt.length,
      resolution,
      sampleCount: requestPayload.parameters.sampleCount,
      hasStorageUri: !!storageUri,
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

    // Veo 3 predictLongRunning returns an operation name
    // Format: "projects/{PROJECT_ID}/locations/{LOCATION}/publishers/google/models/veo-3.0-generate-preview/operations/{OPERATION_ID}"
    const operationName = veoResult.name || veoResult.operation?.name || null
    
    if (!operationName) {
      logger.error("Veo 3 response missing operation name", { veoResult })
      throw new AppError(
        "Veo 3 API did not return an operation name",
        500,
        "VEO3_MISSING_OPERATION"
      )
    }

    // Extract operation ID from full operation name
    const operationId = operationName.split("/").pop() || null

    logger.info("Veo 3 video generation initiated", { 
      operationName, 
      operationId,
      status: "generating" 
    })

    // Return operation details - client will need to poll for completion
    return NextResponse.json({
      success: true,
      message: "Video generation started with Veo 3. This may take a few minutes. Use the operation name to check status.",
      operationName,
      operationId,
      status: "generating",
      provider: "veo-3",
      prompt: veo3Prompt,
      duration,
      aspectRatio,
      resolution,
      generatedAt: new Date().toISOString(),
      // Include endpoint for polling
      pollEndpoint: `/api/video/veo3/status?operationName=${encodeURIComponent(operationName)}`,
    })
  } catch (error) {
    logger.error("Veo 3 video generation error", error)
    const errorResponse = createErrorResponse(error, "Failed to generate video with Veo 3")
    return NextResponse.json(errorResponse, { status: errorResponse.statusCode || 500 })
  }
}

