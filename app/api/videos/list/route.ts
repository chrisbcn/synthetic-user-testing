import { list } from "@vercel/blob"
import { NextResponse } from "next/server"
import { logger, AppError, createErrorResponse } from "@/lib/utils"

export async function GET() {
  try {
    // Check if BLOB_READ_WRITE_TOKEN is configured
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      logger.warn("BLOB_READ_WRITE_TOKEN not configured, returning empty video list")
      return NextResponse.json({ videos: [] })
    }

    logger.info("Listing videos from Vercel Blob storage")

    const { blobs } = await list({
      prefix: "videos/",
    })

    logger.info(`Found ${blobs.length} video(s) in blob storage`)

    const videos = blobs.map((blob) => {
      const filename = blob.pathname.split("/").pop() || "unknown"
      const timestampMatch = filename.match(/^(\d+)-(.+)$/)

      return {
        id: timestampMatch ? timestampMatch[1] : blob.pathname,
        url: blob.url,
        filename: timestampMatch ? timestampMatch[2] : filename,
        size: blob.size,
        uploadedAt: blob.uploadedAt,
        interviewId: null, // Could be enhanced to store this metadata
      }
    })

    return NextResponse.json({ videos })
  } catch (error) {
    logger.error("Error listing videos", error)
    
    // If it's a known error, provide more context
    if (error instanceof Error) {
      if (error.message.includes("token") || error.message.includes("auth")) {
        const errorResponse = createErrorResponse(
          error,
          "Failed to authenticate with blob storage. Please check BLOB_READ_WRITE_TOKEN environment variable.",
          "BLOB_AUTH_ERROR"
        )
        return NextResponse.json(errorResponse, { status: errorResponse.statusCode || 500 })
      }
    }

    const errorResponse = createErrorResponse(error, "Failed to list videos")
    return NextResponse.json(errorResponse, { status: errorResponse.statusCode || 500 })
  }
}
