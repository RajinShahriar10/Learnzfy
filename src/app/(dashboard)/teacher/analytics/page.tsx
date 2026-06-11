"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart } from "@/components/charts/area-chart"
import { BarChart } from "@/components/charts/bar-chart"
import { PieChart } from "@/components/charts/pie-chart"
import { Loader2, Users, BookOpen, TrendingUp, Star, GraduationCap, BarChart3 } from "lucide-react"

interface CoursePerf {
  label: string
  students: number
  completionRate: number
  rating: number
  modules: number
}

interface AnalyticsData {
  totalStudents: number
  totalCourses: number
  publishedCourses: number
  avgCompletionRate: number
  avgRating: number
  totalCompletions: number
  coursePerformance: CoursePerf[]
  monthlyEnrollments: { label: string; value: number }[]
  enrollmentByCourse: { label: string; value: number; color: string }[]
  completionDistribution: { label: string; value: number; color: string }[]
}

export default function TeacherAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/analytics/teacher")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!data) {
    return <div className="text-center py-20 text-muted-foreground">Failed to load analytics</div>
  }

  const statCards = [
    {
      icon: Users,
      label: "Total Students",
      value: data.totalStudents.toLocaleString(),
      color: "text-blue-500 bg-blue-100 dark:bg-blue-900/30",
    },
    {
      icon: BookOpen,
      label: "Courses",
      value: data.totalCourses,
      sub: `${data.publishedCourses} published`,
      color: "text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30",
    },
    {
      icon: TrendingUp,
      label: "Avg Completion",
      value: `${data.avgCompletionRate}%`,
      sub: `${data.totalCompletions} completed`,
      color: "text-violet-500 bg-violet-100 dark:bg-violet-900/30",
    },
    {
      icon: Star,
      label: "Avg Rating",
      value: data.avgRating.toFixed(1),
      color: "text-amber-500 bg-amber-100 dark:bg-amber-900/30",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Insights into your course performance and student engagement
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.label}>
              <CardContent className="flex items-center gap-4 p-6">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  {s.sub && <p className="text-[11px] text-muted-foreground/60">{s.sub}</p>}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4 text-primary" />
              Monthly Enrollments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AreaChart
              data={data.monthlyEnrollments}
              dataKeys={[{ key: "value", color: "#3b82f6", label: "Enrollments" }]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <GraduationCap className="h-4 w-4 text-primary" />
              Completion Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <PieChart
              data={data.completionDistribution}
              height={240}
              innerRadius={60}
              outerRadius={90}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4 text-primary" />
              Enrollment by Course
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={data.enrollmentByCourse}
              dataKeys={[{ key: "value", color: "#3b82f6", label: "Students" }]}
              layout="vertical"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Course Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-2 text-xs font-medium text-muted-foreground pb-2 border-b">
                <span className="col-span-1">Course</span>
                <span className="text-right">Students</span>
                <span className="text-right">Completion</span>
                <span className="text-right">Rating</span>
              </div>
              {data.coursePerformance.map((c, i) => (
                <div key={i} className="grid grid-cols-4 gap-2 text-sm items-center py-1">
                  <span className="col-span-1 font-medium truncate">{c.label}</span>
                  <span className="text-right text-muted-foreground">{c.students}</span>
                  <span className={`text-right font-medium ${c.completionRate >= 70 ? "text-emerald-600" : c.completionRate >= 50 ? "text-amber-600" : "text-rose-600"}`}>
                    {c.completionRate}%
                  </span>
                  <span className="text-right text-muted-foreground">{c.rating}</span>
                </div>
              ))}
              {data.coursePerformance.length === 0 && (
                <p className="text-sm text-muted-foreground py-4 text-center">No course data yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
