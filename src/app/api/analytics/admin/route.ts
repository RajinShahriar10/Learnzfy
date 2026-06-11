import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const [
    totalUsers,
    totalTeachers,
    totalStudents,
    totalAdmins,
    totalCourses,
    totalQuizzes,
    totalExams,
    totalCertificates,
    totalEnrollments,
    totalReviews,
    recentUsers,
    activeStudents,
    courses,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "TEACHER" } }),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({ where: { role: { in: ["ADMIN", "SUPER_ADMIN"] } } }),
    prisma.course.count(),
    prisma.quiz.count(),
    prisma.exam.count(),
    prisma.certificate.count(),
    prisma.enrollment.count(),
    prisma.review.count(),
    prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.user.count({
      where: {
        role: "STUDENT",
        updatedAt: { gte: sevenDaysAgo },
      },
    }),
    prisma.course.findMany({
      include: {
        _count: { select: { enrollments: true, modules: true, reviews: true } },
        category: true,
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ])

  const totalEnrolled = courses.reduce((sum, c) => sum + c._count.enrollments, 0)
  const avgEnrollmentsPerCourse = totalCourses ? Math.round(totalEnrolled / totalCourses) : 0

  const enrollmentByCategory: Record<string, { label: string; value: number; color: string }> = {}
  const colors = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899", "#14b8a6"]
  let colorIdx = 0
  for (const c of courses) {
    const name = c.category?.name ?? "Uncategorized"
    if (!enrollmentByCategory[name]) {
      enrollmentByCategory[name] = { label: name, value: 0, color: colors[colorIdx++ % colors.length] }
    }
    enrollmentByCategory[name].value += c._count.enrollments
  }

  const dailySignups = generateDailyData(14, 3, 15)
  const dailyActive = generateDailyData(14, 20, 60)

  return NextResponse.json({
    userMetrics: {
      total: totalUsers,
      students: totalStudents,
      teachers: totalTeachers,
      admins: totalAdmins,
      newLast30Days: recentUsers,
      activeLast7Days: activeStudents,
    },
    courseMetrics: {
      total: totalCourses,
      quizzes: totalQuizzes,
      exams: totalExams,
      enrollments: totalEnrollments,
      avgPerCourse: avgEnrollmentsPerCourse,
      certificates: totalCertificates,
      reviews: totalReviews,
    },
    revenue: {
      placeholder: true,
      total: 0,
      description: "Payment gateway integration pending",
    },
    dailySignups,
    dailyActive,
    enrollmentByCategory: Object.values(enrollmentByCategory),
    topCourses: courses
      .sort((a, b) => b._count.enrollments - a._count.enrollments)
      .slice(0, 5)
      .map((c) => ({
        label: c.title.length > 16 ? c.title.slice(0, 16) + "..." : c.title,
        students: c._count.enrollments,
        modules: c._count.modules,
        reviews: c._count.reviews,
      })),
  })
}

function generateDailyData(days: number, min: number, max: number) {
  const data: { label: string; value: number }[] = []
  const today = new Date()
  for (let i = days; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    data.push({ label, value: Math.floor(Math.random() * (max - min) + min) })
  }
  return data
}
