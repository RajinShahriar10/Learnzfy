import { NextRequest } from "next/server"
import { ok, serverError, unauthorized } from "@/lib/api-helpers"
import { getRecentSearches } from "@/lib/search"
import { auth } from "@/lib/auth"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()

    const recent = await getRecentSearches(session.user.id)
    return ok(recent)
  } catch (e) {
    return serverError(e)
  }
}
