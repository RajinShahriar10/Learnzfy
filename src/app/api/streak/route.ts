import { prisma } from "@/lib/prisma"
import { NextRequest } from "next/server"
import { ok, err, validation, serverError, requireAuth } from "@/lib/api-helpers"
import { calculateStreak, getActivityDaysForCalendar, getStreakMultiplier, getBaseXpForActivity, checkAndAwardMilestones, getStreakConfig } from "@/lib/streak"

export async function GET() {
  try {
    const { session, error } = await requireAuth()
    if (error) return error

    const [streak, activityDays, milestones, xp] = await Promise.all([
      calculateStreak(session.user.id),
      getActivityDaysForCalendar(session.user.id, 3),
      prisma.streakMilestone.findMany({
        where: { userId: session.user.id },
        orderBy: { days: "asc" },
      }),
      prisma.xP.findUnique({ where: { userId: session.user.id } }),
    ])

    const multiplier = getStreakMultiplier(streak.current)

    return ok({
      current: streak.current,
      longest: streak.longest,
      thisWeek: streak.thisWeek,
      thisMonth: streak.thisMonth,
      multiplier,
      xp: xp?.points ?? 0,
      nextMilestone: getNextMilestone(streak.current),
      activityDays: Object.fromEntries(activityDays),
      milestones: milestones.map((m) => ({
        days: m.days,
        xpAwarded: m.xpAwarded,
        unlockedAt: m.unlockedAt.toISOString(),
      })),
    })
  } catch (e) {
    return serverError(e)
  }
}

function getNextMilestone(current: number) {
  const MILESTONES = [1, 7, 14, 30, 60, 100, 365]
  for (const m of MILESTONES) {
    if (current < m) return m
  }
  return null
}
