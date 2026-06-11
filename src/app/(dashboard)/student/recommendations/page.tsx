"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Loader2, Compass } from "lucide-react"
import { ContinueLearning } from "@/components/recommendations/continue-learning"
import { RecommendedCourses } from "@/components/recommendations/recommended-courses"
import { TrendingCourses } from "@/components/recommendations/trending-courses"
import { RecommendedTeachers } from "@/components/recommendations/recommended-teachers"

export default function RecommendationsPage() {
  const { data: session, status: authStatus } = useSession()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authStatus === "unauthenticated") redirect("/login")
    if (authStatus !== "authenticated") return

    fetch("/api/recommendations")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setData(res.data)
      })
      .finally(() => setLoading(false))
  }, [authStatus])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Compass className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Recommended for You</h1>
          <p className="text-sm text-muted-foreground">
            Personalized recommendations based on your learning activity
          </p>
        </div>
      </div>

      {data?.continueLearning && data.continueLearning.length > 0 && (
        <ContinueLearning courses={data.continueLearning} />
      )}

      <RecommendedCourses
        courses={data?.recommendedCourses ?? []}
        emptyMessage="Enroll in courses to get personalized recommendations"
      />

      <TrendingCourses courses={data?.trendingCourses ?? []} />

      <RecommendedTeachers teachers={data?.recommendedTeachers ?? []} />
    </div>
  )
}
