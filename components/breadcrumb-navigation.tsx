"use client"

import { ChevronRight, Home, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Project {
  id: string
  name: string
  status: "active" | "archived"
}

interface BreadcrumbNavigationProps {
  currentProject?: Project | null
  onNavigateHome?: () => void
  onProjectSwitch?: () => void
}

export function BreadcrumbNavigation({ currentProject, onNavigateHome, onProjectSwitch }: BreadcrumbNavigationProps) {
  const breadcrumbItems = [
    {
      label: "Dashboard",
      onClick: onNavigateHome,
      current: !currentProject,
    },
  ]

  if (currentProject) {
    breadcrumbItems.push({
      label: currentProject.name,
      current: true,
    })
  }

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-gray-50 border-b border-gray-200">
      <div className="flex items-center space-x-1 text-sm text-gray-600">
        {breadcrumbItems.map((item, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />}
            {item.current ? (
              <span className="font-medium text-gray-900">{item.label}</span>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={item.onClick}
                className="h-auto p-1 text-gray-600 hover:text-gray-900"
              >
                {index === 0 && <Home className="h-4 w-4 mr-1" />}
                {item.label}
              </Button>
            )}
          </div>
        ))}
      </div>
      {currentProject && (
        <Button variant="outline" size="sm" onClick={onProjectSwitch} className="text-xs bg-transparent">
          Switch Project
          <ChevronDown className="w-3 h-3 ml-1" />
        </Button>
      )}
    </nav>
  )
}
