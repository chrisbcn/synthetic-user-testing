"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Edit, Plus } from "lucide-react"
import type { Persona } from "@/lib/types"

import { enhancedPersonasData } from "@/lib/enhanced-personas-data"

const transformEnhancedPersona = (enhancedPersona: any): Persona => ({
  id: enhancedPersona.name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, ""),
  projectId: "default-project",
  name: enhancedPersona.name,
  avatar_emoji: enhancedPersona.avatar_emoji,
  persona_type: enhancedPersona.persona_type,
  age: enhancedPersona.age,
  net_worth: enhancedPersona.net_worth,
  annual_spend_fashion: enhancedPersona.annual_spend_fashion,
  intelligence_level: enhancedPersona.intelligence_level,
  location: enhancedPersona.location,
  secondary_residences: enhancedPersona.secondary_residences,
  ethnicity: enhancedPersona.ethnicity,
  wealth_source: enhancedPersona.wealth_source,
  family_background: enhancedPersona.family_background || enhancedPersona.family_wealth_origin,
  career_path: enhancedPersona.career_path,
  personality_profile: enhancedPersona.personality_profile,
  background:
    enhancedPersona.background ||
    `${enhancedPersona.wealth_source}. ${enhancedPersona.personality_profile?.core_traits?.join(", ")}.`,
  keyQuotes: enhancedPersona.key_quotes || [],
  character_bible: enhancedPersona.character_bible,
  physicalTraits: {
    ethnicity: enhancedPersona.ethnicity,
    hairColor: enhancedPersona.character_bible?.visual_dna?.hair,
    eyeColor: enhancedPersona.character_bible?.visual_dna?.eyes,
    build: enhancedPersona.character_bible?.visual_dna?.physical_build,
    style: enhancedPersona.character_bible?.visual_dna?.style_aesthetic,
    accessories: enhancedPersona.character_bible?.signature_elements,
  },
  characterTraits: {
    accent: enhancedPersona.character_bible?.video_mannerisms?.voice_tone,
    speakingStyle: enhancedPersona.character_bible?.video_mannerisms?.speaking_style,
    personality: enhancedPersona.personality_profile?.core_traits?.join(", "),
    socialClass: enhancedPersona.wealth_source,
  },
  videoSettings: {
    setting: enhancedPersona.character_bible?.setting?.primary_location,
    lighting: enhancedPersona.character_bible?.setting?.lighting_style,
    cameraAngle: enhancedPersona.character_bible?.setting?.camera_angles,
    wardrobe: enhancedPersona.character_bible?.signature_elements?.join(", "),
    mood: enhancedPersona.character_bible?.setting?.mood_atmosphere,
  },
  createdAt: new Date(),
  updatedAt: new Date(),
})

const initialPersonas: Persona[] = enhancedPersonasData.personas.map(transformEnhancedPersona)

export function PersonaManager() {
  const [personas, setPersonas] = useState<Persona[]>(initialPersonas)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPersona, setEditingPersona] = useState<Persona | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    avatar_emoji: "", // Updated field name
    persona_type: "", // Updated field name
    age: "",
    location: "",
    annual_spend_fashion: "", // Updated field name
    background: "",
    keyQuotes: "",
    ethnicity: "",
    hairColor: "",
    eyeColor: "",
    build: "",
    style: "",
    accessories: "",
    accent: "",
    speakingStyle: "",
    mannerisms: "",
    personality: "",
    socialClass: "",
    setting: "",
    lighting: "",
    cameraAngle: "",
    wardrobe: "",
    mood: "",
  })

  const handleOpenModal = (persona?: Persona) => {
    if (persona) {
      setEditingPersona(persona)
      setFormData({
        name: persona.name,
        avatar_emoji: persona.avatar_emoji, // Updated field name
        persona_type: persona.persona_type, // Updated field name
        age: persona.age.toString(),
        location: persona.location,
        annual_spend_fashion: persona.annual_spend_fashion || "", // Updated field name
        background: persona.background,
        keyQuotes: persona.keyQuotes.join("\n"),
        ethnicity: persona.physicalTraits?.ethnicity || "",
        hairColor: persona.physicalTraits?.hairColor || "",
        eyeColor: persona.physicalTraits?.eyeColor || "",
        build: persona.physicalTraits?.build || "",
        style: persona.physicalTraits?.style || "",
        accessories: persona.physicalTraits?.accessories?.join(", ") || "",
        accent: persona.characterTraits?.accent || "",
        speakingStyle: persona.characterTraits?.speakingStyle || "",
        mannerisms: persona.characterTraits?.mannerisms?.join(", ") || "",
        personality: persona.characterTraits?.personality || "",
        socialClass: persona.characterTraits?.socialClass || "",
        setting: persona.videoSettings?.setting || "",
        lighting: persona.videoSettings?.lighting || "",
        cameraAngle: persona.videoSettings?.cameraAngle || "",
        wardrobe: persona.videoSettings?.wardrobe || "",
        mood: persona.videoSettings?.mood || "",
      })
    } else {
      setEditingPersona(null)
      setFormData({
        name: "",
        avatar_emoji: "",
        persona_type: "" as Persona["persona_type"],
        age: "",
        location: "",
        annual_spend_fashion: "",
        background: "",
        keyQuotes: "",
        ethnicity: "",
        hairColor: "",
        eyeColor: "",
        build: "",
        style: "",
        accessories: "",
        accent: "",
        speakingStyle: "",
        mannerisms: "",
        personality: "",
        socialClass: "",
        setting: "",
        lighting: "",
        cameraAngle: "",
        wardrobe: "",
        mood: "",
      })
    }
    setIsModalOpen(true)
  }

  const handleSavePersona = () => {
    const personaData: Persona = {
      id: editingPersona?.id || `persona-${Date.now()}`,
      projectId: "default-project",
      name: formData.name,
      avatar_emoji: formData.avatar_emoji, // Updated field name
      persona_type: formData.persona_type, // Updated field name
      age: Number.parseInt(formData.age),
      location: formData.location,
      annual_spend_fashion: formData.annual_spend_fashion, // Updated field name
      background: formData.background,
      keyQuotes: formData.keyQuotes.split("\n").filter((q) => q.trim()),
      physicalTraits: {
        ethnicity: formData.ethnicity || undefined,
        hairColor: formData.hairColor || undefined,
        eyeColor: formData.eyeColor || undefined,
        build: formData.build || undefined,
        style: formData.style || undefined,
        accessories: formData.accessories
          ? formData.accessories
              .split(",")
              .map((a) => a.trim())
              .filter(Boolean)
          : undefined,
      },
      characterTraits: {
        accent: formData.accent || undefined,
        speakingStyle: formData.speakingStyle || undefined,
        mannerisms: formData.mannerisms
          ? formData.mannerisms
              .split(",")
              .map((m) => m.trim())
              .filter(Boolean)
          : undefined,
        personality: formData.personality || undefined,
        socialClass: formData.socialClass || undefined,
      },
      videoSettings: {
        setting: formData.setting || undefined,
        lighting: formData.lighting || undefined,
        cameraAngle: formData.cameraAngle || undefined,
        wardrobe: formData.wardrobe || undefined,
        mood: formData.mood || undefined,
      },
      createdAt: editingPersona?.createdAt || new Date(),
      updatedAt: new Date(),
    }

    if (editingPersona) {
      setPersonas((prev) => prev.map((p) => (p.id === editingPersona.id ? personaData : p)))
    } else {
      setPersonas((prev) => [...prev, personaData])
    }

    setIsModalOpen(false)
    setEditingPersona(null)
  }

  const handleDeletePersona = (id: string) => {
    setPersonas((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <Card className="bg-white border-slate-200">
      {" "}
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center text-white font-bold">
              👥
            </div>
            Enhanced Luxury Fashion Personas ({personas.length}) {/* Updated title */}
          </CardTitle>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-slate-700 hover:bg-slate-800" onClick={() => handleOpenModal()}>
                <Plus className="w-4 h-4 mr-2" />
                Add New Persona
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingPersona ? "Edit Persona" : "Add New Persona"}</DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">👤 Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g. Sarah Johnson"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="avatar_emoji">Avatar Emoji</Label> {/* Updated field name */}
                      <Input
                        id="avatar_emoji"
                        value={formData.avatar_emoji}
                        onChange={(e) => setFormData((prev) => ({ ...prev, avatar_emoji: e.target.value }))}
                        placeholder="👑"
                        maxLength={2}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="persona_type">Persona Type</Label> {/* Updated field name */}
                    <Select
                      value={formData.persona_type}
                      onValueChange={(value: string) => setFormData((prev) => ({ ...prev, persona_type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ultra-HNW Collector - Old Money">Ultra-HNW Collector - Old Money</SelectItem>
                        <SelectItem value="Strategic Builder - New Money">Strategic Builder - New Money</SelectItem>
                        <SelectItem value="Traditional Luxury - Professional Earner">
                          Traditional Luxury - Professional Earner
                        </SelectItem>
                        <SelectItem value="Nepotism Baby - Doesn't Work">Nepotism Baby - Doesn't Work</SelectItem>
                        <SelectItem value="Trophy Wife - Married Into Money">
                          Trophy Wife - Married Into Money
                        </SelectItem>
                        <SelectItem value="High-Earning Professional - Self-Made">
                          High-Earning Professional - Self-Made
                        </SelectItem>
                        <SelectItem value="Old Money Heir - Male Perspective">
                          Old Money Heir - Male Perspective
                        </SelectItem>
                        <SelectItem value="Digital Native Luxury - Gen Z Influence">
                          Digital Native Luxury - Gen Z Influence
                        </SelectItem>
                        <SelectItem value="Divorce Settlement Wealth - Rebuilding Identity">
                          Divorce Settlement Wealth - Rebuilding Identity
                        </SelectItem>
                        <SelectItem value="Private Equity Success - International Wealth">
                          Private Equity Success - International Wealth
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Demographics */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">📊 Demographics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData((prev) => ({ ...prev, age: e.target.value }))}
                        placeholder="35"
                        min="18"
                        max="80"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="annual_spend_fashion">Annual Fashion Spend</Label> {/* Updated field name */}
                      <Input
                        id="annual_spend_fashion"
                        value={formData.annual_spend_fashion}
                        onChange={(e) => setFormData((prev) => ({ ...prev, annual_spend_fashion: e.target.value }))}
                        placeholder="$150K"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                      placeholder="Manhattan, NY"
                    />
                  </div>
                </div>

                {/* Physical Traits */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">🎭 Physical Traits (for Video)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ethnicity">Ethnicity</Label>
                      <Input
                        id="ethnicity"
                        value={formData.ethnicity}
                        onChange={(e) => setFormData((prev) => ({ ...prev, ethnicity: e.target.value }))}
                        placeholder="e.g. Caucasian, Asian-American"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hairColor">Hair Color</Label>
                      <Input
                        id="hairColor"
                        value={formData.hairColor}
                        onChange={(e) => setFormData((prev) => ({ ...prev, hairColor: e.target.value }))}
                        placeholder="e.g. Blonde, Dark brown"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eyeColor">Eye Color</Label>
                      <Input
                        id="eyeColor"
                        value={formData.eyeColor}
                        onChange={(e) => setFormData((prev) => ({ ...prev, eyeColor: e.target.value }))}
                        placeholder="e.g. Blue, Brown"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="build">Build/Physique</Label>
                      <Input
                        id="build"
                        value={formData.build}
                        onChange={(e) => setFormData((prev) => ({ ...prev, build: e.target.value }))}
                        placeholder="e.g. Tall and elegant, Petite"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="style">Style Description</Label>
                    <Input
                      id="style"
                      value={formData.style}
                      onChange={(e) => setFormData((prev) => ({ ...prev, style: e.target.value }))}
                      placeholder="e.g. Classic luxury, Modern minimalist"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accessories">Accessories (comma-separated)</Label>
                    <Input
                      id="accessories"
                      value={formData.accessories}
                      onChange={(e) => setFormData((prev) => ({ ...prev, accessories: e.target.value }))}
                      placeholder="e.g. Hermès scarf, Cartier watch, Pearl earrings"
                    />
                  </div>
                </div>

                {/* Character Traits */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">🗣️ Character Traits (for Video)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="accent">Accent/Speech Pattern</Label>
                      <Input
                        id="accent"
                        value={formData.accent}
                        onChange={(e) => setFormData((prev) => ({ ...prev, accent: e.target.value }))}
                        placeholder="e.g. British accent, Southern drawl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="speakingStyle">Speaking Style</Label>
                      <Input
                        id="speakingStyle"
                        value={formData.speakingStyle}
                        onChange={(e) => setFormData((prev) => ({ ...prev, speakingStyle: e.target.value }))}
                        placeholder="e.g. Articulate and measured, Quick and analytical"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mannerisms">Mannerisms (comma-separated)</Label>
                    <Input
                      id="mannerisms"
                      value={formData.mannerisms}
                      onChange={(e) => setFormData((prev) => ({ ...prev, mannerisms: e.target.value }))}
                      placeholder="e.g. Hand gestures when passionate, Thoughtful pauses"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="personality">Personality</Label>
                      <Input
                        id="personality"
                        value={formData.personality}
                        onChange={(e) => setFormData((prev) => ({ ...prev, personality: e.target.value }))}
                        placeholder="e.g. Confident and discerning"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="socialClass">Social Class</Label>
                      <Input
                        id="socialClass"
                        value={formData.socialClass}
                        onChange={(e) => setFormData((prev) => ({ ...prev, socialClass: e.target.value }))}
                        placeholder="e.g. Ultra-high net worth, Professional class"
                      />
                    </div>
                  </div>
                </div>

                {/* Video Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">🎬 Video Settings</h3>
                  <div className="space-y-2">
                    <Label htmlFor="setting">Setting/Background</Label>
                    <Input
                      id="setting"
                      value={formData.setting}
                      onChange={(e) => setFormData((prev) => ({ ...prev, setting: e.target.value }))}
                      placeholder="e.g. Elegant living room, Modern patio"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lighting">Lighting</Label>
                      <Input
                        id="lighting"
                        value={formData.lighting}
                        onChange={(e) => setFormData((prev) => ({ ...prev, lighting: e.target.value }))}
                        placeholder="e.g. Soft natural light, Bright morning sun"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cameraAngle">Camera Angle</Label>
                      <Input
                        id="cameraAngle"
                        value={formData.cameraAngle}
                        onChange={(e) => setFormData((prev) => ({ ...prev, cameraAngle: e.target.value }))}
                        placeholder="e.g. Slight upward angle, Eye level"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="wardrobe">Wardrobe</Label>
                      <Input
                        id="wardrobe"
                        value={formData.wardrobe}
                        onChange={(e) => setFormData((prev) => ({ ...prev, wardrobe: e.target.value }))}
                        placeholder="e.g. Tailored blazer, Trendy casual wear"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mood">Overall Mood</Label>
                      <Input
                        id="mood"
                        value={formData.mood}
                        onChange={(e) => setFormData((prev) => ({ ...prev, mood: e.target.value }))}
                        placeholder="e.g. Sophisticated and authoritative, Confident and analytical"
                      />
                    </div>
                  </div>
                </div>

                {/* Personality & Background */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">🧠 Personality & Background</h3>
                  <div className="space-y-2">
                    <Label htmlFor="background">Background & Personality</Label>
                    <Textarea
                      id="background"
                      value={formData.background}
                      onChange={(e) => setFormData((prev) => ({ ...prev, background: e.target.value }))}
                      placeholder="Describe their background, values, motivations, and personality traits..."
                      className="min-h-[100px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="keyQuotes">Key Quotes (one per line)</Label>
                    <Textarea
                      id="keyQuotes"
                      value={formData.keyQuotes}
                      onChange={(e) => setFormData((prev) => ({ ...prev, keyQuotes: e.target.value }))}
                      placeholder="Enter key quotes that represent this persona's voice..."
                      className="min-h-[100px]"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSavePersona} className="bg-slate-600 hover:bg-slate-700">
                    {editingPersona ? "Update Persona" : "Save Persona"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {personas.length === 0 ? (
          <div className="text-center py-12 text-slate-600">
            <div className="text-4xl mb-4">👤</div>
            <h3 className="text-xl font-semibold mb-2">No personas created yet</h3>
            <p className="mb-6">Create your first luxury fashion persona to get started</p>
            <Button className="bg-slate-600 hover:bg-slate-700" onClick={() => handleOpenModal()}>
              Create First Persona
            </Button>
          </div>
        ) : (
          <div className="rounded-lg border border-slate-200 overflow-hidden">
            {" "}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="w-12"></TableHead>
                    <TableHead className="font-semibold min-w-[150px]">Name</TableHead>
                    <TableHead className="font-semibold min-w-[120px]">Type</TableHead>
                    <TableHead className="font-semibold min-w-[120px]">Location</TableHead>
                    <TableHead className="font-semibold w-16">Age</TableHead>
                    <TableHead className="font-semibold min-w-[100px]">Annual Spend</TableHead>
                    <TableHead className="w-20 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {personas.map((persona) => (
                    <TableRow key={persona.id} className="hover:bg-slate-50 transition-colors">
                      <TableCell>
                        <span className="text-2xl">{persona.avatar_emoji}</span> {/* Updated field name */}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-slate-900">{persona.name}</div>
                          {persona.keyQuotes.length > 0 && (
                            <div className="text-xs text-slate-500 mt-1 italic max-w-[200px] truncate">
                              "{persona.keyQuotes[0]}"
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs whitespace-nowrap">
                          {persona.persona_type} {/* Updated field name */}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-slate-600 truncate block max-w-[120px]">{persona.location}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">{persona.age}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium text-green-700 whitespace-nowrap">
                          {persona.annual_spend_fashion} {/* Updated field name */}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 justify-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenModal(persona)}
                            className="h-8 w-8 p-0 hover:bg-slate-100"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePersona(persona.id)}
                            className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
