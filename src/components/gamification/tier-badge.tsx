"use client"

import { cn } from "@/lib/utils"
import { getTierForXp, getNextTier, getTierProgress, type Tier } from "@/lib/gamification-data"

interface TierBadgeProps {
  xp: number
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
}

const tierEmojis: Record<string, string> = {
  Bronze: "🥉",
  Silver: "🥈",
  Gold: "🥇",
  Platinum: "💎",
  Diamond: "💠",
  Master: "👑",
  Ace: "⭐",
}

export function TierBadge({ xp, size = "md", showLabel = true }: TierBadgeProps) {
  const tier = getTierForXp(xp)
  const emoji = tierEmojis[tier.name] || "⭐"

  const sizeClasses = {
    sm: "text-lg h-8 w-8",
    md: "text-2xl h-12 w-12",
    lg: "text-4xl h-16 w-16",
  }

  return (
    <div className="flex items-center gap-2">
      <div className={cn(
        "flex items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30 shadow-inner",
        sizeClasses[size]
      )}>
        {emoji}
      </div>
      {showLabel && (
        <div>
          <p className={cn(
            "font-bold",
            size === "sm" && "text-xs",
            size === "md" && "text-sm",
            size === "lg" && "text-lg",
            tier.color
          )}>
            {tier.name}
          </p>
          {tier.name !== "Ace" && (
            <p className="text-[10px] text-muted-foreground">
              {getNextTier(tier.name) ? `${xp.toLocaleString()} / ${getNextTier(tier.name)!.minXp.toLocaleString()} XP` : "Max tier"}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

interface TierProgressProps {
  xp: number
}

export function TierProgress({ xp }: TierProgressProps) {
  const { currentTier, nextTier, progress } = getTierProgress(xp)

  if (!nextTier) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-purple-400">Master</span>
          <span className="text-xs text-muted-foreground">Max tier reached</span>
        </div>
        <div className="h-2 rounded-full bg-gradient-to-r from-purple-400 via-red-400 to-yellow-400" style={{ width: "100%" }} />
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className={cn("font-medium", currentTier.color)}>{currentTier.name}</span>
          <svg className="h-3.5 w-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          <span className={cn("font-medium", nextTier.color)}>{nextTier.name}</span>
        </div>
        <span className="text-xs text-muted-foreground">{progress}%</span>
      </div>
      <div className="relative h-2.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-to-r transition-all duration-700"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${getGradient(currentTier.name)})`,
          }}
        />
      </div>
      <p className="text-[10px] text-muted-foreground">
        {xp.toLocaleString()} / {nextTier.minXp.toLocaleString()} XP to reach {nextTier.name}
      </p>
    </div>
  )
}

function getGradient(tier: string): string {
  const gradients: Record<string, string> = {
    Bronze: "#d97706, #f59e0b",
    Silver: "#9ca3af, #d1d5db",
    Gold: "#eab308, #facc15",
    Platinum: "#38bdf8, #7dd3fc",
    Diamond: "#22d3ee, #67e8f9",
    Master: "#a78bfa, #c4b5fd",
    Ace: "#f87171, #fca5a5",
  }
  return gradients[tier] || "#6366f1, #818cf8"
}
