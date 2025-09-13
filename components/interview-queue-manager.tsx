"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, Eye, BarChart3, Edit, Trash2, Plus, Clock, AlertCircle } from "lucide-react"
import type { Persona, Interviewer } from "@/lib/types"

interface QueuedInterview {
  id: string
  scenario: string
  personaName: string
  interviewerName: string
  estimatedDuration: number
  status: "queued" | "active" | "draft"
  createdAt: Date
  startedAt?: Date
  persona?: Persona
  interviewer?: Interviewer
}

interface InterviewQueueManagerProps {
  onStartInterview: (interview: QueuedInterview) => void
  onEditInterview: (interview: QueuedInterview) => void
  onDeleteInterview: (id: string) => void
  onWatchInterview: (interview: QueuedInterview) => void
  onPauseInterview: (id: string) => void
  onMonitorInterview: (interview: QueuedInterview) => void
  onCreateNew: () => void
}

export function InterviewQueueManager({
  onStartInterview,
  onEditInterview,
  onDeleteInterview,
  onWatchInterview,
  onPauseInterview,
  onMonitorInterview,
  onCreateNew,
}: InterviewQueueManagerProps) {
  // Mock data for demonstration
  const [interviews] = useState<QueuedInterview[]>([
    {
      id: "active-1",
      scenario: "Wardrobe Discovery",
      personaName: "Sophia",
      interviewerName: "Sarah",
      estimatedDuration: 15,
      status: "active",
      createdAt: new Date(Date.now() - 12 * 60 * 1000),
      startedAt: new Date(Date.now() - 12 * 60 * 1000),
    },
    {
      id: "active-2",
      scenario: "Luxury Shopping Experience",
      personaName: "Marcus",
      interviewerName: "Alex",
      estimatedDuration: 20,
      status: "active",
      createdAt: new Date(Date.now() - 8 * 60 * 1000),
      startedAt: new Date(Date.now() - 8 * 60 * 1000),
    },
    {
      id: "queued-1",
      scenario: "Resale Decision",
      personaName: "Emma",
      interviewerName: "Alex",
      estimatedDuration: 15,
      status: "queued",
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
    },
    {
      id: "draft-1",
      scenario: "Stylist Feedback",
      personaName: "Margaret",
      interviewerName: "",
      estimatedDuration: 18,
      status: "draft",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: "draft-2",
      scenario: "Brand Perception Study",
      personaName: "",
      interviewerName: "Sarah",
      estimatedDuration: 25,
      status: "draft",
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    },
    {
      id: "draft-3",
      scenario: "Mobile App Navigation",
      personaName: "Isabella",
      interviewerName: "",
      estimatedDuration: 12,
      status: "draft",
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    },
  ])

  const activeInterviews = interviews.filter((i) => i.status === "active")
  const queuedInterviews = interviews.filter((i) => i.status === "queued")
  const draftInterviews = interviews.filter((i) => i.status === "draft")

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const getElapsedTime = (startTime: Date) => {
    const elapsed = Math.floor((Date.now() - startTime.getTime()) / (1000 * 60))
    return formatDuration(elapsed)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Interview Queue</h2>
          <p className="text-gray-600">Manage your interview pipeline</p>
        </div>
        <Button onClick={onCreateNew} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          New Interview
        </Button>
      </div>

      {/* Active Interviews */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              Active ({activeInterviews.length})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {activeInterviews.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No active interviews</p>
          ) : (
            <div className="space-y-4">
              {activeInterviews.map((interview) => (
                <div key={interview.id} className="border rounded-lg p-4 bg-red-50 border-red-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{interview.scenario}</h3>
                      <p className="text-sm text-gray-600">
                        {interview.personaName} → {interview.interviewerName}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive" className="bg-red-500">
                        Live
                      </Badge>
                      <span className="text-sm font-medium text-red-600">
                        {interview.startedAt && getElapsedTime(interview.startedAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onWatchInterview(interview)}
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Watch
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onPauseInterview(interview.id)}
                      className="text-orange-600 border-orange-200 hover:bg-orange-50"
                    >
                      <Pause className="w-3 h-3 mr-1" />
                      Pause
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onMonitorInterview(interview)}
                      className="text-green-600 border-green-200 hover:bg-green-50"
                    >
                      <BarChart3 className="w-3 h-3 mr-1" />
                      Monitor
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Queued Interviews */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-500" />
            Queued ({queuedInterviews.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {queuedInterviews.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No queued interviews</p>
          ) : (
            <div className="space-y-4">
              {queuedInterviews.map((interview) => (
                <div key={interview.id} className="border rounded-lg p-4 bg-orange-50 border-orange-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{interview.scenario}</h3>
                      <p className="text-sm text-gray-600">
                        {interview.personaName} → {interview.interviewerName}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                        Est: {formatDuration(interview.estimatedDuration)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => onStartInterview(interview)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Start
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => onEditInterview(interview)}>
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDeleteInterview(interview.id)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Draft Interviews */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="w-4 h-4 text-gray-500" />
            Drafts ({draftInterviews.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {draftInterviews.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No draft interviews</p>
          ) : (
            <div className="space-y-4">
              {draftInterviews.map((interview) => (
                <div key={interview.id} className="border rounded-lg p-4 bg-gray-50 border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{interview.scenario}</h3>
                      <p className="text-sm text-gray-600">
                        {interview.personaName || "No persona selected"} →{" "}
                        {interview.interviewerName || "No interviewer selected"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-orange-300 text-orange-700">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Incomplete
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => onEditInterview(interview)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Continue Setup
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDeleteInterview(interview.id)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
