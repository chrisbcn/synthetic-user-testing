export interface Persona {
  id: string
  projectId: string // Added project association
  name: string
  avatar_emoji: string // Updated to match enhanced JSON structure
  persona_type: string // Updated to match enhanced JSON structure
  age: number
  net_worth?: string // Added from enhanced data
  annual_spend_fashion?: string // Updated field name
  intelligence_level?: string // Added from enhanced data
  location: string
  secondary_residences?: string[] // Added from enhanced data
  ethnicity?: string // Added from enhanced data

  wealth_source?: string // Added from enhanced data
  family_background?: string // Added from enhanced data
  career_path?: string // Added from enhanced data

  personality_profile?: {
    // Added structured personality data
    core_traits?: string[]
    communication_style?: string
    small_talk_strengths?: string[]
    trust_patterns?: string
    anxiety_points?: string[]
    learning_style?: string
  }

  background: string
  keyQuotes: string[]

  character_bible?: {
    visual_dna?: {
      physical_build?: string
      face_shape?: string
      hair?: string
      eyes?: string
      skin?: string
      style_aesthetic?: string
      distinctive_features?: string[]
    }

    signature_elements?: string[]

    setting?: {
      primary_location?: string
      secondary_locations?: string[]
      lighting_style?: string
      camera_angles?: string
      background_elements?: string[]
      color_palette?: string
      mood_atmosphere?: string
    }

    video_mannerisms?: {
      speaking_style?: string
      delivery_pace?: string
      facial_expressions?: string
      body_language?: string
      eye_contact?: string
      voice_tone?: string
    }

    consistency_anchors?: string[]
    gemini_image_prompt?: string

    veo3_delivery_characteristics?: {
      speaking_pace?: string
      facial_expressions?: string
      hand_gestures?: string
      voice_tone?: string
      posture?: string
    }
  }

  // Legacy fields for backward compatibility
  physicalTraits?: {
    ethnicity?: string
    hairColor?: string
    eyeColor?: string
    build?: string
    height?: string
    style?: string
    accessories?: string[]
  }
  characterTraits?: {
    accent?: string
    speakingStyle?: string
    mannerisms?: string[]
    personality?: string
    socialClass?: string
  }
  videoSettings?: {
    setting?: string
    lighting?: string
    cameraAngle?: string
    wardrobe?: string
    mood?: string
  }

  createdAt: Date
  updatedAt: Date
}

export interface Scenario {
  id: string
  name: string
  context: string
  questions: string[]
}

export interface Interview {
  id: string
  projectId: string // Added project association
  personaId: string
  scenarioId: string
  interviewerId?: string // Added interviewer selection
  status: "pending" | "in-progress" | "completed" | "failed"
  conversation: ConversationTurn[]
  insights?: string[]
  sentiment?: "positive" | "neutral" | "negative"
  authenticityScore?: number
  createdAt: Date
  completedAt?: Date
  duration?: number
  tags: string[]
}

export interface ConversationTurn {
  speaker: "moderator" | "persona"
  message: string
  timestamp: Date
}

export interface InterviewContext {
  persona: Persona
  scenario: Scenario
  interviewer?: InterviewerPersona // Added interviewer context
  startedAt: Date
  duration?: number
}

export interface InterviewResults {
  interview: Interview
  keyInsights: string[]
  sentimentAnalysis: {
    overall: "positive" | "neutral" | "negative"
    confidence: number
  }
  authenticityScore: number
  recommendations: string[]
}

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
  parentProjectId?: string // For sub-projects
  createdBy: string
  createdAt: Date
  updatedAt: Date
  status: "active" | "archived" | "draft"
  settings: {
    personaLimit?: number
    interviewerLimit?: number
    allowVideoGeneration: boolean
  }
  stats: {
    totalInterviews: number
    totalPersonas: number
    totalInterviewers: number
    totalFiles: number
    lastActivity: Date
  }
}

export interface VideoPullquote {
  id: string
  projectId?: string // Added project association
  interviewId: string
  personaId: string
  responseText: string
  videoPrompt: string
  videoUrl?: string
  thumbnailUrl?: string
  status: "pending" | "generating" | "completed" | "failed" | "error"
  createdAt: Date
  generatedAt?: Date
  duration?: number | string
  title?: string
  error?: string
  generatedPrompt?: string
  taskId?: string // For async video generation tracking
  provider?: string // Video generation provider (veo-3, runway-ml, etc.)
}

// Added interviewer persona interface
export interface InterviewerPersona {
  id: string
  projectId: string // Added project association
  name: string
  avatar_emoji: string
  specialization: string
  age: number
  location: string
  background: string
  education: string
  experience_years: number
  previous_roles: string[]
  expertise: string[]
  interview_style: string
  personality: string
  best_for_projects: string[]
  key_strengths: string[]
  sample_questions: string[]
  background_notes: string
  createdAt: Date
  updatedAt: Date
}

export interface Organization {
  id: string
  name: string
  slug: string
  createdAt: Date
  ownerId: string
  settings: {
    allowSubProjects: boolean
    defaultPersonaLimit: number
    defaultInterviewerLimit: number
  }
}

export interface ProjectFile {
  id: string
  projectId: string
  name: string
  type: "transcript" | "wireframe" | "flow-diagram" | "meeting-notes" | "prototype" | "other"
  url: string
  size: number
  uploadedBy: string
  uploadedAt: Date
  description?: string
  tags: string[]
  metadata?: {
    dimensions?: { width: number; height: number }
    duration?: number
    format?: string
  }
}

export interface ProjectMember {
  id: string
  projectId: string
  userId: string
  role: "owner" | "admin" | "member" | "viewer"
  addedAt: Date
  addedBy: string
}

export interface ProjectDashboardData {
  project: Project
  recentInterviews: Interview[]
  topPersonas: (Persona & { interviewCount: number })[]
  topInterviewers: (InterviewerPersona & { interviewCount: number })[]
  insights: {
    totalInsights: number
    sentimentBreakdown: { positive: number; neutral: number; negative: number }
    averageAuthenticityScore: number
  }
  files: {
    totalFiles: number
    recentFiles: ProjectFile[]
  }
}

export interface GlobalDashboardData {
  organization: Organization
  projects: (Project & { subProjectCount: number })[]
  totalStats: {
    totalProjects: number
    totalInterviews: number
    totalPersonas: number
    totalInterviewers: number
  }
  recentActivity: {
    type: "interview" | "project_created" | "file_uploaded" | "persona_created"
    projectId: string
    projectName: string
    description: string
    timestamp: Date
  }[]
}
