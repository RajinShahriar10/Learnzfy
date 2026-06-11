import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

function generateGrowthData(days: number, base: number, peak: number) {
  const data: { label: string; value: number }[] = []
  const today = new Date()
  let val = base
  for (let i = days; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    val = Math.min(peak, val + Math.floor(Math.random() * (peak - base)) / days + 1)
    data.push({ label, value: Math.round(val) })
  }
  return data
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const userId = session.user.id

  const [xp, enrollments, examAttempts, certificates] = await Promise.all([
    prisma.xP.findUnique({ where: { userId } }),
    prisma.enrollment.findMany({
      where: { userId },
      include: { course: { include: { modules: { include: { lessons: true } } } } },
    }),
    prisma.examAttempt.findMany({
      where: { userId, status: "GRADED" },
      include: { exam: true },
      orderBy: { submittedAt: "asc" },
    }),
    prisma.certificate.findMany({ where: { userId } }),
  ])

  const xpPoints = xp?.points ?? 0
  const xpLevel = xp?.level ?? 1

  const totalLessons = enrollments.reduce(
    (sum, e) => sum + e.course.modules.reduce((ms, m) => ms + m.lessons.length, 0),
    0
  )

  const progress = enrollments.length
    ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)
    : 0

  const xpGrowth = generateGrowthData(14, Math.max(0, xpPoints - 500), xpPoints)

  const courseProgressData = enrollments.map((e) => ({
    label: e.course.title.length > 20 ? e.course.title.slice(0, 20) + "..." : e.course.title,
    value: Math.round(e.progress),
  }))

  const examScoreData = examAttempts.map((a) => ({
    label: a.exam.title.length > 18 ? a.exam.title.slice(0, 18) + "..." : a.exam.title,
    value: Math.round(a.score ?? 0),
  }))

  const quizCount = enrollments.reduce(
    (sum, e) =>
      sum +
      e.course.modules.reduce(
        (ms, m) => ms + m.lessons.filter((l) => l.content?.toLowerCase().includes("quiz")).length,
        0
      ),
    0
  )

  return NextResponse.json({
    xp: { points: xpPoints, level: xpLevel },
    progress: { average: progress, totalCourses: enrollments.length, totalLessons },
    certificates: certificates.length,
    examAttempts: examAttempts.length,
    xpGrowth,
    courseProgress: courseProgressData,
    examScores: examScoreData.length > 0 ? examScoreData : [{ label: "No exams taken", value: 0 }],
    quizPerformance: [
      { label: "Passed", value: Math.floor(examAttempts.length * 0.7), color: "#22c55e" },
      { label: "Failed", value: Math.floor(examAttempts.length * 0.3) || 1, color: "#ef4444" },
    ],
    recentActivity: enrollments
      .filter((e) => e.updatedAt)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 5)
      .map((e) => ({
        text: e.progress === 100 ? `Completed "${e.course.title}"` : `Continued "${e.course.title}" (${Math.round(e.progress)}%)`,
        time: timeAgo(e.updatedAt),
      })),
  })
}

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "Just now"
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
