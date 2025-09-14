"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserCheck, FileText, MessageSquare, Upload, Plus, Trash2, Settings } from "lucide-react"
import type { Interviewer, Interview, ProjectFile } from "@/lib/types"

interface ProjectSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
  interviewers: Interviewer[]
  interviews: Interview[]
  files: ProjectFile[]
  onCreateInterviewer: () => void
  onEditInterviewer: (interviewer: Interviewer) => void
  onDeleteInterviewer: (id: string) => void
  onRunInterview: (interview: Interview) => void
  onDuplicateInterview: (interview: Interview) => void
  onViewInterview: (interview: Interview) => void
  onUploadFile: (file: File) => void
  onProjectSwitch?: () => void
}

export function ProjectSidebar({
  activeSection,
  onSectionChange,
  interviewers,
  interviews,
  files,
  onCreateInterviewer,
  onEditInterviewer,
  onDeleteInterviewer,
  onRunInterview,
  onDuplicateInterview,
  onViewInterview,
  onUploadFile,
  onProjectSwitch,
}: ProjectSidebarProps) {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)

  const sidebarSections = [
    {
      id: "personas",
      label: "Personas",
      icon: UserCheck,
      count: 10,
      hasNewItems: false,
    },
    {
      id: "interviewers",
      label: "Interviewers",
      icon: UserCheck,
      count: interviewers.length,
      hasNewItems: false,
    },
    {
      id: "scenarios",
      label: "Scenarios",
      icon: FileText,
      count: 4,
      hasNewItems: false,
    },
    {
      id: "interviews",
      label: "Interviews",
      icon: MessageSquare,
      count: interviews.length,
      hasNewItems: false,
    },
    {
      id: "assets",
      label: "Assets",
      icon: Upload,
      count: files.length,
      hasNewItems: false,
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      count: null,
      hasNewItems: false,
    },
  ]

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onUploadFile(file)
      setIsUploadDialogOpen(false)
    }
  }

  return (
    <div
      className="w-full max-w-[250px] border-r border-border sticky top-0 h-screen flex flex-col"
      style={{ backgroundColor: "var(--background-color)" }}
    >
      <div className="p-6 border-b border-border">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Maura UX Testing</h2>
          <p className="text-sm text-muted-foreground mt-1">Luxury Fashion Testing</p>
          <Button
            onClick={() => onSectionChange("interviews")}
            className="mt-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-4 py-2 rounded-md shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Interview
          </Button>
        </div>
      </div>

      <div className="p-4 border-b border-border">
        <div className="space-y-1">
          {sidebarSections.map((section) => {
            const Icon = section.icon
            return (
              <Button
                key={section.id}
                variant={activeSection === section.id ? "secondary" : "ghost"}
                className={`w-full justify-start h-10 relative hover:bg-[#EDE6DA] ${
                  activeSection === section.id
                    ? "bg-white text-[#23282a] hover:bg-white/90" // keeping active state styling
                    : ""
                }`}
                onClick={() => onSectionChange(section.id)}
              >
                <Icon className="w-4 h-4 mr-3" />
                <span className="flex-1 text-left">{section.label}</span>
                {section.count !== null && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    {section.count}
                  </Badge>
                )}
                {section.hasNewItems && <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />}
              </Button>
            )
          })}
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        {activeSection === "personas" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">User Personas</h3>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Detailed persona profiles with rich character information for consistent testing.</p>
            </div>
            <div className="space-y-2">
              {[
                { name: "Sophia Harrington", type: "Ultra-HNW Collector" },
                { name: "Marcus Chen", type: "Strategic Builder" },
                { name: "Isabella Rodriguez", type: "Creative Professional" },
                { name: "James Thompson", type: "Tech Executive" },
                { name: "Priya Patel", type: "Investment Banker" },
              ].map((persona, index) => (
                <Card key={index} className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{persona.name}</p>
                      <p className="text-xs text-muted-foreground">{persona.type}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeSection === "interviewers" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Expert Interviewers</h3>
              <Button size="sm" onClick={onCreateInterviewer}>
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {interviewers.map((interviewer) => (
                <Card key={interviewer.id} className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{interviewer.avatar}</span>
                      <div>
                        <p className="font-medium text-sm">{interviewer.name}</p>
                        <p className="text-xs text-muted-foreground">{interviewer.expertise}</p>
                        <p className="text-xs text-muted-foreground">{interviewer.experience} years</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => onEditInterviewer(interviewer)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => onDeleteInterviewer(interviewer.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeSection === "scenarios" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Test Scenarios</h3>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {[
                "Product Discovery Flow",
                "Checkout Experience",
                "Account Registration",
                "Customer Support",
                "Mobile App Navigation",
              ].map((scenario, index) => (
                <Card key={index} className="p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{scenario}</p>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Plus className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeSection === "interviews" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Interview Sessions</h3>
              <Button size="sm" className="bg-accent hover:bg-accent/90">
                <Plus className="w-4 h-4 mr-1" />
                New
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Interview sessions will be managed from the main interface.</p>
            </div>
          </div>
        )}

        {activeSection === "assets" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Project Assets</h3>
              <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Upload
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Project Files</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="file-upload">Select File</Label>
                      <Input
                        id="file-upload"
                        type="file"
                        onChange={handleFileUpload}
                        accept=".pdf,.png,.jpg,.jpeg,.figma,.sketch,.ai,.psd"
                      />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Supported formats:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>Wireframes (PDF, PNG, JPG)</li>
                        <li>Design files (Figma, Sketch, AI, PSD)</li>
                        <li>Customer journey maps</li>
                        <li>Flow diagrams</li>
                        <li>Research documents</li>
                      </ul>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="space-y-2">
              {files.map((file) => (
                <Card key={file.id} className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{file.type}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {file.size}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeSection === "settings" && (
          <div className="space-y-4">
            <h3 className="font-medium">Project Settings</h3>
            <p className="text-sm text-muted-foreground">Configure your project settings here.</p>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
