import { ok, err, serverError, requireAuth } from "@/lib/api-helpers"
import { getTutorConversation } from "@/lib/ai/tutor"

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ conversationId: string }> }
) {
  const { session, error } = await requireAuth()
  if (error) return error

  const { conversationId } = await ctx.params

  try {
    const conversation = await getTutorConversation(session!.user.id, conversationId)
    return ok(conversation)
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Conversation not found") {
      return err("Conversation not found", 404)
    }
    return serverError(error)
  }
}