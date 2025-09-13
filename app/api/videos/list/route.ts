import { list } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const { blobs } = await list({
      prefix: "videos/",
    })

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
    console.error("Error listing videos:", error)
    return NextResponse.json({ error: "Failed to list videos" }, { status: 500 })
  }
}
