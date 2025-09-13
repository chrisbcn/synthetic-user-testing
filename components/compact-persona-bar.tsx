"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, MapPin, DollarSign } from "lucide-react"
import type { Persona } from "@/lib/types"

// Mock personas data - in real app would come from context/props
const mockPersonas: Persona[] = [
  {
    id: "1",
    name: "Sophia Harrington",
    age: 42,
    location: "Manhattan, NY",
    type: "Ultra-HNW Collector",
    annualSpend: "$2.5M+",
    background: "Art collector and philanthropist",
    keyQuotes: ["I expect perfection in every detail"],
    physicalTraits: {
      ethnicity: "Caucasian",
      hairColor: "Platinum blonde",
      eyeColor: "Blue",
      height: "5'7\"",
      build: "Elegant, refined",
    },
    characterTraits: {
      personality: "Sophisticated, discerning, confident",
      communicationStyle: "Articulate and measured",
      values: "Quality, exclusivity, heritage",
    },
    videoSettings: {
      voiceStyle: "Refined, authoritative",
      setting: "Luxury penthouse",
      lighting: "Warm, professional",
    },
    projectId: "project-1",
  },
  {
    id: "2",
    name: "Marcus Chen",
    age: 35,
    location: "San Francisco, CA",
    type: "Strategic Builder",
    annualSpend: "$150K",
    background: "Tech entrepreneur",
    keyQuotes: ["Innovation drives my purchasing decisions"],
    physicalTraits: {
      ethnicity: "Asian",
      hairColor: "Black",
      eyeColor: "Brown",
      height: "5'10\"",
      build: "Athletic, modern",
    },
    characterTraits: {
      personality: "Analytical, forward-thinking, efficient",
      communicationStyle: "Direct and data-driven",
      values: "Innovation, functionality, sustainability",
    },
    videoSettings: {
      voiceStyle: "Clear, confident",
      setting: "Modern office",
      lighting: "Natural, bright",
    },
    projectId: "project-1",
  },
]

interface CompactPersonaBarProps {
  selectedPersonaId?: string
  onSelectPersona?: (personaId: string) => void
  onAddPersona?: () => void
}

export function CompactPersonaBar({ selectedPersonaId, onSelectPersona, onAddPersona }: CompactPersonaBarProps) {
  const [personas] = useState<Persona[]>(mockPersonas)

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-sm font-medium text-slate-700">Personas</h3>
        <Badge variant="secondary" className="text-xs">
          {personas.length}
        </Badge>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {personas.map((persona) => (
          <Card
            key={persona.id}
            className={`flex-shrink-0 w-64 cursor-pointer transition-all hover:shadow-md ${
              selectedPersonaId === persona.id ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-slate-50"
            }`}
            onClick={() => onSelectPersona?.(persona.id)}
          >
            <div className="p-3">
              <div className="flex items-center gap-3 mb-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={`/personas/${persona.id}.jpg`} />
                  <AvatarFallback className="text-xs">
                    {persona.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-slate-900 truncate">{persona.name}</p>
                  <p className="text-xs text-slate-600 truncate">{persona.type}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{persona.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  <span>{persona.annualSpend}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}

        <Button
          variant="outline"
          className="flex-shrink-0 w-32 h-20 border-dashed bg-transparent"
          onClick={onAddPersona}
        >
          <div className="text-center">
            <Plus className="w-4 h-4 mx-auto mb-1" />
            <span className="text-xs">Add Persona</span>
          </div>
        </Button>
      </div>
    </div>
  )
}
