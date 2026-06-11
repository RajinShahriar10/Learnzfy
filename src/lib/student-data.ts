import { courses, leaderboard } from "./mock-data"

export interface EnrolledCourse {
  id: string
  courseId: string
  progress: number
  lastAccessedAt: string
  enrolledAt: string
  completedModules: number
  totalModules: number
  certificateEarned: boolean
}

export interface NotificationItem {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "achievement"
  isRead: boolean
  createdAt: string
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt: string | null
  progress: number
  total: number
}

export interface Certificate {
  id: string
  courseId: string
  courseName: string
  issuedAt: string
  certificateUrl: string
  grade: string
}

export const studentStats = {
  xp: 8750,
  xpToNextLevel: 2500,
  level: 28,
  rank: 5,
  tier: "Gold",
  streak: 12,
  longestStreak: 45,
  coursesEnrolled: 6,
  coursesCompleted: 3,
  certificatesEarned: 2,
  totalHoursLearned: 186,
}

export const enrolledCourses: EnrolledCourse[] = [
  {
    id: "e1",
    courseId: "1",
    progress: 75,
    lastAccessedAt: "2026-06-10T14:30:00Z",
    enrolledAt: "2026-01-15T10:00:00Z",
    completedModules: 9,
    totalModules: 12,
    certificateEarned: false,
  },
  {
    id: "e2",
    courseId: "2",
    progress: 100,
    lastAccessedAt: "2026-05-20T09:15:00Z",
    enrolledAt: "2026-02-01T08:00:00Z",
    completedModules: 10,
    totalModules: 10,
    certificateEarned: true,
  },
  {
    id: "e3",
    courseId: "3",
    progress: 100,
    lastAccessedAt: "2026-04-10T16:45:00Z",
    enrolledAt: "2026-01-20T12:00:00Z",
    completedModules: 8,
    totalModules: 8,
    certificateEarned: true,
  },
  {
    id: "e4",
    courseId: "4",
    progress: 30,
    lastAccessedAt: "2026-06-08T11:00:00Z",
    enrolledAt: "2026-03-10T14:00:00Z",
    completedModules: 4,
    totalModules: 14,
    certificateEarned: false,
  },
  {
    id: "e5",
    courseId: "7",
    progress: 45,
    lastAccessedAt: "2026-06-09T10:30:00Z",
    enrolledAt: "2026-04-05T09:00:00Z",
    completedModules: 7,
    totalModules: 16,
    certificateEarned: false,
  },
  {
    id: "e6",
    courseId: "9",
    progress: 100,
    lastAccessedAt: "2026-03-25T13:20:00Z",
    enrolledAt: "2026-02-20T11:00:00Z",
    completedModules: 6,
    totalModules: 6,
    certificateEarned: true,
  },
]

export const notifications: NotificationItem[] = [
  {
    id: "n1",
    title: "Course Completed!",
    message: "Congratulations! You've completed 'Python for Data Science'.",
    type: "success",
    isRead: false,
    createdAt: "2026-05-20T09:15:00Z",
  },
  {
    id: "n2",
    title: "New Achievement Unlocked",
    message: "You earned the 'Knowledge Seeker' badge for enrolling in 5 courses.",
    type: "achievement",
    isRead: false,
    createdAt: "2026-06-08T11:00:00Z",
  },
  {
    id: "n3",
    title: "Streak at Risk!",
    message: "Complete a lesson today to keep your 12-day streak alive.",
    type: "warning",
    isRead: true,
    createdAt: "2026-06-10T08:00:00Z",
  },
  {
    id: "n4",
    title: "New Course Available",
    message: "Check out 'DevOps & Cloud Computing' by David Kim.",
    type: "info",
    isRead: true,
    createdAt: "2026-06-07T12:00:00Z",
  },
  {
    id: "n5",
    title: "Level Up!",
    message: "You've reached Level 28! Keep up the great work.",
    type: "achievement",
    isRead: true,
    createdAt: "2026-06-05T15:30:00Z",
  },
]

export const achievements: Achievement[] = [
  {
    id: "a1",
    name: "Quick Starter",
    description: "Complete your first lesson",
    icon: "rocket",
    unlockedAt: "2026-01-15T10:30:00Z",
    progress: 1,
    total: 1,
  },
  {
    id: "a2",
    name: "Knowledge Seeker",
    description: "Enroll in 5 courses",
    icon: "book",
    unlockedAt: "2026-06-08T11:00:00Z",
    progress: 6,
    total: 5,
  },
  {
    id: "a3",
    name: "Course Completer",
    description: "Complete your first course",
    icon: "trophy",
    unlockedAt: "2026-04-10T16:45:00Z",
    progress: 1,
    total: 1,
  },
  {
    id: "a4",
    name: "Dedicated Learner",
    description: "Maintain a 30-day learning streak",
    icon: "flame",
    unlockedAt: null,
    progress: 12,
    total: 30,
  },
  {
    id: "a5",
    name: "Quiz Master",
    description: "Score 100% on 10 quizzes",
    icon: "brain",
    unlockedAt: null,
    progress: 7,
    total: 10,
  },
  {
    id: "a6",
    name: "Certified Graduate",
    description: "Earn 5 certificates",
    icon: "award",
    unlockedAt: null,
    progress: 2,
    total: 5,
  },
  {
    id: "a7",
    name: "Centurion",
    description: "Earn 100,000 XP",
    icon: "zap",
    unlockedAt: null,
    progress: 8750,
    total: 100000,
  },
  {
    id: "a8",
    name: "Social Butterfly",
    description: "Leave 10 course reviews",
    icon: "message",
    unlockedAt: null,
    progress: 3,
    total: 10,
  },
]

export const certificates: Certificate[] = [
  {
    id: "c1",
    courseId: "2",
    courseName: "Python for Data Science",
    issuedAt: "2026-05-20T09:15:00Z",
    certificateUrl: "/certificates/python-data-science.pdf",
    grade: "A",
  },
  {
    id: "c2",
    courseId: "3",
    courseName: "UI/UX Design Fundamentals",
    issuedAt: "2026-04-10T16:45:00Z",
    certificateUrl: "/certificates/ui-ux-design.pdf",
    grade: "A+",
  },
  {
    id: "c3",
    courseId: "9",
    courseName: "Graphic Design for Beginners",
    issuedAt: "2026-03-25T13:20:00Z",
    certificateUrl: "/certificates/graphic-design.pdf",
    grade: "A",
  },
]

export function getEnrolledCourseById(courseId: string) {
  return enrolledCourses.find((e) => e.courseId === courseId)
}

export function getEnrolledCourseDetails() {
  return enrolledCourses.map((enrolled) => {
    const course = courses.find((c) => c.id === enrolled.courseId)
    return { ...enrolled, course }
  })
}

export function getCurrentLeaderboard() {
  return leaderboard
}

export const tierInfo = {
  current: "Gold" as const,
  next: "Platinum" as const,
  tiers: [
    { name: "Bronze", minXp: 0, color: "text-amber-700" },
    { name: "Silver", minXp: 1000, color: "text-gray-400" },
    { name: "Gold", minXp: 5000, color: "text-yellow-500" },
    { name: "Platinum", minXp: 15000, color: "text-sky-400" },
    { name: "Diamond", minXp: 30000, color: "text-cyan-400" },
    { name: "Legend", minXp: 50000, color: "text-purple-400" },
  ],
}
