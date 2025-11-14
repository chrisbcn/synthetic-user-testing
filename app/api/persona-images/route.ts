import { type NextRequest, NextResponse } from "next/server"
import { supabase, isSupabaseConfigured, getSupabaseConfig } from "@/lib/supabase"
import { logger } from "@/lib/utils"

/**
 * Get all persona images
 * Returns data in format: { "Persona Name": ["url1", "url2", ...] }
 */
export async function GET() {
  try {
    // If Supabase not configured, return empty object
    if (!isSupabaseConfigured()) {
      logger.warn("Supabase not configured, returning empty persona images")
      return NextResponse.json({})
    }

    const { data, error } = await supabase!
      .from("persona_images")
      .select("persona_name, image_url")
      .order("created_at", { ascending: false })

    if (error) {
      logger.error("Error fetching persona images from Supabase", error)
      return NextResponse.json({})
    }

    // Transform to expected format: { "Persona Name": ["url1", "url2"] }
    const personaImages: { [key: string]: string[] } = {}
    
    if (data) {
      for (const row of data) {
        if (!personaImages[row.persona_name]) {
          personaImages[row.persona_name] = []
        }
        personaImages[row.persona_name].push(row.image_url)
      }
    }

    return NextResponse.json(personaImages)
  } catch (error) {
    logger.error("Error in GET persona-images", error)
    return NextResponse.json({})
  }
}

/**
 * Save a persona image URL
 */
export async function POST(request: NextRequest) {
  try {
    const { personaName, imageUrl } = await request.json()

    if (!personaName || !imageUrl) {
      return NextResponse.json(
        { error: "personaName and imageUrl are required" },
        { status: 400 }
      )
    }

    // If Supabase not configured, return error
    if (!isSupabaseConfigured()) {
      const config = getSupabaseConfig()
      logger.error("Supabase not configured, cannot save persona image", config)
      return NextResponse.json(
        { 
          error: "Supabase not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY",
          config 
        },
        { status: 500 }
      )
    }

    logger.debug("Inserting persona image into Supabase", { 
      personaName, 
      imageUrl: imageUrl.substring(0, 50) + "...",
      supabaseUrl: process.env.SUPABASE_URL?.substring(0, 30) + "..."
    })

    // Insert image URL into Supabase
    const { data, error } = await supabase!
      .from("persona_images")
      .insert([
        {
          persona_name: personaName,
          image_url: imageUrl,
        },
      ])
      .select()

    if (error) {
      logger.error("Error saving persona image to Supabase", error)
      
      // If table doesn't exist, provide helpful error
      if (error.code === "42P01" || error.message.includes("does not exist")) {
        return NextResponse.json(
          { 
            error: "persona_images table does not exist. Please run the migration: supabase-migration-persona-images.sql",
            details: error.message 
          },
          { status: 500 }
        )
      }
      
      return NextResponse.json(
        { error: "Failed to save image", details: error.message },
        { status: 500 }
      )
    }

    // Fetch all images for this persona to return updated list
    const { data: allImages, error: fetchError } = await supabase!
      .from("persona_images")
      .select("persona_name, image_url")
      .order("created_at", { ascending: false })

    if (fetchError) {
      logger.error("Error fetching updated persona images", fetchError)
    }

    // Transform to expected format
    const personaImages: { [key: string]: string[] } = {}
    if (allImages) {
      for (const row of allImages) {
        if (!personaImages[row.persona_name]) {
          personaImages[row.persona_name] = []
        }
        personaImages[row.persona_name].push(row.image_url)
      }
    }

    logger.info("Persona image saved successfully", { personaName, imageUrl })

    return NextResponse.json({ success: true, personaImages })
  } catch (error) {
    logger.error("Error saving persona image", error)
    return NextResponse.json(
      { error: "Failed to save image", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
