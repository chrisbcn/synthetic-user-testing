"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, Users, MessageSquare, Video, TrendingUp, Clock, CheckCircle } from "lucide-react"
import type { DashboardData, ProjectSummary } from "@/lib/types"

// Mock dashboard data
const mockDashboardData: DashboardData = {
  totalProjects: 4,
  activeInterviews: 12,
  completedInterviews: 89,
  totalPersonas: 25,
  totalInterviewers: 8,
  videosGenerated: 34,
  recentActivity: [
    {
      id: "1",
      type: "interview_completed",
      description: "Interview with Sophia Harrington completed",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      projectId: "project-1",
      userId: "user-1",
    },
    {
      id: "2",
      type: "video_generated",
      description: "Video pullquote generated for luxury preferences study",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      projectId: "project-1",
      userId: "user-1",
    },
    {
      id: "3",
      type: "persona_created",
      description: "New persona 'Marcus Chen' added to project",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      projectId: "project-2",
      userId: "user-1",
    },
  ],
}

const mockProjectSummaries: ProjectSummary[] = [
  {
    id: "project-1",
    name: "Maura Luxury Fashion",
    description: "User testing for luxury fashion platform",
    status: "active",
    progress: 75,
    interviewsCompleted: 45,
    totalPersonas: 10,
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
    insights: [
      "Users prefer personalized styling recommendations",
      "Price transparency is crucial for luxury purchases",
      "Mobile experience needs improvement",
    ],
  },
  {
    id: "project-2",
    name: "AI Styling Interface",
    description: "Testing AI-enhanced personal styling features",
    status: "active",
    progress: 45,
    interviewsCompleted: 23,
    totalPersonas: 8,
    lastActivity: new Date(Date.now() - 6 * 60 * 60 * 1000),
    insights: ["AI recommendations feel impersonal", "Users want more control over styling choices"],
  },
]

interface MainDashboardProps {
  onSelectProject: (projectId: string) => void
}

export function MainDashboard({ onSelectProject }: MainDashboardProps) {
  const { user, projects, createProject } = useAuth()
  const [showCreateProject, setShowCreateProject] = useState(false)

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  return (
    <div className="p-6 space-y-6">
      {/* AI Summary Card */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <CardTitle className="text-blue-900 text-lg">AI Summary</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-blue-800 leading-relaxed text-sm">
            Your synthetic user testing dashboard shows great progress with {mockDashboardData.completedInterviews}{" "}
            completed interviews this week. We've got {mockDashboardData.activeInterviews} active interviews running,
            and the AI insights are highlighting some valuable user behavior patterns.
          </p>
          <p className="text-blue-800 leading-relaxed text-sm mt-2">
            Key priorities include reviewing the latest interview results from the luxury fashion study and generating
            video summaries for stakeholder presentations. The personas are providing rich insights into user
            preferences and pain points.
          </p>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Interviews This Week</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-gray-900">{mockDashboardData.activeInterviews}</p>
                  <div className="flex items-center text-green-600 text-sm">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    15%
                  </div>
                </div>
                <p className="text-xs text-gray-500">from last week</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Completed</span>
                <span className="font-medium">{mockDashboardData.completedInterviews}</span>
                <span className="text-gray-500">88%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">In Progress</span>
                <span className="font-medium">{mockDashboardData.activeInterviews}</span>
                <span className="text-gray-500">12%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Videos Generated</span>
                <span className="font-medium">{mockDashboardData.videosGenerated}</span>
                <span className="text-gray-500">38%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Personas</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-gray-900">{mockDashboardData.totalPersonas}</p>
                  <div className="flex items-center text-green-600 text-sm">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    8%
                  </div>
                </div>
                <p className="text-xs text-gray-500">across all projects</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Fashion Focused</span>
                <span className="font-medium">15</span>
                <span className="text-gray-500">60%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tech Savvy</span>
                <span className="font-medium">6</span>
                <span className="text-gray-500">24%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Price Conscious</span>
                <span className="font-medium">4</span>
                <span className="text-gray-500">16%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Key Insights</p>
                <p className="text-3xl font-bold text-gray-900">{mockDashboardData.totalProjects}</p>
                <p className="text-xs text-gray-500">active projects</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Mobile UX</span>
                <span className="ml-auto text-gray-900">Needs work</span>
                <span className="ml-2 text-orange-600">Priority</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Personalization</span>
                <span className="ml-auto text-gray-900">High demand</span>
                <span className="ml-2 text-green-600">Implement</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Price Transparency</span>
                <span className="ml-auto text-gray-900">Critical</span>
                <span className="ml-2 text-red-600">Fix ASAP</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prioritized Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Prioritized Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-4 h-4 border-2 border-gray-300 rounded mt-1"></div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">
                  Review interview results from Sophia Harrington's luxury fashion preferences session
                </h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-3 h-3" />
                    </div>
                    <span>45-minute interview completed 2 hours ago</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-4 h-4 border-2 border-gray-300 rounded mt-1"></div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">
                  Generate video summary for stakeholder presentation on mobile UX findings
                </h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                      <Video className="w-3 h-3" />
                    </div>
                    <span>Ready to generate from 12 completed interviews</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-4 h-4 border-2 border-gray-300 rounded mt-1"></div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">
                  Update persona profiles based on latest interview insights about price sensitivity
                </h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="w-3 h-3" />
                    </div>
                    <span>3 personas need updates</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Active Projects</CardTitle>
              <Button size="sm" onClick={() => setShowCreateProject(true)}>
                <Plus className="w-4 h-4 mr-1" />
                Add Project
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockProjectSummaries.map((project) => (
                <div
                  key={project.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onSelectProject(project.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{project.name}</h3>
                      <p className="text-sm text-gray-600">{project.description}</p>
                    </div>
                    <Badge variant={project.status === "active" ? "default" : "secondary"} className="ml-2">
                      {project.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      <span>{project.interviewsCompleted} interviews</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{project.totalPersonas} personas</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimeAgo(project.lastActivity)}</span>
                    </div>
                  </div>

                  <div className="mb-2">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-1.5" />
                  </div>

                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    View Results
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team Updates */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Team Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockDashboardData.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    {activity.type === "interview_completed" && <CheckCircle className="w-4 h-4 text-green-600" />}
                    {activity.type === "video_generated" && <Video className="w-4 h-4 text-blue-600" />}
                    {activity.type === "persona_created" && <Users className="w-4 h-4 text-purple-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(activity.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
