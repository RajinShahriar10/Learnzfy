"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Zap,
  Flame,
  TrendingUp,
  BookOpen,
  Award,
  ChevronRight,
  Compass,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { ContinueLearning } from "@/components/recommendations/continue-learning"
import { RecommendedCourses } from "@/components/recommendations/recommended-courses"
import { TrendingCourses } from "@/components/recommendations/trending-courses"
import { RecommendedTeachers } from "@/components/recommendations/recommended-teachers"

function XpBar({ current, nextLevel, level }: { current: number; nextLevel: number; level: number }) {
  const xpInLevel = current % nextLevel
  const xpForNext = nextLevel
  const progress = (xpInLevel / xpForNext) * 100

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Level {level}</span>
        <span className="text-muted-foreground">{current.toLocaleString()} XP</span>
      </div>
      <div className="relative h-3 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-gradient-to-r from-orange-400 to-primary transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        {xpForNext - xpInLevel} XP to next level
      </p>
    </div>
  )
}

function StreakDisplay({ current, longest }: { current: number; longest: number }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">
          <Flame className="h-5 w-5 text-orange-500" />
        </div>
        <div>
          <div className="text-2xl font-bold">{current}</div>
          <div className="text-xs text-muted-foreground">day streak</div>
        </div>
      </div>
      <div className="h-8 w-px bg-border" />
      <div className="text-sm text-muted-foreground">
        Longest: <span className="font-semibold text-foreground">{longest} days</span>
      </div>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: any
  label: string
  value: string | number
  sub?: string
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-sm text-muted-foreground">{label}</div>
            {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function StudentDashboard() {
  const { data: session, status: authStatus } = useSession()
  const [recommendations, setRecommendations] = useState<any>(null)
  const [recsLoading, setRecsLoading] = useState(true)

  useEffect(() => {
    if (authStatus === "unauthenticated") redirect("/login")
    if (authStatus !== "authenticated") return

    fetch("/api/recommendations")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setRecommendations(res.data)
      })
      .finally(() => setRecsLoading(false))
  }, [authStatus])

  const initials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("") || "S"

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 ring-2 ring-primary/20">
            <AvatarFallback className="bg-primary/10 text-primary text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {session?.user?.name?.split(" ")[0] || "Student"}
            </h1>
            <p className="text-sm text-muted-foreground">
              Here&apos;s your personalized learning dashboard
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/student/recommendations">
            <Button variant="outline" size="sm" className="gap-2">
              <Compass className="h-4 w-4" />
              Recommendations
            </Button>
          </Link>
          <Link href="/student/profile">
            <Button variant="outline" size="sm">
              Edit Profile
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Zap} label="Total XP" value="8,750" sub="Level 28" />
        <StatCard icon={TrendingUp} label="Current Rank" value="#5" sub="Gold" />
        <StatCard icon={BookOpen} label="Courses Enrolled" value="6" sub="3 completed" />
        <StatCard icon={Award} label="Certificates" value="3" />
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          <XpBar current={8750} nextLevel={2500} level={28} />
          <StreakDisplay current={12} longest={45} />
        </CardContent>
      </Card>

      {recsLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {recommendations?.continueLearning && recommendations.continueLearning.length > 0 && (
            <ContinueLearning courses={recommendations.continueLearning} />
          )}

          {recommendations?.recommendedCourses && recommendations.recommendedCourses.length > 0 && (
            <RecommendedCourses
              courses={recommendations.recommendedCourses.slice(0, 4)}
            />
          )}

          {recommendations?.trendingCourses && recommendations.trendingCourses.length > 0 && (
            <TrendingCourses courses={recommendations.trendingCourses.slice(0, 4)} />
          )}

          {recommendations?.recommendedTeachers && recommendations.recommendedTeachers.length > 0 && (
            <RecommendedTeachers teachers={recommendations.recommendedTeachers.slice(0, 3)} />
          )}
        </>
      )}

      {!recsLoading && !recommendations?.continueLearning?.length && (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <Compass className="mx-auto h-10 w-10 text-muted-foreground/40" />
          <h3 className="mt-3 font-semibold">Start Learning to Get Recommendations</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            Enroll in a course and we&apos;ll personalize your dashboard
          </p>
          <Link href="/courses">
            <Button>Browse Courses</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
