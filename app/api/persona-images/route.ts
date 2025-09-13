import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const IMAGES_FILE = path.join(process.cwd(), "data", "persona-images.json")

export async function GET() {
  try {
    const data = await fs.readFile(IMAGES_FILE, "utf8")
    return NextResponse.json(JSON.parse(data))
  } catch (error) {
    // If file doesn't exist, return empty object
    return NextResponse.json({})
  }
}

export async function POST(request: NextRequest) {
  try {
    const { personaName, imageUrl } = await request.json()

    let personaImages = {}
    try {
      const data = await fs.readFile(IMAGES_FILE, "utf8")
      personaImages = JSON.parse(data)
    } catch (error) {
      // File doesn't exist yet, start with empty object
    }

    // Add new image to persona's array
    if (!personaImages[personaName]) {
      personaImages[personaName] = []
    }
    personaImages[personaName].push(imageUrl)

    // Ensure data directory exists
    await fs.mkdir(path.dirname(IMAGES_FILE), { recursive: true })

    // Save updated data
    await fs.writeFile(IMAGES_FILE, JSON.stringify(personaImages, null, 2))

    return NextResponse.json({ success: true, personaImages })
  } catch (error) {
    console.error("Error saving persona image:", error)
    return NextResponse.json({ error: "Failed to save image" }, { status: 500 })
  }
}
