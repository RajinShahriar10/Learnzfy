import { NextRequest } from "next/server"
import { ok, err, serverError, requireRole, withRateLimit } from "@/lib/api-helpers"
import { ROLES } from "@/config/routes"
import { generateQuizQuestions } from "@/lib/ai/quizgen"

export async function POST(req: NextRequest) {
  const rateHit = withRateLimit(req, { max: 20, windowMs: 60000 })
  if (rateHit) return rateHit

  const { session, error } = await requireRole(ROLES.TEACHER)
  if (error) return error

  let body: {
    lessonId?: string
    courseId?: string
    title?: string
    description?: string
    count?: number
    types?: string[]
    language?: string
  }
  try {
    body = await req.json()
  } catch {
    return err("Invalid JSON", 400)
  }

  if (body.count !== undefined && (body.count < 1 || body.count > 12)) {
    return err("count must be between 1 and 12", 422)
  }

  try {
    if (!body.lessonId && !body.courseId && !body.title && !body.description) {
      return err("Provide a lessonId, courseId, or title so the AI has content to generate from", 422)
    }

    const result = await generateQuizQuestions({
      userId: session!.user.id,
      lessonId: body.lessonId,
      courseId: body.courseId,
      title: body.title,
      description: body.description,
      count: body.count,
      types: (body.types || undefined) as ("mcq" | "true-false" | "multiple-select")[] | undefined,
      language: body.language === "bn" ? "bn" : "en",
    })
    return ok(result)
  } catch (error) {
    return serverError(error)
  }
}