import { NextRequest } from "next/server"
import { ok, serverError, requireRole } from "@/lib/api-helpers"
import { getAdminStreakStats } from "@/lib/streak"

export async function GET() {
  try {
    const { session, error } = await requireRole("ADMIN")
    if (error) return error

    const stats = await getAdminStreakStats()
    return ok(stats)
  } catch (e) {
    return serverError(e)
  }
}
