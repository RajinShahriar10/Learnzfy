"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart } from "@/components/charts/area-chart"
import { BarChart } from "@/components/charts/bar-chart"
import { PieChart } from "@/components/charts/pie-chart"
import {
  Loader2,
  Users,
  BookOpen,
  GraduationCap,
  TrendingUp,
  DollarSign,
  Award,
  BarChart3,
  Activity,
} from "lucide-react"

interface AnalyticsData {
  userMetrics: {
    total: number
    students: number
    teachers: number
    admins: number
    newLast30Days: number
    activeLast7Days: number
  }
  courseMetrics: {
    total: number
    quizzes: number
    exams: number
    enrollments: number
    avgPerCourse: number
    certificates: number
    reviews: number
  }
  revenue: {
    placeholder: boolean
    total: number
    description: string
  }
  dailySignups: { label: string; value: number }[]
  dailyActive: { label: string; value: number }[]
  enrollmentByCategory: { label: string; value: number; color: string }[]
  topCourses: { label: string; students: number; modules: number; reviews: number }[]
}

export default function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/analytics/admin")
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
      label: "Total Users",
      value: data.userMetrics.total.toLocaleString(),
      sub: `${data.userMetrics.students} students`,
      color: "text-blue-500 bg-blue-100 dark:bg-blue-900/30",
    },
    {
      icon: GraduationCap,
      label: "Teachers",
      value: data.userMetrics.teachers.toLocaleString(),
      sub: `${data.userMetrics.admins} admins`,
      color: "text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30",
    },
    {
      icon: Activity,
      label: "Active (7d)",
      value: data.userMetrics.activeLast7Days.toLocaleString(),
      sub: `${data.userMetrics.newLast30Days} new (30d)`,
      color: "text-violet-500 bg-violet-100 dark:bg-violet-900/30",
    },
    {
      icon: BookOpen,
      label: "Courses",
      value: data.courseMetrics.total,
      sub: `${data.courseMetrics.enrollments} enrollments`,
      color: "text-amber-500 bg-amber-100 dark:bg-amber-900/30",
    },
    {
      icon: BarChart3,
      label: "Avg Enrollments",
      value: data.courseMetrics.avgPerCourse,
      sub: "per course",
      color: "text-rose-500 bg-rose-100 dark:bg-rose-900/30",
    },
    {
      icon: Award,
      label: "Certificates",
      value: data.courseMetrics.certificates,
      sub: `${data.courseMetrics.quizzes} quizzes, ${data.courseMetrics.exams} exams`,
      color: "text-cyan-500 bg-cyan-100 dark:bg-cyan-900/30",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Platform-wide metrics and engagement data
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {statCards.map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.label}>
              <CardContent className="flex items-center gap-3 p-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${s.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg font-bold">{s.value}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{s.label}</p>
                  {s.sub && <p className="text-[10px] text-muted-foreground/60 truncate">{s.sub}</p>}
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
              <TrendingUp className="h-4 w-4 text-primary" />
              Daily Signups (14 days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AreaChart
              data={data.dailySignups}
              dataKeys={[{ key: "value", color: "#3b82f6", label: "Signups" }]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-4 w-4 text-primary" />
              Daily Active Users (14 days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AreaChart
              data={data.dailyActive}
              dataKeys={[{ key: "value", color: "#22c55e", label: "Active" }]}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="h-4 w-4 text-primary" />
              Enrollments by Category
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <PieChart
              data={data.enrollmentByCategory.length > 0 ? data.enrollmentByCategory : [{ label: "No data", value: 1, color: "#e5e7eb" }]}
              height={240}
              innerRadius={55}
              outerRadius={85}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <DollarSign className="h-4 w-4 text-primary" />
              Revenue Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            {data.revenue.placeholder ? (
              <>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted mb-3">
                  <DollarSign className="h-7 w-7 text-muted-foreground/50" />
                </div>
                <p className="text-lg font-semibold text-muted-foreground">Revenue tracking</p>
                <p className="text-sm text-muted-foreground/60 text-center max-w-xs">
                  {data.revenue.description}. Charts will appear once payment processing is connected.
                </p>
              </>
            ) : (
              <>
                <p className="text-3xl font-bold">${data.revenue.total.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2 text-xs font-medium text-muted-foreground pb-2 border-b">
                <span className="col-span-1">Course</span>
                <span className="text-right">Students</span>
                <span className="text-right">Reviews</span>
              </div>
              {data.topCourses.map((c, i) => (
                <div key={i} className="grid grid-cols-3 gap-2 text-sm items-center py-1">
                  <span className="col-span-1 font-medium truncate">{c.label}</span>
                  <span className="text-right text-muted-foreground">{c.students}</span>
                  <span className="text-right text-muted-foreground">{c.reviews}</span>
                </div>
              ))}
              {data.topCourses.length === 0 && (
                <p className="text-sm text-muted-foreground py-4 text-center">No courses yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="h-4 w-4 text-primary" />
            Enrollment by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart
            data={data.enrollmentByCategory.length > 0 ? data.enrollmentByCategory : [{ label: "No data", value: 0 }]}
            dataKeys={[{ key: "value", color: "#3b82f6", label: "Enrollments" }]}
          />
        </CardContent>
      </Card>
    </div>
  )
}
