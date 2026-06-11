import { auth } from "@/lib/auth"
import { requireRole } from "@/lib/rbac"
import { teacherAnalytics, teacherInfo } from "@/lib/teacher-data"
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

  const stats = [
    {
      label: "Total Students",
      value: teacherAnalytics.totalStudents.toLocaleString(),
      icon: Users,
      color: "text-blue-600 bg-blue-100 dark:bg-blue-950 dark:text-blue-400",
    },
    {
      label: "Total Courses",
      value: teacherAnalytics.totalCourses,
      sub: `${teacherAnalytics.publishedCourses} published`,
      icon: BookOpen,
      color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400",
    },
    {
      label: "Avg Completion",
      value: `${teacherAnalytics.avgCompletionRate}%`,
      icon: TrendingUp,
      color: "text-violet-600 bg-violet-100 dark:bg-violet-950 dark:text-violet-400",
    },
    {
      label: "Avg Score",
      value: `${teacherAnalytics.avgScore}%`,
      icon: Award,
      color: "text-amber-600 bg-amber-100 dark:bg-amber-950 dark:text-amber-400",
    },
    {
      label: "Modules Created",
      value: teacherAnalytics.totalModules,
      icon: Layers,
      color: "text-rose-600 bg-rose-100 dark:bg-rose-950 dark:text-rose-400",
    },
    {
      label: "Lessons Created",
      value: teacherAnalytics.totalLessons,
      icon: FileText,
      color: "text-cyan-600 bg-cyan-100 dark:bg-cyan-950 dark:text-cyan-400",
    },
    {
      label: "Avg Rating",
      value: teacherAnalytics.avgRating.toFixed(1),
      icon: Star,
      color: "text-yellow-600 bg-yellow-100 dark:bg-yellow-950 dark:text-yellow-400",
    },
    {
      label: "Total Modules",
      value: teacherAnalytics.totalModules,
      icon: BarChart3,
      color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-400",
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome back, {session?.user?.name || teacherInfo.name}</h1>
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
        <CoursePerformanceCard />
        <RecentActivityCard />
      </div>
    </div>
  )
}

function CoursePerformanceCard() {
  const courses = [
    { name: "Web Dev Bootcamp", students: 2340, completion: 68, score: 82 },
    { name: "Advanced React", students: 1120, completion: 72, score: 85 },
    { name: "Flutter Mobile", students: 980, completion: 65, score: 78 },
    { name: "DevOps & Cloud", students: 640, completion: 58, score: 75 },
  ]

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="mb-4 font-semibold">Course Performance</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-2 text-xs font-medium text-muted-foreground pb-2 border-b">
            <span className="col-span-1">Course</span>
            <span className="text-right">Students</span>
            <span className="text-right">Completion</span>
            <span className="text-right">Avg Score</span>
          </div>
          {courses.map((c) => (
            <div key={c.name} className="grid grid-cols-4 gap-2 text-sm items-center">
              <span className="col-span-1 font-medium truncate">{c.name}</span>
              <span className="text-right text-muted-foreground">{c.students}</span>
              <span className="text-right">
                <span className={cn(
                  "font-medium",
                  c.completion >= 70 ? "text-emerald-600" : c.completion >= 60 ? "text-amber-600" : "text-rose-600"
                )}>
                  {c.completion}%
                </span>
              </span>
              <span className="text-right">
                <span className={cn(
                  "font-medium",
                  c.score >= 80 ? "text-emerald-600" : c.score >= 75 ? "text-amber-600" : "text-rose-600"
                )}>
                  {c.score}%
                </span>
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function RecentActivityCard() {
  const activities = [
    { text: "Published 'Web Dev Bootcamp' update", time: "2 hours ago", type: "published" },
    { text: "New enrollment: Alex Thompson", time: "5 hours ago", type: "enrollment" },
    { text: "Module added to 'Advanced React'", time: "1 day ago", type: "module" },
    { text: "Quiz completed by 45 students", time: "2 days ago", type: "quiz" },
    { text: "Course certificate earned: Maria Garcia", time: "3 days ago", type: "certificate" },
  ]

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="mb-4 font-semibold">Recent Activity</h3>
        <div className="space-y-4">
          {activities.map((a, i) => (
            <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
              <div className={cn(
                "mt-0.5 h-2 w-2 rounded-full shrink-0",
                a.type === "published" && "bg-emerald-500",
                a.type === "enrollment" && "bg-blue-500",
                a.type === "module" && "bg-violet-500",
                a.type === "quiz" && "bg-amber-500",
                a.type === "certificate" && "bg-rose-500",
              )} />
              <div className="min-w-0 flex-1">
                <p className="text-sm">{a.text}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

const cn = (...classes: (string | boolean | undefined | null)[]) =>
  classes.filter(Boolean).join(" ")
