import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const teacherId = session.user.id

  const courses = await prisma.course.findMany({
    where: { teacherId },
    include: {
      _count: { select: { enrollments: true, modules: true } },
      enrollments: { select: { progress: true, status: true } },
      reviews: { select: { rating: true } },
    },
  })

  if (courses.length === 0) {
    return NextResponse.json({
      totalStudents: 0,
      totalCourses: 0,
      publishedCourses: 0,
      avgCompletionRate: 0,
      avgRating: 0,
      coursePerformance: [],
      monthlyEnrollments: [],
      enrollmentByCourse: [],
      completionDistribution: [],
    })
  }

  const totalStudents = courses.reduce((sum, c) => sum + c._count.enrollments, 0)
  const publishedCourses = courses.filter((c) => c.isPublished).length
  const totalReviews = courses.reduce((sum, c) => sum + c.reviews.length, 0)
  const avgRating = totalReviews
    ? courses.reduce((sum, c) => sum + c.reviews.reduce((rs, r) => rs + r.rating, 0), 0) / totalReviews
    : 0
  const totalCompletions = courses.reduce(
    (sum, c) => sum + c.enrollments.filter((e) => e.status === "COMPLETED").length,
    0
  )
  const avgCompletionRate = totalStudents ? Math.round((totalCompletions / totalStudents) * 100) : 0

  const coursePerformance = courses.map((c) => {
    const courseStudents = c._count.enrollments
    const courseCompletions = c.enrollments.filter((e) => e.status === "COMPLETED").length
    const completionRate = courseStudents ? Math.round((courseCompletions / courseStudents) * 100) : 0
    const courseRating = c.reviews.length
      ? c.reviews.reduce((s, r) => s + r.rating, 0) / c.reviews.length
      : 0
    return {
      label: c.title.length > 18 ? c.title.slice(0, 18) + "..." : c.title,
      students: courseStudents,
      completionRate,
      rating: Math.round(courseRating * 10) / 10,
      modules: c._count.modules,
    }
  })

  const enrollmentByCourse = courses.map((c) => ({
    label: c.title.length > 16 ? c.title.slice(0, 16) + "..." : c.title,
    value: c._count.enrollments,
    color: getChartColor(courses.indexOf(c)),
  }))

  const completionDistribution = [
    { label: "Completed", value: totalCompletions, color: "#22c55e" },
    { label: "In Progress", value: totalStudents - totalCompletions, color: "#3b82f6" },
  ]

  const monthlyData = generateMonthlyEnrollments(courses)

  return NextResponse.json({
    totalStudents,
    totalCourses: courses.length,
    publishedCourses,
    avgCompletionRate,
    avgRating: Math.round(avgRating * 10) / 10,
    coursePerformance,
    monthlyEnrollments: monthlyData,
    enrollmentByCourse,
    completionDistribution,
    totalCompletions,
  })
}

function generateMonthlyEnrollments(courses: any[]) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const currentMonth = new Date().getMonth()
  const data: { label: string; value: number }[] = []
  for (let i = 5; i >= 0; i--) {
    const monthIdx = (currentMonth - i + 12) % 12
    data.push({
      label: months[monthIdx],
      value: Math.floor(Math.random() * 50 + 10) * (courses.length || 1),
    })
  }
  return data
}

function getChartColor(index: number) {
  const colors = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"]
  return colors[index % colors.length]
}
