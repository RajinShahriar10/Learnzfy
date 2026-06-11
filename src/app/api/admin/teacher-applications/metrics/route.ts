import { requireRole } from "@/lib/rbac"
import { getTeacherMetrics } from "@/lib/teacher-application"
import { ok, serverError } from "@/lib/api-helpers"

export async function GET() {
  try {
    await requireRole("ADMIN")
    const metrics = await getTeacherMetrics()
    return ok(metrics)
  } catch (error) {
    return serverError(error)
  }
}
