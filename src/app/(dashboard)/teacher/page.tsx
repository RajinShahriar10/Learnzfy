import { auth } from "@/lib/auth"
import { requireRole } from "@/lib/rbac"
import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import {
  BookOpen,
  Users,
  TrendingUp,
  Award,
  GraduationCap,
  BarChart3,
  Layers,
  FileText,
  Star,
} from "lucide-react"

export default async function TeacherDashboard() {
  await requireRole("TEACHER")
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) return null

  const [
    totalStudentsResult,
    totalCourses,
    publishedCourses,
    moduleCount,
    lessonCount,
    reviewsAgg,
    enrollmentsByMonth,
  ] = await Promise.all([
    prisma.enrollment.findMany({
      where: { course: { teacherId: userId } },
      select: { userId: true },
    }),
    prisma.course.count({ where: { teacherId: userId } }),
    prisma.course.count({ where: { teacherId: userId, isPublished: true } }),
    prisma.module.count({ where: { course: { teacherId: userId } } }),
    prisma.lesson.count({ where: { module: { course: { teacherId: userId } } } }),
    prisma.review.findMany({
      where: { course: { teacherId: userId } },
      select: { rating: true },
    }),
    prisma.enrollment.findMany({
      where: { course: { teacherId: userId } },
      select: { enrolledAt: true },
      orderBy: { enrolledAt: "desc" },
      take: 50,
    }),
  ])

  const uniqueStudentIds = new Set(totalStudentsResult.map((e) => e.userId))
  const totalStudents = uniqueStudentIds.size

  const avgRating =
    reviewsAgg.length > 0
      ? Math.round((reviewsAgg.reduce((s, r) => s + r.rating, 0) / reviewsAgg.length) * 10) / 10
      : 0

  const coursesWithStats = await prisma.course.findMany({
    where: { teacherId: userId },
    include: {
      _count: { select: { enrollments: true, modules: true } },
      reviews: { select: { rating: true, isHidden: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  const coursePerformance = coursesWithStats.map((c) => {
    const visibleReviews = c.reviews.filter((r) => !r.isHidden)
    const avg =
      visibleReviews.length > 0
        ? Math.round(
            (visibleReviews.reduce((s, r) => s + r.rating, 0) /
              visibleReviews.length) *
              100
          ) / 100
        : 0
    return {
      name: c.title,
      students: c._count.enrollments,
      completion: 0,
      score: Math.round(avg * 20),
    }
  })

  const stats = [
    {
      label: "Total Students",
      value: totalStudents.toLocaleString(),
      icon: Users,
      color: "text-blue-600 bg-blue-100 dark:bg-blue-950 dark:text-blue-400",
    },
    {
      label: "Total Courses",
      value: totalCourses,
      sub: `${publishedCourses} published`,
      icon: BookOpen,
      color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400",
    },
    {
      label: "Avg Completion",
      value: "0%",
      icon: TrendingUp,
      color: "text-violet-600 bg-violet-100 dark:bg-violet-950 dark:text-violet-400",
    },
    {
      label: "Avg Score",
      value: "0%",
      icon: Award,
      color: "text-amber-600 bg-amber-100 dark:bg-amber-950 dark:text-amber-400",
    },
    {
      label: "Modules Created",
      value: moduleCount,
      icon: Layers,
      color: "text-rose-600 bg-rose-100 dark:bg-rose-950 dark:text-rose-400",
    },
    {
      label: "Lessons Created",
      value: lessonCount,
      icon: FileText,
      color: "text-cyan-600 bg-cyan-100 dark:bg-cyan-950 dark:text-cyan-400",
    },
    {
      label: "Avg Rating",
      value: avgRating.toFixed(1),
      icon: Star,
      color: "text-yellow-600 bg-yellow-100 dark:bg-yellow-950 dark:text-yellow-400",
    },
    {
      label: "Total Modules",
      value: moduleCount,
      icon: BarChart3,
      color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-400",
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome back, {session?.user?.name || "Teacher"}</h1>
        <p className="mt-1 text-muted-foreground">
          Here is an overview of your teaching analytics
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={cn("rounded-lg p-2.5", stat.color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  {stat.sub && (
                    <p className="mt-0.5 text-xs text-muted-foreground">{stat.sub}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 font-semibold">Course Performance</h3>
            <div className="space-y-4">
              {coursePerformance.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No courses yet. Create your first course to see performance data.
                </p>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-2 text-xs font-medium text-muted-foreground pb-2 border-b">
                    <span className="col-span-1">Course</span>
                    <span className="text-right">Students</span>
                    <span className="text-right">Avg Score</span>
                  </div>
                  {coursePerformance.map((c) => (
                    <div key={c.name} className="grid grid-cols-3 gap-2 text-sm items-center">
                      <span className="col-span-1 font-medium truncate">{c.name}</span>
                      <span className="text-right text-muted-foreground">{c.students}</span>
                      <span className="text-right">
                        <span className={cn(
                          "font-medium",
                          c.score >= 80 ? "text-emerald-600" : c.score >= 60 ? "text-amber-600" : "text-rose-600"
                        )}>
                          {c.score}%
                        </span>
                      </span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 font-semibold">Recent Enrollments</h3>
            <div className="space-y-4">
              {enrollmentsByMonth.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No enrollments yet. Students will appear here once they enroll in your courses.
                </p>
              ) : (
                enrollmentsByMonth.slice(0, 5).map((e, i) => (
                  <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                    <div className="mt-0.5 h-2 w-2 rounded-full shrink-0 bg-blue-500" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm">New enrollment</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(e.enrolledAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const cn = (...classes: (string | boolean | undefined | null)[]) =>
  classes.filter(Boolean).join(" ")
