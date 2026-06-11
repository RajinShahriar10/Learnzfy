export interface XpRule {
  action: string
  description: string
  baseXp: number
  canEdit: boolean
}

export interface Tier {
  name: string
  minXp: number
  color: string
  icon: string
}

export interface LeaderboardEntry {
  rank: number
  userId: string
  name: string
  avatar: string
  xp: number
  level: number
  tier: string
  isCurrentUser: boolean
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  condition: string
  xpReward: number
  unlockedAt: string | null
  progress: number
  total: number
}

export const defaultXpRules: XpRule[] = [
  { action: "lesson_completed", description: "Lesson Completed", baseXp: 10, canEdit: true },
  { action: "quiz_passed", description: "Quiz Passed", baseXp: 25, canEdit: true },
  { action: "exam_passed", description: "Exam Passed", baseXp: 100, canEdit: true },
  { action: "course_completed", description: "Course Completed", baseXp: 100, canEdit: true },
  { action: "daily_login", description: "Daily Login", baseXp: 5, canEdit: true },
  { action: "achievement_unlocked", description: "Achievement Unlocked", baseXp: 50, canEdit: false },
  { action: "streak_7_days", description: "7-Day Streak Bonus", baseXp: 30, canEdit: true },
  { action: "streak_30_days", description: "30-Day Streak Bonus", baseXp: 100, canEdit: true },
  { action: "top_10_rank", description: "Top 10 Weekly Rank", baseXp: 50, canEdit: true },
]

export const tiers: Tier[] = [
  { name: "Bronze", minXp: 0, color: "text-amber-700", icon: "🥉" },
  { name: "Silver", minXp: 1000, color: "text-gray-400", icon: "🥈" },
  { name: "Gold", minXp: 5000, color: "text-yellow-500", icon: "🥇" },
  { name: "Platinum", minXp: 15000, color: "text-sky-400", icon: "💎" },
  { name: "Diamond", minXp: 30000, color: "text-cyan-400", icon: "💠" },
  { name: "Master", minXp: 50000, color: "text-purple-400", icon: "👑" },
  { name: "Ace", minXp: 100000, color: "text-red-400", icon: "⭐" },
]

export const gamificationAchievements: Achievement[] = [
  {
    id: "first_course",
    name: "First Course",
    description: "Complete your first course",
    icon: "graduation-cap",
    condition: "Complete 1 course",
    xpReward: 50,
    unlockedAt: "2026-04-10T16:45:00Z",
    progress: 1,
    total: 1,
  },
  {
    id: "first_quiz",
    name: "Quiz Novice",
    description: "Pass your first quiz",
    icon: "brain",
    condition: "Pass 1 quiz",
    xpReward: 25,
    unlockedAt: "2026-06-10T15:30:00Z",
    progress: 1,
    total: 1,
  },
  {
    id: "streak_7",
    name: "Week Warrior",
    description: "Maintain a 7-day learning streak",
    icon: "flame",
    condition: "Reach 7-day streak",
    xpReward: 30,
    unlockedAt: "2026-02-10T08:00:00Z",
    progress: 7,
    total: 7,
  },
  {
    id: "top_10",
    name: "Top Contender",
    description: "Reach Top 10 on the weekly leaderboard",
    icon: "trophy",
    condition: "Rank in Top 10 weekly",
    xpReward: 50,
    unlockedAt: "2026-05-15T00:00:00Z",
    progress: 1,
    total: 1,
  },
  {
    id: "exam_champion",
    name: "Exam Champion",
    description: "Pass an exam with 90% or higher",
    icon: "award",
    condition: "Score 90%+ on any exam",
    xpReward: 100,
    unlockedAt: null,
    progress: 84,
    total: 90,
  },
  {
    id: "streak_30",
    name: "Monthly Master",
    description: "Maintain a 30-day learning streak",
    icon: "zap",
    condition: "Reach 30-day streak",
    xpReward: 100,
    unlockedAt: null,
    progress: 12,
    total: 30,
  },
  {
    id: "courses_5",
    name: "Course Collector",
    description: "Complete 5 courses",
    icon: "book",
    condition: "Complete 5 courses",
    xpReward: 100,
    unlockedAt: null,
    progress: 3,
    total: 5,
  },
  {
    id: "xp_100k",
    name: "Centurion",
    description: "Earn 100,000 total XP",
    icon: "zap",
    condition: "Reach 100,000 XP",
    xpReward: 200,
    unlockedAt: null,
    progress: 8750,
    total: 100000,
  },
  {
    id: "quizzes_10",
    name: "Quiz Master",
    description: "Pass 10 quizzes",
    icon: "brain",
    condition: "Pass 10 quizzes",
    xpReward: 75,
    unlockedAt: null,
    progress: 3,
    total: 10,
  },
  {
    id: "exams_3",
    name: "Exam Veteran",
    description: "Pass 3 exams",
    icon: "award",
    condition: "Pass 3 exams",
    xpReward: 150,
    unlockedAt: null,
    progress: 1,
    total: 3,
  },
]

export interface UserGamification {
  xp: number
  level: number
  xpInLevel: number
  xpToNextLevel: number
  tier: string
  streak: number
  longestStreak: number
  lastLoginDate: string
  dailyXpEarned: number
  weeklyXpEarned: number
  monthlyXpEarned: number
}

export const mockUserGamification: UserGamification = {
  xp: 8750,
  level: 28,
  xpInLevel: 750,
  xpToNextLevel: 500,
  tier: "Gold",
  streak: 12,
  longestStreak: 45,
  lastLoginDate: "2026-06-11T00:00:00Z",
  dailyXpEarned: 45,
  weeklyXpEarned: 320,
  monthlyXpEarned: 1850,
}

export function getTierForXp(xp: number): Tier {
  let currentTier = tiers[0]
  for (const tier of tiers) {
    if (xp >= tier.minXp) currentTier = tier
  }
  return currentTier
}

export function getLevelForXp(xp: number): { level: number; xpInLevel: number; xpToNextLevel: number } {
  const xpPerLevel = 300
  const level = Math.floor(xp / xpPerLevel) + 1
  const xpInLevel = xp % xpPerLevel
  return { level, xpInLevel, xpToNextLevel: xpPerLevel - xpInLevel }
}

export function getNextTier(currentTier: string): Tier | null {
  const idx = tiers.findIndex((t) => t.name === currentTier)
  if (idx < tiers.length - 1) return tiers[idx + 1]
  return null
}

export function getTierProgress(xp: number): { currentTier: Tier; nextTier: Tier | null; progress: number } {
  const currentTier = getTierForXp(xp)
  const nextTier = getNextTier(currentTier.name)
  if (!nextTier) return { currentTier, nextTier: null, progress: 100 }
  const range = nextTier.minXp - currentTier.minXp
  const progress = Math.min(100, Math.round(((xp - currentTier.minXp) / range) * 100))
  return { currentTier, nextTier, progress }
}

export const leaderboardData: Record<string, LeaderboardEntry[]> = {
  daily: [
    { rank: 1, userId: "u1", name: "Alex Thompson", avatar: "/avatars/student-1.svg", xp: 450, level: 42, tier: "Diamond", isCurrentUser: false },
    { rank: 2, userId: "u2", name: "Maria Garcia", avatar: "/avatars/student-2.svg", xp: 380, level: 38, tier: "Platinum", isCurrentUser: false },
    { rank: 3, userId: "u3", name: "Priya Patel", avatar: "/avatars/student-3.svg", xp: 310, level: 35, tier: "Gold", isCurrentUser: false },
    { rank: 4, userId: "u4", name: "James Chen", avatar: "/avatars/student-4.svg", xp: 290, level: 31, tier: "Gold", isCurrentUser: false },
    { rank: 5, userId: "u5", name: "Emma Wilson", avatar: "/avatars/student-5.svg", xp: 235, level: 28, tier: "Silver", isCurrentUser: true },
    { rank: 6, userId: "u6", name: "David Kim", avatar: "/avatars/student-6.svg", xp: 200, level: 26, tier: "Silver", isCurrentUser: false },
    { rank: 7, userId: "u7", name: "Sarah Lee", avatar: "/avatars/student-7.svg", xp: 180, level: 24, tier: "Silver", isCurrentUser: false },
    { rank: 8, userId: "u8", name: "Mike Brown", avatar: "/avatars/student-8.svg", xp: 150, level: 22, tier: "Bronze", isCurrentUser: false },
    { rank: 9, userId: "u9", name: "Lisa Wang", avatar: "/avatars/student-9.svg", xp: 120, level: 20, tier: "Bronze", isCurrentUser: false },
    { rank: 10, userId: "u10", name: "Tom Davis", avatar: "/avatars/student-10.svg", xp: 90, level: 18, tier: "Bronze", isCurrentUser: false },
  ],
  weekly: [
    { rank: 1, userId: "u1", name: "Alex Thompson", avatar: "/avatars/student-1.svg", xp: 2850, level: 42, tier: "Diamond", isCurrentUser: false },
    { rank: 2, userId: "u2", name: "Maria Garcia", avatar: "/avatars/student-2.svg", xp: 2420, level: 38, tier: "Platinum", isCurrentUser: false },
    { rank: 3, userId: "u3", name: "Priya Patel", avatar: "/avatars/student-3.svg", xp: 2100, level: 35, tier: "Gold", isCurrentUser: false },
    { rank: 4, userId: "u5", name: "Emma Wilson", avatar: "/avatars/student-5.svg", xp: 1850, level: 28, tier: "Silver", isCurrentUser: true },
    { rank: 5, userId: "u4", name: "James Chen", avatar: "/avatars/student-4.svg", xp: 1720, level: 31, tier: "Gold", isCurrentUser: false },
    { rank: 6, userId: "u6", name: "David Kim", avatar: "/avatars/student-6.svg", xp: 1500, level: 26, tier: "Silver", isCurrentUser: false },
    { rank: 7, userId: "u7", name: "Sarah Lee", avatar: "/avatars/student-7.svg", xp: 1280, level: 24, tier: "Silver", isCurrentUser: false },
    { rank: 8, userId: "u8", name: "Mike Brown", avatar: "/avatars/student-8.svg", xp: 1050, level: 22, tier: "Bronze", isCurrentUser: false },
    { rank: 9, userId: "u9", name: "Lisa Wang", avatar: "/avatars/student-9.svg", xp: 820, level: 20, tier: "Bronze", isCurrentUser: false },
    { rank: 10, userId: "u10", name: "Tom Davis", avatar: "/avatars/student-10.svg", xp: 650, level: 18, tier: "Bronze", isCurrentUser: false },
  ],
  monthly: [
    { rank: 1, userId: "u1", name: "Alex Thompson", avatar: "/avatars/student-1.svg", xp: 12400, level: 42, tier: "Diamond", isCurrentUser: false },
    { rank: 2, userId: "u2", name: "Maria Garcia", avatar: "/avatars/student-2.svg", xp: 10800, level: 38, tier: "Platinum", isCurrentUser: false },
    { rank: 3, userId: "u3", name: "Priya Patel", avatar: "/avatars/student-3.svg", xp: 9200, level: 35, tier: "Gold", isCurrentUser: false },
    { rank: 4, userId: "u4", name: "James Chen", avatar: "/avatars/student-4.svg", xp: 8800, level: 31, tier: "Gold", isCurrentUser: false },
    { rank: 5, userId: "u5", name: "Emma Wilson", avatar: "/avatars/student-5.svg", xp: 7850, level: 28, tier: "Silver", isCurrentUser: true },
    { rank: 6, userId: "u6", name: "David Kim", avatar: "/avatars/student-6.svg", xp: 6200, level: 26, tier: "Silver", isCurrentUser: false },
    { rank: 7, userId: "u7", name: "Sarah Lee", avatar: "/avatars/student-7.svg", xp: 5100, level: 24, tier: "Silver", isCurrentUser: false },
    { rank: 8, userId: "u8", name: "Mike Brown", avatar: "/avatars/student-8.svg", xp: 4300, level: 22, tier: "Bronze", isCurrentUser: false },
    { rank: 9, userId: "u9", name: "Lisa Wang", avatar: "/avatars/student-9.svg", xp: 3500, level: 20, tier: "Bronze", isCurrentUser: false },
    { rank: 10, userId: "u10", name: "Tom Davis", avatar: "/avatars/student-10.svg", xp: 2800, level: 18, tier: "Bronze", isCurrentUser: false },
  ],
  all_time: [
    { rank: 1, userId: "u1", name: "Alex Thompson", avatar: "/avatars/student-1.svg", xp: 15420, level: 42, tier: "Diamond", isCurrentUser: false },
    { rank: 2, userId: "u2", name: "Maria Garcia", avatar: "/avatars/student-2.svg", xp: 12850, level: 38, tier: "Platinum", isCurrentUser: false },
    { rank: 3, userId: "u3", name: "Priya Patel", avatar: "/avatars/student-3.svg", xp: 11200, level: 35, tier: "Gold", isCurrentUser: false },
    { rank: 4, userId: "u4", name: "James Chen", avatar: "/avatars/student-4.svg", xp: 9800, level: 31, tier: "Gold", isCurrentUser: false },
    { rank: 5, userId: "u5", name: "Emma Wilson", avatar: "/avatars/student-5.svg", xp: 8750, level: 28, tier: "Silver", isCurrentUser: true },
    { rank: 6, userId: "u6", name: "David Kim", avatar: "/avatars/student-6.svg", xp: 7200, level: 26, tier: "Silver", isCurrentUser: false },
    { rank: 7, userId: "u7", name: "Sarah Lee", avatar: "/avatars/student-7.svg", xp: 6100, level: 24, tier: "Silver", isCurrentUser: false },
    { rank: 8, userId: "u8", name: "Mike Brown", avatar: "/avatars/student-8.svg", xp: 5300, level: 22, tier: "Bronze", isCurrentUser: false },
    { rank: 9, userId: "u9", name: "Lisa Wang", avatar: "/avatars/student-9.svg", xp: 4500, level: 20, tier: "Bronze", isCurrentUser: false },
    { rank: 10, userId: "u10", name: "Tom Davis", avatar: "/avatars/student-10.svg", xp: 3800, level: 18, tier: "Bronze", isCurrentUser: false },
  ],
}

export function getLeaderboard(type: "daily" | "weekly" | "monthly" | "all_time"): LeaderboardEntry[] {
  return leaderboardData[type] || []
}

export function calculateXp(
  rules: XpRule[],
  action: string,
  multiplier: number = 1
): number {
  const rule = rules.find((r) => r.action === action)
  if (!rule) return 0
  return Math.round(rule.baseXp * multiplier)
}
