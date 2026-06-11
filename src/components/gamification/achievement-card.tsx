"use client"

import { cn } from "@/lib/utils"
import { CheckCircle2, Clock, GraduationCap, Brain, Flame, Trophy, Award, Book, Zap } from "lucide-react"
import type { Achievement } from "@/lib/gamification-data"

const iconMap: Record<string, typeof Trophy> = {
  "graduation-cap": GraduationCap,
  "brain": Brain,
  "flame": Flame,
  "trophy": Trophy,
  "award": Award,
  "book": Book,
  "zap": Zap,
}

interface AchievementCardProps {
  achievement: Achievement
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  const Icon = iconMap[achievement.icon] || Trophy
  const isUnlocked = !!achievement.unlockedAt
  const progressPercent = Math.min(100, Math.round((achievement.progress / achievement.total) * 100))

  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl border bg-card p-5 transition-all",
      isUnlocked
        ? "border-emerald-200 dark:border-emerald-800"
        : "hover:border-primary/30 hover:shadow-sm"
    )}>
      {isUnlocked && (
        <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30" />
      )}

      <div className="flex items-start gap-4">
        <div className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all",
          isUnlocked
            ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400 shadow-sm"
            : "bg-muted text-muted-foreground"
        )}>
          <Icon className="h-6 w-6" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className={cn(
              "font-semibold",
              isUnlocked ? "text-emerald-700 dark:text-emerald-400" : ""
            )}>
              {achievement.name}
            </h3>
            {isUnlocked && (
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {achievement.description}
          </p>

          <div className="mt-3 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{achievement.condition}</span>
              {isUnlocked ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  {new Date(achievement.unlockedAt!).toLocaleDateString()}
                </span>
              ) : (
                <span className="text-muted-foreground">
                  {achievement.progress}/{achievement.total}
                </span>
              )}
            </div>
            {!isUnlocked && (
              <div className="relative h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={cn(
        "absolute bottom-2 right-3 text-[10px] font-medium",
        isUnlocked ? "text-emerald-500" : "text-muted-foreground/50"
      )}>
        +{achievement.xpReward} XP
      </div>
    </div>
  )
}
