"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProjectSidebar } from "@/components/project-sidebar"
import { InterviewRunner } from "@/components/interview-runner"
import InterviewerManager from "@/components/interviewer-manager"
import { FileRepository } from "@/components/file-repository"
import { ResultsAnalytics } from "@/components/results-analytics"
import { useAuth } from "@/lib/auth"
import { Play, MessageSquare, RotateCcw, FileText, Video, ChevronUp, ChevronDown, Search } from "lucide-react"
import { VideoModal } from "@/components/video-modal"
import type { Persona, Interviewer, Interview, ProjectFile } from "@/lib/types"
import PersonasPage from "@/app/personas/page"

interface ProjectWorkspaceProps {
  projectId: string
  onBackToDashboard: () => void
}

const mockPersonas: Persona[] = [
  {
    id: "sophia-harrington",
    name: "Sophia Harrington",
    avatar: "💎",
    type: "Ultra-HNW Collector",
    age: 52,
    location: "Manhattan, NY",
    annualSpend: "$300K",
    background:
      "Third-generation wealth, Harvard MBA, sits on museum boards. Values relationships with brand advisors built over decades.",
    keyQuotes: ["I don't buy trends, I buy pieces that will be relevant in twenty years."],
  },
  {
    id: "marcus-chen",
    name: "Marcus Chen",
    avatar: "⚡",
    type: "Strategic Builder",
    age: 34,
    location: "San Francisco, CA",
    annualSpend: "$95K",
    background:
      "Stanford CS grad, senior product manager at major tech company. Approaches luxury shopping like product development.",
    keyQuotes: ["Show me the analytics and I can make better decisions."],
  },
  {
    id: "isabella-rossi",
    name: "Isabella Rossi",
    avatar: "🌹",
    type: "Traditional Luxury",
    age: 48,
    location: "Milan, Italy",
    annualSpend: "$180K",
    background: "Third-generation luxury fashion family, studied at Bocconi. Runs family's luxury textile business.",
    keyQuotes: ["Technology should enhance relationships, not replace them."],
  },
  {
    id: "aisha-okafor",
    name: "Aisha Okafor",
    avatar: "✨",
    type: "Emerging Luxury",
    age: 29,
    location: "Lagos, Nigeria",
    annualSpend: "$65K",
    background:
      "Oxford-educated, runs successful fintech startup. Building luxury wardrobe as status symbol and personal expression.",
    keyQuotes: ["I'm building my luxury knowledge as much as my wardrobe."],
  },
  {
    id: "james-whitmore",
    name: "James Whitmore III",
    avatar: "🏛️",
    type: "Ultra-HNW Collector",
    age: 58,
    location: "Greenwich, CT",
    annualSpend: "$420K",
    background: "Fifth-generation banker, Yale educated. Manages family trust and private foundation.",
    keyQuotes: ["The best luxury is invisible to those who don't know to look for it."],
  },
  {
    id: "priya-sharma",
    name: "Priya Sharma",
    avatar: "🪷",
    type: "Strategic Builder",
    age: 31,
    location: "Mumbai, India",
    annualSpend: "$85K",
    background: "IIM graduate, works in family pharmaceutical business expanding internationally.",
    keyQuotes: ["I need pieces that work whether I'm in Mumbai boardrooms or New York meetings."],
  },
  {
    id: "alexandre-dubois",
    name: "Alexandre Dubois",
    avatar: "🎨",
    type: "Traditional Luxury",
    age: 44,
    location: "16th Arrondissement, Paris",
    annualSpend: "$220K",
    background:
      "Art dealer specializing in contemporary luxury pieces. Family connections to major French luxury houses.",
    keyQuotes: ["In Paris, we understand that true luxury is timeless."],
  },
  {
    id: "sarah-kim",
    name: "Sarah Kim",
    avatar: "🌸",
    type: "Emerging Luxury",
    age: 26,
    location: "Seoul, South Korea",
    annualSpend: "$55K",
    background: "Works for major Korean tech company, building social media presence around luxury lifestyle.",
    keyQuotes: ["Every piece needs to work for content creation and real life."],
  },
  {
    id: "carolina-mendoza",
    name: "Carolina Mendoza",
    avatar: "☀️",
    type: "Strategic Builder",
    age: 35,
    location: "Mexico City, Mexico",
    annualSpend: "$120K",
    background:
      "Runs successful marketing agency, built business from scratch. First in family to enter luxury market.",
    keyQuotes: ["Show me the ROI on everything - my time, my money, my style choices."],
  },
  {
    id: "william-blackstone",
    name: "William Blackstone",
    avatar: "⚖️",
    type: "Ultra-HNW Collector",
    age: 61,
    location: "Belgravia, London",
    annualSpend: "$380K",
    background: "Senior barrister, QC, from family of judges and lawyers. Collector of rare menswear and accessories.",
    keyQuotes: ["I've been wearing the same style for thirty years, and I'll be wearing it for thirty more."],
  },
]

const mockInterviewers: Interviewer[] = [
  {
    id: "sophia-chen-laurent",
    name: "Sophia Chen-Laurent",
    avatar: "👗",
    expertise: "Luxury Fashion & Consumer Psychology",
    experience: 8,
    background: "Former Condé Nast fashion editor turned UX researcher specializing in luxury consumer behavior",
    interviewStyle: "Empathetic and sophisticated, naturally speaks luxury fashion language",
    sampleQuestions: ["Tell me about your relationship with your personal advisor at [Brand]"],
  },
  {
    id: "marcus-rodriguez",
    name: "Marcus Rodriguez",
    avatar: "📊",
    expertise: "Fintech & Wealth Management UX",
    experience: 6,
    background: "Former Goldman Sachs analyst turned product manager, specializes in luxury fintech",
    interviewStyle: "Data-driven but empathetic, speaks business language fluently",
    sampleQuestions: ["How do you think about ROI when building your luxury wardrobe?"],
  },
  {
    id: "isabella-montgomery",
    name: "Isabella Montgomery",
    avatar: "🎨",
    expertise: "Design Psychology & Creative Platforms",
    experience: 5,
    background: "Royal College of Art graduate with deep expertise in design psychology",
    interviewStyle: "Curious and non-judgmental, excellent at understanding aesthetic choices",
    sampleQuestions: ["How has your personal aesthetic evolved over time?"],
  },
  {
    id: "david-kim",
    name: "David Kim",
    avatar: "⚙️",
    expertise: "Enterprise SaaS & B2B Tools",
    experience: 10,
    background: "Former Microsoft product manager specializing in enterprise tools",
    interviewStyle: "Systematic and thorough, excellent at understanding professional workflows",
    sampleQuestions: ["Walk me through your typical workflow when working with a new client"],
  },
  {
    id: "amara-osei",
    name: "Amara Osei",
    avatar: "🌍",
    expertise: "Global Market Research & Cultural Psychology",
    experience: 7,
    background: "International consultant specializing in luxury market expansion",
    interviewStyle: "Culturally sensitive and globally minded",
    sampleQuestions: ["How do cultural expectations around luxury differ in your contexts?"],
  },
  {
    id: "thomas-anderson",
    name: "Thomas Anderson",
    avatar: "👔",
    expertise: "Traditional Luxury & Heritage Brands",
    experience: 15,
    background: "Former luxury brand executive with deep heritage brand expertise",
    interviewStyle: "Refined and discreet, deeply respectful of traditional luxury values",
    sampleQuestions: ["How important is maintaining the personal relationship aspect?"],
  },
  {
    id: "zoe-wang",
    name: "Zoe Wang",
    avatar: "📱",
    expertise: "Mobile UX & Gen Z/Millennial Research",
    experience: 4,
    background: "Digital native specializing in mobile-first experiences",
    interviewStyle: "Energetic and digitally fluent",
    sampleQuestions: ["How do you balance creating content-worthy looks with building a practical wardrobe?"],
  },
  {
    id: "rachel-goldman",
    name: "Rachel Goldman",
    avatar: "🧠",
    expertise: "Behavioral Economics & Decision Science",
    experience: 9,
    background: "Former academic researcher specializing in luxury consumption psychology",
    interviewStyle: "Scientifically curious and non-judgmental",
    sampleQuestions: ["What emotions do you experience when making a significant luxury purchase?"],
  },
  {
    id: "alessandro-bianchi",
    name: "Alessandro Bianchi",
    avatar: "🎯",
    expertise: "Luxury Retail & Customer Experience",
    experience: 12,
    background: "Former luxury retail executive specializing in omnichannel customer experience",
    interviewStyle: "Service-oriented and relationship-focused",
    sampleQuestions: ["What does exceptional service look like to you in a luxury context?"],
  },
  {
    id: "sarah-mitchell",
    name: "Dr. Sarah Mitchell",
    avatar: "🔬",
    expertise: "Research Methodology & Data Science",
    experience: 11,
    background: "Former academic researcher specializing in mixed-methods research",
    interviewStyle: "Methodical and thorough, excellent at designing comprehensive research",
    sampleQuestions: ["Help me understand your typical decision-making process"],
  },
]

const mockInterviews: Interview[] = [
  {
    id: "interview-1",
    personaId: "sophia-harrington",
    personaName: "Sophia Harrington",
    interviewerId: "sophia-chen-laurent",
    interviewerName: "Sophia Chen-Laurent",
    scenarioId: "Luxury Wardrobe Management Experience",
    scenario: "Luxury Wardrobe Management Experience",
    status: "completed",
    createdAt: new Date(2025, 8, 10, 14, 30).toISOString(), // Sept 10, 2025 2:30 PM
    conversation: [
      {
        speaker: "moderator",
        message: "Tell me about your relationship with your personal advisor at your preferred luxury brands.",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        speaker: "persona",
        message:
          "I've worked with the same advisor at Brunello Cucinelli for over fifteen years. She understands my lifestyle completely - knows I prefer investment pieces over trends, remembers my color preferences, and even tracks what I've worn to important events so I never repeat. That relationship is invaluable.",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30000).toISOString(),
      },
      {
        speaker: "moderator",
        message: "How do you evaluate whether a piece is worth the investment?",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 60000).toISOString(),
      },
      {
        speaker: "persona",
        message:
          "I look at three things: craftsmanship, versatility, and timelessness. Can I wear this in five years? Does it work for multiple occasions? Will the construction hold up? If it passes all three tests and I genuinely love it, then it's worth considering. Price per wear over time is more important than the initial cost.",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 90000).toISOString(),
      },
      {
        speaker: "moderator",
        message: "What role does technology play in your luxury shopping experience?",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 120000).toISOString(),
      },
      {
        speaker: "persona",
        message:
          "Technology should enhance the human relationship, not replace it. I appreciate when my advisor can quickly access my purchase history or preferences, but I don't want to lose that personal touch. Apps are fine for browsing, but for significant purchases, I need that human expertise and relationship.",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 150000).toISOString(),
      },
    ],
    messages: [
      {
        id: "msg-1",
        role: "interviewer",
        content: "Tell me about your relationship with your personal advisor at your preferred luxury brands.",
        timestamp: new Date().toISOString(),
      },
      {
        id: "msg-2",
        role: "persona",
        content:
          "I've worked with the same advisor at Brunello Cucinelli for over fifteen years. She understands my lifestyle completely - knows I prefer investment pieces over trends, remembers my color preferences, and even tracks what I've worn to important events so I never repeat. That relationship is invaluable.",
        timestamp: new Date().toISOString(),
      },
    ],
  },
  {
    id: "interview-2",
    personaId: "marcus-chen",
    personaName: "Marcus Chen",
    interviewerId: "marcus-rodriguez",
    interviewerName: "Marcus Rodriguez",
    scenarioId: "Strategic Luxury Investment Planning",
    scenario: "Strategic Luxury Investment Planning",
    status: "completed",
    createdAt: new Date(2025, 8, 9, 10, 15).toISOString(),
    conversation: [
      {
        speaker: "moderator",
        message: "How do you approach ROI when building your luxury wardrobe?",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        speaker: "persona",
        message:
          "I track everything - cost per wear, versatility across occasions, resale value trends. I want pieces that work for both client meetings and weekend events. If I can't see myself wearing something at least 20 times a year, it doesn't make financial sense, regardless of the brand prestige.",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 30000).toISOString(),
      },
      {
        speaker: "moderator",
        message: "Do you use any tools or systems to track this data?",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 60000).toISOString(),
      },
      {
        speaker: "persona",
        message:
          "I have a simple spreadsheet that tracks purchase date, cost, occasions worn, and estimated resale value. I also take photos of outfits to avoid repetition at important meetings. It's not sophisticated, but it helps me make data-driven decisions about what's actually working in my wardrobe.",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 90000).toISOString(),
      },
    ],
    messages: [
      {
        id: "msg-3",
        role: "interviewer",
        content: "How do you approach ROI when building your luxury wardrobe?",
        timestamp: new Date().toISOString(),
      },
      {
        id: "msg-4",
        role: "persona",
        content:
          "I track everything - cost per wear, versatility across occasions, resale value trends. I want pieces that work for both client meetings and weekend events. If I can't see myself wearing something at least 20 times a year, it doesn't make financial sense, regardless of the brand prestige.",
        timestamp: new Date().toISOString(),
      },
    ],
  },
  {
    id: "interview-3",
    personaId: "aisha-okafor",
    personaName: "Aisha Okafor",
    interviewerId: "amara-osei",
    interviewerName: "Amara Osei",
    scenarioId: "Cultural Identity in Luxury Fashion",
    scenario: "Cultural Identity in Luxury Fashion",
    status: "completed",
    createdAt: new Date(2025, 8, 8, 16, 45).toISOString(),
    conversation: [
      {
        id: "msg-5",
        speaker: "interviewer",
        message: "How do you navigate between global luxury trends and maintaining your cultural authenticity?",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "msg-6",
        speaker: "persona",
        message:
          "It's about finding pieces that honor both worlds. I'll wear a Bottega Veneta blazer with jewelry from Nigerian designers, or pair Ganni with traditional Ankara prints. Luxury should amplify who you are, not erase your identity. When I walk into boardrooms in Lagos or London, I want to represent excellence and heritage simultaneously.",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 30000).toISOString(),
      },
    ],
    messages: [
      {
        id: "msg-5",
        role: "interviewer",
        content: "How do you navigate between global luxury trends and maintaining your cultural authenticity?",
        timestamp: new Date().toISOString(),
      },
      {
        id: "msg-6",
        role: "persona",
        content:
          "It's about finding pieces that honor both worlds. I'll wear a Bottega Veneta blazer with jewelry from Nigerian designers, or pair Ganni with traditional Ankara prints. Luxury should amplify who you are, not erase your identity. When I walk into boardrooms in Lagos or London, I want to represent excellence and heritage simultaneously.",
        timestamp: new Date().toISOString(),
      },
    ],
  },
  {
    id: "interview-4",
    personaId: "sarah-kim",
    personaName: "Sarah Kim",
    interviewerId: "zoe-wang",
    interviewerName: "Zoe Wang",
    scenarioId: "Social Media and Luxury Consumption",
    scenario: "Social Media and Luxury Consumption",
    status: "completed",
    createdAt: new Date(2025, 8, 7, 11, 20).toISOString(),
    conversation: [
      {
        id: "msg-7",
        speaker: "interviewer",
        message: "How do you balance creating content-worthy looks with building a practical luxury wardrobe?",
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "msg-8",
        speaker: "persona",
        message:
          "Every piece has to work double duty - it needs to photograph beautifully for my Instagram but also function in my actual life. I look for interesting textures and silhouettes that create visual interest in photos, but the fit and comfort have to be perfect for 12-hour workdays. Korean fashion culture is so visual, but I'm learning that European luxury focuses more on craftsmanship and longevity.",
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 30000).toISOString(),
      },
    ],
    messages: [
      {
        id: "msg-7",
        role: "interviewer",
        content: "How do you balance creating content-worthy looks with building a practical luxury wardrobe?",
        timestamp: new Date().toISOString(),
      },
      {
        id: "msg-8",
        role: "persona",
        content:
          "Every piece has to work double duty - it needs to photograph beautifully for my Instagram but also function in my actual life. I look for interesting textures and silhouettes that create visual interest in photos, but the fit and comfort have to be perfect for 12-hour workdays. Korean fashion culture is so visual, but I'm learning that European luxury focuses more on craftsmanship and longevity.",
        timestamp: new Date().toISOString(),
      },
    ],
  },
  {
    id: "interview-5",
    personaId: "william-blackstone",
    personaName: "William Blackstone",
    interviewerId: "thomas-anderson",
    interviewerName: "Thomas Anderson",
    scenarioId: "Heritage Luxury and Digital Innovation",
    scenario: "Heritage Luxury and Digital Innovation",
    status: "completed",
    createdAt: new Date(2025, 8, 6, 9, 0).toISOString(),
    conversation: [
      {
        id: "msg-9",
        speaker: "interviewer",
        message: "How do you balance honoring tradition with embracing innovations that could enhance your experience?",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "msg-10",
        speaker: "persona",
        message:
          "Innovation should serve tradition, not supplant it. If technology can help me locate that perfect vintage Patek Philippe I've been seeking, or ensure my tailor has precise measurements from twenty years of fittings, then it has merit. But the moment it attempts to replace the human relationships I've cultivated over decades, it becomes counterproductive. Quality and discretion must remain paramount.",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 30000).toISOString(),
      },
    ],
    messages: [
      {
        id: "msg-9",
        role: "interviewer",
        content: "How do you balance honoring tradition with embracing innovations that could enhance your experience?",
        timestamp: new Date().toISOString(),
      },
      {
        id: "msg-10",
        role: "persona",
        content:
          "Innovation should serve tradition, not supplant it. If technology can help me locate that perfect vintage Patek Philippe I've been seeking, or ensure my tailor has precise measurements from twenty years of fittings, then it has merit. But the moment it attempts to replace the human relationships I've cultivated over decades, it becomes counterproductive. Quality and discretion must remain paramount.",
        timestamp: new Date().toISOString(),
      },
    ],
  },
]

const mockFiles: ProjectFile[] = [
  {
    id: "file-1",
    name: "Luxury Checkout Flow.pdf",
    type: "Wireframe",
    size: "2.4 MB",
    uploadedAt: new Date().toISOString(),
    url: "/mock-file.pdf",
  },
]

export function ProjectWorkspace({ projectId, onBackToDashboard }: ProjectWorkspaceProps) {
  const [activeSection, setActiveSection] = useState("overview")
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<any>(null)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<"createdAt" | "scenario" | "personaName" | "interviewerName">("createdAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const { user, logout, currentProject } = useAuth()
  const [personas, setPersonas] = useState<Persona[]>(mockPersonas)
  const [interviewers, setInterviewers] = useState<Interviewer[]>(mockInterviewers)
  const [interviews, setInterviews] = useState<Interview[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("completed-interviews")
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          console.log("[v0] Loaded interviews from localStorage:", parsed.length, "interviews")
          return [...parsed, ...mockInterviews]
        } catch (error) {
          console.error("[v0] Failed to parse saved interviews:", error)
        }
      }
    }
    console.log("[v0] Using mock interviews:", mockInterviews.length, "interviews")
    return mockInterviews
  })
  const [files, setFiles] = useState<ProjectFile[]>(mockFiles)
  const [videos, setVideos] = useState<any[]>([])
  const [videosLoading, setVideosLoading] = useState(true)

  useEffect(() => {
    loadVideos()
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const completedInterviews = interviews.filter(
        (interview) => !mockInterviews.some((mock) => mock.id === interview.id),
      )
      localStorage.setItem("completed-interviews", JSON.stringify(completedInterviews))
      console.log("[v0] Saved", completedInterviews.length, "completed interviews to localStorage")
    }
  }, [interviews])

  const handleSort = (field: "createdAt" | "scenario" | "personaName" | "interviewerName") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const getFilteredAndSortedInterviews = () => {
    let filtered = interviews

    // Filter by search term
    if (searchTerm) {
      filtered = interviews.filter(
        (interview) =>
          interview.scenario.toLowerCase().includes(searchTerm.toLowerCase()) ||
          interview.personaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          interview.interviewerName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Sort interviews
    return filtered.sort((a, b) => {
      let aValue: string | Date
      let bValue: string | Date

      switch (sortField) {
        case "createdAt":
          aValue = new Date(a.createdAt)
          bValue = new Date(b.createdAt)
          break
        case "scenario":
          aValue = a.scenario
          bValue = b.scenario
          break
        case "personaName":
          aValue = a.personaName
          bValue = b.personaName
          break
        case "interviewerName":
          aValue = a.interviewerName
          bValue = b.interviewerName
          break
        default:
          aValue = new Date(a.createdAt)
          bValue = new Date(b.createdAt)
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })
  }

  const renderSortIcon = (field: "createdAt" | "scenario" | "personaName" | "interviewerName") => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
  }

  const loadVideos = async () => {
    try {
      console.log("[v0] Loading videos from API...")
      setVideosLoading(true)
      const response = await fetch("/api/videos/list")
      console.log("[v0] Videos API response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Videos loaded:", data)
        const processedVideos = await Promise.all(
          (data.videos || []).map(async (video: any, index: number) => {
            const mockInterviewAssociations = [
              {
                interviewId: "interview-1",
                interviewTitle: "Luxury Wardrobe Management Experience",
                personaName: "Sophia Harrington",
              },
              {
                interviewId: "interview-2",
                interviewTitle: "Strategic Luxury Investment Planning",
                personaName: "Marcus Chen",
              },
              {
                interviewId: "interview-3",
                interviewTitle: "Cultural Identity in Luxury Fashion",
                personaName: "Aisha Okafor",
              },
              {
                interviewId: "interview-4",
                interviewTitle: "Social Media and Luxury Consumption",
                personaName: "Sarah Kim",
              },
            ]

            const association = mockInterviewAssociations[index % mockInterviewAssociations.length]

            if (!video.thumbnail) {
              try {
                const thumbnail = await generateVideoThumbnail(video.url)
                return { ...video, thumbnail, ...association }
              } catch (error) {
                console.error("[v0] Failed to generate thumbnail for video:", video.id, error)
                return { ...video, ...association }
              }
            }
            return { ...video, ...association }
          }),
        )
        setVideos(processedVideos)
      } else {
        console.error("[v0] Failed to load videos:", response.statusText)
        setVideos([])
      }
    } catch (error) {
      console.error("[v0] Error loading videos:", error)
      setVideos([])
    } finally {
      setVideosLoading(false)
    }
  }

  const generateVideoThumbnail = (videoUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video")
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      video.crossOrigin = "anonymous"
      video.onloadedmetadata = () => {
        canvas.width = 160
        canvas.height = 90
        video.currentTime = Math.min(2, video.duration / 4)
      }

      video.onseeked = () => {
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          const thumbnail = canvas.toDataURL("image/jpeg", 0.8)
          resolve(thumbnail)
        } else {
          reject(new Error("Could not get canvas context"))
        }
      }

      video.onerror = () => reject(new Error("Failed to load video"))
      video.src = videoUrl
    })
  }

  const handleCreatePersona = () => {
    // Open persona creation modal
    console.log("Create persona")
  }

  const handleEditPersona = (persona: Persona) => {
    console.log("Edit persona:", persona)
  }

  const handleDeletePersona = (id: string) => {
    setPersonas((prev) => prev.filter((p) => p.id !== id))
  }

  const handleCreateInterviewer = () => {
    console.log("Create interviewer")
  }

  const handleEditInterviewer = (interviewer: Interviewer) => {
    console.log("Edit interviewer:", interviewer)
  }

  const handleDeleteInterviewer = (id: string) => {
    setInterviewers((prev) => prev.filter((i) => i.id !== id))
  }

  const handleRunInterview = (interview: Interview) => {
    setActiveSection("interviews")
  }

  const handleDuplicateInterview = (interview: Interview) => {
    const duplicate = {
      ...interview,
      id: `${interview.id}-copy-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "draft" as const,
    }
    setInterviews((prev) => [...prev, duplicate])
  }

  const handleViewInterview = (interview: Interview) => {
    setSelectedInterview(interview)
    setActiveSection("results")
  }

  const handleUploadFile = (file: File) => {
    const newFile: ProjectFile = {
      id: `file-${Date.now()}`,
      name: file.name,
      type: file.type.includes("image") ? "Wireframe" : "Document",
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      uploadedAt: new Date().toISOString(),
      url: URL.createObjectURL(file),
    }
    setFiles((prev) => [...prev, newFile])
  }

  const handlePlayVideo = (video: any) => {
    console.log("[v0] Playing video:", video.url)
    setSelectedVideo(video)
    setShowVideoModal(true)
  }

  const handleCloseModal = () => {
    console.log("[v0] Closing video modal")
    setShowVideoModal(false)
    setSelectedVideo(null)
  }

  const handleInterviewCompleted = (completedInterview: Interview) => {
    console.log("[v0] Interview completed callback received:", completedInterview.id)
    console.log("[v0] Adding completed interview to list:", completedInterview)
    setInterviews((prev) => {
      const updated = [completedInterview, ...prev]
      console.log("[v0] Updated interviews list, total count:", updated.length)
      return updated
    })
    setSelectedInterview(completedInterview)
    console.log("[v0] Set selected interview and switching to results")
  }

  const renderMainContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Recent Videos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {videosLoading ? (
                  <div className="text-center py-8 text-slate-500">Loading videos...</div>
                ) : videos.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    No videos uploaded yet. Upload videos from the Results section to see them here.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {videos.map((video) => (
                      <div
                        key={video.id}
                        className="group bg-slate-50 rounded-lg overflow-hidden hover:bg-slate-100 transition-colors"
                      >
                        <div className="relative cursor-pointer" onClick={() => handlePlayVideo(video)}>
                          {video.thumbnail ? (
                            <img
                              src={video.thumbnail || "/placeholder.svg"}
                              alt={video.filename || video.name}
                              className="w-full h-32 object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.style.display = "none"
                                target.nextElementSibling?.classList.remove("hidden")
                              }}
                            />
                          ) : null}
                          <div
                            className={`w-full h-32 bg-slate-200 flex items-center justify-center ${video.thumbnail ? "hidden" : ""}`}
                          >
                            <Play className="w-8 h-8 text-slate-400" />
                          </div>
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                            <Play className="w-8 h-8 text-white" />
                          </div>
                          {video.duration && (
                            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                              {video.duration}
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <h4 className="font-medium text-sm mb-1">{video.filename || video.name}</h4>
                          {video.interviewId ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                const interview = interviews.find((i) => i.id === video.interviewId)
                                if (interview) {
                                  console.log("[v0] Navigating to interview results:", interview.id)
                                  setSelectedInterview(interview)
                                  setActiveSection("results")
                                }
                              }}
                              className="text-xs text-blue-600 hover:text-blue-800 hover:underline mb-1 block text-left transition-colors"
                            >
                              {video.interviewTitle || `Interview with ${video.personaName}`}
                            </button>
                          ) : (
                            <p className="text-xs text-slate-600 mb-1">{video.interviewTitle || "Interview Video"}</p>
                          )}
                          <p className="text-xs text-slate-500">
                            {video.personaName || new Date(video.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Recent Interviews
                  </CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      placeholder="Search interviews..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-2 px-3 text-sm font-medium text-slate-600">
                          <button
                            onClick={() => handleSort("scenario")}
                            className="flex items-center gap-1 hover:text-slate-800 transition-colors"
                          >
                            Interview
                            {renderSortIcon("scenario")}
                          </button>
                        </th>
                        <th className="text-left py-2 px-3 text-sm font-medium text-slate-600">
                          <button
                            onClick={() => handleSort("interviewerName")}
                            className="flex items-center gap-1 hover:text-slate-800 transition-colors"
                          >
                            Interviewer
                            {renderSortIcon("interviewerName")}
                          </button>
                        </th>
                        <th className="text-left py-2 px-3 text-sm font-medium text-slate-600">
                          <button
                            onClick={() => handleSort("personaName")}
                            className="flex items-center gap-1 hover:text-slate-800 transition-colors"
                          >
                            Interviewee
                            {renderSortIcon("personaName")}
                          </button>
                        </th>
                        <th className="text-left py-2 px-3 text-sm font-medium text-slate-600">
                          <button
                            onClick={() => handleSort("createdAt")}
                            className="flex items-center gap-1 hover:text-slate-800 transition-colors"
                          >
                            Date
                            {renderSortIcon("createdAt")}
                          </button>
                        </th>
                        <th className="text-left py-2 px-3 text-sm font-medium text-slate-600">Video</th>
                        <th className="text-left py-2 px-3 text-sm font-medium text-slate-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredAndSortedInterviews().map((interview, index) => {
                        const hasVideo = videos.some((v) => v.interviewId === interview.id)
                        return (
                          <tr
                            key={interview.id}
                            className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                              index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                            }`}
                          >
                            <td className="py-3 px-3">
                              <button
                                onClick={() => handleViewInterview(interview)}
                                className="text-left hover:text-blue-600 hover:underline transition-colors"
                              >
                                <div className="font-medium text-sm">{interview.scenario}</div>
                              </button>
                            </td>
                            <td className="py-3 px-3">
                              <button
                                onClick={() => {
                                  setActiveSection("interviewers")
                                }}
                                className="text-sm text-slate-700 hover:text-blue-600 hover:underline transition-colors"
                              >
                                {interview.interviewerName}
                              </button>
                            </td>
                            <td className="py-3 px-3">
                              <button
                                onClick={() => {
                                  setActiveSection("personas")
                                }}
                                className="text-sm text-slate-700 hover:text-blue-600 hover:underline transition-colors"
                              >
                                {interview.personaName}
                              </button>
                            </td>
                            <td className="py-3 px-3">
                              <div className="text-sm text-slate-700">
                                {new Date(interview.createdAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </div>
                              <div className="text-xs text-slate-500">
                                {new Date(interview.createdAt).toLocaleTimeString("en-US", {
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                })}
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              {hasVideo ? (
                                <button
                                  onClick={() => {
                                    const video = videos.find((v) => v.interviewId === interview.id)
                                    if (video) handlePlayVideo(video)
                                  }}
                                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm transition-colors"
                                >
                                  <Play className="w-3 h-3" />
                                  <span className="sr-only">Play video</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    setSelectedInterview(interview)
                                    setActiveSection("results")
                                  }}
                                  className="flex items-center gap-1 text-green-600 hover:text-green-800 text-sm transition-colors"
                                >
                                  <Video className="w-3 h-3" />
                                  <span className="sr-only">Generate video</span>
                                </button>
                              )}
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleRunInterview(interview)}
                                  className="h-7 w-7 p-0"
                                  title="Rerun interview"
                                >
                                  <RotateCcw className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setSelectedInterview(interview)
                                    setActiveSection("results")
                                  }}
                                  className="h-7 w-7 p-0"
                                  title="View transcript"
                                >
                                  <FileText className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setSelectedInterview(interview)
                                    setActiveSection("results")
                                  }}
                                  className="h-7 w-7 p-0"
                                  title="Generate video prompt"
                                >
                                  <Video className="w-3 h-3" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <VideoModal isOpen={showVideoModal} onClose={handleCloseModal} video={selectedVideo} />
          </div>
        )
      case "personas":
        return <PersonasPage />
      case "interviewers":
        return <InterviewerManager />
      case "interviews":
        return <InterviewRunner onSectionChange={setActiveSection} onInterviewCompleted={handleInterviewCompleted} />
      case "results":
        return <ResultsAnalytics selectedInterview={selectedInterview} />
      case "files":
        return <FileRepository projectId={projectId} />
      default:
        return <div>Section not implemented</div>
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      <ProjectSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        personas={personas}
        interviewers={interviewers}
        interviews={interviews}
        files={files}
        onCreatePersona={handleCreatePersona}
        onEditPersona={handleEditPersona}
        onDeletePersona={handleDeletePersona}
        onCreateInterviewer={handleCreateInterviewer}
        onEditInterviewer={handleEditInterviewer}
        onDeleteInterviewer={handleDeleteInterviewer}
        onRunInterview={handleRunInterview}
        onDuplicateInterview={handleDuplicateInterview}
        onViewInterview={handleViewInterview}
        onUploadFile={handleUploadFile}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">{renderMainContent()}</div>
      </div>
    </div>
  )
}
