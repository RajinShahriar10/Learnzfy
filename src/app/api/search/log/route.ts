import { NextRequest } from "next/server"
import { ok, serverError, validation } from "@/lib/api-helpers"
import { logSearch } from "@/lib/search"
import { auth } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    if (!body.query || typeof body.query !== "string") return validation("query is required")

    const session = await auth()
    logSearch(body.query, session?.user?.id)

    return ok({ logged: true })
  } catch (e) {
    return serverError(e)
  }
}
