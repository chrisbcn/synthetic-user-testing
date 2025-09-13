"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Send, Play, RotateCcw, Key, AlertTriangle, Lightbulb, FileText } from "lucide-react"
import type { Persona, Scenario, ConversationTurn, InterviewerPersona, Interview } from "@/lib/types"

const scenarios: Scenario[] = [
  {
    id: "wardrobe",
    name: "Rediscovering Wardrobe Interface",
    context:
      "You're getting ready for a charity gala next week. You know you have amazing pieces, but you're not sure what you haven't worn recently. Looking at the Maura wardrobe interface...",
    questions: [
      "Looking at this wardrobe interface, how would you go about finding pieces you haven't worn recently?",
      "What's your reaction to seeing purchase dates and wear counts for your items?",
      "How do you feel about the way items are organized and filtered here?",
      "Would this seasonal rotation feature help you rediscover forgotten pieces?",
      "What concerns, if any, do you have about digitizing your wardrobe this way?",
    ],
  },
  {
    id: "resale",
    name: "Brand-Managed Resale vs TheRealReal",
    context:
      "You're doing your seasonal closet review. Some pieces aren't earning their space anymore. You're looking at Maura's brand-managed resale features.",
    questions: [
      "How do you feel about the brand managing the resale process versus using TheRealReal?",
      "What's your reaction to being notified that other VIP customers want similar items?",
      "How important is the VIP-to-VIP marketplace exclusivity to you?",
      "Would you trust this authentication and valuation process over current options?",
      "What concerns do you have about selling through this VIP marketplace?",
    ],
  },
  {
    id: "stylist",
    name: "AI-Enhanced Personal Styling",
    context:
      "Your client advisor at Keton has created some new looks based on pieces you already own plus some new arrivals from the spring collection.",
    questions: [
      "How do you feel about your stylist having access to your wardrobe data?",
      "What's your reaction to seeing your existing pieces styled with new arrivals?",
      "Does this make you more or less likely to purchase the suggested new items?",
      "How does this enhance or change your relationship with your client advisor?",
      "What concerns do you have about sharing this level of personal data?",
    ],
  },
]

const initialPersonas: Persona[] = [
  {
    id: "sophia-harrington",
    name: "Sophia Harrington",
    avatar: "💎",
    type: "Ultra-HNW Collector",
    age: 52,
    location: "Manhattan, NY",
    annualSpend: "$300K",
    background:
      "Third-generation wealth, Harvard MBA, sits on museum boards. Values relationships with brand advisors built over decades. Frustrated by TheRealReal's poor handling of luxury resale - has lost thousands on undervalued pieces. Sees fashion as investment and legacy building. Prefers exclusive experiences over mass market anything.",
    keyQuotes: [
      "I've had such terrible experiences with TheRealReal - they sold my $2,000 Brunello Cucinelli sweater for $17. If Keton managed the process, I'd trust their authentication completely.",
      "The VIP-to-VIP marketplace is brilliant! I'd much rather sell to other discerning customers who understand the value of these pieces.",
      "I don't buy trends, I buy pieces that will be relevant in twenty years. That's real luxury.",
    ],
    physicalTraits: {
      ethnicity: "Caucasian",
      hairColor: "Silver blonde, professionally styled",
      eyeColor: "Blue",
      build: "Elegant and poised, maintains fitness through private Pilates",
      style: "Timeless elegance with investment pieces - classic luxury that whispers rather than shouts",
      accessories: ["Hermès Birkin collection", "Cartier watch", "pearl earrings", "Brunello Cucinelli scarves"],
    },
    characterTraits: {
      accent: "Refined East Coast accent, measured cadence",
      speakingStyle: "Articulate and thoughtful, uses luxury industry terminology naturally",
      mannerisms: ["Thoughtful pauses before speaking", "subtle hand gestures", "maintains excellent posture"],
      personality: "Discerning and sophisticated, values authenticity over trends",
      socialClass: "Old money - generational wealth from family investments",
    },
    videoSettings: {
      setting: "Corner office in private equity firm, art collection visible",
      lighting: "Soft natural light from large windows",
      cameraAngle: "Slightly elevated, professional distance",
      wardrobe: "Brunello Cucinelli cashmere, The Row tailoring, subtle designer pieces",
      mood: "Confident and authoritative, speaks with quiet authority",
    },
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
      "Stanford CS grad, senior product manager at major tech company. Grew up middle-class but now earning significant tech salary. Approaches luxury shopping like product development - research-heavy, ROI-focused. Wants to build a 'capsule wardrobe' that maximizes cost-per-wear. Sees Maura as the 'analytics dashboard for my closet.' Still learning luxury fashion rules but brings fresh perspective.",
    keyQuotes: [
      "I need to see the data - how many times have I worn this piece, what's my cost-per-wear, what's the resale value trend?",
      "This would help me be more strategic about what I already own before buying new pieces. It's like A/B testing my wardrobe.",
      "I don't want to make expensive mistakes. Show me the analytics and I can make better decisions.",
    ],
    physicalTraits: {
      ethnicity: "Asian-American (Chinese heritage)",
      hairColor: "Black, modern cut",
      eyeColor: "Dark brown",
      build: "Athletic build, enjoys cycling and tech-bro fitness culture",
      style: "Modern minimalist with strategic luxury investments - quality over quantity",
      accessories: ["Apple Watch Ultra", "minimalist leather goods", "high-end sunglasses"],
    },
    characterTraits: {
      accent: "West Coast casual with tech industry precision",
      speakingStyle: "Data-driven language, uses metrics and analysis naturally",
      mannerisms: ["Gestures while explaining concepts", "checks phone occasionally", "leans forward when engaged"],
      personality: "Analytical and ambitious, treats fashion as strategic investment",
      socialClass: "New money - tech success, building wealth methodically",
    },
    videoSettings: {
      setting: "Modern apartment with minimalist design, tech setup visible",
      lighting: "Clean LED lighting, slightly cool tone",
      cameraAngle: "Eye level, casual but professional",
      wardrobe: "Keton basics, Norse Projects, high-quality casual wear with luxury accents",
      mood: "Enthusiastic about optimization, speaks with conviction about strategy",
    },
  },
  {
    id: "isabella-rossi",
    name: "Isabella Rossi",
    avatar: "🌹",
    type: "Traditional Luxury",
    age: 48,
    location: "Milan, Italy",
    annualSpend: "$180K",
    background:
      "Third-generation luxury fashion family, studied at Bocconi. Runs family's luxury textile business. Deeply values craftsmanship and heritage. Skeptical of tech solutions but willing to try if they preserve relationships with trusted advisors. Concerned about privacy and maintaining discretion. Prefers in-person experiences but recognizes need to modernize.",
    keyQuotes: [
      "Technology should enhance relationships, not replace them. My advisor at Prada knows my style better than any algorithm ever could.",
      "Privacy is paramount in our world. How do I know my information won't be shared inappropriately?",
      "I appreciate innovation, but only if it respects the traditions that make luxury meaningful.",
    ],
    physicalTraits: {
      ethnicity: "Italian",
      hairColor: "Dark brown with subtle highlights",
      eyeColor: "Hazel",
      build: "Petite and elegant, classic Mediterranean beauty",
      style: "Italian sophistication - heritage brands, impeccable tailoring, family jewelry",
      accessories: ["Family heirloom jewelry", "Bottega Veneta handbags", "silk scarves from heritage brands"],
    },
    characterTraits: {
      accent: "Subtle Italian accent, melodic intonation",
      speakingStyle: "Passionate but measured, references family traditions and heritage",
      mannerisms: ["Expressive hand gestures", "touches jewelry when thoughtful", "warm but reserved smile"],
      personality: "Warm but cautious about technology, values tradition and relationships",
      socialClass: "Old European money - family fashion business spanning generations",
    },
    videoSettings: {
      setting: "Elegant Milanese apartment, family portraits and luxury books visible",
      lighting: "Warm afternoon light through historic windows",
      cameraAngle: "Slightly warm angle, emphasizing approachable elegance",
      wardrobe: "Giorgio Armani, Max Mara, family couture pieces, classic Italian luxury",
      mood: "Gracious but slightly skeptical of new technology, protective of traditions",
    },
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
      "Oxford-educated, runs successful fintech startup. Building luxury wardrobe as status symbol and personal expression. Influences other young African professionals. Wants to understand luxury 'rules' while maintaining cultural identity. Sees luxury as empowerment and representation. Active on social media but values authentic experiences.",
    keyQuotes: [
      "I'm building my luxury knowledge as much as my wardrobe. I want to understand the heritage behind these pieces.",
      "Representation matters. When I wear luxury, I'm showing other young women like me that we belong in these spaces.",
      "I need guidance, but I also want to maintain my personal style and cultural identity.",
    ],
    physicalTraits: {
      ethnicity: "Nigerian",
      hairColor: "Natural black hair, styled in protective styles",
      eyeColor: "Dark brown",
      build: "Tall and statuesque, confident posture",
      style: "Contemporary African luxury - mix of international brands with African designers",
      accessories: ["Statement jewelry mixing heritage and modern pieces", "luxury handbags", "bold accessories"],
    },
    characterTraits: {
      accent: "Nigerian accent with international inflection from education abroad",
      speakingStyle: "Confident and articulate, bridges traditional and modern perspectives",
      mannerisms: ["Animated gestures", "warm laugh", "touches accessories when making points"],
      personality: "Ambitious and culturally proud, building luxury taste while honoring heritage",
      socialClass: "New money - successful entrepreneur building wealth",
    },
    videoSettings: {
      setting: "Modern Lagos office with African art and luxury pieces",
      lighting: "Bright natural light, energetic atmosphere",
      cameraAngle: "Dynamic angle that captures confidence and energy",
      wardrobe: "Mix of international luxury (Keton, Ganni) with African luxury designers",
      mood: "Enthusiastic and forward-thinking, speaks with passion about building taste",
    },
  },
  {
    id: "james-whitmore",
    name: "James Whitmore III",
    avatar: "🏛️",
    type: "Ultra-HNW Collector",
    age: 58,
    location: "Greenwich, CT",
    annualSpend: "$420K",
    background:
      "Fifth-generation banker, Yale educated. Manages family trust and private foundation. Values tradition but not opposed to innovation if it preserves relationships. Has extensive collection of rare luxury pieces. Prefers working with people he's known for decades. Sees luxury as stewardship rather than consumption.",
    keyQuotes: [
      "I don't follow trends, I set them. Or rather, I ignore them entirely and stick to what works.",
      "The best luxury is invisible to those who don't know to look for it.",
      "I'd need to understand how this preserves my relationships with the people I've worked with for twenty years.",
    ],
    physicalTraits: {
      ethnicity: "Caucasian",
      hairColor: "Distinguished grey, perfectly groomed",
      eyeColor: "Green",
      build: "Tall and distinguished, maintains health through golf and sailing",
      style: "American old money - Brooks Brothers DNA with strategic luxury additions",
      accessories: ["Patek Philippe collection", "monogrammed items", "club ties", "heritage pieces"],
    },
    characterTraits: {
      accent: "Upper-class Northeast American, precise diction",
      speakingStyle: "Measured and diplomatic, uses understatement effectively",
      mannerisms: ["Minimal but purposeful gestures", "maintains formal posture", "slight smile"],
      personality: "Reserved but friendly, values discretion and long-term relationships",
      socialClass: "Multi-generational old money - banking and real estate dynasty",
    },
    videoSettings: {
      setting: "Wood-paneled study with family portraits and leather-bound books",
      lighting: "Classic warm lighting, traditional atmosphere",
      cameraAngle: "Respectful distance, emphasizing authority and dignity",
      wardrobe: "Savile Row tailoring, American heritage brands, family heirloom accessories",
      mood: "Quietly authoritative, speaks with calm confidence about legacy",
    },
  },
  {
    id: "priya-sharma",
    name: "Priya Sharma",
    avatar: "🪷",
    type: "Strategic Builder",
    age: 31,
    location: "Mumbai, India",
    annualSpend: "$85K",
    background:
      "IIM graduate, works in family pharmaceutical business expanding internationally. Building luxury wardrobe for global business contexts while honoring Indian heritage. Analytical approach to luxury purchasing - wants pieces that work across cultures. Influential among Mumbai's young luxury consumers. Values quality and versatility.",
    keyQuotes: [
      "I need pieces that work whether I'm in Mumbai boardrooms or New York meetings. Versatility is luxury for global professionals.",
      "Understanding cost-per-wear helps me justify investments to myself and my family who think luxury is wasteful.",
      "I want to build a wardrobe that reflects both my heritage and my global ambitions.",
    ],
    physicalTraits: {
      ethnicity: "Indian",
      hairColor: "Long black hair, often in elegant updos",
      eyeColor: "Dark brown",
      build: "Petite and graceful, yoga-toned",
      style: "East-meets-West luxury - Indian couture mixed with international brands",
      accessories: ["Heritage jewelry from family", "luxury handbags", "silk scarves", "designer eyewear"],
    },
    characterTraits: {
      accent: "Educated Indian English, crisp pronunciation",
      speakingStyle: "Thoughtful and precise, references both tradition and innovation",
      mannerisms: ["Graceful hand movements", "touches jewelry when thinking", "warm but professional smile"],
      personality: "Thoughtful strategist, balances respect for tradition with modern ambition",
      socialClass: "New money - pharmaceutical family business success",
    },
    videoSettings: {
      setting: "Modern Mumbai apartment with traditional Indian art and luxury furnishings",
      lighting: "Warm natural light with traditional elements",
      cameraAngle: "Flattering angle that emphasizes grace and intelligence",
      wardrobe: "Sabyasachi for special occasions, international luxury for business, strategic investments",
      mood: "Confident but considerate, speaks thoughtfully about balancing cultures",
    },
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
      "Art dealer specializing in contemporary luxury pieces. Family connections to major French luxury houses. Values the artisanal aspect of luxury goods. Skeptical of technology that might diminish human relationships in luxury. Appreciates innovation but fears losing the 'soul' of luxury shopping. Influential in Parisian cultural circles.",
    keyQuotes: [
      "Luxury is not about having many things, it's about having the right things that bring joy every time you see them.",
      "Technology should celebrate craftsmanship, not replace human connection in luxury.",
      "In Paris, we understand that true luxury is timeless. Trends are for tourists.",
    ],
    physicalTraits: {
      ethnicity: "French",
      hairColor: "Dark brown with distinguished silver at temples",
      eyeColor: "Blue-grey",
      build: "Lean and elegant, classic French sophistication",
      style: "Quintessential Parisian elegance - understated luxury with perfect fit",
      accessories: ["Hermès accessories", "vintage watches", "silk pocket squares", "quality leather goods"],
    },
    characterTraits: {
      accent: "Cultured French accent, melodious pronunciation",
      speakingStyle: "Philosophical and refined, references art and culture naturally",
      mannerisms: ["Contemplative pauses", "elegant gestures", "occasional French phrases"],
      personality: "Intellectually curious but protective of French luxury traditions",
      socialClass: "Old money - family luxury goods heritage",
    },
    videoSettings: {
      setting: "Classic Parisian apartment with art collection and designer furniture",
      lighting: "Soft Parisian afternoon light through tall windows",
      cameraAngle: "Artistic angle that captures sophisticated atmosphere",
      wardrobe: "French luxury houses, impeccably tailored pieces, family vintage accessories",
      mood: "Contemplative and cultured, speaks with appreciation for craftsmanship",
    },
  },
  {
    id: "sarah-kim",
    name: "Sarah Kim",
    avatar: "🌸",
    type: "Emerging Luxury",
    age: 26,
    location: "Seoul, South Korea",
    annualSpend: "$55K",
    background:
      "Works for major Korean tech company, building social media presence around luxury lifestyle. Learning luxury fashion 'rules' through online research and international exposure. Influential among young Korean professionals entering luxury market. Balances K-fashion trends with international luxury investment pieces. Strategic about building 'Instagram-worthy' but practical wardrobe.",
    keyQuotes: [
      "I want to build a luxury collection that photographs well but also makes sense for my lifestyle and budget.",
      "Korean beauty and fashion culture is so advanced, but I'm learning about European luxury heritage too.",
      "Every piece needs to work for content creation and real life. That's the reality for my generation.",
    ],
    physicalTraits: {
      ethnicity: "Korean",
      hairColor: "Black with subtle highlights, trendy styling",
      eyeColor: "Dark brown",
      build: "Petite and fashion-forward, influenced by K-beauty standards",
      style: "Korean luxury fusion - K-fashion elevated with international luxury pieces",
      accessories: ["Statement bags", "tech accessories", "jewelry mixing Korean and Western styles"],
    },
    characterTraits: {
      accent: "Fluent English with slight Korean accent, modern vocabulary",
      speakingStyle: "Enthusiastic and trend-aware, uses fashion and tech terminology",
      mannerisms: ["Expressive with hands", "takes photos/videos naturally", "tech-savvy gestures"],
      personality: "Trend-conscious but strategic, building luxury knowledge through social influence",
      socialClass: "New money - tech industry success, social media influence",
    },
    videoSettings: {
      setting: "Modern Seoul apartment with K-beauty products and luxury pieces displayed",
      lighting: "Perfect ring light setup, optimized for content creation",
      cameraAngle: "Social media savvy angle, optimized for engagement",
      wardrobe: "Korean luxury brands mixed with international pieces, trend-forward styling",
      mood: "Energetic and aspirational, speaks with excitement about building style",
    },
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
      "Runs successful marketing agency, built business from scratch. First in family to enter luxury market. Strategic about pieces that work across business and social contexts. Influences other Latin American entrepreneurs. Wants luxury education but maintains cultural identity. Sees luxury as empowerment and business tool.",
    keyQuotes: [
      "I built my business from nothing, so every luxury purchase needs to earn its place in my life and closet.",
      "I want to understand luxury, but I also want to represent my culture with pride. Both can exist together.",
      "Show me the ROI on everything - my time, my money, my style choices. I make decisions based on data.",
    ],
    physicalTraits: {
      ethnicity: "Mexican",
      hairColor: "Rich brown with caramel highlights",
      eyeColor: "Dark brown",
      build: "Curvaceous and confident, embraces body positivity",
      style: "Latin luxury - vibrant colors and patterns elevated with luxury pieces",
      accessories: ["Statement jewelry", "luxury handbags", "artistic pieces from Latin American designers"],
    },
    characterTraits: {
      accent: "Mexican accent with international education influence",
      speakingStyle: "Passionate and direct, uses business terminology mixed with warmth",
      mannerisms: ["Animated storytelling", "touches others when emphasizing points", "warm laughter"],
      personality: "Confident and social, builds community around luxury appreciation",
      socialClass: "New money - successful entrepreneur, building wealth",
    },
    videoSettings: {
      setting: "Colorful Mexico City office with luxury pieces and cultural artifacts",
      lighting: "Vibrant natural light, energetic atmosphere",
      cameraAngle: "Warm, engaging angle that captures personality",
      wardrobe: "International luxury mixed with Mexican designers, bold patterns and colors",
      mood: "Vibrant and determined, speaks with passion about building success",
    },
  },
  {
    id: "william-blackstone",
    name: "William Blackstone",
    avatar: "⚖️",
    type: "Ultra-HNW Collector",
    age: 61,
    location: "Belgravia, London",
    annualSpend: "$380K",
    background:
      "Senior barrister, QC, from family of judges and lawyers. Collector of rare menswear and accessories. Values craftsmanship and provenance above all. Skeptical of innovation but appreciates quality wherever found. Has extensive knowledge of luxury heritage. Dry sense of humor about modern luxury trends.",
    keyQuotes: [
      "I've been wearing the same style for thirty years, and I'll be wearing it for thirty more. That's the point of good taste.",
      "One doesn't follow fashion, one simply dresses appropriately for one's station and circumstances.",
      "If this technology can help me find that perfect vintage piece I've been seeking for years, then perhaps it has merit.",
    ],
    physicalTraits: {
      ethnicity: "British",
      hairColor: "Silver-white, impeccably groomed",
      eyeColor: "Steel blue",
      build: "Distinguished bearing, maintains health through country pursuits",
      style: "British aristocratic luxury - Savile Row tradition with modern touches",
      accessories: ["Vintage Rolex collection", "family cufflinks", "traditional British luxury accessories"],
    },
    characterTraits: {
      accent: "Received Pronunciation, perfectly modulated",
      speakingStyle: "Precise and measured, uses understatement and subtle humor",
      mannerisms: ["Minimal movement", "purposeful gestures", "dry wit delivery"],
      personality: "Witty but reserved, values expertise and long-term relationships",
      socialClass: "Old money - legal profession dynasty, landed gentry background",
    },
    videoSettings: {
      setting:
        "Traditional London gentleman's club library with dark wood paneling, leather Chesterfield chairs, oil paintings of ancestors, vintage law books, crystal whiskey decanter, morning newspaper folded precisely, brass desk accessories",
      lighting:
        "Classic British interior lighting with warm table lamps, natural light through tall Georgian windows, traditional portrait lighting emphasizing gravitas and heritage",
      cameraAngle:
        "Formal medium shot from respectful eye level, 85mm lens for dignified compression, positioned to emphasize both personal authority and institutional tradition",
      wardrobe:
        "Charcoal Savile Row three-piece suit, university tie, vintage gold cufflinks, pocket watch chain visible, silver hair immaculately groomed, understated British elegance",
      mood: "Dry wit and quiet authority, minimal but precise gestures, delivers subtle humor with perfect timing, speaks with decades of legal and luxury expertise",
    },
  },
]

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
]

const getRecommendedInterviewer = (persona: Persona | null, scenario: Scenario | null): InterviewerPersona => {
  if (!persona || !scenario) return defaultInterviewers[0]

  // Recommend based on persona type and scenario context
  if (persona.type === "Ultra-HNW Collector" || scenario.id === "resale") {
    return defaultInterviewers[0] // Sophia - luxury fashion expert
  } else if (persona.type === "Strategic Builder" || scenario.id === "wardrobe") {
    return defaultInterviewers[1] // Marcus - data-driven approach
  } else {
    return defaultInterviewers[2] // Isabella - design psychology
  }
}

interface InterviewRunnerProps {
  onSectionChange?: (section: string) => void
  onInterviewCompleted?: (interview: Interview) => void
}

export function InterviewRunner({ onSectionChange, onInterviewCompleted }: InterviewRunnerProps) {
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null)
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null)
  const [selectedInterviewer, setSelectedInterviewer] = useState<InterviewerPersona | null>(null)
  const [conversation, setConversation] = useState<ConversationTurn[]>([])
  const [currentMessage, setCurrentMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [interviewStatus, setInterviewStatus] = useState<"setup" | "active" | "completed">("setup")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState("")
  const [showApiKeyInput, setShowApiKeyInput] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (selectedPersona || selectedScenario) {
      const recommended = getRecommendedInterviewer(selectedPersona, selectedScenario)
      setSelectedInterviewer(recommended)
    }
  }, [selectedPersona, selectedScenario])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [conversation])

  const startInterview = async () => {
    if (!selectedPersona || !selectedScenario || !selectedInterviewer) return

    setInterviewStatus("active")
    setCurrentQuestionIndex(0)
    setError(null)

    // Start with the first question
    const firstQuestion = selectedScenario.questions[0]
    const initialTurn: ConversationTurn = {
      speaker: "moderator",
      message: firstQuestion,
      timestamp: new Date(),
    }

    setConversation([initialTurn])
    await sendMessage(firstQuestion, [])
  }

  const sendMessage = async (message: string, currentConversation: ConversationTurn[] = conversation) => {
    if (!selectedPersona || !selectedScenario || !selectedInterviewer) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          persona: selectedPersona,
          scenario: selectedScenario,
          interviewer: selectedInterviewer,
          message,
          conversationHistory: currentConversation,
          apiKey: apiKey || undefined,
        }),
      })

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Rate limit reached. Please wait a moment before continuing the conversation.")
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to get response")
      }

      const responseTurn: ConversationTurn = {
        speaker: "persona",
        message: data.response,
        timestamp: new Date(),
      }

      const updatedConversation = [...currentConversation, responseTurn]
      setConversation(updatedConversation)
    } catch (error) {
      console.error("Error sending message:", error)
      setError(error instanceof Error ? error.message : "Failed to send message")
    } finally {
      setIsLoading(false)
    }
  }

  const handleNextQuestion = async () => {
    if (!selectedScenario || currentQuestionIndex >= selectedScenario.questions.length - 1) return

    const nextIndex = currentQuestionIndex + 1
    setCurrentQuestionIndex(nextIndex)

    const nextQuestion = selectedScenario.questions[nextIndex]
    const questionTurn: ConversationTurn = {
      speaker: "moderator",
      message: nextQuestion,
      timestamp: new Date(),
    }

    const newConversation = [...conversation, questionTurn]
    setConversation(newConversation)

    await sendMessage(nextQuestion, newConversation)

    if (nextIndex >= selectedScenario.questions.length - 1) {
      completeInterview(newConversation)
    }
  }

  const completeInterview = (finalConversation: ConversationTurn[]) => {
    if (!selectedPersona || !selectedScenario || !selectedInterviewer) return

    setInterviewStatus("completed")

    const completedInterview: Interview = {
      id: `interview-${Date.now()}`,
      personaId: selectedPersona.id,
      personaName: selectedPersona.name,
      interviewerId: selectedInterviewer.id,
      interviewerName: selectedInterviewer.name,
      scenarioId: selectedScenario.id,
      scenario: selectedScenario.name,
      status: "completed",
      createdAt: new Date().toISOString(),
      conversation: finalConversation,
      messages: finalConversation.map((turn, index) => ({
        id: `msg-${Date.now()}-${index}`,
        role: turn.speaker === "moderator" ? "interviewer" : "persona",
        content: turn.message,
        timestamp: turn.timestamp.toISOString(),
      })),
    }

    console.log("[v0] Interview completed:", completedInterview)

    if (onInterviewCompleted) {
      onInterviewCompleted(completedInterview)
    }
  }

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return

    const userMessage: ConversationTurn = {
      speaker: "moderator",
      message: currentMessage,
      timestamp: new Date(),
    }

    const newConversation = [...conversation, userMessage]
    setConversation(newConversation)
    setCurrentMessage("")

    await sendMessage(currentMessage, newConversation)
  }

  const resetInterview = () => {
    setInterviewStatus("setup")
    setConversation([])
    setCurrentMessage("")
    setCurrentQuestionIndex(0)
    setError(null)
    setShowApiKeyInput(false)
    setApiKey("")
    setSelectedInterviewer(null)
  }

  const canStart = selectedPersona && selectedScenario && selectedInterviewer && interviewStatus === "setup"
  const hasMoreQuestions = selectedScenario && currentQuestionIndex < selectedScenario.questions.length - 1

  const handleViewResults = () => {
    if (interviewStatus !== "completed" && selectedPersona && selectedScenario && selectedInterviewer) {
      completeInterview(conversation)
    }

    if (onSectionChange) {
      onSectionChange("results")
    }
  }

  return (
    <div className="space-y-6">
      {showApiKeyInput && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="space-y-3">
            <p className="text-amber-800">
              <strong>API Key Required:</strong> The ANTHROPIC_API_KEY environment variable is not accessible in the
              runtime. As a temporary workaround, you can enter your Claude API key directly below.
            </p>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="password"
                  placeholder="Enter your Claude API key (sk-ant-...)"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="bg-white"
                />
              </div>
              <Button onClick={() => setShowApiKeyInput(false)} variant="outline" size="sm" disabled={!apiKey.trim()}>
                <Key className="w-4 h-4 mr-1" />
                Use Key
              </Button>
            </div>
            <p className="text-xs text-amber-700">
              ⚠️ <strong>Security Note:</strong> This is a temporary workaround for demo purposes. In production, API
              keys should only be stored in secure environment variables.
            </p>
          </AlertDescription>
        </Alert>
      )}

      {interviewStatus === "setup" && (
        <Card className="bg-white/80 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center text-white font-bold">
                🎯
              </div>
              Run Live Interview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {apiKey && (
              <Alert className="bg-green-50 border-green-200">
                <Key className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>API Key Configured:</strong> Ready to run Claude interviews.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  Select Luxury Persona
                </label>
                <Select
                  onValueChange={(value) => setSelectedPersona(initialPersonas.find((p) => p.id === value) || null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a persona..." />
                  </SelectTrigger>
                  <SelectContent>
                    {initialPersonas.map((persona) => (
                      <SelectItem key={persona.id} value={persona.id}>
                        {persona.avatar} {persona.name} - {persona.type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  Select Test Scenario
                </label>
                <Select onValueChange={(value) => setSelectedScenario(scenarios.find((s) => s.id === value) || null)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a scenario..." />
                  </SelectTrigger>
                  <SelectContent>
                    {scenarios.map((scenario) => (
                      <SelectItem key={scenario.id} value={scenario.id}>
                        {scenario.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                  Select Interviewer
                  {selectedInterviewer && (
                    <Badge variant="secondary" className="text-xs">
                      <Lightbulb className="w-3 h-3 mr-1" />
                      Recommended
                    </Badge>
                  )}
                </label>
                <Select
                  value={selectedInterviewer?.id || ""}
                  onValueChange={(value) =>
                    setSelectedInterviewer(defaultInterviewers.find((i) => i.id === value) || null)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose interviewer..." />
                  </SelectTrigger>
                  <SelectContent>
                    {defaultInterviewers.map((interviewer) => (
                      <SelectItem key={interviewer.id} value={interviewer.id}>
                        {interviewer.avatar_emoji} {interviewer.name} - {interviewer.specialization}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedPersona && selectedScenario && selectedInterviewer && (
              <div className="bg-slate-50 rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{selectedPersona.avatar}</span>
                      <div>
                        <h3 className="font-semibold">{selectedPersona.name}</h3>
                        <Badge variant="secondary">{selectedPersona.type}</Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{selectedInterviewer.avatar_emoji}</span>
                      <div>
                        <h3 className="font-semibold">{selectedInterviewer.name}</h3>
                        <Badge variant="outline">{selectedInterviewer.specialization}</Badge>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600">{selectedInterviewer.interview_style}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-slate-700 mb-1">Scenario Context:</h4>
                  <p className="text-sm text-slate-600">{selectedScenario.context}</p>
                </div>
                <div>
                  <h4 className="font-medium text-slate-700 mb-1">Questions ({selectedScenario.questions.length}):</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    {selectedScenario.questions.slice(0, 3).map((question, index) => (
                      <li key={index}>• {question}</li>
                    ))}
                    {selectedScenario.questions.length > 3 && (
                      <li className="text-slate-500">... and {selectedScenario.questions.length - 3} more</li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            <Button
              onClick={startInterview}
              disabled={!canStart}
              className="w-full h-12 text-lg bg-[#23282a] text-white hover:bg-[#23282a]/90"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Live Interview
            </Button>
          </CardContent>
        </Card>
      )}

      {interviewStatus === "active" && (
        <div className="space-y-4">
          <Card className="bg-white/80 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{selectedPersona?.avatar}</span>
                    <div>
                      <h3 className="font-semibold">{selectedPersona?.name}</h3>
                      <p className="text-sm text-slate-600">{selectedScenario?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500">
                    <span className="text-sm">interviewed by</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{selectedInterviewer?.avatar_emoji}</span>
                      <div>
                        <p className="text-sm font-medium">{selectedInterviewer?.name}</p>
                        <p className="text-xs text-slate-500">{selectedInterviewer?.specialization}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    Question {currentQuestionIndex + 1} of {selectedScenario?.questions.length}
                  </Badge>
                  <Button variant="outline" size="sm" onClick={resetInterview}>
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Reset
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-white/20">
            <CardContent className="p-0">
              <ScrollArea className="h-96 p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {conversation.map((turn, index) => (
                    <div
                      key={index}
                      className={`flex ${turn.speaker === "moderator" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          turn.speaker === "moderator"
                            ? "bg-slate-600 text-white"
                            : "bg-slate-100 text-slate-900 border"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {turn.speaker === "persona" && <span className="text-lg">{selectedPersona?.avatar}</span>}
                          {turn.speaker === "interviewer" && (
                            <span className="text-lg">{selectedInterviewer?.avatar_emoji}</span>
                          )}
                          <div>
                            <p className="text-sm">{turn.message}</p>
                            <p
                              className={`text-xs mt-1 ${
                                turn.speaker === "moderator" ? "text-slate-300" : "text-slate-500"
                              }`}
                            >
                              {turn.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-slate-100 border rounded-lg p-3 flex items-center gap-2">
                        <span className="text-lg">{selectedInterviewer?.avatar_emoji}</span>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm text-slate-600">Thinking...</span>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {error && (
                <div className="p-4 bg-red-50 border-t border-red-200">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="p-4 border-t bg-slate-50/50">
                <div className="flex gap-2">
                  <Input
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    placeholder="Ask a follow-up question..."
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                    disabled={isLoading}
                  />
                  <Button onClick={handleSendMessage} disabled={!currentMessage.trim() || isLoading} size="sm">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          {conversation.length > 0 &&
            !isLoading &&
            selectedScenario &&
            currentQuestionIndex < selectedScenario.questions.length - 1 && (
              <Button onClick={handleNextQuestion} className="w-full bg-blue-600 hover:bg-blue-700">
                Next Question ({currentQuestionIndex + 2}/{selectedScenario.questions.length})
              </Button>
            )}

          {conversation.length > 0 &&
            !isLoading &&
            selectedScenario &&
            currentQuestionIndex >= selectedScenario.questions.length - 1 && (
              <Button onClick={handleViewResults} className="w-full bg-green-600 hover:bg-green-700">
                View Interview Results
              </Button>
            )}
        </div>
      )}

      {interviewStatus === "completed" && (
        <Card className="bg-white/80 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white">✓</div>
              Interview Completed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-50 rounded-lg p-4 space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{selectedPersona?.avatar}</span>
                <div>
                  <h3 className="font-semibold text-lg">{selectedPersona?.name}</h3>
                  <p className="text-sm text-slate-600">
                    Interviewed by {selectedInterviewer?.name} • {selectedScenario?.name}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-slate-700">Questions Asked</p>
                  <p className="text-slate-600">{selectedScenario?.questions.length}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-700">Responses Collected</p>
                  <p className="text-slate-600">{conversation.filter((turn) => turn.speaker === "persona").length}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button onClick={handleViewResults} className="w-full bg-green-600 hover:bg-green-700">
                <FileText className="w-4 h-4 mr-2" />
                View Interview Results
              </Button>

              <Button onClick={resetInterview} variant="outline" className="w-full bg-transparent">
                <RotateCcw className="w-4 h-4 mr-2" />
                Start New Interview
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
