"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Clock, User, Target } from "lucide-react"
import { InterviewRunner } from "@/components/interview-runner"
import type { Interview } from "@/lib/types"

// Same mock data as interviews page
const mockInterviews: Interview[] = [
  {
    id: "interview-1",
    personaId: "sophia-harrington",
    personaName: "Sophia Harrington",
    interviewerId: "sophia-chen-laurent",
    interviewerName: "Sophia Chen-Laurent",
    scenarioId: "Luxury Wardrobe Management Experience",
    scenario: "Luxury Wardrobe Management Experience",
    status: "completed",
    createdAt: new Date(2025, 8, 10, 14, 30).toISOString(),
    completedAt: new Date(2025, 8, 10, 15, 15).toISOString(),
    duration: 45,
    conversation: [
      {
        speaker: "moderator",
        message: "Tell me about your relationship with your personal advisor at your preferred luxury brands.",
        timestamp: new Date(2025, 8, 10, 14, 30),
      },
      {
        speaker: "persona",
        message:
          "I've worked with the same advisor at Brunello Cucinelli for over fifteen years. She understands my lifestyle completely - knows I prefer investment pieces over trends, remembers my color preferences, and even tracks what I've worn to important events so I never repeat. That relationship is invaluable.",
        timestamp: new Date(2025, 8, 10, 14, 31),
      },
    ],
    insights: [
      "Strong preference for long-term advisor relationships",
      "Values personalized service and memory of preferences",
      "Investment mindset over trend-following",
    ],
    sentiment: "positive",
    authenticityScore: 92,
    tags: ["luxury", "wardrobe", "advisor-relationship"],
  },
  {
    id: "interview-2",
    personaId: "marcus-chen",
    personaName: "Marcus Chen",
    interviewerId: "marcus-rodriguez",
    interviewerName: "Marcus Rodriguez",
    scenarioId: "Strategic Luxury Investment Planning",
    scenario: "Strategic Luxury Investment Planning",
    status: "completed",
    createdAt: new Date(2025, 8, 9, 10, 15).toISOString(),
    completedAt: new Date(2025, 8, 9, 11, 0).toISOString(),
    duration: 45,
    conversation: [],
    insights: [
      "Data-driven approach to luxury purchases",
      "Focus on ROI and resale value",
      "Preference for established brands with proven track records",
    ],
    sentiment: "neutral",
    authenticityScore: 88,
    tags: ["investment", "luxury", "data-driven"],
  },
  {
    id: "interview-3",
    personaId: "aisha-okafor",
    personaName: "Aisha Okafor",
    interviewerId: "amara-osei",
    interviewerName: "Amara Osei",
    scenarioId: "Cultural Identity in Luxury Fashion",
    scenario: "Cultural Identity in Luxury Fashion",
    status: "completed",
    createdAt: new Date(2025, 8, 8, 16, 45).toISOString(),
    completedAt: new Date(2025, 8, 8, 17, 30).toISOString(),
    duration: 45,
    conversation: [],
    insights: [
      "Strong connection between cultural identity and fashion choices",
      "Seeks brands that respect and celebrate diversity",
      "Values authentic representation in luxury marketing",
    ],
    sentiment: "positive",
    authenticityScore: 95,
    tags: ["cultural-identity", "diversity", "representation"],
  },
  {
    id: "interview-4",
    personaId: "sarah-kim",
    personaName: "Sarah Kim",
    interviewerId: "zoe-wang",
    interviewerName: "Zoe Wang",
    scenarioId: "Social Media and Luxury Consumption",
    scenario: "Social Media and Luxury Consumption",
    status: "completed",
    createdAt: new Date(2025, 8, 7, 11, 20).toISOString(),
    completedAt: new Date(2025, 8, 7, 12, 5).toISOString(),
    duration: 45,
    conversation: [],
    insights: [
      "Social media heavily influences purchase decisions",
      "Values brands with strong digital presence",
      "Seeks shareable, Instagram-worthy pieces",
    ],
    sentiment: "positive",
    authenticityScore: 87,
    tags: ["social-media", "digital", "influence"],
  },
  {
    id: "interview-5",
    personaId: "william-blackstone",
    personaName: "William Blackstone",
    interviewerId: "thomas-anderson",
    interviewerName: "Thomas Anderson",
    scenarioId: "Heritage Luxury and Digital Innovation",
    scenario: "Heritage Luxury and Digital Innovation",
    status: "completed",
    createdAt: new Date(2025, 8, 6, 9, 0).toISOString(),
    completedAt: new Date(2025, 8, 6, 9, 45).toISOString(),
    duration: 45,
    conversation: [],
    insights: [
      "Appreciates heritage and craftsmanship",
      "Cautious about digital innovation in luxury",
      "Values traditional shopping experiences",
    ],
    sentiment: "neutral",
    authenticityScore: 91,
    tags: ["heritage", "craftsmanship", "traditional"],
  },
  {
    id: "interview-175",
    personaId: "sophia-harrington",
    personaName: "Sophia Harrington",
    interviewerId: "sophia-chen-laurent",
    interviewerName: "Sophia Chen-Laurent",
    scenarioId: "Luxury Wardrobe Management Experience",
    scenario: "Luxury Wardrobe Management Experience",
    status: "completed",
    createdAt: new Date(2025, 8, 12, 14, 30).toISOString(),
    completedAt: new Date(2025, 8, 12, 15, 15).toISOString(),
    duration: 45,
    conversation: [
      {
        speaker: "moderator",
        message: "Tell me about your relationship with your personal advisor at your preferred luxury brands.",
        timestamp: new Date(2025, 8, 12, 14, 30),
      },
      {
        speaker: "persona",
        message:
          "I've worked with the same advisor at Brunello Cucinelli for over fifteen years. She understands my lifestyle completely - knows I prefer investment pieces over trends, remembers my color preferences, and even tracks what I've worn to important events so I never repeat. That relationship is invaluable.",
        timestamp: new Date(2025, 8, 12, 14, 31),
      },
      {
        speaker: "moderator",
        message: "How do you feel about digital tools for wardrobe management?",
        timestamp: new Date(2025, 8, 12, 14, 32),
      },
      {
        speaker: "persona",
        message:
          "I'm quite traditional in my approach. I prefer the personal touch - having someone who knows me personally rather than an algorithm. However, I do appreciate when brands use technology to enhance the personal service, like keeping digital records of my purchases and preferences.",
        timestamp: new Date(2025, 8, 12, 14, 33),
      },
    ],
    insights: [
      "Strong preference for long-term advisor relationships",
      "Values personalized service and memory of preferences",
      "Investment mindset over trend-following",
      "Appreciates technology that enhances personal service",
      "Traditional approach to luxury shopping",
    ],
    sentiment: "positive",
    authenticityScore: 94,
    tags: ["luxury", "wardrobe", "advisor-relationship", "personal-service"],
  },
]

export default function InterviewDetailPage() {
  const params = useParams()
  const router = useRouter()
  const interviewId = params.id as string

  const [interview, setInterview] = useState<Interview | null>(null)
  const [showSummary, setShowSummary] = useState(false)
  const [interviewConfig, setInterviewConfig] = useState<any>(null)

  useEffect(() => {
    let foundInterview = mockInterviews.find((i) => i.id === interviewId)

    if (!foundInterview && typeof window !== "undefined") {
      const saved = localStorage.getItem("completed-interviews")
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          foundInterview = parsed.find((i: Interview) => i.id === interviewId)
        } catch (error) {
          console.error("Failed to parse saved interviews:", error)
        }
      }

      if (!foundInterview) {
        const configKey = `interview-config-${interviewId}`
        const savedConfig = localStorage.getItem(configKey)
        if (savedConfig) {
          try {
            const config = JSON.parse(savedConfig)
            setInterviewConfig(config)
            setShowSummary(false)
            return
          } catch (error) {
            console.error("Failed to parse interview config:", error)
          }
        }
      }
    }

    if (foundInterview) {
      setInterview(foundInterview)
      if (foundInterview.status === "completed") {
        setShowSummary(true)
      }
    }
  }, [interviewId])

  const handleBackToInterviews = () => {
    router.push("/interviews")
  }

  const handleBackToDashboard = () => {
    router.push("/")
  }

  const handleInterviewCompleted = (completedInterview: Interview) => {
    setInterview(completedInterview)
    setShowSummary(true)

    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("completed-interviews")
      let interviews = []
      if (saved) {
        try {
          interviews = JSON.parse(saved)
        } catch (error) {
          console.error("Failed to parse saved interviews:", error)
        }
      }
      interviews.push(completedInterview)
      localStorage.setItem("completed-interviews", JSON.stringify(interviews))

      const configKey = `interview-config-${interviewId}`
      localStorage.removeItem(configKey)
    }
  }

  if (!interview && !interviewConfig && interviewId !== "new") {
    return (
      <div className="p-6" style={{ backgroundColor: "#f8f6f2" }}>
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={handleBackToInterviews}
            className="hover:bg-[#EDE6DA]"
            style={{ backgroundColor: "#f8f6f2", border: "1px solid #EDE6DA" }}
          >
            Back to Interviews
          </Button>
          <Button
            variant="ghost"
            onClick={handleBackToDashboard}
            className="hover:bg-[#EDE6DA]"
            style={{ backgroundColor: "#f8f6f2", border: "1px solid #EDE6DA" }}
          >
            Back to Dashboard
          </Button>
        </div>
        <div className="text-center py-8 text-slate-500">Interview not found</div>
      </div>
    )
  }

  if (!showSummary || interviewId === "new" || interviewConfig) {
    return (
      <div className="p-6 space-y-6" style={{ backgroundColor: "#f8f6f2" }}>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={handleBackToInterviews}
            className="hover:bg-[#EDE6DA]"
            style={{ backgroundColor: "#f8f6f2", border: "1px solid #EDE6DA" }}
          >
            Back to Interviews
          </Button>
          <Button
            variant="ghost"
            onClick={handleBackToDashboard}
            className="hover:bg-[#EDE6DA]"
            style={{ backgroundColor: "#f8f6f2", border: "1px solid #EDE6DA" }}
          >
            Back to Dashboard
          </Button>
        </div>

        <InterviewRunner
          initialConfig={interviewConfig}
          onInterviewCompleted={handleInterviewCompleted}
          onSectionChange={(section) => {
            if (section === "results") {
              setShowSummary(true)
            }
          }}
        />
      </div>
    )
  }

  const formatDuration = (minutes: number) => {
    return `${minutes} min`
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800"
      case "negative":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: "#f8f6f2" }}>
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={handleBackToInterviews}
          className="hover:bg-[#EDE6DA]"
          style={{ backgroundColor: "#f8f6f2", border: "1px solid #EDE6DA" }}
        >
          Back to Interviews
        </Button>
        <Button
          variant="ghost"
          onClick={handleBackToDashboard}
          className="hover:bg-[#EDE6DA]"
          style={{ backgroundColor: "#f8f6f2", border: "1px solid #EDE6DA" }}
        >
          Back to Dashboard
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowSummary(false)}
          className="border-[#EDE6DA] hover:bg-[#EDE6DA]"
          style={{ backgroundColor: "#f8f6f2" }}
        >
          View Interview Interface
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">{interview.scenario}</h1>
        <p className="text-gray-600 mt-1">
          Interview with {interview.personaName} • Conducted by {interview.interviewerName}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <MessageSquare className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <Badge variant="default" className="bg-green-100 text-green-800 mt-1">
                  {interview.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-semibold">{formatDuration(interview.duration || 45)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <User className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Sentiment</p>
                <Badge className={getSentimentColor(interview.sentiment || "neutral")}>
                  {interview.sentiment || "neutral"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Target className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Authenticity</p>
                <p className="font-semibold">{interview.authenticityScore || 90}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
        </CardHeader>
        <CardContent>
          {interview.insights && interview.insights.length > 0 ? (
            <ul className="space-y-2">
              {interview.insights.map((insight, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700">{insight}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No insights available for this interview.</p>
          )}
        </CardContent>
      </Card>

      {interview.tags && interview.tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {interview.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Interview Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Created</p>
              <p className="font-medium">
                {new Date(interview.createdAt).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(interview.createdAt).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
            </div>

            {interview.completedAt && (
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="font-medium">
                  {new Date(interview.completedAt).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(interview.completedAt).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
