"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChevronDown,
  ChevronUp,
  User,
  MapPin,
  DollarSign,
  Calendar,
  Briefcase,
  Heart,
  Zap,
  Target,
  Upload,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import enhancedPersonasData from "@/data/enhanced-personas.json"

const personaBios = {
  "Sophia Harrington":
    "Sophia Harrington represents the pinnacle of old money sophistication, a 52-year-old fourth-generation heiress whose family's $120M shipping fortune has been carefully cultivated and expanded over decades. Born into privilege but shaped by expectation, Sophia transformed what could have been a life of leisure into a formidable business empire through strategic thinking and unwavering discipline. Her Harvard MBA and tenure at Goldman Sachs weren't family obligations but personal choices that proved her worth beyond her surname.\n\nNow splitting time between her meticulously appointed Upper East Side residence and sprawling Hamptons estate, Sophia embodies the rare combination of inherited grace and earned respect that defines true American aristocracy. Her approach to luxury reflects generations of refined taste—she invests in pieces that whisper rather than shout, understanding that true quality speaks for itself. From her coveted Hermès collection, acquired through decades-long relationships with the brand, to her preference for Brunello Cucinelli's understated cashmere, every purchase reflects careful consideration and timeless appeal.\n\nSophia's daily routine balances competitive drive with cultural refinement: morning tennis at the club, afternoon board meetings for her various philanthropic endeavors, and evenings spent at gallery openings or intimate dinner parties where conversation flows as smoothly as the vintage wine. Despite her privileged background, she earned her success through strategic thinking and business acumen, making her both formidable in boardrooms and respected in social circles.\n\nHer shopping philosophy mirrors her life approach—measured, thoughtful, and focused on long-term value rather than momentary trends. She believes luxury should enhance life's experiences rather than define them, preferring pieces that serve multiple purposes across her varied social and professional obligations. This practical elegance extends to her relationships with luxury brands, where she values personal service and historical craftsmanship over flashy marketing or celebrity endorsements.",

  "Emma Rodriguez":
    "Emma Rodriguez embodies the new generation of self-made tech wealth, a 29-year-old Mexican-American entrepreneur whose $8M fortune represents the American dream realized through strategic thinking, relentless work ethic, and technological innovation. Growing up in a working-class family in San Antonio, Emma learned early that success required both intelligence and determination—qualities that propelled her through engineering school and into the competitive world of Silicon Valley.\n\nHer journey from Google engineer to successful fintech startup founder wasn't just about coding skills; it required navigating cultural expectations, gender bias, and the complex dynamics of venture capital while staying true to her values and vision. Now living in West Hollywood, Emma approaches the luxury market with the same analytical mindset that drove her business success, researching every purchase like an investment opportunity and seeking pieces that offer versatility, quality, and long-term value.\n\nHer style evolution reflects her personal journey from startup casual to sophisticated professional, carefully mixing emerging luxury brands with quality basics to create a wardrobe that works across her varied professional and social obligations. Emma's shopping psychology is deeply influenced by her background—she understands the value of money because she's earned every dollar, leading her to seek pieces that justify their cost through superior craftsmanship, versatility, and durability.\n\nShe gravitates toward brands that share her values of innovation and authenticity, preferring companies with strong ethical practices and diverse leadership. Her West Hollywood home serves as both sanctuary and workspace, filled with carefully chosen pieces that reflect her journey and aspirations. Emma represents the data-driven luxury consumer who wants to understand the ROI of every fashion decision, but she's also learning to appreciate the emotional and cultural value of beautiful things.",

  "Margaret Chen":
    "Margaret Chen exemplifies traditional luxury earned through professional excellence, a 45-year-old Chinese-American legal powerhouse whose $15M fortune represents decades of 70-hour weeks, strategic career moves, and unwavering commitment to excellence in one of the world's most demanding professions. As a corporate law partner at a prestigious San Francisco firm, Margaret navigates complex international deals while balancing family obligations that include caring for aging parents and raising her teenage daughter—a delicate dance that requires both professional authority and personal grace.\n\nHer Pacific Heights home reflects her conservative luxury philosophy, filled with quality pieces from heritage brands like Chanel and Hermès, purchased through long-standing relationships with personal shoppers who understand her need for discretion and efficiency. Margaret's approach to fashion mirrors her legal precision: every piece must serve multiple purposes, transitioning seamlessly from courtroom authority to charity gala elegance, from client dinners to parent-teacher conferences.\n\nHer shopping habits reflect the time constraints of her demanding career—she relies on trusted advisors and established relationships rather than browsing or experimenting with new brands. Privacy and traditional service remain non-negotiable as she navigates her complex professional and personal responsibilities. Margaret's style evolution has been shaped by her understanding that in law, appearance communicates competence before she even speaks, leading her to invest in pieces that project authority, sophistication, and cultural sensitivity across diverse professional contexts.\n\nHer wardrobe serves as professional armor, carefully chosen to command respect in male-dominated boardrooms while honoring her cultural heritage and personal aesthetic. The pressure of representing both her firm and her community in high-stakes negotiations has taught her that luxury isn't about personal indulgence but about projecting the confidence and competence that clients expect from someone handling billion-dollar deals.",

  "Isabella Vandenberg-Chen":
    "Isabella Vandenberg-Chen represents the complex reality of inherited privilege, a 26-year-old mixed Dutch-Taiwanese heiress whose $45M trust fund provides unlimited financial freedom while creating existential questions about purpose, identity, and authentic self-expression. Born into a world where money was never a consideration, Isabella has spent her adult years grappling with the weight of unearned advantage and the challenge of finding meaningful direction in a life without traditional constraints.\n\nHer Tribeca loft, surrounded by gallery-quality art and designer furniture, serves as both sanctuary and gilded cage—a beautiful space that sometimes feels disconnected from the real world where most people struggle with basic financial security. Isabella's shopping habits reflect this internal conflict: she buys impulsively when something catches her eye, but increasingly questions the meaning behind her purchases and their impact on both her personal growth and the broader world.\n\nDespite her advantages, Isabella demonstrates genuine sophistication through her art history education from Columbia and her fluency in multiple cultures, languages, and social contexts—skills that could translate into meaningful work if she can overcome her uncertainty about her place in the world. Her current relationship with contemporary artist Marcus, whom her parents disapprove of due to his working-class background, represents her ongoing struggle to define herself beyond family expectations and social conventions.\n\nIsabella's approach to luxury is evolving from unconscious consumption toward more thoughtful consideration of how her choices reflect her values and aspirations. She's drawn to emerging designers and sustainable brands, seeing her purchasing power as a way to support creativity and positive change rather than simply acquiring beautiful objects. The challenge for Isabella lies in translating her advantages into meaningful contribution while maintaining her authentic self in a world that often sees her only as a wealthy heiress rather than a complex individual with her own dreams and struggles.",

  "Tiffany Morrison-Kellerman":
    "Tiffany Morrison-Kellerman represents the ambitious climb into ultra-high society, a 38-year-old African-American woman whose marriage to tech billionaire Richard Kellerman catapulted her from middle-class Detroit roots into Beverly Hills social circles where $200M+ provides access but not automatic acceptance. Her background as a pharmaceutical sales rep gave her street smarts, work ethic, and relationship-building skills that many old money wives lack, but these same qualities sometimes work against her in environments where effortless privilege is valued over earned success.\n\nEvery outfit serves as armor in her ongoing battle for social acceptance, carefully chosen to signal belonging while maintaining her authentic self—a delicate balance that requires constant navigation of unspoken rules and subtle hierarchies. Tiffany's shopping psychology reflects her determination to prove worthiness through visible success, leading her to invest in recognizable luxury pieces that photograph well and command immediate respect, using fashion as both shield and statement in her quest for social legitimacy.\n\nHer Beverly Hills mansion serves as both home and stage, where she hosts charity events and dinner parties designed to build relationships and establish her place in philanthropic circles. The constant scrutiny she faces as a Black woman in predominantly white elite spaces has taught her that every choice—from handbag to hairstyle—will be analyzed and judged, making her approach to luxury both strategic and deeply personal.\n\nTiffany's relationship with her husband's wealth is complicated by her own success and independence; she contributed significantly to their early relationship and continues to pursue her own business interests, refusing to be seen merely as a trophy wife. The pressure of representing both her family and her community in high-profile social situations has made her acutely aware of fashion's communicative power, leading her to work with stylists and image consultants who understand the nuanced requirements of her position.",

  "Dr. Priya Mehta":
    "Dr. Priya Mehta represents the intersection of medical excellence and emerging wealth, a 41-year-old Indian-American plastic surgeon whose $12M fortune flows from surgical precision, entrepreneurial vision, and the deep satisfaction of helping patients achieve their aesthetic goals while building a thriving practice. As a first-generation wealth creator whose father drove a cab in Queens to support her medical education, every purchase reflects her journey from working-class immigrant family to professional success—a transformation that required not just academic excellence but cultural navigation and unwavering determination.\n\nHer Upper West Side practice demands clothes that transition seamlessly from surgery to business meetings, leading her to invest in quality pieces that work as hard as she does while projecting the competence and sophistication that patients expect from someone performing complex procedures. Priya's approach to luxury mirrors her medical training—methodical, research-driven, and focused on long-term value rather than momentary trends or status symbols.\n\nShe seeks efficiency and quality over flash, building a wardrobe that supports her demanding 12-hour days while honoring her family's sacrifices and cultural heritage. Her shopping philosophy reflects the practical mindset that enabled her success: every piece must justify its cost through superior performance, versatility, and durability, whether she's consulting with patients, attending medical conferences, or participating in the cultural events that connect her to both her professional community and Indian-American heritage.\n\nThe pressure of running a successful practice while maintaining work-life balance has taught her to value pieces that simplify her daily routine without compromising her professional image. Priya's relationship with luxury is deeply influenced by her understanding of value—having worked for everything she owns, she appreciates quality craftsmanship and ethical business practices while remaining mindful of the financial struggles her family overcame.",

  "James Alexander Pemberton III":
    "James Alexander Pemberton III embodies effortless WASP privilege, a 34-year-old fifth-generation Boston Brahmin whose $85M fortune flows from textile mills, banking heritage, and the kind of generational wealth that shapes worldview from birth. His approach to luxury reflects centuries of understated confidence—quality pieces that last decades, purchased from the same brands his grandfather wore, representing a continuity of taste and values that transcends momentary fashion trends.\n\nLiving in Back Bay while managing the family hedge fund, James represents traditional masculine luxury focused on function over fashion, where every piece serves a purpose rooted in the activities that define his social class: tennis at the country club, sailing in Nantucket, business meetings in mahogany-paneled offices, and charity galas where old Boston families gather to support causes their ancestors established.\n\nHis wardrobe centers on these needs, with Brooks Brothers blazers and Ralph Lauren classics forming the foundation of a style philosophy that values heritage over innovation, quality over quantity, and discretion over display. Despite his privileged background, James shows genuine appreciation for craftsmanship and tradition, believing the best luxury whispers rather than shouts while maintaining the athletic confidence that comes from a lifetime of country club sports and Ivy League education.\n\nHis shopping habits reflect generational wisdom about value and longevity—he invests in pieces from established brands with proven track records, often purchasing from the same stores his family has patronized for decades. The pressure of managing family wealth and maintaining social position has taught him that appearance communicates competence and continuity, leading him to choose pieces that project stability and trustworthiness to both clients and peers.",

  "Luna Zhao-Williams":
    "Luna Zhao-Williams represents the evolution of luxury influence, a 24-year-old Chinese-American digital native whose $15M empire flows from authentic content creation, strategic business investments, and a deep understanding of how luxury culture is changing in the social media age. Unlike typical influencers who simply showcase wealth, Luna focuses on educating her 500K followers about luxury heritage, craftsmanship stories, and the cultural significance of beautiful objects—creating content that bridges Eastern and Western luxury markets with genuine sophistication and cultural sensitivity.\n\nHer SoHo loft serves as both home and content studio, where she creates videos that explore the intersection of tradition and innovation in luxury goods, from Japanese textile techniques to Italian leather craftsmanship, always emphasizing the human stories behind beautiful objects. Luna's approach to fashion reflects her generation's values—sustainability-conscious, education-focused, and authentically curious about the stories behind each piece rather than simply their status value or aesthetic appeal.\n\nShe invests in fewer, better items that hold both monetary and cultural value, using her platform to promote genuine appreciation for luxury craftsmanship over superficial status symbols or trend-driven consumption. Her shopping philosophy centers on supporting brands that align with her values of transparency, sustainability, and cultural respect, often featuring emerging designers alongside established houses to show her audience the full spectrum of luxury creativity.\n\nThe responsibility of influencing purchasing decisions for hundreds of thousands of followers has made Luna acutely aware of her impact, leading her to research brands thoroughly and only promote pieces she genuinely believes in and would purchase herself. Her bicultural background gives her unique insight into how luxury is perceived and valued across different cultures, allowing her to create content that resonates with diverse audiences while maintaining authenticity and respect for cultural traditions.",

  "Victoria Blackstone-Morrison":
    "Victoria Blackstone-Morrison embodies resilience and reinvention, a 47-year-old Georgetown lawyer whose $95M divorce settlement represents both an ending and a beginning—the conclusion of a 20-year marriage that defined her social identity and the start of a journey toward rediscovering who she is beyond the role of political wife and mother. Her approach to luxury reflects this transformation, moving from choices made to please others toward purchases that bring her genuine joy and support her evolving sense of self.\n\nLiving in Georgetown while co-parenting teenagers who are navigating their own complex feelings about their parents' divorce, Victoria uses fashion as both armor and empowerment tool, carefully selecting pieces that work for solo social appearances and potential career re-entry while rebuilding her confidence after years of subordinating her preferences to family expectations.\n\nHer shopping psychology centers on reclaiming personal choice and building confidence, with every purchase representing freedom from her ex-husband's preferences and a step toward authentic self-expression. The challenge of rebuilding social connections after divorce has taught her that appearance communicates independence and strength, leading her to invest in pieces that project confidence while honoring her personal aesthetic rather than conforming to others' expectations.\n\nVictoria's relationship with luxury is complicated by her awareness that her wealth comes from divorce rather than personal achievement, creating both gratitude for financial security and determination to use her resources meaningfully. Her Georgetown home is being transformed from a showcase of political entertaining into a personal sanctuary that reflects her tastes and interests, filled with art and furniture chosen for personal meaning rather than social impression.",

  "Alexander Chen-Nakamura":
    "Alexander Chen-Nakamura represents global luxury sophistication, a 39-year-old mixed Chinese-Japanese private equity success story whose $180M fortune spans continents and cultures, requiring a wardrobe that performs flawlessly across diverse business environments, social contexts, and cultural expectations. His approach to fashion reflects his international lifestyle—sourcing the best from each region, from Japanese tailoring precision to Italian leather craftsmanship, British suiting tradition to American casual luxury, creating a globally informed aesthetic that respects local customs while maintaining personal consistency.\n\nTraveling 200+ days annually across Asia, Europe, and the Americas for business deals and cultural exploration, Alexander needs versatile pieces that transition seamlessly between Tokyo boardrooms and London dinner parties, Hong Kong social clubs and New York gallery openings, always maintaining the highest quality standards while demonstrating cultural sensitivity and respect.\n\nHis Tribeca penthouse serves as a global headquarters, filled with art from different cultures and technology that keeps him connected to worldwide markets and relationships, reflecting his belief that true luxury lies in experiences and connections rather than mere accumulation of beautiful objects. Alexander's luxury philosophy centers on functionality and cultural sensitivity, building a wardrobe that works equally well across climates and cultures while honoring the craftsmanship traditions of different regions.\n\nHis shopping habits reflect his global perspective—he purchases pieces during travels, building relationships with artisans and brands in their home markets while supporting local economies and traditional techniques. The pressure of representing American interests in Asian markets and Asian perspectives in Western contexts has taught him that appearance communicates respect and understanding, leading him to invest in pieces that demonstrate cultural fluency and professional competence across diverse environments.",
}

export default function PersonasPage() {
  const [expandedPersona, setExpandedPersona] = useState<string | null>(null)
  const [personaImages, setPersonaImages] = useState<{ [key: string]: string[] }>({})
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: string]: number }>({})
  const [imageLoadingStates, setImageLoadingStates] = useState<{ [key: string]: "loading" | "loaded" | "error" }>({})

  useEffect(() => {
    const loadPersonaImages = async () => {
      try {
        const response = await fetch("/api/persona-images")
        if (response.ok) {
          const images = await response.json()
          setPersonaImages(images)
          console.log("[v0] Loaded persona images from storage:", images)
        }
      } catch (error) {
        console.error("[v0] Error loading persona images:", error)
      }
    }

    loadPersonaImages()
  }, [])

  const toggleExpanded = (personaId: string) => {
    setExpandedPersona(expandedPersona === personaId ? null : personaId)
  }

  const handleImageUpload = async (personaName: string, file: File) => {
    try {
      console.log("[v0] Starting image upload for:", personaName)
      console.log("[v0] File details:", { name: file.name, size: file.size, type: file.type })

      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const { url } = await response.json()
        console.log("[v0] Upload successful, URL:", url)

        const saveResponse = await fetch("/api/persona-images", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            personaName,
            imageUrl: url,
          }),
        })

        if (saveResponse.ok) {
          const { personaImages: updatedImages } = await saveResponse.json()
          setPersonaImages(updatedImages)
          console.log("[v0] Image saved to persistent storage:", updatedImages)
        }

        setImageLoadingStates((prev) => ({
          ...prev,
          [`${personaName}-${url}`]: "loading",
        }))
      } else {
        console.error("[v0] Upload failed with status:", response.status)
        const errorText = await response.text()
        console.error("[v0] Error response:", errorText)
      }
    } catch (error) {
      console.error("[v0] Upload error:", error)
    }
  }

  const nextImage = (personaName: string) => {
    const images = personaImages[personaName] || []
    if (images.length > 1) {
      setCurrentImageIndex((prev) => ({
        ...prev,
        [personaName]: ((prev[personaName] || 0) + 1) % images.length,
      }))
    }
  }

  const prevImage = (personaName: string) => {
    const images = personaImages[personaName] || []
    if (images.length > 1) {
      setCurrentImageIndex((prev) => ({
        ...prev,
        [personaName]: ((prev[personaName] || 0) - 1 + images.length) % images.length,
      }))
    }
  }

  return (
    <div className="min-h-screen">
      <div className="">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Personas</h1>
          <p className="text-gray-600">Detailed profiles of our synthetic user testing personas</p>
        </div>

        <div className="grid gap-8">
          {enhancedPersonasData.personas.map((persona, index) => {
            const images = personaImages[persona.name] || []
            const currentIndex = currentImageIndex[persona.name] || 0

            return (
              <Card key={persona.name || index} className="bg-white border border-gray-200">
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row">
                    {/* Image Section with Upload and Carousel */}
                    <div className="lg:w-1/3 relative overflow-hidden">
                      {images.length > 0 ? (
                        <div className="relative w-full h-80 lg:h-96">
                          <img
                            src={images[currentIndex] || "/placeholder.svg"}
                            alt={`${persona.name} - Photo ${currentIndex + 1}`}
                            className="absolute inset-0 w-full h-full object-cover"
                            onLoad={() => console.log("[v0] Image loaded successfully:", images[currentIndex])}
                            onError={() => console.log("[v0] Image failed to load:", images[currentIndex])}
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6">
                            <div className="text-white text-center">
                              <h2 className="text-2xl font-bold mb-2 drop-shadow-lg">{persona.name}</h2>
                              <p className="text-white/90 italic mb-4 drop-shadow-md">
                                "
                                {persona.personality_profile?.core_traits?.[0] ||
                                  persona.persona_type ||
                                  "Strategic thinker"}
                                "
                              </p>

                              {/* Upload button */}
                              <div className="mb-4">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) handleImageUpload(persona.name, file)
                                  }}
                                  className="hidden"
                                  id={`upload-${persona.name}`}
                                />
                                <label
                                  htmlFor={`upload-${persona.name}`}
                                  className="inline-flex items-center gap-2 px-3 py-1 text-sm bg-white/20 backdrop-blur-sm text-white rounded-md cursor-pointer hover:bg-white/30 transition-colors"
                                >
                                  <Upload className="w-4 h-4" />
                                  Upload Photo
                                </label>
                              </div>

                              {images.length > 1 && (
                                <div className="text-xs text-white/80">
                                  {currentIndex + 1} of {images.length}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Carousel controls */}
                          {images.length > 1 && (
                            <>
                              <button
                                onClick={() => prevImage(persona.name)}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-white/30 transition-colors"
                              >
                                <ChevronLeft className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => nextImage(persona.name)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-white/30 transition-colors"
                              >
                                <ChevronRight className="w-5 h-5" />
                              </button>
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="w-full h-80 lg:h-96 bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center p-6">
                          <div className="text-center">
                            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center mb-4 mx-auto">
                              <User className="w-12 h-12 text-gray-500" />
                            </div>

                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{persona.name}</h2>
                            <p className="text-gray-600 italic mb-4">
                              "
                              {persona.personality_profile?.core_traits?.[0] ||
                                persona.persona_type ||
                                "Strategic thinker"}
                              "
                            </p>

                            <div className="mb-4">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) handleImageUpload(persona.name, file)
                                }}
                                className="hidden"
                                id={`upload-${persona.name}`}
                              />
                              <label
                                htmlFor={`upload-${persona.name}`}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-md cursor-pointer hover:bg-blue-100 transition-colors"
                              >
                                <Upload className="w-4 h-4" />
                                Upload Photo
                              </label>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="lg:w-2/3 p-8">
                      {/* Quick Overview */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-gray-500" />
                            <div>
                              <span className="text-sm text-gray-500">Age</span>
                              <p className="font-semibold">{persona.age}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Briefcase className="w-5 h-5 text-gray-500" />
                            <div>
                              <span className="text-sm text-gray-500">Type</span>
                              <p className="font-semibold">{persona.persona_type}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-gray-500" />
                            <div>
                              <span className="text-sm text-gray-500">Location</span>
                              <p className="font-semibold">{persona.location}</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <DollarSign className="w-5 h-5 text-gray-500" />
                            <div>
                              <span className="text-sm text-gray-500">Net Worth</span>
                              <p className="font-semibold">{persona.net_worth}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Heart className="w-5 h-5 text-gray-500" />
                            <div>
                              <span className="text-sm text-gray-500">Wealth Source</span>
                              <p className="font-semibold">{persona.wealth_source}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <User className="w-5 h-5 text-gray-500" />
                            <div>
                              <span className="text-sm text-gray-500">Intelligence</span>
                              <p className="font-semibold">{persona.intelligence_level}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quick Insights */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            Core Traits
                          </h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {persona.personality_profile?.core_traits
                              ?.slice(0, 3)
                              .map((trait, index) => <li key={index}>• {trait}</li>) || <li>• Strategic thinker</li>}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            Daily Challenges
                          </h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {Array.isArray(persona.daily_challenges) ? (
                              persona.daily_challenges
                                .slice(0, 3)
                                .map((challenge, index) => <li key={index}>• {challenge}</li>)
                            ) : persona.daily_challenges && typeof persona.daily_challenges === "object" ? (
                              Object.values(persona.daily_challenges)
                                .slice(0, 3)
                                .map((challenge, index) => <li key={index}>• {challenge}</li>)
                            ) : (
                              <li>• Managing complex decisions</li>
                            )}
                          </ul>
                        </div>
                      </div>

                      {/* Expand/Collapse Button */}
                      <Button
                        variant="outline"
                        onClick={() => toggleExpanded(persona.name || index.toString())}
                        className="w-full"
                      >
                        {expandedPersona === (persona.name || index.toString()) ? (
                          <>
                            <ChevronUp className="w-4 h-4 mr-2" />
                            Show Less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4 mr-2" />
                            View Full Profile
                          </>
                        )}
                      </Button>

                      {/* Expanded Content */}
                      {expandedPersona === (persona.name || index.toString()) && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <Tabs defaultValue="bio" className="w-full">
                            <TabsList className="grid w-full grid-cols-5">
                              <TabsTrigger value="bio">Bio</TabsTrigger>
                              <TabsTrigger value="personality">Personality</TabsTrigger>
                              <TabsTrigger value="background">Background</TabsTrigger>
                              <TabsTrigger value="quotes">Key Quotes</TabsTrigger>
                              <TabsTrigger value="visual">Visual DNA</TabsTrigger>
                            </TabsList>

                            <TabsContent value="bio" className="mt-6">
                              <div>
                                <h4 className="font-semibold mb-4 text-lg">About {persona.name}</h4>
                                <div className="text-gray-700 leading-relaxed space-y-4">
                                  {personaBios[persona.name as keyof typeof personaBios]
                                    ?.split("\n\n")
                                    .map((paragraph, index) => (
                                      <p key={index}>{paragraph}</p>
                                    ))}
                                </div>
                              </div>
                            </TabsContent>

                            <TabsContent value="personality" className="mt-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <h4 className="font-semibold mb-3">Core Traits</h4>
                                  <div className="space-y-2">
                                    {persona.personality_profile?.core_traits?.map((trait, index) => (
                                      <Badge key={index} variant="secondary" className="mr-2 mb-2">
                                        {trait}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-3">Communication Style</h4>
                                  <p className="text-sm text-gray-600 mb-3">
                                    {persona.personality_profile?.communication_style || "Professional and direct"}
                                  </p>
                                  <h4 className="font-semibold mb-3">Trust Patterns</h4>
                                  <p className="text-sm text-gray-600">
                                    {persona.personality_profile?.trust_patterns || "Builds trust through consistency"}
                                  </p>
                                </div>
                              </div>
                            </TabsContent>

                            <TabsContent value="background" className="mt-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <h4 className="font-semibold mb-3">Career Path</h4>
                                  <p className="text-sm text-gray-600 mb-4">
                                    {persona.career_path || "Professional background"}
                                  </p>
                                  <h4 className="font-semibold mb-3">Family Wealth Origin</h4>
                                  <p className="text-sm text-gray-600">{persona.family_wealth_origin || "Self-made"}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-3">Annual Fashion Spend</h4>
                                  <p className="text-sm text-gray-600 mb-4">
                                    {persona.annual_spend_fashion || "Varies"}
                                  </p>
                                  <h4 className="font-semibold mb-3">Secondary Residences</h4>
                                  <ul className="text-sm text-gray-600">
                                    {persona.secondary_residences?.map((residence, index) => (
                                      <li key={index}>• {residence}</li>
                                    )) || <li>• Primary residence only</li>}
                                  </ul>
                                </div>
                              </div>
                            </TabsContent>

                            <TabsContent value="quotes" className="mt-6">
                              <div className="space-y-4">
                                <h4 className="font-semibold mb-3">Key Quotes</h4>
                                {persona.key_quotes?.map((quote, index) => (
                                  <blockquote
                                    key={index}
                                    className="border-l-4 border-blue-500 pl-4 italic text-gray-700"
                                  >
                                    "{quote}"
                                  </blockquote>
                                )) || <p className="text-gray-500">No key quotes available for this persona.</p>}
                              </div>
                            </TabsContent>

                            <TabsContent value="visual" className="mt-6">
                              <div className="space-y-6">
                                <div>
                                  <h4 className="font-semibold mb-3">Physical Appearance</h4>
                                  <p className="text-sm text-gray-600">
                                    {persona.character_bible?.visual_dna?.physical_build || "Professional appearance"}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-3">Style & Clothing</h4>
                                  <p className="text-sm text-gray-600">
                                    {persona.character_bible?.visual_dna?.style_aesthetic || "Professional attire"}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-3">Setting & Environment</h4>
                                  <p className="text-sm text-gray-600">
                                    {persona.character_bible?.setting?.primary_location || "Professional environment"}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-3">Signature Elements</h4>
                                  <div className="grid grid-cols-1 gap-2">
                                    {persona.character_bible?.signature_elements?.map((element, index) => (
                                      <Badge key={index} variant="outline" className="mr-2 mb-2">
                                        {element}
                                      </Badge>
                                    )) || <p className="text-gray-500">No signature elements defined</p>}
                                  </div>
                                </div>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
