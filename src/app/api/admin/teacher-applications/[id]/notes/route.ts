import { requireRole } from "@/lib/rbac"
import { addAdminNote } from "@/lib/teacher-application"
import { ok, serverError, validation } from "@/lib/api-helpers"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireRole("ADMIN")
    const { id } = await params
    const body = await request.json()

    if (!body.content?.trim()) return validation("content is required")

    const application = await addAdminNote(id, body.content.trim(), user.name ?? "Admin")
    return ok(application)
  } catch (error: any) {
    if (error.message?.includes("No application")) {
      return new Response(JSON.stringify({ success: false, error: "Application not found" }), { status: 404 })
    }
    return serverError(error)
  }
}
