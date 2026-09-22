import { NextRequest } from "next/server"
import { ok, err, serverError, requireAuth, withRateLimit } from "@/lib/api-helpers"
import { generateStudyPlan, listStudyPlans } from "@/lib/ai/planner"

export async function POST(req: NextRequest) {
  const rateHit = withRateLimit(req, { max: 20, windowMs: 60000 })
  if (rateHit) return rateHit

  const { session, error } = await requireAuth()
  if (error) return error

  let body: {
    goal?: string
    topic?: string
    hoursPerWeek?: number
    weeks?: number
    language?: string
  }
  try {
    body = await req.json()
  } catch {
    return err("Invalid JSON", 400)
  }

  const goal = (body.goal || "").trim()
  if (!goal) return err("goal is required", 400)
  if (goal.length > 500) return err("goal is too long", 400)

  try {
    const { plan, content } = await generateStudyPlan(session!.user.id, {
      goal,
      topic: body.topic,
      hoursPerWeek: body.hoursPerWeek,
      weeks: body.weeks,
      language: body.language === "bn" ? "bn" : "en",
    })
    return ok({ plan, content })
  } catch (error) {
    return serverError(error)
  }
}

export async function GET() {
  const { session, error } = await requireAuth()
  if (error) return error

  try {
    const plans = await listStudyPlans(session!.user.id)
    return ok(plans)
  } catch (error) {
    return serverError(error)
  }
}