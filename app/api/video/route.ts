import { type NextRequest, NextResponse } from "next/server"
import { logger, AppError, createErrorResponse, sanitizeString } from "@/lib/utils"

export async function POST(request: NextRequest) {
  try {
    const { prompt: videoPrompt, persona, responseText, provider = "auto" } = await request.json()

    const runwayApiKey = process.env.RUNWAY_API_KEY
    const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
    const googleCloudProjectId = process.env.GOOGLE_CLOUD_PROJECT_ID
    const googleCloudAccessToken = process.env.GOOGLE_CLOUD_ACCESS_TOKEN

    logger.info("Video generation API called", {
      provider,
      hasRunway: !!runwayApiKey,
      hasGemini: !!geminiApiKey,
      hasVeo3: !!googleCloudProjectId,
    })

    // Try Veo 3 first if Google Cloud is configured and requested
    if ((provider === "veo3" || provider === "auto") && googleCloudProjectId) {
      logger.info("Attempting video generation with Veo 3", {
        hasProjectId: !!googleCloudProjectId,
        provider,
      })

      try {
        const veo3Response = await fetch(`${request.nextUrl.origin}/api/video/veo3`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: videoPrompt,
            persona,
            responseText,
            duration: 10,
            aspectRatio: "16:9",
          }),
        })

        let veo3Result
        try {
          veo3Result = await veo3Response.json()
        } catch (jsonError) {
          // If JSON parsing fails, get text response
          const errorText = await veo3Response.text()
          logger.error("Veo 3 response parsing failed", { status: veo3Response.status, errorText })
          
          if (provider === "veo3") {
            return NextResponse.json({
              success: false,
              error: `Veo 3 API error: ${veo3Response.status} - ${errorText.substring(0, 500)}`,
              message: "Failed to generate video with Veo 3",
              instructions: "Please check your Google Cloud configuration and Veo 3 API access. Check server logs for details.",
              videoUrl: null,
              thumbnailUrl: null,
              status: "error",
              provider: "veo-3",
              generatedAt: new Date().toISOString(),
            }, { status: veo3Response.status || 500 })
          }
          throw new Error(`Veo 3 response parsing failed: ${errorText}`)
        }

        if (veo3Response.ok && veo3Result.success) {
          logger.info("Veo 3 video generation successful")
          return NextResponse.json({
            ...veo3Result,
            provider: "veo-3",
          })
        } else {
          // Veo 3 failed - return the error instead of falling back
          logger.error("Veo 3 generation failed", {
            status: veo3Response.status,
            error: veo3Result.error || veo3Result.message,
            fullResponse: veo3Result,
          })
          
          // ALWAYS return error for veo3 provider - never fall back
          if (provider === "veo3" || provider === "auto") {
            return NextResponse.json({
              success: false,
              error: veo3Result.error || `Veo 3 API error: ${veo3Response.status}`,
              message: veo3Result.message || "Failed to generate video with Veo 3",
              instructions: veo3Result.instructions || "Please check your Google Cloud configuration and Veo 3 API access. Check server logs for details.",
              videoUrl: null,
              thumbnailUrl: null,
              status: "error",
              provider: "veo-3",
              generatedAt: new Date().toISOString(),
            }, { status: veo3Response.status || 500 })
          }
        }
      } catch (veo3Error) {
        logger.error("Veo 3 request error", veo3Error)
        
        // NEVER fall back when Veo 3 is requested - always return the error
        if (provider === "veo3" || provider === "auto") {
          const errorMessage = veo3Error instanceof Error ? veo3Error.message : "Unknown error"
          return NextResponse.json({
            success: false,
            error: `Veo 3 request failed: ${errorMessage}`,
            message: "Failed to connect to Veo 3 API",
            instructions: "Please check your Google Cloud configuration, Vertex AI API access, and network connection. Check server logs for details.",
            videoUrl: null,
            thumbnailUrl: null,
            status: "error",
            provider: "veo-3",
            generatedAt: new Date().toISOString(),
          }, { status: 500 })
        }
      }
    }

    // If we get here and provider was "veo3", something went wrong
    if (provider === "veo3") {
      return NextResponse.json({
        success: false,
        error: "Veo 3 is not configured. GOOGLE_CLOUD_PROJECT_ID environment variable is required.",
        message: "Veo 3 video generation is not available",
        instructions: "Please set GOOGLE_CLOUD_PROJECT_ID in your environment variables.",
        videoUrl: null,
        thumbnailUrl: null,
        status: "error",
        provider: "veo-3",
        generatedAt: new Date().toISOString(),
      }, { status: 500 })
    }

    if (runwayApiKey) {
      logger.info("Attempting real video generation via Runway ML")

      try {
        const videoGenerationPrompt = `${persona.physicalTraits?.appearance || "Professional person"}, ${persona.age} years old, speaking directly to camera in a warm, welcoming environment. ${persona.personality || "Confident and articulate"}. Setting: cozy living room with soft natural lighting from large windows, or luxurious walk-in wardrobe with warm ambient lighting and rich textures, or sunny outdoor terrace with golden hour lighting, or beautifully appointed home office with warm wood tones and soft lamp lighting. Quote: "${responseText}"`

        const runwayResponse = await fetch("https://api.runwayml.com/v1/image_to_video", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${runwayApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gen3a_turbo",
            prompt_text: videoGenerationPrompt,
            duration: 10,
            ratio: "16:9",
            resolution: "720p",
            seed: Math.floor(Math.random() * 1000000),
          }),
        })

        if (runwayResponse.ok) {
          const runwayResult = await runwayResponse.json()
          logger.info("Runway ML video generation initiated", { taskId: runwayResult.id })

          const videoData = {
            success: true,
            message: "Video generation started with Runway ML! This typically takes 1-3 minutes.",
            instructions: `Your video is being generated by Runway ML.

Task ID: ${runwayResult.id}

The video will be processed and you can check the status by refreshing this page or checking your Runway ML dashboard at runwayml.com.

Once complete, the video will be available for download.`,
            videoUrl: null,
            thumbnailUrl: null,
            taskId: runwayResult.id,
            status: "generating",
            generatedAt: new Date().toISOString(),
            provider: "runway-ml",
            prompt: videoGenerationPrompt,
          }
          return NextResponse.json(videoData)
        } else {
          const errorText = await runwayResponse.text()
          logger.warn("Runway ML failed, falling back to prompt generation", { error: errorText })
        }
      } catch (runwayError) {
        logger.warn("Runway ML error, falling back to prompt generation", runwayError)
      }
    }

    if (!geminiApiKey) {
      logger.warn("No API keys found for video generation")
      const mockVideoData = {
        success: false,
        error:
          "No API key configured. Add RUNWAY_API_KEY for real video generation, or GEMINI_API_KEY for prompt generation.",
        message: "This demo generates video prompts that can be used with video generation services.",
        instructions: `To set up real video generation with Runway ML:

1. Sign up at runwayml.com
2. Subscribe to a paid plan ($12/month minimum)
3. Get your API key from the Runway ML dashboard
4. Add RUNWAY_API_KEY to your environment variables

Or add GEMINI_API_KEY for prompt generation only.`,
        videoUrl: null,
        thumbnailUrl: null,
        status: "error",
        generatedAt: new Date().toISOString(),
        provider: "none",
      }
      return NextResponse.json(mockVideoData)
    }

    logger.info("Generating optimized video prompt (not actual video)")

    const personaName = persona?.name || "Unknown Person"
    const personaAge = persona?.age || "Unknown age"
    const personaLocation = persona?.location || "Unknown location"
    const personaAppearance = persona?.physicalTraits?.appearance || "Professional appearance"
    const personaPersonality = persona?.personality || "Confident and articulate"

    const enhancedPrompt = `Create a detailed video generation prompt optimized for Runway ML's Gen-3 Alpha Turbo model with warm, welcoming environments:

PERSONA: ${personaName} (${personaAge} years old, ${personaLocation})
PHYSICAL TRAITS: ${personaAppearance}
PERSONALITY: ${personaPersonality}
RESPONSE: "${responseText}"

Generate a comprehensive Runway ML prompt that includes:
1. Clear physical description and styling details
2. WARM, COMFORTABLE SETTING OPTIONS:
   - Cozy living room with soft natural lighting from large windows
   - Luxurious walk-in wardrobe with warm ambient lighting and rich textures
   - Sunny outdoor space (terrace, garden) with golden hour lighting
   - Beautifully appointed home office with warm wood tones, soft desk lamps, and comfortable furnishings
3. LIGHTING REQUIREMENTS:
   - Soft, warm lighting (golden hour, table lamps, natural window light)
   - Avoid harsh fluorescent, strip lighting, or cool blue tones
   - Use warm color palette: golden, amber, cream, soft browns
4. Natural speaking gestures and expressions showing comfort and ease
5. Camera framing (medium shot, direct eye contact) in the welcoming environment
6. Professional yet comfortable clothing appropriate for the luxurious home setting

Keep the prompt concise but descriptive, emphasizing the warm, inviting atmosphere that makes viewers feel welcome and comfortable.`

    logger.debug("Making request to Gemini API")

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: enhancedPrompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1000,
            },
          }),
        },
      )

      logger.debug("Gemini API response", { status: response.status })

      if (!response.ok) {
        const errorText = await response.text()
        logger.error("Gemini API error", { status: response.status, error: errorText })

        const errorData = {
          success: false,
          error: `API Error ${response.status}: ${errorText}`,
          message: "Failed to generate video prompt.",
          instructions: "Check your Gemini API key and try again.",
          videoUrl: null,
          thumbnailUrl: null,
          status: "error",
          generatedAt: new Date().toISOString(),
          provider: "gemini-api",
        }
        return NextResponse.json(errorData)
      }

      const geminiResponse = await response.json()
      logger.info("Video prompt generated successfully")

      const generatedPrompt = geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text || ""

      const videoData = {
        success: true,
        message: "Runway ML-optimized video prompt generated! Copy this to use with Runway ML.",
        instructions: `This system generates prompts optimized for Runway ML. To create the video:

1. Copy the generated prompt below
2. Go to runwayml.com and sign in
3. Navigate to Gen-3 Alpha Turbo
4. Paste the prompt and generate your video
5. Download the result when complete

For automatic video generation, add your RUNWAY_API_KEY to environment variables.

Generated Runway ML Prompt:
${generatedPrompt}`,
        videoUrl: null,
        thumbnailUrl: null,
        duration: null,
        status: "completed",
        generatedAt: new Date().toISOString(),
        provider: "runway-prompt-generator",
        prompt: videoPrompt,
        generatedPrompt: generatedPrompt,
      }

      return NextResponse.json(videoData)
    } catch (fetchError) {
      logger.error("Fetch error when calling Gemini API", fetchError)

      const errorData = {
        success: false,
        error: `Network error: ${fetchError instanceof Error ? fetchError.message : "Failed to connect to Gemini API"}`,
        message: "Unable to connect to the video prompt generation service.",
        instructions:
          "This might be a network issue or API key problem. Please check your GEMINI_API_KEY environment variable and try again.",
        videoUrl: null,
        thumbnailUrl: null,
        status: "error",
        generatedAt: new Date().toISOString(),
        provider: "gemini-api-error",
      }
      return NextResponse.json(errorData)
    }
  } catch (error) {
    logger.error("Video generation error", error)
    const errorResponse = createErrorResponse(error, "Failed to generate video")
    return NextResponse.json(errorResponse, { status: errorResponse.statusCode || 500 })
  }
}
