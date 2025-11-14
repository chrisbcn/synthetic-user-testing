import { type NextRequest, NextResponse } from "next/server"
import { logger, AppError, createErrorResponse, sanitizeString } from "@/lib/utils"
import { getGoogleCloudConfig, buildVertexAIEndpoint, getVertexAIHeaders } from "@/lib/google-cloud"

/**
 * Google Cloud Vertex AI Nano Banana (Gemini 2.5 Flash Image Preview) API
 * 
 * Endpoint: https://aiplatform.googleapis.com/v1/projects/{PROJECT_ID}/locations/{LOCATION}/publishers/google/models/gemini-2.5-flash-image-preview:generateContent
 * 
 * Required environment variables:
 * - GOOGLE_CLOUD_PROJECT_ID: Your GCP project ID
 * - GOOGLE_CLOUD_ACCESS_TOKEN: Access token (or use ADC)
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

    // Build Vertex AI API endpoint
    const endpoint = buildVertexAIEndpoint(
      config.projectId,
      config.location,
      "gemini-2.5-flash-image-preview"
    )

    logger.debug("Calling Nano Banana API", {
      projectId: config.projectId,
      location: config.location,
      promptLength: sanitizedPrompt.length,
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

    // Get authorization headers
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

