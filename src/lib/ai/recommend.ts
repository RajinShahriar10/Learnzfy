import { aiCompleteJson } from "./client"

export interface RecommendationCandidate {
  id: string
  title: string
  category: string | null
}

export interface UserInterest {
  category?: string
  courseTitles?: string[]
  level?: string
}

async function aiReasons(
  candidates: RecommendationCandidate[],
  interests: UserInterest
): Promise<Record<string, string>> {
  if (candidates.length === 0) return {}

  const system = [
    "You are Learnzfy's recommendation engine for a FREE education platform (tagline: education is your right, not a product for sale).",
    "For every course id, produce one short, human, personalized match reason (max 12 words).",
    "Return ONLY a JSON object mapping course id to its reason string, e.g. {\"id\": \"Because you enjoy Web Development\"}.",
    "Reasons must be specific to the course title and the student's interests — never generic.",
  ].join("\n")

  const raw = await aiCompleteJson<Record<string, string>>(
    {
      system,
      messages: [
        {
          role: "user",
          content: [
            `Student interest category: ${interests.category || "not known"}`,
            `Recently studied: ${(interests.courseTitles || []).slice(0, 5).join(", ") || "nothing yet"}`,
            `Student level: ${interests.level || "beginner"}`,
            "Candidate courses:",
            candidates.map((c) => `${c.id} :: ${c.title} :: ${c.category || "uncategorized"}`).join("\n"),
          ].join("\n"),
        },
      ],
      temperature: 0.5,
      maxTokens: 800,
    },
    {}
  )

  const map: Record<string, string> = {}
  for (const c of candidates) {
    const reason = raw[c.id]
    if (reason && typeof reason === "string" && reason.trim()) {
      map[c.id] = reason.trim()
    }
  }
  return map
}

export async function enrichRecommendationReasons(
  candidates: RecommendationCandidate[],
  interests: UserInterest,
  defaultReason: (c: RecommendationCandidate) => string
): Promise<Record<string, string>> {
  try {
    const map = await aiReasons(candidates, interests)
    return candidates.reduce<Record<string, string>>((acc, c) => {
      acc[c.id] = map[c.id] || defaultReason(c)
      return acc
    }, {})
  } catch {
    return candidates.reduce<Record<string, string>>((acc, c) => {
      acc[c.id] = defaultReason(c)
      return acc
    }, {})
  }
}