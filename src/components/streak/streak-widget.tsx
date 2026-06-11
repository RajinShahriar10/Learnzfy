"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Flame, Zap, Award, ChevronRight, Trophy } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { StreakCalendar } from "./streak-calendar"

interface StreakData {
  current: number
  longest: number
  thisWeek: number
  thisMonth: number
  multiplier: number
  xp: number
  nextMilestone: number | null
  activityDays: Record<string, number>
  milestones: { days: number; xpAwarded: number; unlockedAt: string }[]
}

export function StreakWidget() {
  const [data, setData] = useState<StreakData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchStreak = useCallback(async () => {
    try {
      const res = await fetch("/api/streak")
      if (res.ok) {
        const json = await res.json()
        setData(json.data)
      }
    } catch {
      //
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStreak()
  }, [fetchStreak])

  if (loading) {
    return (
      <Card>
        <CardContent className="p-5 space-y-3">
          <div className="h-5 w-32 rounded bg-muted animate-pulse" />
          <div className="h-16 rounded bg-muted animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  if (!data) return null

  const milestoneLabels: Record<number, string> = {
    1: "First Day",
    7: "1 Week",
    14: "2 Weeks",
    30: "1 Month",
    60: "2 Months",
    100: "100 Days",
    365: "1 Year",
  }

  const unlockedMilestones = new Set(data.milestones.map((m) => m.days))
  const nextMilestoneDays = data.nextMilestone

  return (
    <Card>
      <CardContent className="p-5 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-500" />
            Learning Streak
          </h3>
          <Button variant="ghost" size="sm" asChild className="gap-1 h-7 text-xs">
            <Link href="/student/leaderboard">
              Leaderboard <ChevronRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-950">
              <Flame className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">{data.current}</div>
              <div className="text-xs text-muted-foreground">day streak</div>
            </div>
          </div>
          <div className="h-10 w-px bg-border" />
          <div className="text-sm text-muted-foreground">
            Longest: <span className="font-semibold text-foreground">{data.longest} days</span>
          </div>
          <div className="h-10 w-px bg-border" />
          <div className="text-sm text-muted-foreground">
            Multiplier: <span className="font-semibold text-emerald-600 dark:text-emerald-400">×{data.multiplier}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">
            This week: <span className="font-semibold text-foreground">{data.thisWeek} days</span>
          </span>
          <span className="text-muted-foreground">
            This month: <span className="font-semibold text-foreground">{data.thisMonth} days</span>
          </span>
        </div>

        <StreakCalendar activityDays={data.activityDays} />

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-semibold">Milestones</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(milestoneLabels).map(([days, label]) => {
              const d = parseInt(days)
              const unlocked = unlockedMilestones.has(d)
              const isNext = d === nextMilestoneDays

              return (
                <div
                  key={d}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all",
                    unlocked
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                      : isNext
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400 ring-1 ring-yellow-400"
                        : "bg-muted text-muted-foreground"
                  )}
                >
                  {unlocked && <Award className="h-3 w-3" />}
                  {label}
                  {unlocked && (
                    <Zap className="h-3 w-3 text-yellow-500" />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-lg bg-muted/30 p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-yellow-500" />
              XP Multiplier
            </span>
            <span className="text-lg font-bold text-primary">×{data.multiplier}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {data.multiplier === 1
              ? "Complete 2+ days in a row to earn bonus XP"
              : `Earning ${data.multiplier}x XP on all activities — keep your streak alive!`}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}
