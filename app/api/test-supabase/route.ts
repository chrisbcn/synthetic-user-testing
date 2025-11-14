import { NextResponse } from "next/server"
import { supabase, isSupabaseConfigured, getSupabaseConfig } from "@/lib/supabase"
import { logger } from "@/lib/utils"

/**
 * Test endpoint to verify Supabase connection
 * GET /api/test-supabase
 */
export async function GET() {
  try {
    const config = getSupabaseConfig()
    
    logger.info("Testing Supabase connection", config)
    
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: "Supabase not configured",
          config,
          env: {
            SUPABASE_URL: process.env.SUPABASE_URL ? "SET" : "MISSING",
            SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? "SET" : "MISSING",
            urlLength: process.env.SUPABASE_URL?.length || 0,
            keyLength: process.env.SUPABASE_ANON_KEY?.length || 0,
          },
        },
        { status: 500 }
      )
    }

    // Test basic query with timeout
    const queryPromise = supabase!
      .from("persona_images")
      .select("count")
      .limit(1)
    
    // Add timeout to catch network issues
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Supabase query timeout after 10 seconds")), 10000)
    )
    
    const { data, error, status } = await Promise.race([
      queryPromise,
      timeoutPromise
    ]) as any

    if (error) {
      logger.error("Supabase query error", { error, status })
      
      return NextResponse.json(
        {
          success: false,
          error: "Supabase query failed",
          details: error.message,
          code: error.code,
          hint: error.hint,
          status,
          config,
        },
        { status: 500 }
      )
    }

    // Also test direct fetch to Supabase REST API
    let directFetchTest: any = null
    try {
      const restUrl = `${process.env.SUPABASE_URL}/rest/v1/persona_images?select=count&limit=1`
      const directResponse = await fetch(restUrl, {
        headers: {
          'apikey': process.env.SUPABASE_ANON_KEY!,
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        },
        signal: AbortSignal.timeout(5000), // 5 second timeout
      })
      directFetchTest = {
        ok: directResponse.ok,
        status: directResponse.status,
        statusText: directResponse.statusText,
      }
    } catch (fetchErr: any) {
      directFetchTest = {
        error: fetchErr.message,
        type: fetchErr.name,
      }
    }

    return NextResponse.json({
      success: true,
      message: "Supabase connection successful",
      config,
      data,
      directFetchTest,
    })
  } catch (err: any) {
    logger.error("Supabase test error", err)
    
    return NextResponse.json(
      {
        success: false,
        error: "Supabase test failed",
        message: err.message,
        stack: err.stack,
        config: getSupabaseConfig(),
      },
      { status: 500 }
    )
  }
}

