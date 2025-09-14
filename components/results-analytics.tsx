"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { VideoGenerator } from "@/components/video-generator"
import { VideoModal } from "@/components/video-modal"
import {
  Video,
  TrendingUp,
  Users,
  MessageSquare,
  Lightbulb,
  Quote,
  AlertTriangle,
  Play,
  Edit2,
  X,
  HelpCircle,
  Copy,
} from "lucide-react"
import type { Interview, Persona } from "@/lib/types"

interface ResultsAnalyticsProps {
  selectedInterview?: Interview | null
}

// Mock data for demonstration
const mockInterviews: Interview[] = [
  {
    id: "interview-1",
    personaId: "sophia",
    scenarioId: "wardrobe",
    status: "completed",
    conversation: [
      {
        speaker: "moderator",
        message: "Looking at this wardrobe interface, how would you go about finding pieces you haven't worn recently?",
        timestamp: new Date("2024-01-15T10:00:00Z"),
      },
      {
        speaker: "persona",
        message:
          "I'd expect my client advisor to already know what I haven't worn. This feels like work I shouldn't have to do myself. I pay premium prices for premium service, which includes curation.",
        timestamp: new Date("2024-01-15T10:00:30Z"),
      },
      {
        speaker: "moderator",
        message: "What's your reaction to seeing purchase dates and wear counts for your items?",
        timestamp: new Date("2024-01-15T10:01:00Z"),
      },
      {
        speaker: "persona",
        message:
          "It's interesting data, but I'm concerned about privacy. Who else can see this information? I don't want my shopping habits analyzed by anyone other than my trusted advisor.",
        timestamp: new Date("2024-01-15T10:01:45Z"),
      },
    ],
    createdAt: new Date("2024-01-15T10:00:00Z"),
    completedAt: new Date("2024-01-15T10:15:00Z"),
    title: "Wardrobe Interface Analysis",
    personaName: "Sophia Harrington",
  },
  {
    id: "interview-2",
    personaId: "emma",
    scenarioId: "stylist",
    status: "completed",
    conversation: [
      {
        speaker: "moderator",
        message: "How do you feel about your stylist having access to your wardrobe data?",
        timestamp: new Date("2024-01-16T14:00:00Z"),
      },
      {
        speaker: "persona",
        message:
          "I love it! The more data they have, the better recommendations I'll get. I want to see analytics on cost-per-wear, seasonal rotation, and style compatibility scores.",
        timestamp: new Date("2024-01-16T14:00:30Z"),
      },
    ],
    createdAt: new Date("2024-01-16T14:00:00Z"),
    completedAt: new Date("2024-01-16T14:12:00Z"),
    title: "Stylist Recommendations Analysis",
    personaName: "Emma Rodriguez",
  },
]

const mockAnalysis = {
  keyInsights: [
    "Ultra-HNW customers prioritize privacy and personalized service over self-service features",
    "Data transparency is valued but must be coupled with strict privacy controls",
    "Strategic builders embrace data-driven features and want more analytics",
    "Traditional luxury customers prefer human curation over algorithmic recommendations",
  ],
  sentiment: {
    overall: "positive" as const,
    confidence: 0.95,
    reasoning: "Mixed reactions with privacy concerns balanced by appreciation for data insights",
  },
  authenticityScore: 0.89,
  painPoints: [
    "Privacy concerns about data sharing",
    "Expectation of white-glove service without self-service requirements",
    "Need for trusted advisor relationship maintenance",
  ],
  opportunities: [
    "Enhanced privacy controls and transparency",
    "Tiered service levels based on customer preferences",
    "Advanced analytics for data-driven customers",
  ],
  quotes: [
    "I'd expect my client advisor to know my style better than I do",
    "I love it! The more data they have, the better recommendations I'll get",
    "I'm concerned about privacy. Who else can see this information?",
  ],
  recommendations: [
    "Implement granular privacy controls for wardrobe data",
    "Create customer preference profiles for service level customization",
    "Develop advisor-mediated data insights rather than direct customer access",
    "Add cost-per-wear and compatibility analytics for strategic customers",
  ],
}

const sentimentColors = {
  positive: "#22c55e",
  neutral: "#f59e0b",
  negative: "#ef4444",
}

const chartData = [
  { name: "Sophia", sentiment: "neutral", score: 0.65 },
  { name: "Emma", sentiment: "positive", score: 0.85 },
  { name: "Margaret", sentiment: "negative", score: 0.45 },
]

// Mock persona data for video generation
const mockPersonas: Record<string, Persona> = {
  sophia: {
    id: "sophia",
    name: "Sophia Harrington",
    avatar: "👑",
    type: "Ultra-HNW Collector",
    age: 52,
    location: "Upper East Side, Manhattan",
    annualSpend: "$300K",
    background: "Ultra-HNW luxury collector from Upper East Side Manhattan...",
    keyQuotes: ["I expect my client advisor to know my style better than I do"],
    physicalTraits: {
      ethnicity: "Caucasian",
      hairColor: "Silver-blonde",
      eyeColor: "Blue",
      build: "Elegant, tall",
      style: "Classic luxury, impeccably tailored",
      accessories: ["Hermès scarf", "Cartier watch", "Pearl earrings"],
    },
    characterTraits: {
      accent: "Refined Upper East Side accent",
      speakingStyle: "Articulate, measured, sophisticated",
      mannerisms: ["Gestures with hands when passionate", "Sslight pause before important points"],
      personality: "Confident, discerning, relationship-focused",
      socialClass: "Ultra-high net worth, old money",
    },
    videoSettings: {
      setting: "Elegant living room with art collection visible in background",
      lighting: "Soft, warm natural light from large windows",
      cameraAngle: "Slight upward angle, professional framing",
      wardrobe: "Tailored blazer, silk blouse, minimal but expensive jewelry",
      mood: "Sophisticated, authoritative yet approachable",
    },
  },
  emma: {
    id: "emma",
    name: "Emma Rodriguez",
    avatar: "💼",
    type: "Strategic Builder",
    age: 29,
    location: "West Hollywood, LA",
    annualSpend: "$75K",
    background: "29-year-old tech director building a luxury wardrobe strategically...",
    keyQuotes: ["I need to see the data before making expensive fashion decisions"],
    physicalTraits: {
      ethnicity: "Half British, half Filipino",
      hairColor: "Dark brown",
      eyeColor: "Brown",
      build: "Petite, athletic",
      style: "Modern minimalist, trendy but strategic",
      accessories: ["Dior sunglasses", "Apple Watch", "Structured handbag"],
    },
    characterTraits: {
      accent: "American with slight British inflection",
      speakingStyle: "Quick, analytical, enthusiastic about data",
      mannerisms: ["Uses hand gestures when explaining", "Pulls up phone to reference data"],
      personality: "Strategic, data-driven, ambitious",
      socialClass: "High-earning professional, new money",
    },
    videoSettings: {
      setting: "Modern patio with clean lines, beautiful house in background",
      lighting: "Bright morning sun with slight bokeh effect",
      cameraAngle: "Eye level, direct engagement with camera",
      wardrobe: "Trendy but expensive casual wear, designer accessories",
      mood: "Confident, analytical, slightly casual but polished",
    },
  },
}

export function ResultsAnalytics({ selectedInterview }: ResultsAnalyticsProps) {
  const [activeView, setActiveView] = useState<"overview" | "detailed" | "transcript">(
    selectedInterview ? "detailed" : "overview",
  )
  const [showVideoGenerator, setShowVideoGenerator] = useState(false)
  const [videos, setVideos] = useState<any[]>([])
  const [videosLoading, setVideosLoading] = useState(true)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<any>(null)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [interviews, setInterviews] = useState<Interview[]>(mockInterviews)
  const [analysis, setAnalysis] = useState(mockAnalysis)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showInterviewDetail, setShowInterviewDetail] = useState(false)
  const [uploadedVideos, setUploadedVideos] = useState<
    Array<{
      id: string
      name: string
      url: string
      uploadedAt: Date
      size: string
      duration: string
      interviewId?: string
      thumbnail?: string
    }>
  >([])
  const [isUploading, setIsUploading] = useState(false)
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState("")

  const [promptHistory, setPromptHistory] = useState<any[]>([])
  const [showPromptModal, setShowPromptModal] = useState(false)
  const [selectedPrompt, setSelectedPrompt] = useState<any>(null)
  const [editingPrompt, setEditingPrompt] = useState("")
  const [isEditingPrompt, setIsEditingPrompt] = useState(false)

  const handleTitleChange = (videoId: string, title: string) => {
    // Implementation for handleTitleChange
  }

  useEffect(() => {
    const savedPrompts = localStorage.getItem("videoPrompts")
    if (savedPrompts) {
      try {
        const parsedPrompts = JSON.parse(savedPrompts)
        setPromptHistory(parsedPrompts)
      } catch (error) {
        console.error("Failed to load prompt history:", error)
      }
    }
  }, [])

  const handleViewPrompt = (prompt: any) => {
    setSelectedPrompt(prompt)
    setEditingPrompt(prompt.generatedPrompt || prompt.videoPrompt)
    setIsEditingPrompt(false)
    setShowPromptModal(true)
  }

  const handleSavePrompt = () => {
    if (selectedPrompt) {
      const updatedPrompts = promptHistory.map((prompt) =>
        prompt.id === selectedPrompt.id ? { ...prompt, generatedPrompt: editingPrompt } : prompt,
      )
      setPromptHistory(updatedPrompts)
      localStorage.setItem("videoPrompts", JSON.stringify(updatedPrompts))
      setIsEditingPrompt(false)
    }
  }

  const handleDeletePrompt = (promptId: string) => {
    const updatedPrompts = promptHistory.filter((prompt) => prompt.id !== promptId)
    setPromptHistory(updatedPrompts)
    localStorage.setItem("videoPrompts", JSON.stringify(updatedPrompts))
    if (selectedPrompt?.id === promptId) {
      setShowPromptModal(false)
    }
  }

  const handleCopyPrompt = async (prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt)
    } catch (error) {
      console.error("Failed to copy prompt:", error)
    }
  }

  useEffect(() => {
    if (selectedInterview) {
      setActiveView("detailed")
    } else {
      setActiveView("overview")
    }
  }, [selectedInterview])

  useEffect(() => {
    loadVideos()
  }, [])

  const generateThumbnailFromUrl = (videoUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video")
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      video.crossOrigin = "anonymous"
      video.onloadedmetadata = () => {
        canvas.width = 160
        canvas.height = 90
        video.currentTime = Math.min(2, video.duration / 4) // Capture at 2 seconds or 1/4 duration
      }

      video.onseeked = () => {
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          const thumbnail = canvas.toDataURL("image/jpeg", 0.8)
          resolve(thumbnail)
        } else {
          reject(new Error("Could not get canvas context"))
        }
      }

      video.onerror = () => reject(new Error("Could not load video"))
      video.src = videoUrl
    })
  }

  const generateVideoThumbnail = (videoFile: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video")
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      video.onloadedmetadata = () => {
        canvas.width = 160
        canvas.height = 90
        video.currentTime = Math.min(2, video.duration / 4) // Capture at 2 seconds or 1/4 duration
      }

      video.onseeked = () => {
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          const thumbnail = canvas.toDataURL("image/jpeg", 0.8)
          resolve(thumbnail)
        } else {
          reject(new Error("Could not get canvas context"))
        }
      }

      video.onerror = () => reject(new Error("Could not load video"))
      video.src = URL.createObjectURL(videoFile)
    })
  }

  const loadVideos = async () => {
    try {
      console.log("[v0] Loading videos from API...")
      setVideosLoading(true) // Ensure loading state is set
      const response = await fetch("/api/videos/list")
      console.log("[v0] API response status:", response.status)

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log("[v0] API response data:", data)

      if (data.videos) {
        const processedVideos = await Promise.all(
          data.videos.map(async (video: any) => {
            let thumbnail = video.thumbnail

            // Generate thumbnail if it doesn't exist
            if (!thumbnail) {
              try {
                thumbnail = await generateThumbnailFromUrl(video.url)
                console.log("[v0] Generated thumbnail for video:", video.filename)
              } catch (error) {
                console.error("[v0] Failed to generate thumbnail for video:", video.filename, error)
              }
            }

            return {
              ...video,
              uploadedAt: new Date(video.uploadedAt),
              thumbnail: thumbnail,
            }
          }),
        )

        console.log("[v0] Processed videos:", processedVideos)
        setUploadedVideos(processedVideos)
      } else {
        console.log("[v0] No videos found in API response")
        setUploadedVideos([])
      }
    } catch (error) {
      console.error("[v0] Failed to load videos:", error)
      alert("Failed to load existing videos. Please refresh the page.")
    } finally {
      setVideosLoading(false) // Always set loading to false when done
    }
  }

  const analyzeInterview = async (interview: Interview) => {
    setIsAnalyzing(true)
    try {
      // In a real app, we'd fetch persona and scenario data
      const mockPersona = {
        name: "Sophia Harrington",
        type: "Ultra-HNW Collector",
        background: "Ultra-HNW luxury collector from Upper East Side Manhattan...",
      }
      const mockScenario = {
        name: "Rediscovering Wardrobe Interface",
      }

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversation: interview.conversation,
          persona: mockPersona,
          scenario: mockScenario,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setAnalysis(data.analysis)
      }
    } catch (error) {
      console.error("Analysis failed:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleInterviewClick = (interview: Interview) => {
    console.log("[v0] Interview clicked:", interview.id)
    setShowInterviewDetail(true)
  }

  const handleBackToList = () => {
    setShowInterviewDetail(false)
    setActiveView("overview")
    setShowVideoGenerator(false)
  }

  const handleGenerateVideo = () => {
    setShowVideoGenerator(true)
  }

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("video/")) {
      setIsUploading(true)
      try {
        console.log("[v0] Starting video upload to Blob storage:", file.name)

        const thumbnail = await generateVideoThumbnail(file)

        const formData = new FormData()
        formData.append("file", file)
        if (selectedInterview) {
          formData.append("interviewId", selectedInterview.id)
        }

        const response = await fetch("/api/videos/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`)
        }

        const uploadedVideo = await response.json()

        const newVideo = {
          id: uploadedVideo.id,
          name: uploadedVideo.filename,
          url: uploadedVideo.url,
          uploadedAt: new Date(uploadedVideo.uploadedAt),
          size: `${(uploadedVideo.size / (1024 * 1024)).toFixed(1)} MB`,
          duration: "Processing...",
          interviewId: uploadedVideo.interviewId,
          thumbnail: thumbnail,
        }

        const videoElement = document.createElement("video")
        videoElement.src = newVideo.url
        videoElement.onloadedmetadata = () => {
          const minutes = Math.floor(videoElement.duration / 60)
          const seconds = Math.floor(videoElement.duration % 60)
          newVideo.duration = `${minutes}:${seconds.toString().padStart(2, "0")}`
          setUploadedVideos((prev) => prev.map((v) => (v.id === newVideo.id ? newVideo : v)))
        }

        setUploadedVideos((prev) => [newVideo, ...prev])
        console.log("[v0] Video uploaded successfully to Blob storage:", uploadedVideo.url)
      } catch (error) {
        console.error("[v0] Video upload failed:", error)
        alert("Failed to upload video. Please try again.")
      } finally {
        setIsUploading(false)
      }

      event.target.value = ""
    } else {
      console.log("[v0] Invalid file type or no file selected")
      alert("Please select a valid video file")
    }
  }

  const handleDeleteVideo = async (videoId: string) => {
    const videoToDelete = uploadedVideos.find((v) => v.id === videoId)
    if (videoToDelete) {
      try {
        const response = await fetch("/api/videos/delete", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: videoToDelete.url }),
        })

        if (!response.ok) {
          throw new Error(`Delete failed: ${response.statusText}`)
        }

        setUploadedVideos((prev) => prev.filter((v) => v.id !== videoId))
        console.log("[v0] Video deleted from Blob storage:", videoToDelete.name)
      } catch (error) {
        console.error("[v0] Video deletion failed:", error)
        alert("Failed to delete video. Please try again.")
      }
    }
  }

  const handlePlayVideo = (video: any) => {
    console.log("[v0] Playing video:", video.url)
    setSelectedVideo(video)
    setShowVideoModal(true)
  }

  const handleCloseVideoModal = () => {
    console.log("[v0] Closing video modal")
    setShowVideoModal(false)
    setSelectedVideo(null)
  }

  const handleEditTitle = (videoId: string, currentTitle: string) => {
    setEditingVideoId(videoId)
    setEditingTitle(currentTitle)
  }

  const handleSaveTitle = async (videoId: string) => {
    if (editingTitle.trim()) {
      setUploadedVideos((prev) => prev.map((v) => (v.id === videoId ? { ...v, name: editingTitle.trim() } : v)))
      setEditingVideoId(null)
      setEditingTitle("")
      console.log("[v0] Video title updated:", editingTitle.trim())
    }
  }

  const handleCancelEdit = () => {
    setEditingVideoId(null)
    setEditingTitle("")
  }

  const completedInterviews = interviews.filter((i) => i.status === "completed")
  const avgDuration =
    completedInterviews.reduce((acc, interview) => {
      if (interview.completedAt && interview.createdAt) {
        return acc + (interview.completedAt.getTime() - interview.createdAt.getTime())
      }
      return acc
    }, 0) /
    completedInterviews.length /
    1000 /
    60 // Convert to minutes

  const parseMultipleSpeakers = (messageText, originalMessage) => {
    console.log("[v0] Parsing message:", messageText.substring(0, 200) + "...")

    const speakerPatterns = [
      /researcher:\s*/gi,
      /sophia harrington:\s*/gi,
      /interviewer:\s*/gi,
      /moderator:\s*/gi,
      /marcus chen:\s*/gi,
      /priya sharma:\s*/gi,
      /alex rodriguez:\s*/gi,
      /sarah johnson:\s*/gi,
      /david kim:\s*/gi,
      /emily watson:\s*/gi,
      /james wilson:\s*/gi,
      /lisa anderson:\s*/gi,
      /michael brown:\s*/gi,
      /jennifer davis:\s*/gi,
    ]

    const matches = []
    speakerPatterns.forEach((pattern, patternIndex) => {
      let match
      const regex = new RegExp(pattern.source, pattern.flags)
      while ((match = regex.exec(messageText)) !== null) {
        matches.push({
          index: match.index,
          length: match[0].length,
          pattern: pattern,
          patternIndex: patternIndex,
          isResearcher:
            pattern.source.includes("researcher") ||
            pattern.source.includes("interviewer") ||
            pattern.source.includes("moderator"),
        })
      }
    })

    console.log("[v0] Found speaker matches:", matches)

    if (matches.length === 0) {
      // No speaker patterns found, return as single persona segment
      return [
        {
          speaker: "persona",
          message: messageText,
          timestamp: originalMessage.timestamp,
        },
      ]
    }

    // Sort matches by position
    matches.sort((a, b) => a.index - b.index)
    console.log("[v0] Sorted matches:", matches)

    const segments = []
    let lastIndex = 0

    matches.forEach((match, i) => {
      // Add content before this speaker (if any) as persona content
      if (match.index > lastIndex) {
        const beforeText = messageText.substring(lastIndex, match.index).trim()
        if (beforeText) {
          segments.push({
            speaker: "persona",
            message: beforeText,
            timestamp: originalMessage.timestamp,
          })
        }
      }

      // Find the end of this speaker's content
      const nextMatch = matches[i + 1]
      const endIndex = nextMatch ? nextMatch.index : messageText.length
      const speakerContent = messageText.substring(match.index + match.length, endIndex).trim()

      if (speakerContent) {
        segments.push({
          speaker: match.isResearcher ? "moderator" : "persona",
          message: speakerContent,
          timestamp: originalMessage.timestamp,
        })
      }

      lastIndex = endIndex
    })

    console.log("[v0] Generated segments:", segments)
    return segments
  }

  const renderDetailedView = () => {
    if (!selectedInterview) return null

    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">{selectedInterview.title}</h2>
              <div className="text-sm text-slate-600 space-y-1">
                <p>
                  <span className="font-medium">Participant:</span> {selectedInterview.personaName}
                </p>
                <p>
                  <span className="font-medium">Date:</span>{" "}
                  {new Date(selectedInterview.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium">Time:</span>{" "}
                  {new Date(selectedInterview.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">15m</div>
                <div className="text-sm text-slate-600">Duration</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">89%</div>
                <div className="text-sm text-slate-600 flex items-center justify-center gap-1">
                  Authenticity
                  <div className="group relative">
                    <HelpCircle className="w-3 h-3 text-slate-400 cursor-help" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      How genuine and natural the responses appear based on persona characteristics
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">4</div>
                <div className="text-sm text-slate-600">Insights identified</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">😊 Positive</div>
                <div className="text-sm text-slate-600">Sentiment</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              Top Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-lg">
                <div className="w-6 h-6 bg-gray-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <p className="text-slate-700">
                  Ultra-HNW customers prioritize privacy and personalized service over self-service features
                </p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-lg">
                <div className="w-6 h-6 bg-gray-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <p className="text-slate-700">
                  Data transparency is valued but must be coupled with strict privacy controls
                </p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-lg">
                <div className="w-6 h-6 bg-gray-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <p className="text-slate-700">
                  Long-term relationship building is more important than transaction efficiency
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Quotes with Video Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Quote className="w-5 h-5 text-slate-600" />
              Key Quotes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {selectedInterview?.conversation && selectedInterview.conversation.length > 0 ? (
                selectedInterview.conversation
                  .filter((message) => message.speaker === "persona" && message.message.length > 50) // Only persona messages with substantial content
                  .slice(0, 2) // Show max 2 key quotes
                  .map((message, index) => (
                    <div key={index} className="p-4 bg-slate-50 rounded-lg border-l-4 border-gray-400">
                      <p className="text-slate-700 italic mb-2">"{message.message}"</p>
                      <p className="text-sm text-slate-500">— {selectedInterview.personaName}</p>
                    </div>
                  ))
              ) : (
                <div className="p-4 bg-slate-50 rounded-lg border-l-4 border-gray-400">
                  <p className="text-slate-500 italic">No key quotes available for this interview.</p>
                </div>
              )}
            </div>

            {/* Quote Videos Section */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold">Quote Videos</h3>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowVideoGenerator(true)}
                  className="flex items-center gap-2"
                >
                  <Video className="w-4 h-4" />
                  Generate Video
                </Button>
              </div>

              {/* Video Upload Area */}
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center mb-6">
                <Video className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600 mb-2">Upload videos of key quotes</p>
                <p className="text-sm text-slate-500 mb-4">
                  Show the tester saying these key quotes • MP4, MOV, AVI, WebM
                </p>
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={handleVideoUpload}
                  className="hidden"
                  id="video-upload"
                  disabled={uploadingVideo}
                />
                <Button
                  variant="outline"
                  disabled={uploadingVideo}
                  className="cursor-pointer bg-transparent"
                  onClick={() => {
                    console.log("[v0] Choose Video button clicked")
                    const fileInput = document.getElementById("video-upload") as HTMLInputElement
                    if (fileInput) {
                      fileInput.click()
                    }
                  }}
                >
                  {uploadingVideo ? "Uploading..." : "Choose Video"}
                </Button>
              </div>

              {/* Video Grid */}
              {videosLoading ? (
                <div className="text-center py-8 text-slate-500">Loading videos...</div>
              ) : uploadedVideos.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  No videos uploaded yet. Upload videos to see them here.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {uploadedVideos.map((video) => (
                    <div key={video.id} className="bg-slate-50 rounded-lg overflow-hidden">
                      <div
                        className="relative bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-200 transition-colors"
                        onClick={() => handlePlayVideo(video)}
                      >
                        {video.thumbnail ? (
                          <img
                            src={video.thumbnail || "/placeholder.svg"}
                            alt={video.filename || video.name}
                            className="w-full h-32 object-cover"
                          />
                        ) : (
                          <div className="w-full h-32 bg-slate-200 flex items-center justify-center">
                            <Play className="w-8 h-8 text-slate-400" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/20 hover:bg-black/30 transition-colors flex items-center justify-center">
                          <Play className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <div className="p-3 flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          {video.isEditing ? (
                            <input
                              type="text"
                              value={video.editTitle || video.filename || video.name}
                              onChange={(e) => handleTitleChange(video.id, e.target.value)}
                              onBlur={() => handleSaveTitle(video.id)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveTitle(video.id)
                                if (e.key === "Escape") handleCancelEdit(video.id)
                              }}
                              className="w-full text-sm font-medium bg-white border rounded px-2 py-1"
                              autoFocus
                            />
                          ) : (
                            <h4 className="text-sm font-medium truncate">{video.filename || video.name}</h4>
                          )}
                          <p className="text-xs text-slate-500">
                            {(video.size / 1024 / 1024).toFixed(1)} MB •{" "}
                            {new Date(video.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditTitle(video.id)
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteVideo(video.id)
                            }}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Generated Video Prompts Section */}
        {promptHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5 text-purple-600" />
                Generated Video Prompts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Title</th>
                      <th className="text-left p-3 font-medium">Generated</th>
                      <th className="text-left p-3 font-medium">Status</th>
                      <th className="text-left p-3 font-medium">Response Preview</th>
                      <th className="text-left p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {promptHistory
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map((prompt, index) => (
                        <tr
                          key={prompt.id}
                          className={`border-b cursor-pointer hover:bg-slate-50 ${
                            index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                          }`}
                          onClick={() => handleViewPrompt(prompt)}
                        >
                          <td className="p-3 font-medium">{prompt.title}</td>
                          <td className="p-3 text-sm text-slate-600">
                            {new Date(prompt.createdAt).toLocaleDateString()} at{" "}
                            {new Date(prompt.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td className="p-3">
                            <Badge
                              variant={
                                prompt.status === "completed"
                                  ? "default"
                                  : prompt.status === "pending"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {prompt.status}
                            </Badge>
                          </td>
                          <td className="p-3 text-sm text-slate-600 max-w-[200px] truncate">
                            {prompt.responseText?.substring(0, 60)}...
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleViewPrompt(prompt)
                                }}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleCopyPrompt(prompt.generatedPrompt || prompt.videoPrompt)
                                }}
                              >
                                Copy
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pain Points */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Pain Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900">Lack of personal relationship</p>
                  <p className="text-sm text-slate-600">
                    Digital-first approaches feel impersonal and don't build the trust necessary for high-value
                    purchases
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900">Privacy concerns with data sharing</p>
                  <p className="text-sm text-slate-600">
                    Hesitant to share personal information without clear understanding of how it will be used and
                    protected
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Opportunities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900">Enhanced advisor tools</p>
                  <p className="text-sm text-slate-600">
                    Provide advisors with better data and tools to serve clients more effectively while maintaining
                    personal relationships
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900">Transparent data usage</p>
                  <p className="text-sm text-slate-600">
                    Clear communication about how personal data enhances the shopping experience while ensuring privacy
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Follow-up Questions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-500" />
              Follow-up Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-slate-700">
                  How might we design features that enhance the advisor-client relationship rather than replace it?
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-slate-700">
                  What specific privacy controls would make you comfortable sharing more personal data?
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-slate-700">
                  How do you currently track and analyze your luxury purchases, and what tools would be helpful?
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Video Generator Modal */}
        {showVideoGenerator && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Generate Video Prompt</h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowVideoGenerator(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <VideoGenerator
                  persona={mockPersonas[selectedInterview.personaId]}
                  conversation={selectedInterview?.conversation || []}
                  onVideoGenerated={(video) => {
                    console.log("[v0] Video generated:", video)
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Prompt Editing Modal */}
        {showPromptModal && selectedPrompt && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">{selectedPrompt.title}</h2>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => setIsEditingPrompt(!isEditingPrompt)}>
                      <Edit2 className="w-4 h-4 mr-2" />
                      {isEditingPrompt ? "Cancel" : "Edit"}
                    </Button>
                    {isEditingPrompt && (
                      <Button size="sm" onClick={handleSavePrompt}>
                        Save Changes
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => setShowPromptModal(false)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Original Response:</label>
                    <textarea
                      value={selectedPrompt.responseText}
                      readOnly
                      className="w-full min-h-[100px] p-3 border rounded-md bg-slate-50 text-sm mt-2"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Video Prompt:</label>
                    <textarea
                      value={editingPrompt}
                      onChange={(e) => setEditingPrompt(e.target.value)}
                      readOnly={!isEditingPrompt}
                      className={`w-full min-h-[200px] p-3 border rounded-md text-sm mt-2 ${
                        isEditingPrompt ? "" : "bg-slate-50"
                      }`}
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button onClick={() => handleCopyPrompt(editingPrompt)} variant="outline">
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Prompt
                    </Button>
                    <Button
                      onClick={() =>
                        window.open(
                          "https://labs.google/fx/tools/flow/project/d4048cd9-3ab3-4ecb-9bec-50cfd0c0915c",
                          "_blank",
                        )
                      }
                    >
                      <Video className="mr-2 h-4 w-4" />
                      Try VEO 3
                    </Button>
                    <Button variant="destructive" onClick={() => handleDeletePrompt(selectedPrompt.id)}>
                      <X className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <VideoModal isOpen={showVideoModal} onClose={handleCloseVideoModal} video={selectedVideo} />
      </div>
    )
  }

  const renderOverview = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Completed Interviews</CardTitle>
            <Badge variant="secondary">{completedInterviews.length} interviews</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {completedInterviews.map((interview) => (
              <div
                key={interview.id}
                className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                onClick={() => {
                  handleInterviewClick(interview)
                  setActiveView("detailed")
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{interview.scenarioId}</p>
                    <p className="text-sm text-slate-600">
                      {interview.personaId} • {new Date(interview.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button size="sm">View Results</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Persona Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium">Sophia Harrington</p>
                  <p className="text-sm text-slate-600">Avg authenticity</p>
                </div>
                <Progress value={85} />
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium">Marcus Chen</p>
                  <p className="text-sm text-slate-600">Avg authenticity</p>
                </div>
                <Progress value={72} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Scenario Success
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium">Wardrobe Discovery</p>
                  <p className="text-sm text-slate-600">Success rate</p>
                </div>
                <Badge variant="outline">92%</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium">Stylist Recommendations</p>
                  <p className="text-sm text-slate-600">Success rate</p>
                </div>
                <Badge variant="outline">85%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            Insight Evolution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
              <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="font-medium text-slate-900">
                  Ultra-HNW customers prioritize privacy and personalized service over self-service features
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">8 interviews</Badge>
                  <p className="text-sm text-slate-600">Confidence: 95%</p>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
              <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="font-medium text-slate-900">
                  Data transparency is valued but must be coupled with strict privacy controls
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">6 interviews</Badge>
                  <p className="text-sm text-slate-600">Confidence: 88%</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderTranscript = () => {
    if (!selectedInterview) return null

    const groupedConversation = []
    let currentPair = { question: null, answer: null, followUps: [] }

    for (const message of selectedInterview.conversation || []) {
      console.log("[v0] Processing message:", message.speaker, message.message.substring(0, 100))

      if (message.speaker === "moderator") {
        if (currentPair.question && (currentPair.answer || currentPair.followUps.length > 0)) {
          console.log("[v0] Saving completed pair:", currentPair)
          groupedConversation.push(currentPair)
        }
        // Start new pair with this question
        currentPair = { question: message, answer: null, followUps: [] }
        console.log("[v0] Started new pair with moderator question")
      } else if (message.speaker === "persona") {
        const segments = parseMultipleSpeakers(message.message, message)
        console.log("[v0] Parsed segments:", segments.length)

        for (let i = 0; i < segments.length; i++) {
          const segment = segments[i]
          console.log("[v0] Processing segment:", segment.speaker, segment.message.substring(0, 50))

          if (segment.speaker === "moderator") {
            if (currentPair.question && (currentPair.answer || currentPair.followUps.length > 0)) {
              console.log("[v0] Saving pair before researcher question:", currentPair)
              groupedConversation.push(currentPair)
            }
            // Start completely new pair for the researcher question
            currentPair = { question: segment, answer: null, followUps: [] }
            console.log("[v0] Created new pair for embedded researcher question")
          } else {
            // This is a persona response
            if (!currentPair.answer) {
              currentPair.answer = segment
              console.log("[v0] Set as main answer")
            } else {
              // This is a follow-up response
              currentPair.followUps.push(segment)
              console.log("[v0] Added as follow-up")
            }
          }
        }
      }
    }

    if (currentPair.question && (currentPair.answer || currentPair.followUps.length > 0)) {
      console.log("[v0] Saving final pair:", currentPair)
      groupedConversation.push(currentPair)
    }

    console.log("[v0] Final grouped conversation:", groupedConversation.length, "pairs")

    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Interview Transcript</h2>
          <p className="text-slate-600 mb-6">
            Complete conversation between interviewer and {selectedInterview.personaName}
          </p>
        </div>

        {/* Q&A Pairs */}
        <div className="space-y-6">
          {groupedConversation.map((pair, index) => (
            <div key={index} className="border-l-4 border-blue-200 pl-6 space-y-4">
              {/* Question */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-blue-900 mb-1">Interviewer</p>
                    <p className="text-slate-700">{pair.question.message}</p>
                    <p className="text-xs text-slate-500 mt-2">
                      {new Date(pair.question.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Main Answer */}
              {pair.answer && (
                <div className="bg-slate-50 p-4 rounded-lg ml-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 mb-1">{selectedInterview.personaName}</p>
                      <p className="text-slate-700">{pair.answer.message}</p>
                      <p className="text-xs text-slate-500 mt-2">
                        {new Date(pair.answer.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {pair.followUps.map((followUp, followUpIndex) => (
                <div key={followUpIndex} className="bg-slate-100 p-4 rounded-lg ml-8 border-l-2 border-slate-300">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-slate-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-3 h-3 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800 mb-1 text-sm">
                        {selectedInterview.personaName} (Follow-up)
                      </p>
                      <p className="text-slate-700 text-sm">{followUp.message}</p>
                      <p className="text-xs text-slate-500 mt-2">{new Date(followUp.timestamp).toLocaleTimeString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {showVideoGenerator && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Generate Video Prompt</h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowVideoGenerator(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <VideoGenerator
                  persona={mockPersonas[selectedInterview.personaId]}
                  conversation={selectedInterview?.conversation || []}
                  onVideoGenerated={(video) => {
                    console.log("[v0] Video generated:", video)
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <Tabs value={activeView} className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview" onClick={() => setActiveView("overview")}>
          Overview
        </TabsTrigger>
        {selectedInterview && (
          <TabsTrigger value="detailed" onClick={() => setActiveView("detailed")}>
            Detailed Results
          </TabsTrigger>
        )}
        {selectedInterview && (
          <TabsTrigger value="transcript" onClick={() => setActiveView("transcript")}>
            Transcript
          </TabsTrigger>
        )}
      </TabsList>
      <TabsContent value="overview">{renderOverview()}</TabsContent>
      <TabsContent value="detailed">{renderDetailedView()}</TabsContent>
      <TabsContent value="transcript">{renderTranscript()}</TabsContent>

      <VideoModal isOpen={showVideoModal} onClose={handleCloseVideoModal} video={selectedVideo} />
    </Tabs>
  )
}
