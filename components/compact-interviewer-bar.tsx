"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Briefcase, Star } from "lucide-react"
import type { Interviewer } from "@/lib/types"

// Mock interviewers data
const mockInterviewers: Interviewer[] = [
  {
    id: "1",
    name: "Dr. Sarah Mitchell",
    title: "Luxury Fashion Research Director",
    company: "Fashion Insights Lab",
    expertise: ["Luxury Consumer Behavior", "Brand Psychology", "Market Research"],
    experience: "15+ years",
    background: "Former Chanel strategist with deep expertise in luxury consumer psychology",
    interviewStyle: "Empathetic and probing, excellent at uncovering emotional drivers",
    sampleQuestions: [
      "What emotions do you experience when making a luxury purchase?",
      "How do you define authenticity in luxury brands?",
    ],
    projectId: "project-1",
  },
  {
    id: "2",
    name: "James Rodriguez",
    title: "Senior UX Researcher",
    company: "Digital Experience Co",
    expertise: ["User Experience", "Digital Interfaces", "Behavioral Analysis"],
    experience: "12+ years",
    background: "Former Apple UX researcher specializing in premium digital experiences",
    interviewStyle: "Analytical and systematic, focuses on user behavior patterns",
    sampleQuestions: [
      "Walk me through your typical online shopping journey",
      "What frustrates you most about current shopping apps?",
    ],
    projectId: "project-1",
  },
]

interface CompactInterviewerBarProps {
  selectedInterviewerId?: string
  onSelectInterviewer?: (interviewerId: string) => void
  onAddInterviewer?: () => void
}

export function CompactInterviewerBar({
  selectedInterviewerId,
  onSelectInterviewer,
  onAddInterviewer,
}: CompactInterviewerBarProps) {
  const [interviewers] = useState<Interviewer[]>(mockInterviewers)

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-sm font-medium text-slate-700">Interviewers</h3>
        <Badge variant="secondary" className="text-xs">
          {interviewers.length}
        </Badge>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {interviewers.map((interviewer) => (
          <Card
            key={interviewer.id}
            className={`flex-shrink-0 w-72 cursor-pointer transition-all hover:shadow-md ${
              selectedInterviewerId === interviewer.id ? "ring-2 ring-green-500 bg-green-50" : "hover:bg-slate-50"
            }`}
            onClick={() => onSelectInterviewer?.(interviewer.id)}
          >
            <div className="p-3">
              <div className="flex items-center gap-3 mb-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={`/interviewers/${interviewer.id}.jpg`} />
                  <AvatarFallback className="text-xs">
                    {interviewer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-slate-900 truncate">{interviewer.name}</p>
                  <p className="text-xs text-slate-600 truncate">{interviewer.title}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  <span className="truncate">{interviewer.company}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  <span>{interviewer.experience}</span>
                </div>
              </div>

              <div className="mt-2">
                <div className="flex flex-wrap gap-1">
                  {interviewer.expertise.slice(0, 2).map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                      {skill}
                    </Badge>
                  ))}
                  {interviewer.expertise.length > 2 && (
                    <Badge variant="outline" className="text-xs px-1 py-0">
                      +{interviewer.expertise.length - 2}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}

        <Button
          variant="outline"
          className="flex-shrink-0 w-32 h-24 border-dashed bg-transparent"
          onClick={onAddInterviewer}
        >
          <div className="text-center">
            <Plus className="w-4 h-4 mx-auto mb-1" />
            <span className="text-xs">Add Interviewer</span>
          </div>
        </Button>
      </div>
    </div>
  )
}
