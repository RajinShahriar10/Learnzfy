"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart } from "@/components/charts/area-chart"
import { BarChart } from "@/components/charts/bar-chart"
import { LineChart } from "@/components/charts/line-chart"
import { PieChart } from "@/components/charts/pie-chart"
import { Loader2, TrendingUp, Zap, BookOpen, Award, BarChart3 } from "lucide-react"

interface AnalyticsData {
  xp: { points: number; level: number }
  progress: { average: number; totalCourses: number; totalLessons: number }
  certificates: number
  examAttempts: number
  xpGrowth: { label: string; value: number }[]
  courseProgress: { label: string; value: number }[]
  examScores: { label: string; value: number }[]
  quizPerformance: { label: string; value: number; color: string }[]
  recentActivity: { text: string; time: string }[]
}

export default function StudentAnalytics() {
  const { data: session } = useSession()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/analytics/student")
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
      icon: Zap,
      label: "Total XP",
      value: data.xp.points.toLocaleString(),
      sub: `Level ${data.xp.level}`,
      color: "text-amber-500 bg-amber-100 dark:bg-amber-900/30",
    },
    {
      icon: TrendingUp,
      label: "Avg Progress",
      value: `${data.progress.average}%`,
      sub: `${data.progress.totalCourses} courses`,
      color: "text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30",
    },
    {
      icon: BookOpen,
      label: "Lessons",
      value: data.progress.totalLessons.toLocaleString(),
      sub: "across all courses",
      color: "text-blue-500 bg-blue-100 dark:bg-blue-900/30",
    },
    {
      icon: Award,
      label: "Certificates",
      value: data.certificates,
      sub: `${data.examAttempts} exams taken`,
      color: "text-violet-500 bg-violet-100 dark:bg-violet-900/30",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Track your learning performance and growth
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
                  <p className="text-[11px] text-muted-foreground/60">{s.sub}</p>
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
              XP Growth (14 days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AreaChart
              data={data.xpGrowth}
              dataKeys={[{ key: "value", color: "#f59e0b", label: "XP" }]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4 text-primary" />
              Course Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={data.courseProgress}
              dataKeys={[{ key: "value", color: "#3b82f6", label: "Progress" }]}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4 text-primary" />
              Exam Scores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={data.examScores}
              dataKeys={[{ key: "value", color: "#8b5cf6", label: "Score" }]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4 text-primary" />
              Quiz Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <PieChart
              data={data.quizPerformance}
              height={220}
              innerRadius={50}
              outerRadius={80}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentActivity.length === 0 && (
                <p className="text-sm text-muted-foreground">No recent activity</p>
              )}
              {data.recentActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-3 pb-2 border-b last:border-0">
                  <div className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm truncate">{a.text}</p>
                    <p className="text-xs text-muted-foreground">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
