"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { HeaderNavigation } from "@/components/header-navigation"
import { MainDashboard } from "@/components/main-dashboard"
import { ProjectWorkspace } from "@/components/project-workspace"

export function Dashboard() {
  const { currentProject } = useAuth()
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)

  console.log("[v0] Dashboard rendering, currentProject:", currentProject, "selectedProjectId:", selectedProjectId)

  const showMainDashboard = !currentProject && !selectedProjectId

  const handleSelectProject = (projectId: string) => {
    console.log("[v0] Selecting project:", projectId)
    setSelectedProjectId(projectId)
  }

  const handleBackToDashboard = () => {
    console.log("[v0] Going back to dashboard")
    setSelectedProjectId(null)
  }

  const handleNavigateHome = () => {
    setSelectedProjectId(null)
  }

  const handleNavigateSettings = () => {
    // TODO: Implement settings navigation
    console.log("[v0] Navigate to settings")
  }

  const currentProjectData = selectedProjectId
    ? { id: selectedProjectId, name: "Maura UX Testing", status: "active" as const }
    : currentProject

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderNavigation
        currentProject={currentProjectData}
        onProjectSelect={handleSelectProject}
        onNavigateHome={handleNavigateHome}
        onNavigateSettings={handleNavigateSettings}
      />

      <main className="flex-1">
        {showMainDashboard ? (
          <MainDashboard onSelectProject={handleSelectProject} />
        ) : (
          <ProjectWorkspace
            projectId={selectedProjectId || currentProject?.id || ""}
            onBackToDashboard={handleBackToDashboard}
          />
        )}
      </main>
    </div>
  )
}
