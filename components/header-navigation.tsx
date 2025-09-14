"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, ChevronDown, Settings, User, LogOut } from "lucide-react"
import { BreadcrumbNavigation } from "@/components/breadcrumb-navigation"

interface Project {
  id: string
  name: string
  status: "active" | "archived"
}

interface HeaderNavigationProps {
  currentProject?: Project | null
  onProjectSelect?: (projectId: string) => void
  onNavigateHome?: () => void
  onNavigateSettings?: () => void
  onProjectSwitch?: () => void
}

export function HeaderNavigation({
  currentProject,
  onProjectSelect,
  onNavigateHome,
  onNavigateSettings,
  onProjectSwitch,
}: HeaderNavigationProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Mock projects for dropdown
  const projects: Project[] = [
    { id: "maura", name: "Maura UX Testing", status: "active" },
    { id: "ecommerce", name: "E-commerce Checkout", status: "active" },
    { id: "banking", name: "Banking App Redesign", status: "active" },
  ]

  return (
    <div>
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Project Switcher */}
          <div className="flex items-center space-x-6">
            {/* Logo/Home */}
            <Button
              variant="ghost"
              onClick={onNavigateHome}
              className="flex items-center space-x-2 text-lg font-semibold text-gray-900 hover:text-gray-700"
            >
              <img src="/homonc-logo.svg" alt="Homonc" className="h-6 w-6" />
            </Button>

            {/* Project Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                  <span className="text-sm font-medium">{currentProject ? currentProject.name : "Select Project"}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                <div className="px-2 py-1.5 text-sm font-medium text-gray-700">Active Projects</div>
                <DropdownMenuSeparator />
                {projects
                  .filter((p) => p.status === "active")
                  .map((project) => (
                    <DropdownMenuItem
                      key={project.id}
                      onClick={() => onProjectSelect?.(project.id)}
                      className="flex items-center justify-between"
                    >
                      <span>{project.name}</span>
                      {currentProject?.id === project.id && <div className="h-2 w-2 rounded-full bg-green-500" />}
                    </DropdownMenuItem>
                  ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-blue-600">+ Create New Project</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Center - Search */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search across projects, personas, interviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Right side - User Menu and Settings */}
          <div className="flex items-center space-x-4">
            {/* Settings */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onNavigateSettings}
              className="text-gray-600 hover:text-gray-900"
            >
              <Settings className="h-4 w-4" />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gray-100 text-gray-600">U</AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onNavigateSettings}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <BreadcrumbNavigation
        currentProject={currentProject}
        onNavigateHome={onNavigateHome}
        onProjectSwitch={onProjectSwitch}
      />
    </div>
  )
}
