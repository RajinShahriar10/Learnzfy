import { NextRequest } from "next/server"
import { ok, serverError } from "@/lib/api-helpers"
import { getPopularSearches } from "@/lib/search"

export async function GET() {
  try {
    const popular = await getPopularSearches()
    return ok(popular)
  } catch (e) {
    return serverError(e)
  }
}
