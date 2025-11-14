"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, FileText, Check, Copy } from "lucide-react"
import type { Persona, ConversationTurn, VideoPullquote } from "@/lib/types"

interface VideoGeneratorProps {
  persona: Persona
  conversation: ConversationTurn[]
  onVideoGenerated?: (video: VideoPullquote) => void
}

export function VideoGenerator({ persona, conversation, onVideoGenerated }: VideoGeneratorProps) {
  const [selectedResponse, setSelectedResponse] = useState<string>("")
  const [customPrompt, setCustomPrompt] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedVideos, setGeneratedVideos] = useState<VideoPullquote[]>([])
  const [hasGeneratedPrompts, setHasGeneratedPrompts] = useState(false)
  const [currentGeneratedPrompt, setCurrentGeneratedPrompt] = useState<string>("")
  const [showCurrentPrompt, setShowCurrentPrompt] = useState(false)
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">("idle")

  useEffect(() => {
    const savedPrompts = localStorage.getItem("videoPrompts")
    if (savedPrompts) {
      try {
        const parsedPrompts = JSON.parse(savedPrompts)
        setGeneratedVideos(parsedPrompts)
        setHasGeneratedPrompts(parsedPrompts.length > 0)
      } catch (error) {
        console.error("Failed to load saved prompts:", error)
      }
    }
  }, [])

  useEffect(() => {
    if (generatedVideos.length > 0) {
      localStorage.setItem("videoPrompts", JSON.stringify(generatedVideos))
    }
  }, [generatedVideos])

  const personaResponses = (conversation || []).filter((turn) => turn.speaker === "persona")

  const generateVideoPrompt = (responseText: string) => {
    if (!persona) {
      return `Create a user interview video from the transcript below. We should just see the person answering. 

The person should be a well-dressed individual, speaking clearly and confidently.

Setting: seated in an elegant chair, looking directly at the camera with warm, natural lighting.

The person gives the following answer:
${responseText}`
    }

    const { character_bible, physicalTraits, characterTraits, videoSettings } = persona

    // Use enhanced character bible if available, otherwise fall back to legacy fields
    if (character_bible?.gemini_image_prompt && character_bible?.veo3_delivery_characteristics) {
      return `Create a user interview video of ${persona.name} from the transcript below. We should just see ${persona.name} answering.

VISUAL APPEARANCE:
${character_bible.gemini_image_prompt}

DELIVERY CHARACTERISTICS:
Speaking pace: ${character_bible.veo3_delivery_characteristics.speaking_pace}
Facial expressions: ${character_bible.veo3_delivery_characteristics.facial_expressions}
Hand gestures: ${character_bible.veo3_delivery_characteristics.hand_gestures}
Voice tone: ${character_bible.veo3_delivery_characteristics.voice_tone}
Posture: ${character_bible.veo3_delivery_characteristics.posture}

CONSISTENCY ANCHORS:
${character_bible.consistency_anchors?.join("\n") || "Maintain consistent appearance throughout"}

SETTING & ATMOSPHERE:
${character_bible.setting?.primary_location || "Professional interview setting"}
${character_bible.setting?.lighting_style || "Professional lighting"}
${character_bible.setting?.mood_atmosphere || "Professional atmosphere"}

${persona.name} gives the following answer:
${responseText}`
    }

    // Legacy fallback for personas without character bible
    return `Create a user interview video of ${persona.name} from the transcript below. We should just see ${persona.name} answering. 

${persona.name} should be ${physicalTraits?.ethnicity || "a person"}, ${persona.age} years old, ${characterTraits?.socialClass || "well-dressed"}. ${physicalTraits?.style || "Stylish and trendy"}, wearing ${videoSettings?.wardrobe || "expensive, high-end clothes from the latest designers"}. ${physicalTraits?.accessories?.join(", ") || "Fashionable accessories"}.

Setting: ${videoSettings?.setting || "seated in an elegant chair, looking directly at the camera"}. ${videoSettings?.lighting || "Warm, natural lighting"} with ${videoSettings?.cameraAngle || "a slight bokeh effect"}. ${videoSettings?.mood || "Professional yet approachable atmosphere"}.

Speaking style: ${characterTraits?.accent || "Clear, articulate speech"} with ${characterTraits?.speakingStyle || "confident delivery"}. ${characterTraits?.mannerisms?.join(", ") || "Natural gestures and expressions"}.

${persona.name} gives the following answer:
${responseText}`
  }

  const handleGenerateVideo = async (responseText: string) => {
    setIsGenerating(true)
    setShowCurrentPrompt(false)

    try {
      const videoPrompt = customPrompt || generateVideoPrompt(responseText)

      console.log("[v0] Generating video prompt with data:", {
        prompt: videoPrompt.substring(0, 100) + "...",
        personaId: persona?.id,
        responseLength: responseText.length,
      })

      const response = await fetch("/api/video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: videoPrompt,
          persona: persona,
          responseText: responseText,
          provider: "auto", // Will try Veo 3 first if configured, then Runway, then prompt-only
        }),
      })

      if (!response.ok) {
        throw new Error(`Video prompt generation failed: ${response.statusText}`)
      }

      const result = await response.json()
      console.log("[v0] Video API response:", result)

      const responsePreview = responseText.substring(0, 50).replace(/\n/g, " ")
      
      // Determine status based on result
      let videoStatus: "completed" | "generating" | "error" = "completed"
      if (result.success === false) {
        videoStatus = "error"
      } else if (result.status === "generating" || result.taskId) {
        videoStatus = "generating"
      } else if (result.videoUrl) {
        videoStatus = "completed"
      }

      const newVideo: VideoPullquote = {
        id: `video-${Date.now()}`,
        interviewId: `interview-${persona?.id || "unknown"}`,
        personaId: persona?.id || "unknown",
        responseText,
        videoPrompt,
        status: videoStatus,
        createdAt: new Date(),
        title: `${persona?.name || "Unknown Persona"}: "${responsePreview}${responseText.length > 50 ? "..." : ""}"`,
        videoUrl: result.videoUrl || undefined,
        thumbnailUrl: result.thumbnailUrl,
        duration: result.duration || "30s",
        error: result.error,
        generatedPrompt: result.generatedPrompt || result.prompt || videoPrompt,
        taskId: result.taskId, // Store task ID for polling if needed
        provider: result.provider, // Store provider info
      }

      console.log(
        "[v0] Created video object with generatedPrompt:",
        newVideo.generatedPrompt?.substring(0, 100) + "...",
      )

      setGeneratedVideos((prev) => [...prev, newVideo])
      setHasGeneratedPrompts(true)
      setCurrentGeneratedPrompt(newVideo.generatedPrompt || newVideo.videoPrompt)
      setShowCurrentPrompt(true)
      onVideoGenerated?.(newVideo)

      if (result.success !== false) {
        setTimeout(() => {
          console.log("[v0] Video prompt generated successfully")
        }, 100)
      }
    } catch (error) {
      console.error("Video prompt generation failed:", error)

      const responsePreview = selectedResponse.substring(0, 50).replace(/\n/g, " ")
      const errorVideo: VideoPullquote = {
        id: `video-error-${Date.now()}`,
        interviewId: `interview-${persona?.id || "unknown"}`,
        personaId: persona?.id || "unknown",
        responseText,
        videoPrompt: customPrompt || generateVideoPrompt(responseText),
        status: "error",
        createdAt: new Date(),
        title: `${persona?.name || "Unknown Persona"}: "${responsePreview}${selectedResponse.length > 50 ? "..." : ""}" (Failed)`,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }

      setGeneratedVideos((prev) => [...prev, errorVideo])
      setHasGeneratedPrompts(true)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyPrompt = async (prompt: string) => {
    try {
      console.log("[v0] Attempting to copy prompt to clipboard")
      await navigator.clipboard.writeText(prompt)
      console.log("[v0] Prompt copied successfully using clipboard API")
      setCopyStatus("success")
      setTimeout(() => setCopyStatus("idle"), 2000)
    } catch (error) {
      console.error("Failed to copy prompt:", error)
      try {
        const textArea = document.createElement("textarea")
        textArea.value = prompt
        textArea.style.position = "fixed"
        textArea.style.left = "-999999px"
        textArea.style.top = "-999999px"
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        const successful = document.execCommand("copy")
        document.body.removeChild(textArea)

        if (successful) {
          console.log("[v0] Prompt copied successfully using fallback method")
          setCopyStatus("success")
          setTimeout(() => setCopyStatus("idle"), 2000)
        } else {
          throw new Error("Fallback copy method failed")
        }
      } catch (fallbackError) {
        console.error("Fallback copy failed:", fallbackError)
        setCopyStatus("error")
        setTimeout(() => setCopyStatus("idle"), 3000)
      }
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Video Generator
          </CardTitle>
          <CardDescription>
            Generate videos directly using Veo 3 with detailed character bible data for consistent, high-quality video
            generation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="response-select">Select Response to Convert</Label>
            <Select value={selectedResponse} onValueChange={setSelectedResponse}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an interview response..." />
              </SelectTrigger>
              <SelectContent>
                {personaResponses.map((response, index) => (
                  <SelectItem key={index} value={response.message}>
                    Response {index + 1}: {response.message.substring(0, 50)}...
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedResponse && (
            <div>
              <Label>Selected Response</Label>
              <Textarea value={selectedResponse} readOnly className="min-h-[100px] bg-muted" />
            </div>
          )}

          {selectedResponse && persona?.character_bible && (
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-sm text-blue-800">Character Bible Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div>
                  <strong>Visual DNA:</strong> {persona.character_bible.visual_dna?.style_aesthetic || "Not specified"}
                </div>
                <div>
                  <strong>Setting:</strong> {persona.character_bible.setting?.primary_location || "Not specified"}
                </div>
                <div>
                  <strong>Delivery Style:</strong>{" "}
                  {persona.character_bible.veo3_delivery_characteristics?.speaking_pace || "Not specified"}
                </div>
                <div>
                  <strong>Consistency Anchors:</strong>{" "}
                  {persona.character_bible.consistency_anchors?.slice(0, 2).join(", ") || "Not specified"}
                </div>
              </CardContent>
            </Card>
          )}

          {hasGeneratedPrompts && (
            <div>
              <Label htmlFor="custom-prompt">Custom Video Prompt (Optional)</Label>
              <Textarea
                id="custom-prompt"
                placeholder="Override the auto-generated prompt with your own..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="min-h-[120px]"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use this to customize the prompt for your next generation
              </p>
            </div>
          )}

          <Button
            onClick={() => handleGenerateVideo(selectedResponse)}
            disabled={!selectedResponse || isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Video...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Generate Video with Veo 3
              </>
            )}
          </Button>

          {showCurrentPrompt && currentGeneratedPrompt && (
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-lg text-green-800">
                  {generatedVideos[generatedVideos.length - 1]?.videoUrl
                    ? "Video Generated Successfully!"
                    : generatedVideos[generatedVideos.length - 1]?.status === "generating"
                      ? "Video Generation in Progress..."
                      : "Generated Enhanced Video Prompt"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Show video if available */}
                {generatedVideos[generatedVideos.length - 1]?.videoUrl && (
                  <div className="space-y-2">
                    <video
                      src={generatedVideos[generatedVideos.length - 1].videoUrl}
                      controls
                      className="w-full rounded-lg border"
                      style={{ maxHeight: "400px" }}
                    >
                      Your browser does not support the video tag.
                    </video>
                    <p className="text-sm text-muted-foreground">
                      Generated with {generatedVideos[generatedVideos.length - 1]?.provider || "Veo 3"}
                    </p>
                  </div>
                )}

                {/* Show generating status */}
                {generatedVideos[generatedVideos.length - 1]?.status === "generating" && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-blue-600">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Video is being generated. This may take a few minutes...</span>
                    </div>
                    {generatedVideos[generatedVideos.length - 1]?.taskId && (
                      <p className="text-xs text-muted-foreground">
                        Task ID: {generatedVideos[generatedVideos.length - 1].taskId}
                      </p>
                    )}
                  </div>
                )}

                {/* Show prompt */}
                <Textarea value={currentGeneratedPrompt} readOnly className="min-h-[150px] bg-white text-sm" />
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleCopyPrompt(currentGeneratedPrompt)}
                    variant="outline"
                    className={
                      copyStatus === "success"
                        ? "bg-green-100 border-green-300"
                        : copyStatus === "error"
                          ? "bg-red-100 border-red-300"
                          : ""
                    }
                  >
                    {copyStatus === "success" ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Copied!
                      </>
                    ) : copyStatus === "error" ? (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Failed
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Prompt
                      </>
                    )}
                  </Button>
                  {!generatedVideos[generatedVideos.length - 1]?.videoUrl && (
                    <Button
                      onClick={() =>
                        window.open(
                          "https://labs.google/fx/tools/flow/project/d4048cd9-3ab3-4ecb-9bec-50cfd0c0915c",
                          "_blank",
                        )
                      }
                      variant="outline"
                    >
                      Open VEO 3 (Manual)
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
