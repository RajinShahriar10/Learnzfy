import { submitApplication, getOwnApplication } from "@/lib/teacher-application"
import { ok, created, serverError, err } from "@/lib/api-helpers"

export async function GET() {
  try {
    const application = await getOwnApplication()
    return ok(application)
  } catch (error) {
    return serverError(error)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body.fullName?.trim()) return err("Full name is required", 422)
    const application = await submitApplication(body)
    return created(application)
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401 })
    }
    if (error.message?.includes("pending application")) {
      return err(error.message, 409)
    }
    return serverError(error)
  }
}
