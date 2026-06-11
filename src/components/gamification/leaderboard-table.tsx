"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { getLeaderboard, type LeaderboardEntry } from "@/lib/gamification-data"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Flame } from "lucide-react"

type Period = "daily" | "weekly" | "monthly" | "all_time"

const periods: { key: Period; label: string }[] = [
  { key: "daily", label: "Daily" },
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
  { key: "all_time", label: "All Time" },
]

const tierColors: Record<string, string> = {
  Bronze: "text-amber-700",
  Silver: "text-gray-400",
  Gold: "text-yellow-500",
  Platinum: "text-sky-400",
  Diamond: "text-cyan-400",
  Master: "text-purple-400",
  Ace: "text-red-400",
}

interface LeaderboardTableProps {
  className?: string
}

export function LeaderboardTable({ className }: LeaderboardTableProps) {
  const [period, setPeriod] = useState<Period>("weekly")
  const entries = getLeaderboard(period)

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex gap-1 rounded-lg bg-muted p-1 w-fit">
        {periods.map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
              period === p.key
                ? "bg-background text-foreground shadow"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {entries.map((entry) => (
          <div
            key={`${period}-${entry.userId}`}
            className={cn(
              "flex items-center gap-3 rounded-lg border bg-background p-3 transition-all hover:shadow-sm",
              entry.isCurrentUser && "border-primary/30 bg-primary/5 ring-1 ring-primary/20"
            )}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center">
              {entry.rank === 1 && <Trophy className="h-6 w-6 text-yellow-500" />}
              {entry.rank === 2 && <Medal className="h-5 w-5 text-gray-400" />}
              {entry.rank === 3 && <Medal className="h-5 w-5 text-amber-600" />}
              {entry.rank > 3 && (
                <span className="text-sm font-bold text-muted-foreground">#{entry.rank}</span>
              )}
            </div>

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold">
              {entry.name.charAt(0)}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-sm font-medium",
                  entry.isCurrentUser && "text-primary"
                )}>
                  {entry.name}
                </span>
                {entry.isCurrentUser && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-primary/30 text-primary">
                    You
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Level {entry.level}</span>
                <span className="text-muted-foreground/30">&middot;</span>
                <span className={cn("font-medium", tierColors[entry.tier] || "")}>
                  {entry.tier}
                </span>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm font-bold tabular-nums">{entry.xp.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground">XP</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
