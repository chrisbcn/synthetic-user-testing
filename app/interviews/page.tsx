"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, MessageSquare, Play, Video, RotateCcw, FileText, ChevronUp, ChevronDown, Search } from "lucide-react"
import type { Interview } from "@/lib/types"

// Mock interviews data - same as used in project workspace
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
    conversation: [],
    messages: [],
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
    conversation: [],
    messages: [],
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
    conversation: [],
    messages: [],
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
    conversation: [],
    messages: [],
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
    conversation: [],
    messages: [],
  },
]

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("completed-interviews")
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          return [...parsed, ...mockInterviews]
        } catch (error) {
          console.error("Failed to parse saved interviews:", error)
        }
      }
    }
    return mockInterviews
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<"createdAt" | "scenario" | "personaName" | "interviewerName">("createdAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [videos, setVideos] = useState<any[]>([])

  useEffect(() => {
    loadVideos()
  }, [])

  const loadVideos = async () => {
    try {
      const response = await fetch("/api/videos/list")
      if (response.ok) {
        const data = await response.json()
        setVideos(data.videos || [])
      }
    } catch (error) {
      console.error("Error loading videos:", error)
    }
  }

  const handleSort = (field: "createdAt" | "scenario" | "personaName" | "interviewerName") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const getFilteredAndSortedInterviews = () => {
    let filtered = interviews

    // Filter by search term
    if (searchTerm) {
      filtered = interviews.filter(
        (interview) =>
          interview.scenario.toLowerCase().includes(searchTerm.toLowerCase()) ||
          interview.personaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          interview.interviewerName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Sort interviews
    return filtered.sort((a, b) => {
      let aValue: string | Date
      let bValue: string | Date

      switch (sortField) {
        case "createdAt":
          aValue = new Date(a.createdAt)
          bValue = new Date(b.createdAt)
          break
        case "scenario":
          aValue = a.scenario
          bValue = b.scenario
          break
        case "personaName":
          aValue = a.personaName
          bValue = b.personaName
          break
        case "interviewerName":
          aValue = a.interviewerName
          bValue = b.interviewerName
          break
        default:
          aValue = new Date(a.createdAt)
          bValue = new Date(b.createdAt)
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })
  }

  const renderSortIcon = (field: "createdAt" | "scenario" | "personaName" | "interviewerName") => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
  }

  const handleNewInterview = () => {
    // This would typically navigate to interview creation or open a modal
    console.log("Create new interview")
  }

  const handleViewInterview = (interview: Interview) => {
    // Navigate to interview results
    console.log("View interview:", interview.id)
  }

  const handleRunInterview = (interview: Interview) => {
    // Rerun interview
    console.log("Rerun interview:", interview.id)
  }

  const handlePlayVideo = (video: any) => {
    // Play video
    console.log("Play video:", video.id)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Interviews</h1>
          <p className="text-gray-600 mt-1">View and manage all your user interviews</p>
        </div>
        <Button onClick={handleNewInterview} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          New Interview
        </Button>
      </div>

      {/* Interviews Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              All Interviews ({interviews.length})
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search interviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 px-3 text-sm font-medium text-slate-600">
                    <button
                      onClick={() => handleSort("scenario")}
                      className="flex items-center gap-1 hover:text-slate-800 transition-colors"
                    >
                      Interview
                      {renderSortIcon("scenario")}
                    </button>
                  </th>
                  <th className="text-left py-2 px-3 text-sm font-medium text-slate-600">
                    <button
                      onClick={() => handleSort("interviewerName")}
                      className="flex items-center gap-1 hover:text-slate-800 transition-colors"
                    >
                      Interviewer
                      {renderSortIcon("interviewerName")}
                    </button>
                  </th>
                  <th className="text-left py-2 px-3 text-sm font-medium text-slate-600">
                    <button
                      onClick={() => handleSort("personaName")}
                      className="flex items-center gap-1 hover:text-slate-800 transition-colors"
                    >
                      Interviewee
                      {renderSortIcon("personaName")}
                    </button>
                  </th>
                  <th className="text-left py-2 px-3 text-sm font-medium text-slate-600">
                    <button
                      onClick={() => handleSort("createdAt")}
                      className="flex items-center gap-1 hover:text-slate-800 transition-colors"
                    >
                      Date
                      {renderSortIcon("createdAt")}
                    </button>
                  </th>
                  <th className="text-left py-2 px-3 text-sm font-medium text-slate-600">Status</th>
                  <th className="text-left py-2 px-3 text-sm font-medium text-slate-600">Video</th>
                  <th className="text-left py-2 px-3 text-sm font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredAndSortedInterviews().map((interview, index) => {
                  const hasVideo = videos.some((v) => v.interviewId === interview.id)
                  return (
                    <tr
                      key={interview.id}
                      className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                      }`}
                    >
                      <td className="py-3 px-3">
                        <button
                          onClick={() => handleViewInterview(interview)}
                          className="text-left hover:text-blue-600 hover:underline transition-colors"
                        >
                          <div className="font-medium text-sm">{interview.scenario}</div>
                        </button>
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-sm text-slate-700">{interview.interviewerName}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-sm text-slate-700">{interview.personaName}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-sm text-slate-700">
                          {new Date(interview.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                        <div className="text-xs text-slate-500">
                          {new Date(interview.createdAt).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <Badge
                          variant={interview.status === "completed" ? "default" : "secondary"}
                          className={interview.status === "completed" ? "bg-green-100 text-green-800" : ""}
                        >
                          {interview.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-3">
                        {hasVideo ? (
                          <button
                            onClick={() => {
                              const video = videos.find((v) => v.interviewId === interview.id)
                              if (video) handlePlayVideo(video)
                            }}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm transition-colors"
                          >
                            <Play className="w-3 h-3" />
                            <span className="sr-only">Play video</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleViewInterview(interview)}
                            className="flex items-center gap-1 text-green-600 hover:text-green-800 text-sm transition-colors"
                          >
                            <Video className="w-3 h-3" />
                            <span className="sr-only">Generate video</span>
                          </button>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRunInterview(interview)}
                            className="h-7 w-7 p-0"
                            title="Rerun interview"
                          >
                            <RotateCcw className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewInterview(interview)}
                            className="h-7 w-7 p-0"
                            title="View results"
                          >
                            <FileText className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {getFilteredAndSortedInterviews().length === 0 && (
            <div className="text-center py-8 text-slate-500">
              {searchTerm ? "No interviews match your search." : "No interviews found."}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
