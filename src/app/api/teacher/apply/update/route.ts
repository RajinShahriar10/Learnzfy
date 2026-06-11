import { updateApplication } from "@/lib/teacher-application"
import { ok, serverError, err } from "@/lib/api-helpers"

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const application = await updateApplication(body)
    return ok(application)
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401 })
    }
    if (error.message?.includes("No application")) return err(error.message, 404)
    if (error.message?.includes("approved") || error.message?.includes("under review")) return err(error.message, 409)
    return serverError(error)
  }
}
