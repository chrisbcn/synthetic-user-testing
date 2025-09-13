"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface User {
  id: string
  email: string
  name: string
  organizationId: string
  role: "admin" | "member"
}

export interface Project {
  id: string
  name: string
  description: string
  organizationId: string
  createdBy: string
  createdAt: Date
  status: "active" | "archived"
}

interface AuthContextType {
  user: User | null
  currentProject: Project | null
  projects: Project[]
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  signup: (email: string, password: string, name: string) => Promise<boolean>
  createProject: (name: string, description: string) => void
  selectProject: (projectId: string) => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock data for demonstration
const mockUsers: User[] = [
  {
    id: "user-1",
    email: "demo@example.com",
    name: "Demo User",
    organizationId: "org-1",
    role: "admin",
  },
]

const mockProjects: Project[] = [
  {
    id: "project-1",
    name: "Luxury Fashion UX Research",
    description: "User testing for Maura's wardrobe and resale features",
    organizationId: "org-1",
    createdBy: "user-1",
    createdAt: new Date("2024-01-01"),
    status: "active",
  },
  {
    id: "project-2",
    name: "AI Styling Interface Study",
    description: "Testing AI-enhanced personal styling features",
    organizationId: "org-1",
    createdBy: "user-1",
    createdAt: new Date("2024-01-15"),
    status: "active",
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [projects, setProjects] = useState<Project[]>(mockProjects)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check for stored auth state
    const storedUser = localStorage.getItem("auth-user")
    const storedProject = localStorage.getItem("current-project")

    if (storedUser) {
      const userData = JSON.parse(storedUser)
      setUser(userData)
      setIsAuthenticated(true)

      if (storedProject) {
        const projectData = JSON.parse(storedProject)
        setCurrentProject(projectData)
      } else if (projects.length > 0) {
        setCurrentProject(projects[0])
        localStorage.setItem("current-project", JSON.stringify(projects[0]))
      }
    }
  }, [projects])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simple mock authentication
    const user = mockUsers.find((u) => u.email === email)
    if (user && password === "demo123") {
      setUser(user)
      setIsAuthenticated(true)
      localStorage.setItem("auth-user", JSON.stringify(user))

      // Set default project
      if (projects.length > 0) {
        setCurrentProject(projects[0])
        localStorage.setItem("current-project", JSON.stringify(projects[0]))
      }

      return true
    }
    return false
  }

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    // Simple mock signup
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      organizationId: "org-1",
      role: "member",
    }

    setUser(newUser)
    setIsAuthenticated(true)
    localStorage.setItem("auth-user", JSON.stringify(newUser))

    return true
  }

  const logout = () => {
    setUser(null)
    setCurrentProject(null)
    setIsAuthenticated(false)
    localStorage.removeItem("auth-user")
    localStorage.removeItem("current-project")
  }

  const createProject = (name: string, description: string) => {
    if (!user) return

    const newProject: Project = {
      id: `project-${Date.now()}`,
      name,
      description,
      organizationId: user.organizationId,
      createdBy: user.id,
      createdAt: new Date(),
      status: "active",
    }

    setProjects((prev) => [...prev, newProject])
    setCurrentProject(newProject)
    localStorage.setItem("current-project", JSON.stringify(newProject))
  }

  const selectProject = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId)
    if (project) {
      setCurrentProject(project)
      localStorage.setItem("current-project", JSON.stringify(project))
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        currentProject,
        projects,
        login,
        logout,
        signup,
        createProject,
        selectProject,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
