import { getUserRecommendations } from "@/lib/recommendations"
import { ok, serverError, unauthorized } from "@/lib/api-helpers"

export async function GET() {
  try {
    const data = await getUserRecommendations()
    return ok(data)
  } catch (error: any) {
    if (error.message === "Unauthorized") return unauthorized()
    return serverError(error)
  }
}
