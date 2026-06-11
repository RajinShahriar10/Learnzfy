import { NextRequest } from "next/server"
import { ok, validation, serverError, requireRole } from "@/lib/api-helpers"
import { prisma } from "@/lib/prisma"
import { DEFAULT_STREAK_XP } from "@/lib/streak"

export async function GET() {
  try {
    const { session, error } = await requireRole("ADMIN")
    if (error) return error

    const settings = await prisma.setting.findMany({
      where: { key: { startsWith: "streak_" } },
    })

    const config: Record<string, number> = {}
    for (const [key, value] of Object.entries(DEFAULT_STREAK_XP)) {
      const setting = settings.find((s) => s.key === `streak_${key}`)
      config[key] = setting ? parseFloat(setting.value) : value
    }

    return ok(config)
  } catch (e) {
    return serverError(e)
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { session, error } = await requireRole("ADMIN")
    if (error) return error

    const body = await req.json()

    for (const [key, value] of Object.entries(body)) {
      if (key in DEFAULT_STREAK_XP && typeof value === "number") {
        await prisma.setting.upsert({
          where: { key: `streak_${key}` },
          create: { key: `streak_${key}`, value: String(value) },
          update: { value: String(value) },
        })
      }
    }

    return ok({ message: "Streak configuration updated" })
  } catch (e) {
    return serverError(e)
  }
}
