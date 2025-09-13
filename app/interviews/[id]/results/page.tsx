"use client"

import { useParams } from "next/navigation"
import { ResultsAnalytics } from "@/components/results-analytics"
import { useState, useEffect } from "react"
import type { Interview } from "@/lib/types"

// Same mock data as other interview pages
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
]

export default function InterviewResultsPage() {
  const params = useParams()
  const interviewId = params.id as string
  const [interview, setInterview] = useState<Interview | null>(null)

  useEffect(() => {
    // Find interview from mock data or localStorage
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
    }

    if (foundInterview) {
      setInterview(foundInterview)
    }
  }, [interviewId])

  if (!interview) {
    return <div className="p-6">Interview not found</div>
  }

  return <ResultsAnalytics selectedInterview={interview} />
}
