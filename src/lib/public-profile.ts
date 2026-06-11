import { prisma } from "@/lib/prisma"
import type { Role } from "@prisma/client"

export type ProfileVisibility = "public" | "private" | "friends_only"

export interface PublicProfileData {
  exists: boolean
  user: {
    id: string
    name: string | null
    email: string
    image: string | null
    role: Role
  } | null
  profile: {
    bio: string | null
    avatarUrl: string | null
    profileVisibility: string
    showOnLeaderboard: boolean
    shareLearningActivity: boolean
  } | null
  xp: {
    points: number
    level: number
  } | null
  badges: {
    id: string
    name: string
    icon: string
    description: string
    earnedAt: Date
  }[]
  certificates: {
    id: string
    studentName: string
    courseName: string
    issuedAt: Date
    status: string
  }[]
  completedCourses: number
  currentStreak: number
  longestStreak: number
  leaderboardRank: number | null
  achievements: {
    id: string
    name: string
    icon: string
    description: string
    progress: number
    total: number
    unlockedAt: Date | null
  }[]
}

export async function getPublicProfile(userId: string): Promise<PublicProfileData> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      profile: {
        select: {
          bio: true,
          avatarUrl: true,
          profileVisibility: true,
          showOnLeaderboard: true,
          shareLearningActivity: true,
        },
      },
      xp: {
        select: { points: true, level: true },
      },
      badges: {
        include: {
          badge: {
            select: { name: true, iconUrl: true, description: true },
          },
        },
        orderBy: { earnedAt: "desc" },
      },
      certificates: {
        select: {
          id: true,
          studentName: true,
          courseName: true,
          issuedAt: true,
          status: true,
        },
        orderBy: { issuedAt: "desc" },
        take: 50,
      },
      enrollments: {
        where: { status: "COMPLETED" },
        select: { id: true },
      },
    },
  })

  if (!user || !user.profile || user.profile.profileVisibility === "private") {
    return {
      exists: false,
      user: null,
      profile: null,
      xp: null,
      badges: [],
      certificates: [],
      completedCourses: 0,
      currentStreak: 0,
      longestStreak: 0,
      leaderboardRank: null,
      achievements: [],
    }
  }

  const shareActivity = user.profile.shareLearningActivity

  const now = new Date()
  now.setHours(0, 0, 0, 0)

  const activityLogs = await prisma.activityLog.findMany({
    where: { userId, createdAt: { gte: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000) } },
    select: { createdAt: true },
    orderBy: { createdAt: "desc" },
  })

  const activityDays = new Set<string>()
  for (const log of activityLogs) {
    activityDays.add(log.createdAt.toISOString().slice(0, 10))
  }

  let currentStreak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = today.toISOString().slice(0, 10)

  if (activityDays.has(todayStr)) {
    currentStreak = 1
    const d = new Date(today)
    while (true) {
      d.setDate(d.getDate() - 1)
      if (activityDays.has(d.toISOString().slice(0, 10))) {
        currentStreak++
      } else {
        break
      }
    }
  } else {
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    if (activityDays.has(yesterday.toISOString().slice(0, 10))) {
      const d = new Date(yesterday)
      while (true) {
        if (activityDays.has(d.toISOString().slice(0, 10))) {
          currentStreak++
          d.setDate(d.getDate() - 1)
        } else {
          break
        }
      }
    }
  }

  let longestStreak = currentStreak
  let run = 0
  const start = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000)
  const cursor = new Date(start)
  while (cursor <= today) {
    if (activityDays.has(cursor.toISOString().slice(0, 10))) {
      run++
      longestStreak = Math.max(longestStreak, run)
    } else {
      run = 0
    }
    cursor.setDate(cursor.getDate() + 1)
  }

  let leaderboardRank: number | null = null
  if (user.profile.showOnLeaderboard && user.xp) {
    const betterCount = await prisma.xP.count({
      where: { points: { gt: user.xp.points } },
    })
    leaderboardRank = betterCount + 1
  }

  const achievements = [
    { id: "first_course", name: "First Steps", icon: "rocket", description: "Complete your first course", progress: user.enrollments.length >= 1 ? 1 : 0, total: 1, unlockedAt: user.enrollments.length >= 1 ? new Date() : null },
    { id: "five_courses", name: "Knowledge Seeker", icon: "book", description: "Complete 5 courses", progress: Math.min(user.enrollments.length, 5), total: 5, unlockedAt: user.enrollments.length >= 5 ? new Date() : null },
    { id: "ten_courses", name: "Scholar", icon: "trophy", description: "Complete 10 courses", progress: Math.min(user.enrollments.length, 10), total: 10, unlockedAt: user.enrollments.length >= 10 ? new Date() : null },
    { id: "streak_7", name: "Week Warrior", icon: "flame", description: "Maintain a 7-day streak", progress: Math.min(longestStreak, 7), total: 7, unlockedAt: longestStreak >= 7 ? new Date() : null },
    { id: "streak_30", name: "Monthly Master", icon: "brain", description: "Maintain a 30-day streak", progress: Math.min(longestStreak, 30), total: 30, unlockedAt: longestStreak >= 30 ? new Date() : null },
    { id: "first_badge", name: "Badge Collector", icon: "award", description: "Earn your first badge", progress: user.badges.length >= 1 ? 1 : 0, total: 1, unlockedAt: user.badges.length >= 1 ? new Date() : null },
    { id: "five_badges", name: "Emblem Hunter", icon: "zap", description: "Earn 5 badges", progress: Math.min(user.badges.length, 5), total: 5, unlockedAt: user.badges.length >= 5 ? new Date() : null },
    { id: "xp_1000", name: "Rising Star", icon: "zap", description: "Earn 1,000 XP", progress: Math.min(user.xp?.points ?? 0, 1000), total: 1000, unlockedAt: (user.xp?.points ?? 0) >= 1000 ? new Date() : null },
    { id: "xp_5000", name: "Power Learner", icon: "award", description: "Earn 5,000 XP", progress: Math.min(user.xp?.points ?? 0, 5000), total: 5000, unlockedAt: (user.xp?.points ?? 0) >= 5000 ? new Date() : null },
    { id: "first_certificate", name: "Certified", icon: "trophy", description: "Earn your first certificate", progress: user.certificates.length >= 1 ? 1 : 0, total: 1, unlockedAt: user.certificates.length >= 1 ? new Date() : null },
  ]

  return {
    exists: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
    },
    profile: user.profile,
    xp: user.xp ? { points: user.xp.points, level: user.xp.level } : null,
    badges: user.badges.map((b) => ({
      id: b.id,
      name: b.badge.name,
      icon: b.badge.iconUrl ?? "award",
      description: b.badge.description ?? "",
      earnedAt: b.earnedAt,
    })),
    certificates: shareActivity ? user.certificates : [],
    completedCourses: shareActivity ? user.enrollments.length : 0,
    currentStreak: shareActivity ? currentStreak : 0,
    longestStreak: shareActivity ? longestStreak : 0,
    leaderboardRank,
    achievements,
  }
}

export async function updatePrivacySettings(userId: string, data: {
  profileVisibility?: ProfileVisibility
  showOnLeaderboard?: boolean
  shareLearningActivity?: boolean
}) {
  const profile = await prisma.profile.upsert({
    where: { userId },
    update: {
      ...(data.profileVisibility !== undefined && { profileVisibility: data.profileVisibility }),
      ...(data.showOnLeaderboard !== undefined && { showOnLeaderboard: data.showOnLeaderboard }),
      ...(data.shareLearningActivity !== undefined && { shareLearningActivity: data.shareLearningActivity }),
    },
    create: {
      userId,
      profileVisibility: data.profileVisibility ?? "public",
      showOnLeaderboard: data.showOnLeaderboard ?? true,
      shareLearningActivity: data.shareLearningActivity ?? true,
    },
    select: {
      profileVisibility: true,
      showOnLeaderboard: true,
      shareLearningActivity: true,
    },
  })

  return profile
}
