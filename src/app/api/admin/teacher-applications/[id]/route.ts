import { requireRole } from "@/lib/rbac"
import { getApplicationDetail } from "@/lib/teacher-application"
import { ok, serverError, notFound } from "@/lib/api-helpers"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole("ADMIN")
    const { id } = await params
    const application = await getApplicationDetail(id)
    if (!application) return notFound("Application")
    return ok(application)
  } catch (error) {
    return serverError(error)
  }
}
