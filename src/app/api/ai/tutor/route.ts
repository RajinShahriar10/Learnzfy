import { NextRequest } from "next/server"
import { ok, err, serverError, requireAuth, withRateLimit } from "@/lib/api-helpers"
import { chatWithTutor, listTutorConversations } from "@/lib/ai/tutor"
import { isAiConfigured, aiModeLabel } from "@/lib/ai/providers"

export async function POST(req: NextRequest) {
  const rateHit = withRateLimit(req, { max: 30, windowMs: 60000 })
  if (rateHit) return rateHit

  const { session, error } = await requireAuth()
  if (error) return error

  let body: { message?: string; conversationId?: string; courseId?: string; lessonId?: string }
  try {
    body = await req.json()
  } catch {
    return err("Invalid JSON", 400)
  }

  const message = (body.message || "").trim()
  if (!message) return err("Message is required", 400)
  if (message.length > 2000) return err("Message is too long", 400)

  try {
    const result = await chatWithTutor({
      userId: session!.user.id,
      conversationId: body.conversationId,
      courseId: body.courseId,
      lessonId: body.lessonId,
      message,
    })
    return ok({ ...result, aiConfigured: isAiConfigured(), aiMode: aiModeLabel() })
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Conversation not found") {
      return err("Conversation not found", 404)
    }
    return serverError(error)
  }
}

export async function GET() {
  const { session, error } = await requireAuth()
  if (error) return error

  try {
    const conversations = await listTutorConversations(session!.user.id)
    return ok({ conversations, aiConfigured: isAiConfigured(), aiMode: aiModeLabel() })
  } catch (error) {
    return serverError(error)
  }
}