import { requireRole } from "@/lib/rbac"
import { listApplications, getTeacherMetrics } from "@/lib/teacher-application"
import { ok, serverError } from "@/lib/api-helpers"

export async function GET(request: Request) {
  try {
    await requireRole("ADMIN")
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") ?? undefined
    const search = searchParams.get("search") ?? undefined
    const result = await listApplications(status, search)
    return ok(result)
  } catch (error) {
    return serverError(error)
  }
}
