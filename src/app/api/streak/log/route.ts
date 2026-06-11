import { prisma } from "@/lib/prisma"
import { NextRequest } from "next/server"
import { ok, created, validation, serverError, requireAuth } from "@/lib/api-helpers"
import { getStreakMultiplier, getBaseXpForActivity, getStreakConfig, checkAndAwardMilestones, calculateStreak } from "@/lib/streak"

export async function POST(req: NextRequest) {
  try {
    const { session, error } = await requireAuth()
    if (error) return error

    const body = await req.json()
    const { type, courseId, lessonId } = body

    const validTypes = ["LESSON_WATCHED", "QUIZ_PASSED", "EXAM_TAKEN", "COURSE_COMPLETED"]
    if (!type || !validTypes.includes(type)) return validation("Invalid activity type")

    const baseXp = getBaseXpForActivity(type)

    const streak = await calculateStreak(session.user.id)
    const multiplier = getStreakMultiplier(streak.current)
    const xpEarned = Math.round(baseXp * multiplier)

    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        type,
        courseId: courseId ?? null,
        lessonId: lessonId ?? null,
        xpEarned,
      },
    })

    await prisma.xP.upsert({
      where: { userId: session.user.id },
      create: { userId: session.user.id, points: xpEarned, level: 1 },
      update: { points: { increment: xpEarned } },
    })

    const newStreak = await calculateStreak(session.user.id)
    const newMultiplier = getStreakMultiplier(newStreak.current)
    const awarded = await checkAndAwardMilestones(session.user.id, newStreak.current)

    return created({
      xpEarned,
      multiplier: newMultiplier,
      currentStreak: newStreak.current,
      longestStreak: newStreak.longest,
      milestonesAwarded: awarded,
    })
  } catch (e) {
    return serverError(e)
  }
}
