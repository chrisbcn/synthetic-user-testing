"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Play, Users, BarChart3, Video, ChevronUp, ChevronDown } from "lucide-react"

interface FloatingActionBarProps {
  onStartInterview?: () => void
  onManagePersonas?: () => void
  onViewResults?: () => void
  onGenerateVideo?: () => void
}

export function FloatingActionBar({
  onStartInterview,
  onManagePersonas,
  onViewResults,
  onGenerateVideo,
}: FloatingActionBarProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <TooltipProvider>
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <Card className="bg-white backdrop-blur-sm border">
          <div className="p-2">
            {isExpanded && (
              <div className="flex items-center gap-2 mb-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" variant="ghost" onClick={onManagePersonas}>
                      <Users className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Manage Personas</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" variant="ghost" onClick={onViewResults}>
                      <BarChart3 className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>View Results</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" variant="ghost" onClick={onGenerateVideo}>
                      <Video className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Generate Video</TooltipContent>
                </Tooltip>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Button onClick={onStartInterview} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Play className="w-4 h-4 mr-2" />
                Start Interview
              </Button>

              <Button size="sm" variant="ghost" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </TooltipProvider>
  )
}
