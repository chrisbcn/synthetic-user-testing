"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2, User, MapPin, Briefcase } from "lucide-react"
import type { InterviewerPersona } from "@/lib/types"

const defaultInterviewers: InterviewerPersona[] = [
  {
    id: "sophia-chen-laurent",
    name: "Sophia Chen-Laurent",
    avatar_emoji: "👗",
    specialization: "Luxury Fashion & Consumer Psychology",
    age: 34,
    location: "New York City",
    background: "Former Condé Nast fashion editor turned UX researcher specializing in luxury consumer behavior",
    education: "BA Fashion Journalism (Parsons), MS Consumer Psychology (Columbia)",
    experience_years: 8,
    previous_roles: [
      "Senior Fashion Editor at Vogue",
      "Consumer Insights Lead at LVMH Digital",
      "UX Researcher at luxury e-commerce startups",
    ],
    expertise: [
      "Luxury consumer psychology",
      "Fashion industry dynamics",
      "High-net-worth consumer behavior",
      "Digital luxury experiences",
      "Wardrobe psychology and styling",
      "Brand relationship dynamics",
    ],
    interview_style:
      "Empathetic and sophisticated, naturally speaks luxury fashion language, never judges spending levels",
    personality: "Culturally fluent in luxury, warm but professional, genuinely curious about personal style stories",
    best_for_projects: [
      "Luxury fashion platforms",
      "High-end retail experiences",
      "Personal styling applications",
      "Wardrobe management tools",
      "Brand loyalty research",
    ],
    key_strengths: [
      "Understands luxury pricing without judgment",
      "Speaks fluent fashion terminology",
      "Recognizes brand hierarchies and heritage",
      "Expert in styling psychology",
      "Comfortable with HNW discussions",
    ],
    sample_questions: [
      "Tell me about your relationship with your personal advisor at [Brand] - how has that evolved over time?",
      "When you're getting ready for an important event, walk me through your process for selecting pieces from your collection.",
      "How do you decide when a piece has earned its place in your wardrobe versus when it might be time to move it on?",
    ],
    background_notes:
      "Grew up in luxury retail family, understands both editorial and commercial sides of fashion. Has personal relationships with luxury brand executives. Genuinely passionate about how people express identity through clothing choices.",
  },
  {
    id: "marcus-rodriguez",
    name: "Marcus Rodriguez",
    avatar_emoji: "📊",
    specialization: "Fintech & Wealth Management UX",
    age: 31,
    location: "San Francisco",
    background:
      "Former Goldman Sachs analyst turned product manager, now specializes in luxury fintech and wealth management applications",
    education: "MBA Wharton, BS Economics Stanford",
    experience_years: 6,
    previous_roles: [
      "Investment Banking Analyst at Goldman Sachs",
      "Product Manager at wealth management fintech",
      "Senior UX Researcher at luxury marketplace platforms",
    ],
    expertise: [
      "Wealth management psychology",
      "High-net-worth digital behavior",
      "Investment mindset application to luxury goods",
      "Financial services UX patterns",
      "Business model validation",
      "ROI-focused consumer decision making",
    ],
    interview_style:
      "Data-driven but empathetic, speaks business language fluently, understands wealth accumulation mindsets",
    personality: "Analytical yet warm, respects financial success, curious about investment psychology in luxury",
    best_for_projects: [
      "Wealth management platforms",
      "Investment tracking applications",
      "Luxury asset management",
      "Strategic purchase planning tools",
      "Financial services for HNW individuals",
    ],
    key_strengths: [
      "Comfortable discussing large financial amounts",
      "Understands investment psychology",
      "Speaks wealth management language",
      "Expert in ROI and analytics mindset",
      "Bridges business and consumer perspectives",
    ],
    sample_questions: [
      "How do you think about ROI when building your luxury wardrobe - is it financial, emotional, or both?",
      "Walk me through your decision-making process for a significant luxury purchase - what factors do you weigh?",
      "How important is tracking cost-per-wear or similar metrics in your approach to wardrobe investment?",
    ],
    background_notes:
      "Comes from entrepreneurial family, understands both earning and spending significant wealth. Personally invests in luxury items as alternative assets. Genuinely interested in how successful people approach strategic spending.",
  },
  {
    id: "isabella-montgomery",
    name: "Isabella Montgomery",
    avatar_emoji: "🎨",
    specialization: "Design Psychology & Creative Platforms",
    age: 29,
    location: "London",
    background:
      "Royal College of Art graduate with deep expertise in design psychology and creative decision-making processes",
    education: "MA Design Psychology (RCA), BA Psychology (Oxford)",
    experience_years: 5,
    previous_roles: [
      "Design Researcher at IDEO",
      "Creative Psychology Consultant for luxury brands",
      "UX Researcher for creative professional tools",
    ],
    expertise: [
      "Design decision psychology",
      "Creative process research",
      "Aesthetic preference formation",
      "Visual communication psychology",
      "Style development patterns",
      "Cultural influences on taste",
    ],
    interview_style: "Curious and non-judgmental, excellent at understanding aesthetic choices and creative processes",
    personality: "Intellectually curious, culturally sophisticated, genuinely fascinated by how people develop taste",
    best_for_projects: [
      "Creative software platforms",
      "Design collaboration tools",
      "Style discovery applications",
      "Visual search and curation",
      "Aesthetic preference engines",
    ],
    key_strengths: [
      "Deep understanding of aesthetic psychology",
      "Expert in visual decision-making",
      "Comfortable with creative professional workflows",
      "Strong cultural literacy across design fields",
      "Excellent at uncovering design motivations",
    ],
    sample_questions: [
      "How has your personal aesthetic evolved over time, and what influences have shaped that journey?",
      "When you're styling an outfit, what's the creative process like - is it intuitive or more systematic?",
      "How do you decide what 'works' visually when you're combining different pieces?",
    ],
    background_notes:
      "Comes from family of artists and designers, natural understanding of creative processes. Has worked with luxury brands on design psychology. Genuinely passionate about the intersection of psychology and aesthetics.",
  },
  {
    id: "david-kim",
    name: "David Kim",
    avatar_emoji: "⚙️",
    specialization: "Enterprise SaaS & B2B Tools",
    age: 36,
    location: "Seattle",
    background:
      "Former Microsoft product manager specializing in enterprise tools and workflow optimization for professional users",
    education: "MS Computer Science (Carnegie Mellon), MBA (Kellogg)",
    experience_years: 10,
    previous_roles: [
      "Senior Product Manager at Microsoft (Office Suite)",
      "UX Research Lead at Salesforce",
      "Enterprise software consultant",
    ],
    expertise: [
      "Professional workflow optimization",
      "Enterprise user behavior",
      "B2B tool adoption patterns",
      "Productivity software design",
      "Professional efficiency psychology",
      "Team collaboration dynamics",
    ],
    interview_style: "Systematic and thorough, excellent at understanding professional workflows and efficiency needs",
    personality: "Process-oriented, respectful of professional expertise, curious about workflow optimization",
    best_for_projects: [
      "Professional styling tools",
      "Brand advisor platforms",
      "Client management systems",
      "Professional service applications",
      "B2B luxury tools",
    ],
    key_strengths: [
      "Expert in professional workflow analysis",
      "Strong understanding of B2B user needs",
      "Excellent at identifying efficiency opportunities",
      "Comfortable with complex professional tools",
      "Deep knowledge of enterprise adoption patterns",
    ],
    sample_questions: [
      "Walk me through your typical workflow when working with a new client - what tools and processes do you rely on?",
      "What are the biggest inefficiencies in your current styling process that you wish technology could solve?",
      "How do you manage client relationships and preferences across your entire client base?",
    ],
    background_notes:
      "Has worked extensively with professional service providers. Understands the needs of consultants, advisors, and service professionals. Genuinely interested in how technology can enhance rather than replace human expertise.",
  },
  {
    id: "amara-osei",
    name: "Amara Osei",
    avatar_emoji: "🌍",
    specialization: "Global Market Research & Cultural Psychology",
    age: 33,
    location: "Lagos/London (splits time)",
    background: "International consultant specializing in luxury market expansion and cross-cultural consumer behavior",
    education: "PhD Cultural Psychology (LSE), MA International Business (INSEAD)",
    experience_years: 7,
    previous_roles: [
      "Senior Consultant at McKinsey (Consumer Goods)",
      "Cultural Research Lead for global luxury brands",
      "International market researcher for fashion conglomerates",
    ],
    expertise: [
      "Cross-cultural consumer psychology",
      "Emerging luxury market dynamics",
      "Cultural adaptation of luxury brands",
      "International user research methods",
      "Socioeconomic factors in luxury consumption",
      "Global fashion market trends",
    ],
    interview_style: "Culturally sensitive and globally minded, excellent at understanding diverse luxury perspectives",
    personality: "Globally sophisticated, culturally curious, respectful of different approaches to luxury",
    best_for_projects: [
      "Global luxury platform expansion",
      "Cross-cultural user research",
      "Emerging market studies",
      "Cultural adaptation research",
      "International luxury commerce",
    ],
    key_strengths: [
      "Deep understanding of global luxury markets",
      "Expert in cultural sensitivity",
      "Strong grasp of emerging market dynamics",
      "Multilingual research capabilities",
      "Excellent at identifying cultural nuances",
    ],
    sample_questions: [
      "How do cultural expectations around luxury differ between your professional and personal contexts?",
      "What role does luxury play in expressing cultural identity for you and your community?",
      "How do you navigate between global luxury trends and maintaining your cultural authenticity?",
    ],
    background_notes:
      "Has lived and worked across multiple continents. Deep understanding of how luxury functions differently across cultures. Particularly strong in African, European, and Asian luxury markets. Passionate about inclusive luxury experiences.",
  },
]

export default function InterviewerManager() {
  const [interviewers, setInterviewers] = useState<InterviewerPersona[]>(defaultInterviewers)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingInterviewer, setEditingInterviewer] = useState<InterviewerPersona | null>(null)
  const [newInterviewer, setNewInterviewer] = useState<Partial<InterviewerPersona>>({
    name: "",
    avatar_emoji: "👤",
    specialization: "",
    age: 30,
    location: "",
    background: "",
    education: "",
    experience_years: 0,
    previous_roles: [],
    expertise: [],
    interview_style: "",
    personality: "",
    best_for_projects: [],
    key_strengths: [],
    sample_questions: [],
    background_notes: "",
  })

  const handleCreateInterviewer = () => {
    if (newInterviewer.name && newInterviewer.specialization) {
      const interviewer: InterviewerPersona = {
        id: newInterviewer.name.toLowerCase().replace(/\s+/g, "-"),
        name: newInterviewer.name,
        avatar_emoji: newInterviewer.avatar_emoji || "👤",
        specialization: newInterviewer.specialization,
        age: newInterviewer.age || 30,
        location: newInterviewer.location || "",
        background: newInterviewer.background || "",
        education: newInterviewer.education || "",
        experience_years: newInterviewer.experience_years || 0,
        previous_roles: newInterviewer.previous_roles || [],
        expertise: newInterviewer.expertise || [],
        interview_style: newInterviewer.interview_style || "",
        personality: newInterviewer.personality || "",
        best_for_projects: newInterviewer.best_for_projects || [],
        key_strengths: newInterviewer.key_strengths || [],
        sample_questions: newInterviewer.sample_questions || [],
        background_notes: newInterviewer.background_notes || "",
      }
      setInterviewers([...interviewers, interviewer])
      setNewInterviewer({
        name: "",
        avatar_emoji: "👤",
        specialization: "",
        age: 30,
        location: "",
        background: "",
        education: "",
        experience_years: 0,
        previous_roles: [],
        expertise: [],
        interview_style: "",
        personality: "",
        best_for_projects: [],
        key_strengths: [],
        sample_questions: [],
        background_notes: "",
      })
      setIsCreateDialogOpen(false)
    }
  }

  const handleDeleteInterviewer = (id: string) => {
    setInterviewers(interviewers.filter((interviewer) => interviewer.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Interviewer Personas</h2>
          <p className="text-gray-600">Manage your research interviewer profiles and specializations</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Interviewer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Interviewer</DialogTitle>
              <DialogDescription>Add a new interviewer persona with their expertise and background</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newInterviewer.name}
                    onChange={(e) => setNewInterviewer({ ...newInterviewer, name: e.target.value })}
                    placeholder="Dr. Sarah Johnson"
                  />
                </div>
                <div>
                  <Label htmlFor="avatar">Avatar Emoji</Label>
                  <Input
                    id="avatar"
                    value={newInterviewer.avatar_emoji}
                    onChange={(e) => setNewInterviewer({ ...newInterviewer, avatar_emoji: e.target.value })}
                    placeholder="👤"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  value={newInterviewer.specialization}
                  onChange={(e) => setNewInterviewer({ ...newInterviewer, specialization: e.target.value })}
                  placeholder="Luxury Fashion & Consumer Psychology"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={newInterviewer.age}
                    onChange={(e) => setNewInterviewer({ ...newInterviewer, age: Number.parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newInterviewer.location}
                    onChange={(e) => setNewInterviewer({ ...newInterviewer, location: e.target.value })}
                    placeholder="New York City"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="background">Background</Label>
                <Textarea
                  id="background"
                  value={newInterviewer.background}
                  onChange={(e) => setNewInterviewer({ ...newInterviewer, background: e.target.value })}
                  placeholder="Brief professional background..."
                />
              </div>
              <div>
                <Label htmlFor="interview_style">Interview Style</Label>
                <Textarea
                  id="interview_style"
                  value={newInterviewer.interview_style}
                  onChange={(e) => setNewInterviewer({ ...newInterviewer, interview_style: e.target.value })}
                  placeholder="Empathetic and sophisticated, naturally speaks luxury fashion language..."
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateInterviewer}>Create Interviewer</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {interviewers.map((interviewer) => (
          <Card key={interviewer.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{interviewer.avatar_emoji}</div>
                  <div>
                    <CardTitle className="text-lg">{interviewer.name}</CardTitle>
                    <CardDescription className="text-sm">{interviewer.specialization}</CardDescription>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm" onClick={() => setEditingInterviewer(interviewer)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteInterviewer(interviewer.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{interviewer.age} years old</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{interviewer.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Briefcase className="w-4 h-4" />
                <span>{interviewer.experience_years} years experience</span>
              </div>

              <div>
                <p className="text-sm text-gray-700 line-clamp-3">{interviewer.background}</p>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-2">Key Expertise</h4>
                <div className="flex flex-wrap gap-1">
                  {interviewer.expertise.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {interviewer.expertise.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{interviewer.expertise.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-2">Best For</h4>
                <div className="flex flex-wrap gap-1">
                  {interviewer.best_for_projects.slice(0, 2).map((project, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {project}
                    </Badge>
                  ))}
                  {interviewer.best_for_projects.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{interviewer.best_for_projects.length - 2} more
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
