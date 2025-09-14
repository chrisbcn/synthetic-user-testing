"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, ChevronUp, ChevronDown, RotateCcw, FileText, Video, Play } from "lucide-react"
import type { Interview } from "@/lib/types"

interface InterviewsTableProps {
  interviews: Interview[]
  onViewInterview: (interview: Interview) => void
  onRunInterview: (interview: Interview) => void
  onDuplicateInterview: (interview: Interview) => void
  videos: any[]
  onPlayVideo: (video: any) => void
  searchTerm: string
  onSearchChange: (term: string) => void
  sortField: "createdAt" | "scenario" | "personaName" | "interviewerName"
  sortDirection: "asc" | "desc"
  onSort: (field: "createdAt" | "scenario" | "personaName" | "interviewerName") => void
}

export default function InterviewsTable({
  interviews,
  onViewInterview,
  onRunInterview,
  onDuplicateInterview,
  videos,
  onPlayVideo,
  searchTerm,
  onSearchChange,
  sortField,
  sortDirection,
  onSort,
}: InterviewsTableProps) {
  const getSortIcon = (field: string) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            All Interviews ({interviews.length})
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search interviews..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-3">
                  <Button
                    variant="ghost"
                    onClick={() => onSort("scenario")}
                    className="h-auto p-0 font-medium text-slate-700 hover:text-slate-900"
                  >
                    Interview
                    {getSortIcon("scenario")}
                  </Button>
                </th>
                <th className="text-left py-3 px-3">
                  <Button
                    variant="ghost"
                    onClick={() => onSort("interviewerName")}
                    className="h-auto p-0 font-medium text-slate-700 hover:text-slate-900"
                  >
                    Interviewer
                    {getSortIcon("interviewerName")}
                  </Button>
                </th>
                <th className="text-left py-3 px-3">
                  <Button
                    variant="ghost"
                    onClick={() => onSort("personaName")}
                    className="h-auto p-0 font-medium text-slate-700 hover:text-slate-900"
                  >
                    Interviewee
                    {getSortIcon("personaName")}
                  </Button>
                </th>
                <th className="text-left py-3 px-3">
                  <Button
                    variant="ghost"
                    onClick={() => onSort("createdAt")}
                    className="h-auto p-0 font-medium text-slate-700 hover:text-slate-900"
                  >
                    Date
                    {getSortIcon("createdAt")}
                  </Button>
                </th>
                <th className="text-left py-3 px-3">
                  <span className="font-medium text-slate-700">Status</span>
                </th>
                <th className="text-left py-3 px-3">
                  <span className="font-medium text-slate-700">Video</span>
                </th>
                <th className="text-left py-3 px-3">
                  <span className="font-medium text-slate-700">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {interviews.map((interview, index) => (
                <tr
                  key={interview.id}
                  className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                  }`}
                >
                  <td className="py-3 px-3">
                    <button
                      onClick={() => onViewInterview(interview)}
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
                      className={
                        interview.status === "completed"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                      }
                    >
                      {interview.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-3">
                    {videos.find((v) => v.interviewId === interview.id) ? (
                      <button
                        onClick={() => {
                          const video = videos.find((v) => v.interviewId === interview.id)
                          if (video) onPlayVideo(video)
                        }}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm transition-colors"
                      >
                        <Play className="w-3 h-3" />
                        <span className="sr-only">Play video</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          onViewInterview(interview)
                        }}
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
                        onClick={() => onRunInterview(interview)}
                        className="h-7 w-7 p-0"
                        title="Rerun interview"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onViewInterview(interview)}
                        className="h-7 w-7 p-0"
                        title="View transcript"
                      >
                        <FileText className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onViewInterview(interview)}
                        className="h-7 w-7 p-0"
                        title="Generate video prompt"
                      >
                        <Video className="w-3 h-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {interviews.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              {searchTerm ? "No interviews match your search." : "No interviews found."}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
