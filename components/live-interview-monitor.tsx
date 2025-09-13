"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Pause, Square, Save, Share2, Clock, TrendingUp, MessageSquare, Target } from "lucide-react"

interface LiveInterviewMonitorProps {
  interviewId: string
  scenario: string
  personaName: string
  interviewerName: string
  onPause: () => void
  onStop: () => void
  onSaveDraft: () => void
  onShare: () => void
}

interface ConversationMessage {
  id: string
  speaker: "moderator" | "persona"
  message: string
  timestamp: Date
  responseTime?: number
}

interface LiveAnalytics {
  authenticity: number
  sentiment: "positive" | "neutral" | "negative"
  insightsFound: number
  avgResponseTime: number
  progress: number
}

export function LiveInterviewMonitor({
  interviewId,
  scenario,
  personaName,
  interviewerName,
  onPause,
  onStop,
  onSaveDraft,
  onShare,
}: LiveInterviewMonitorProps) {
  const [conversation, setConversation] = useState<ConversationMessage[]>([
    {
      id: "1",
      speaker: "moderator",
      message: "Looking at this wardrobe interface, how would you find pieces you haven't worn recently?",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
    },
    {
      id: "2",
      speaker: "persona",
      message:
        "I'd immediately look for the purchase date filter - I keep meticulous records, and seeing items from 2019 or earlier that I haven't styled recently would be perfect.",
      timestamp: new Date(Date.now() - 4 * 60 * 1000),
      responseTime: 2.3,
    },
    {
      id: "3",
      speaker: "moderator",
      message: "That's interesting. Can you tell me more about how you organize your wardrobe mentally?",
      timestamp: new Date(Date.now() - 3 * 60 * 1000),
    },
    {
      id: "4",
      speaker: "persona",
      message:
        "I think in seasons and occasions first, then by brand relationships. Each piece has a story - when I bought it, why, what it represents in my style evolution.",
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      responseTime: 1.8,
    },
  ])

  const [analytics, setAnalytics] = useState<LiveAnalytics>({
    authenticity: 87,
    sentiment: "positive",
    insightsFound: 3,
    avgResponseTime: 2.3,
    progress: 80,
  })

  const [isTyping, setIsTyping] = useState(false)
  const [duration, setDuration] = useState(12 * 60 + 34) // 12:34 in seconds
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDuration((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Simulate typing indicator
  useEffect(() => {
    const typingInterval = setInterval(() => {
      setIsTyping(Math.random() > 0.7)
    }, 3000)

    return () => clearInterval(typingInterval)
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [conversation])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "text-green-600"
      case "negative":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "😊"
      case "negative":
        return "😞"
      default:
        return "😐"
    }
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <h1 className="text-xl font-semibold text-gray-900">Live: {scenario}</h1>
            </div>
            <div className="text-sm text-gray-600">
              {personaName} & {interviewerName}
            </div>
            <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
              <Clock className="w-4 h-4" />
              {formatDuration(duration)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onPause}>
              <Pause className="w-4 h-4 mr-1" />
              Pause
            </Button>
            <Button variant="outline" size="sm" onClick={onStop}>
              <Square className="w-4 h-4 mr-1" />
              Stop
            </Button>
            <Button variant="outline" size="sm" onClick={onSaveDraft}>
              <Save className="w-4 h-4 mr-1" />
              Save Draft
            </Button>
            <Button variant="outline" size="sm" onClick={onShare}>
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-6 p-6">
        {/* Conversation */}
        <div className="flex-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Conversation
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full pb-6">
              <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {conversation.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.speaker === "moderator" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-3 ${
                          message.speaker === "moderator" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">
                            {message.speaker === "moderator" ? interviewerName : personaName}
                          </span>
                          {message.responseTime && (
                            <span className="text-xs opacity-70">({message.responseTime}s)</span>
                          )}
                        </div>
                        <p className="text-sm leading-relaxed">{message.message}</p>
                        <div className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg px-4 py-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">{personaName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <span className="text-xs text-gray-500 ml-2">Typing...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="w-80 space-y-6">
          {/* Live Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Live Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Authenticity</span>
                <span className="text-lg font-bold text-green-600">{analytics.authenticity}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Sentiment</span>
                <div className="flex items-center gap-1">
                  <span className={`text-sm font-medium ${getSentimentColor(analytics.sentiment)}`}>
                    {analytics.sentiment.charAt(0).toUpperCase() + analytics.sentiment.slice(1)}
                  </span>
                  <span>{getSentimentEmoji(analytics.sentiment)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Insights Found</span>
                <span className="text-lg font-bold text-blue-600">{analytics.insightsFound}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Avg Response</span>
                <span className="text-sm font-medium">{analytics.avgResponseTime}s</span>
              </div>
            </CardContent>
          </Card>

          {/* Context */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Context
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Scenario</h4>
                <p className="text-sm text-gray-600">{scenario}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2">Assets</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>wardrobe_v3.png</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>filter_mockup.jpg</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Progress</span>
                  <span>{analytics.progress}% Complete</span>
                </div>
                <Progress value={analytics.progress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
