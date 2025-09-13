"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, MessageSquare, FileText, Play } from "lucide-react"

interface InterviewCreationModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateInterview: (interviewData: any) => void
}

const mockPersonas = [
  { id: "sophia-harrington", name: "Sophia Harrington", type: "Ultra-HNW Collector" },
  { id: "marcus-chen", name: "Marcus Chen", type: "Strategic Builder" },
  { id: "isabella-rodriguez", name: "Isabella Rodriguez", type: "Creative Professional" },
  { id: "james-thompson", name: "James Thompson", type: "Tech Executive" },
  { id: "priya-patel", name: "Priya Patel", type: "Investment Banker" },
]

const mockInterviewers = [
  { id: "sophia-chen-laurent", name: "Sophia Chen-Laurent", expertise: "Luxury Consumer Psychology" },
  { id: "marcus-rodriguez", name: "Marcus Rodriguez", expertise: "Strategic Investment Analysis" },
  { id: "amara-osei", name: "Amara Osei", expertise: "Cultural Fashion Studies" },
  { id: "zoe-wang", name: "Zoe Wang", expertise: "Digital Consumer Behavior" },
  { id: "thomas-anderson", name: "Thomas Anderson", expertise: "Heritage Brand Strategy" },
]

const mockScenarios = [
  { id: "luxury-wardrobe", name: "Luxury Wardrobe Management Experience" },
  { id: "strategic-investment", name: "Strategic Luxury Investment Planning" },
  { id: "cultural-identity", name: "Cultural Identity in Luxury Fashion" },
  { id: "social-media", name: "Social Media and Luxury Consumption" },
  { id: "heritage-digital", name: "Heritage Luxury and Digital Innovation" },
]

export function InterviewCreationModal({ isOpen, onClose, onCreateInterview }: InterviewCreationModalProps) {
  const [selectedPersona, setSelectedPersona] = useState("")
  const [selectedInterviewer, setSelectedInterviewer] = useState("")
  const [selectedScenario, setSelectedScenario] = useState("")
  const [customScenario, setCustomScenario] = useState("")
  const [interviewTitle, setInterviewTitle] = useState("")
  const [notes, setNotes] = useState("")

  const handleCreate = () => {
    const interviewData = {
      id: `interview-${Date.now()}`,
      personaId: selectedPersona,
      personaName: mockPersonas.find((p) => p.id === selectedPersona)?.name || "",
      interviewerId: selectedInterviewer,
      interviewerName: mockInterviewers.find((i) => i.id === selectedInterviewer)?.name || "",
      scenarioId: selectedScenario || "custom",
      scenario: selectedScenario ? mockScenarios.find((s) => s.id === selectedScenario)?.name || "" : customScenario,
      title: interviewTitle,
      notes,
      status: "draft",
      createdAt: new Date().toISOString(),
      conversation: [],
      messages: [],
    }

    onCreateInterview(interviewData)

    // Reset form
    setSelectedPersona("")
    setSelectedInterviewer("")
    setSelectedScenario("")
    setCustomScenario("")
    setInterviewTitle("")
    setNotes("")

    onClose()
  }

  const isValid = selectedPersona && selectedInterviewer && (selectedScenario || customScenario)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Create New Interview
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Interview Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Interview Title (Optional)</Label>
            <Input
              id="title"
              placeholder="e.g., Luxury Shopping Experience - Sophia H."
              value={interviewTitle}
              onChange={(e) => setInterviewTitle(e.target.value)}
            />
          </div>

          {/* Persona Selection */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Select Persona
            </Label>
            <div className="grid grid-cols-1 gap-2">
              {mockPersonas.map((persona) => (
                <Card
                  key={persona.id}
                  className={`cursor-pointer transition-colors ${
                    selectedPersona === persona.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedPersona(persona.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{persona.name}</p>
                        <p className="text-sm text-gray-600">{persona.type}</p>
                      </div>
                      {selectedPersona === persona.id && <Badge className="bg-blue-500">Selected</Badge>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Interviewer Selection */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Select Interviewer
            </Label>
            <div className="grid grid-cols-1 gap-2">
              {mockInterviewers.map((interviewer) => (
                <Card
                  key={interviewer.id}
                  className={`cursor-pointer transition-colors ${
                    selectedInterviewer === interviewer.id ? "border-green-500 bg-green-50" : "hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedInterviewer(interviewer.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{interviewer.name}</p>
                        <p className="text-sm text-gray-600">{interviewer.expertise}</p>
                      </div>
                      {selectedInterviewer === interviewer.id && <Badge className="bg-green-500">Selected</Badge>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Scenario Selection */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Select Scenario
            </Label>
            <div className="grid grid-cols-1 gap-2">
              {mockScenarios.map((scenario) => (
                <Card
                  key={scenario.id}
                  className={`cursor-pointer transition-colors ${
                    selectedScenario === scenario.id ? "border-purple-500 bg-purple-50" : "hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    setSelectedScenario(scenario.id)
                    setCustomScenario("")
                  }}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{scenario.name}</p>
                      {selectedScenario === scenario.id && <Badge className="bg-purple-500">Selected</Badge>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="pt-2">
              <Label htmlFor="custom-scenario">Or Create Custom Scenario</Label>
              <Textarea
                id="custom-scenario"
                placeholder="Describe your custom interview scenario..."
                value={customScenario}
                onChange={(e) => {
                  setCustomScenario(e.target.value)
                  if (e.target.value) setSelectedScenario("")
                }}
                className="mt-2"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any specific instructions or context for this interview..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!isValid} className="bg-blue-600 hover:bg-blue-700">
              <Play className="w-4 h-4 mr-2" />
              Create Interview
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
