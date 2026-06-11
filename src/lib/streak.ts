import { prisma } from "@/lib/prisma"
import type { ActivityType } from "@prisma/client"

export const STREAK_MILESTONES = [1, 7, 14, 30, 60, 100, 365] as const

export const MILESTONE_LABELS: Record<number, string> = {
  1: "First Day",
  7: "1 Week",
  14: "2 Weeks",
  30: "1 Month",
  60: "2 Months",
  100: "100 Days",
  365: "1 Year",
}

export const DEFAULT_STREAK_XP = {
  multiplier_2: 1.5,
  multiplier_5: 2,
  multiplier_10: 3,
  multiplier_30: 5,
  milestone_1: 10,
  milestone_7: 50,
  milestone_14: 100,
  milestone_30: 250,
  milestone_60: 500,
  milestone_100: 1000,
  milestone_365: 5000,
}

export function getStreakMultiplier(streakDays: number): number {
  if (streakDays >= 30) return 5
  if (streakDays >= 10) return 3
  if (streakDays >= 5) return 2
  if (streakDays >= 2) return 1.5
  return 1
}

export function getBaseXpForActivity(activityType: ActivityType): number {
  switch (activityType) {
    case "LESSON_WATCHED": return 10
    case "QUIZ_PASSED": return 25
    case "EXAM_TAKEN": return 50
    case "COURSE_COMPLETED": return 200
  }
}

export function getXpBonusForMilestone(days: number): number {
  return DEFAULT_STREAK_XP[`milestone_${days}` as keyof typeof DEFAULT_STREAK_XP] ?? 0
}

export async function getStreakConfig() {
  const settings = await prisma.setting.findMany({
    where: { key: { startsWith: "streak_" } },
  })

  const config = { ...DEFAULT_STREAK_XP }

  for (const s of settings) {
    const val = parseFloat(s.value)
    if (!isNaN(val)) {
      const key = s.key.replace("streak_", "") as keyof typeof DEFAULT_STREAK_XP
      if (key in config) (config as any)[key] = val
    }
  }

  return config
}

export async function calculateStreak(userId: string) {
  const logs = await prisma.activityLog.findMany({
    where: { userId },
    select: { createdAt: true },
    orderBy: { createdAt: "desc" },
  })

  if (logs.length === 0) {
    return { current: 0, longest: 0, thisWeek: 0, thisMonth: 0 }
  }

  const activeDays = new Set<string>()
  for (const log of logs) {
    activeDays.add(log.createdAt.toISOString().slice(0, 10))
  }

  const sortedDays = Array.from(activeDays).sort().reverse()

  // Current streak: count consecutive days backwards from today
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = today.toISOString().slice(0, 10)

  let currentStreak = 0
  const checkDate = new Date(today)

  // If no activity today, start checking from yesterday
  if (!activeDays.has(todayStr)) {
    checkDate.setDate(checkDate.getDate() - 1)
  }

  while (true) {
    const dateStr = checkDate.toISOString().slice(0, 10)
    if (activeDays.has(dateStr)) {
      currentStreak++
      checkDate.setDate(checkDate.getDate() - 1)
    } else {
      break
    }
  }

  // Longest streak
  let longest = 0
  let current = 0
  const allSorted = Array.from(activeDays).sort()
  for (let i = 0; i < allSorted.length; i++) {
    if (i === 0) {
      current = 1
    } else {
      const prev = new Date(allSorted[i - 1])
      const curr = new Date(allSorted[i])
      const diffDays = Math.round((curr.getTime() - prev.getTime()) / 86400000)
      if (diffDays === 1) {
        current++
      } else {
        current = 1
      }
    }
    longest = Math.max(longest, current)
  }

  // Weekly count
  const weekAgo = new Date(today)
  weekAgo.setDate(weekAgo.getDate() - 7)
  const thisWeek = sortedDays.filter((d) => d >= weekAgo.toISOString().slice(0, 10)).length

  // Monthly count
  const monthAgo = new Date(today)
  monthAgo.setDate(monthAgo.getDate() - 30)
  const thisMonth = sortedDays.filter((d) => d >= monthAgo.toISOString().slice(0, 10)).length

  return { current: currentStreak, longest, thisWeek, thisMonth }
}

export async function getActivityDaysForCalendar(userId: string, months: number = 3) {
  const since = new Date()
  since.setMonth(since.getMonth() - months)
  since.setHours(0, 0, 0, 0)

  const logs = await prisma.activityLog.findMany({
    where: { userId, createdAt: { gte: since } },
    select: { createdAt: true },
  })

  const activityMap = new Map<string, number>()
  for (const log of logs) {
    const key = log.createdAt.toISOString().slice(0, 10)
    activityMap.set(key, (activityMap.get(key) ?? 0) + 1)
  }

  return activityMap
}

export async function checkAndAwardMilestones(userId: string, currentStreak: number) {
  const awarded: { days: number; xp: number }[] = []

  for (const milestone of STREAK_MILESTONES) {
    if (currentStreak < milestone) continue

    const existing = await prisma.streakMilestone.findUnique({
      where: { userId_days: { userId, days: milestone } },
    })

    if (existing) continue

    const xpBonus = getXpBonusForMilestone(milestone)

    await prisma.streakMilestone.create({
      data: { userId, days: milestone, xpAwarded: xpBonus },
    })

    await prisma.xP.upsert({
      where: { userId },
      create: { userId, points: xpBonus, level: 1 },
      update: { points: { increment: xpBonus } },
    })

    awarded.push({ days: milestone, xp: xpBonus })
  }

  return awarded
}

export async function getAdminStreakStats() {
  const totalUsers = await prisma.user.count({ where: { role: "STUDENT" } })

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = today.toISOString().slice(0, 10)

  const [usersWithActivity, todayActiveGroup, weekActiveGroup] = await Promise.all([
    prisma.activityLog.groupBy({ by: ["userId"], _count: true }),
    prisma.activityLog.groupBy({
      by: ["userId"],
      where: { createdAt: { gte: new Date(todayStr) } },
      _count: true,
    }),
    prisma.activityLog.groupBy({
      by: ["userId"],
      where: { createdAt: { gte: new Date(today.getTime() - 7 * 86400000) } },
      _count: true,
    }),
  ])

  const todayActive = todayActiveGroup.length
  const weekActive = weekActiveGroup.length

  const totalMilestones = await prisma.streakMilestone.count()

  const activityTypeCounts = await prisma.activityLog.groupBy({
    by: ["type"],
    _count: true,
  })

  return {
    totalStudents: totalUsers,
    activeToday: todayActive,
    activeThisWeek: weekActive,
    totalMilestonesAwarded: totalMilestones,
    usersWithAnyActivity: usersWithActivity.length,
    activityBreakdown: activityTypeCounts.map((a) => ({
      type: a.type,
      count: a._count,
    })),
  }
}
