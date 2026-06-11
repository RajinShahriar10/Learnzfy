import { NextRequest } from "next/server"
import { ok, serverError, validation, unauthorized } from "@/lib/api-helpers"
import { searchAll, logSearch } from "@/lib/search"
import { auth } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get("q") || ""
    const type = searchParams.get("type") || undefined
    const difficulty = searchParams.get("difficulty") || undefined
    const category = searchParams.get("category") || undefined
    const sort = searchParams.get("sort") || "relevance"
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")

    if (!q || q.trim().length < 1) return validation("Search query is required")

    const results = await searchAll({ q, type, difficulty, category, sort, page, limit })

    // Log search asynchronously (don't await)
    const session = await auth()
    logSearch(q, session?.user?.id)

    return ok(results)
  } catch (e) {
    return serverError(e)
  }
}
