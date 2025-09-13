"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { HeaderNavigation } from "@/components/header-navigation"
import { ProjectSidebar } from "@/components/project-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const personas = [
  { id: "sophia-harrington", name: "Sophia Harrington", type: "Ultra-HNW Collector" },
  { id: "marcus-chen", name: "Marcus Chen", type: "Strategic Builder" },
  { id: "isabella-rodriguez", name: "Isabella Rodriguez", type: "Creative Professional" },
  { id: "james-thompson", name: "James Thompson", type: "Tech Executive" },
  { id: "priya-patel", name: "Priya Patel", type: "Investment Banker" },
]

const interviewers = [
  { id: "sophia-chen-laurent", name: "Sophia Chen-Laurent", expertise: "Luxury Consumer Psychology" },
  { id: "marcus-rodriguez", name: "Marcus Rodriguez", expertise: "Strategic Investment Analysis" },
  { id: "amara-osei", name: "Amara Osei", expertise: "Cultural Fashion Studies" },
  { id: "zoe-wang", name: "Zoe Wang", expertise: "Digital Consumer Behavior" },
  { id: "thomas-anderson", name: "Thomas Anderson", expertise: "Heritage Brand Strategy" },
]

const scenarios = [
  { id: "luxury-wardrobe", name: "Luxury Wardrobe Management Experience" },
  { id: "strategic-investment", name: "Strategic Luxury Investment Planning" },
  { id: "cultural-identity", name: "Cultural Identity in Luxury Fashion" },
  { id: "social-media", name: "Social Media and Luxury Consumption" },
  { id: "heritage-digital", name: "Heritage Luxury and Digital Innovation" },
]

export default function NewInterviewPage() {
  const router = useRouter()
  const { currentProject } = useAuth()
  const [selectedPersona, setSelectedPersona] = useState("")
  const [selectedInterviewer, setSelectedInterviewer] = useState("")
  const [selectedScenario, setSelectedScenario] = useState("")
  const [customScenario, setCustomScenario] = useState("")
  const [interviewTitle, setInterviewTitle] = useState("")
  const [notes, setNotes] = useState("")

  const mockInterviewers = interviewers.map((i) => ({
    id: i.id,
    name: i.name,
    expertise: i.expertise,
    avatar: "👤",
    experience: 5,
  }))

  const mockInterviews: any[] = []
  const mockFiles: any[] = []

  const handleCreate = () => {
    console.log("[v0] Creating interview with:", {
      persona: selectedPersona,
      interviewer: selectedInterviewer,
      scenario: selectedScenario || "custom",
      customScenario,
      title: interviewTitle,
      notes,
    })

    // Create a unique interview ID and navigate to the interview runner
    const interviewId = `interview-${Date.now()}`

    // Store the interview configuration in localStorage so the interview runner can access it
    if (typeof window !== "undefined") {
      const interviewConfig = {
        id: interviewId,
        persona: selectedPersona,
        interviewer: selectedInterviewer,
        scenario: selectedScenario || "custom",
        customScenario,
        title: interviewTitle,
        notes,
        status: "setup",
      }
      localStorage.setItem(`interview-config-${interviewId}`, JSON.stringify(interviewConfig))
    }

    // Navigate to the interview runner
    router.push(`/interviews/${interviewId}`)
  }

  const handleNavigateHome = () => {
    router.push("/")
  }

  const handleNavigateSettings = () => {
    console.log("[v0] Navigate to settings")
  }

  const isValid = selectedPersona && selectedInterviewer && (selectedScenario || customScenario.trim())

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8f6f2" }}>
      {/* Header Navigation */}
      <HeaderNavigation
        currentProject={currentProject}
        onProjectSelect={() => {}}
        onNavigateHome={handleNavigateHome}
        onNavigateSettings={handleNavigateSettings}
      />

      <div className="flex">
        {/* Project Sidebar */}
        <ProjectSidebar
          activeSection="interviews"
          onSectionChange={() => {}}
          interviewers={mockInterviewers}
          interviews={mockInterviews}
          files={mockFiles}
          onCreateInterviewer={() => {}}
          onEditInterviewer={() => {}}
          onDeleteInterviewer={() => {}}
          onRunInterview={() => {}}
          onDuplicateInterview={() => {}}
          onViewInterview={() => {}}
          onUploadFile={() => {}}
        />

        {/* Main content */}
        <main className="flex-1">
          <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <Button variant="ghost" onClick={() => router.push("/interviews")} className="hover:bg-[#EDE6DA]">
                Back to Interviews
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create New Interview</h1>
                <p className="text-gray-600">Set up a new synthetic user interview</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Interview Title */}
                <Card className="border-[#EDE6DA]">
                  <CardHeader>
                    <CardTitle className="text-lg">Interview Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Interview Title (Optional)</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Luxury Shopping Experience - Sophia H."
                        value={interviewTitle}
                        onChange={(e) => setInterviewTitle(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="notes">Additional Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Any specific instructions or context for this interview..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Persona Selection */}
                <Card className="border-[#EDE6DA]">
                  <CardHeader>
                    <CardTitle className="text-lg">Select Persona</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select value={selectedPersona} onValueChange={setSelectedPersona}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a persona for the interview" />
                      </SelectTrigger>
                      <SelectContent>
                        {personas.map((persona) => (
                          <SelectItem key={persona.id} value={persona.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{persona.name}</span>
                              <span className="text-sm text-gray-500">{persona.type}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                {/* Interviewer Selection */}
                <Card className="border-[#EDE6DA]">
                  <CardHeader>
                    <CardTitle className="text-lg">Select Interviewer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select value={selectedInterviewer} onValueChange={setSelectedInterviewer}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose an interviewer" />
                      </SelectTrigger>
                      <SelectContent>
                        {interviewers.map((interviewer) => (
                          <SelectItem key={interviewer.id} value={interviewer.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{interviewer.name}</span>
                              <span className="text-sm text-gray-500">{interviewer.expertise}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                {/* Scenario Selection */}
                <Card className="border-[#EDE6DA]">
                  <CardHeader>
                    <CardTitle className="text-lg">Select Scenario</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Predefined Scenarios</Label>
                      <Select
                        value={selectedScenario}
                        onValueChange={(value) => {
                          setSelectedScenario(value)
                          setCustomScenario("")
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a scenario" />
                        </SelectTrigger>
                        <SelectContent>
                          {scenarios.map((scenario) => (
                            <SelectItem key={scenario.id} value={scenario.id}>
                              {scenario.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-[#EDE6DA]" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="px-2 text-gray-500" style={{ backgroundColor: "#f8f6f2" }}>
                          Or
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="custom-scenario">Create Custom Scenario</Label>
                      <Textarea
                        id="custom-scenario"
                        placeholder="Describe your custom interview scenario..."
                        value={customScenario}
                        onChange={(e) => {
                          setCustomScenario(e.target.value)
                          if (e.target.value.trim()) setSelectedScenario("")
                        }}
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Summary Sidebar */}
              <div className="space-y-6">
                <Card className="border-[#EDE6DA]">
                  <CardHeader>
                    <CardTitle className="text-lg">Interview Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Persona</Label>
                      <p className="text-sm">
                        {selectedPersona
                          ? personas.find((p) => p.id === selectedPersona)?.name || "Unknown"
                          : "Not selected"}
                      </p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-600">Interviewer</Label>
                      <p className="text-sm">
                        {selectedInterviewer
                          ? interviewers.find((i) => i.id === selectedInterviewer)?.name || "Unknown"
                          : "Not selected"}
                      </p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-600">Scenario</Label>
                      <p className="text-sm">
                        {selectedScenario
                          ? scenarios.find((s) => s.id === selectedScenario)?.name || "Unknown"
                          : customScenario.trim()
                            ? "Custom scenario"
                            : "Not selected"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-3">
                  <Button
                    onClick={handleCreate}
                    disabled={!isValid}
                    className="w-full text-white"
                    style={{ backgroundColor: "#232822" }}
                    size="lg"
                  >
                    Create Interview
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => router.push("/interviews")}
                    className="w-full border-[#EDE6DA] hover:bg-[#EDE6DA]"
                    style={{ backgroundColor: "#f8f6f2" }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
