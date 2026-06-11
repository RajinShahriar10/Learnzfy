import { NextRequest } from "next/server"
import { ok, serverError, validation } from "@/lib/api-helpers"
import { getSuggestions } from "@/lib/search"

export async function GET(req: NextRequest) {
  try {
    const q = new URL(req.url).searchParams.get("q") || ""
    if (!q || q.trim().length < 2) return ok([])

    const suggestions = await getSuggestions(q)
    return ok(suggestions)
  } catch (e) {
    return serverError(e)
  }
}
