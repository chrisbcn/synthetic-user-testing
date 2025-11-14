import { type NextRequest, NextResponse } from "next/server"
import { logger, AppError, createErrorResponse, sanitizeString } from "@/lib/utils"
import { getGoogleCloudConfig, buildVertexAIEndpoint, getVertexAIHeaders } from "@/lib/google-cloud"

/**
 * Google Cloud Vertex AI Nano Banana (Gemini 2.5 Flash Image) API
 * 
 * Matching RENOIR wardrobe project pattern:
 * - Uses service account credentials (GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_CLIENT_ID)
 * - Uses OAuth2 Bearer tokens (not API keys)
 * - Model: gemini-2.5-flash-image (not -preview)
 * 
 * Endpoint: https://us-central1-aiplatform.googleapis.com/v1/projects/{PROJECT_ID}/locations/us-central1/publishers/google/models/gemini-2.5-flash-image:generateContent
 * 
 * Required environment variables:
 * - GOOGLE_CLOUD_PROJECT_ID: Your GCP project ID
 * - GOOGLE_CLIENT_EMAIL: Service account email
 * - GOOGLE_PRIVATE_KEY: Service account private key
 * - GOOGLE_CLIENT_ID: Service account client ID
 */

interface NanoBananaRequest {
  prompt: string
  aspectRatio?: "1:1" | "16:9" | "9:16" // Default: 1:1
  safetySettings?: {
    category: string
    threshold: string
  }[]
}

export async function POST(request: NextRequest) {
  try {
    logger.info("Nano Banana image generation API called")

    const config = await getGoogleCloudConfig()
    if (!config) {
      throw new AppError(
        "GOOGLE_CLOUD_PROJECT_ID environment variable is required",
        500,
        "MISSING_PROJECT_ID"
      )
    }

    // Parse request body
    let body: NanoBananaRequest
    try {
      body = await request.json()
    } catch (error) {
      throw new AppError("Invalid JSON in request body", 400, "INVALID_JSON")
    }

    const { prompt, aspectRatio = "1:1" } = body

    if (!prompt) {
      throw new AppError("Prompt is required", 400, "MISSING_PROMPT")
    }

    const sanitizedPrompt = sanitizeString(prompt, 5000)

    // Build Vertex AI API endpoint (matching RENOIR pattern)
    // Model name: gemini-2.5-flash-image (not -preview)
    const endpoint = buildVertexAIEndpoint(
      config.projectId,
      config.location,
      "gemini-2.5-flash-image", // RENOIR uses this model name
      "generateContent"
    )

    logger.debug("Calling Nano Banana API", {
      projectId: config.projectId,
      location: config.location,
      promptLength: sanitizedPrompt.length,
      endpoint,
    })

    // Prepare request payload
    const requestPayload = {
      contents: [
        {
          parts: [
            {
              text: sanitizedPrompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
        aspectRatio: aspectRatio,
      },
    }

    // Get authorization headers (OAuth2 Bearer token - matching RENOIR pattern)
    const headers = await getVertexAIHeaders()

    const imageResponse = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(requestPayload),
    })

    if (!imageResponse.ok) {
      const errorText = await imageResponse.text()
      logger.error("Nano Banana API error", { status: imageResponse.status, error: errorText })
      throw new AppError(
        `Nano Banana API error: ${imageResponse.status} - ${errorText}`,
        imageResponse.status,
        "NANO_BANANA_API_ERROR"
      )
    }

    const imageResult = await imageResponse.json()

    // Extract image URL or base64 data from response
    // Note: Adjust based on actual API response structure
    const imageUrl = imageResult.imageUrl || imageResult.image?.uri || null
    const imageData = imageResult.imageData || imageResult.image?.bytes || null

    logger.info("Nano Banana image generated successfully")

    return NextResponse.json({
      success: true,
      message: "Image generated successfully with Nano Banana!",
      imageUrl,
      imageData, // Base64 encoded image if provided
      provider: "nano-banana",
      prompt: sanitizedPrompt,
      aspectRatio,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    logger.error("Nano Banana image generation error", error)
    const errorResponse = createErrorResponse(error, "Failed to generate image with Nano Banana")
    return NextResponse.json(errorResponse, { status: errorResponse.statusCode || 500 })
  }
}

