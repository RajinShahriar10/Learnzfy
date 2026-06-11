"use client"

import { cn } from "@/lib/utils"
import { Flame } from "lucide-react"

interface StreakDisplayProps {
  streak: number
  longestStreak: number
  size?: "sm" | "md" | "lg"
}

export function StreakDisplay({ streak, longestStreak, size = "md" }: StreakDisplayProps) {
  const isAtRisk = streak > 0 && streak % 7 === 0

  return (
    <div className="flex items-center gap-3">
      <div className={cn(
        "relative flex items-center justify-center rounded-full",
        streak > 0 ? "bg-orange-100 dark:bg-orange-950/40" : "bg-muted",
        size === "sm" && "h-8 w-8",
        size === "md" && "h-12 w-12",
        size === "lg" && "h-16 w-16"
      )}>
        <Flame className={cn(
          streak > 0 ? "text-orange-500" : "text-muted-foreground/40",
          size === "sm" && "h-4 w-4",
          size === "md" && "h-6 w-6",
          size === "lg" && "h-8 w-8",
          streak > 0 && "animate-pulse"
        )} />
        {streak > 0 && (
          <span className={cn(
            "absolute -right-1 -top-1 flex items-center justify-center rounded-full bg-orange-500 text-[9px] font-bold text-white",
            size === "sm" && "h-4 w-4",
            size === "md" && "h-5 w-5",
            size === "lg" && "h-6 w-6 text-xs"
          )}>
            {streak}
          </span>
        )}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <p className={cn(
            "font-bold",
            size === "sm" && "text-sm",
            size === "md" && "text-lg",
            size === "lg" && "text-2xl",
            streak > 0 ? "text-orange-600 dark:text-orange-400" : "text-muted-foreground"
          )}>
            {streak > 0 ? `${streak} day${streak !== 1 ? "s" : ""}` : "No streak"}
          </p>
          {isAtRisk && (
            <span className="text-[10px] text-orange-500 font-medium animate-pulse">At risk!</span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Longest: {longestStreak} day{longestStreak !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  )
}
