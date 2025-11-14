import { type NextRequest, NextResponse } from "next/server"
import { logger, AppError, createErrorResponse } from "@/lib/utils"
import { getGoogleCloudConfig, buildVertexAIEndpoint, getVertexAIHeaders } from "@/lib/google-cloud"

/**
 * Veo 3 Video Generation Status Check API
 * 
 * Polls the status of a long-running Veo 3 video generation operation.
 * 
 * Query parameters:
 * - operationName: Full operation name from predictLongRunning response
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const operationName = searchParams.get("operationName")

    if (!operationName) {
      throw new AppError("operationName query parameter is required", 400, "MISSING_OPERATION_NAME")
    }

    const config = await getGoogleCloudConfig()
    if (!config) {
      throw new AppError(
        "GOOGLE_CLOUD_PROJECT_ID environment variable is required",
        500,
        "MISSING_PROJECT_ID"
      )
    }

    // Build endpoint for fetchPredictOperation
    const modelName = process.env.VERTEX_AI_MODEL_VEO3 || "veo-3.0-generate-preview"
    const endpoint = buildVertexAIEndpoint(
      config.projectId, 
      config.location, 
      modelName, 
      "fetchPredictOperation"
    )

    logger.debug("Checking Veo 3 operation status", { operationName, endpoint })

    // Request body for fetchPredictOperation
    const requestPayload = {
      operationName,
    }

    // Get authorization headers (OAuth2 Bearer token - matching RENOIR pattern)
    const headers = await getVertexAIHeaders()

    const statusResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(requestPayload),
    })

    if (!statusResponse.ok) {
      const errorText = await statusResponse.text()
      logger.error("Veo 3 status check error", { 
        status: statusResponse.status, 
        error: errorText,
        operationName 
      })
      throw new AppError(
        `Veo 3 status check error: ${statusResponse.status} - ${errorText}`,
        statusResponse.status,
        "VEO3_STATUS_ERROR"
      )
    }

    const statusResult = await statusResponse.json()

    // Check if operation is done
    const isDone = statusResult.done === true
    const hasError = !!statusResult.error

    if (hasError) {
      logger.error("Veo 3 operation failed", { 
        operationName,
        error: statusResult.error 
      })
      return NextResponse.json({
        success: false,
        status: "failed",
        operationName,
        error: statusResult.error,
        message: "Video generation failed",
      })
    }

    if (!isDone) {
      // Still generating
      return NextResponse.json({
        success: true,
        status: "generating",
        operationName,
        done: false,
        message: "Video generation in progress...",
      })
    }

    // Operation is done - extract video URLs
    const response = statusResult.response
    const videos = response?.videos || []
    
    // Extract video URLs (GCS URIs or base64)
    const videoUrls = videos.map((video: { gcsUri?: string; bytesBase64Encoded?: string; mimeType?: string }) => {
      if (video.gcsUri) {
        return {
          type: "gcs",
          uri: video.gcsUri,
          mimeType: video.mimeType || "video/mp4",
        }
      } else if (video.bytesBase64Encoded) {
        return {
          type: "base64",
          data: video.bytesBase64Encoded,
          mimeType: video.mimeType || "video/mp4",
        }
      }
      return null
    }).filter(Boolean)

    logger.info("Veo 3 video generation completed", { 
      operationName,
      videoCount: videoUrls.length 
    })

    return NextResponse.json({
      success: true,
      status: "completed",
      operationName,
      done: true,
      videos: videoUrls,
      videoUrl: videoUrls[0]?.uri || videoUrls[0]?.data || null, // First video for backward compatibility
      message: `Video generation completed! Generated ${videoUrls.length} video(s).`,
    })
  } catch (error) {
    logger.error("Veo 3 status check error", error)
    const errorResponse = createErrorResponse(error, "Failed to check Veo 3 video generation status")
    return NextResponse.json(errorResponse, { status: errorResponse.statusCode || 500 })
  }
}

