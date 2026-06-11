"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface XpBarProps {
  currentXp: number
  xpInLevel: number
  xpToNextLevel: number
  level: number
  animated?: boolean
}

export function XpBar({ currentXp, xpInLevel, xpToNextLevel, level, animated = true }: XpBarProps) {
  const [displayProgress, setDisplayProgress] = useState(animated ? 0 : (xpInLevel / (xpInLevel + xpToNextLevel)) * 100)

  useEffect(() => {
    if (animated) {
      const target = (xpInLevel / (xpInLevel + xpToNextLevel)) * 100
      const timer = setTimeout(() => setDisplayProgress(target), 100)
      return () => clearTimeout(timer)
    }
  }, [xpInLevel, xpToNextLevel, animated])

  const progress = animated ? displayProgress : (xpInLevel / (xpInLevel + xpToNextLevel)) * 100

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="font-bold text-foreground">Level {level}</span>
          <span className="text-muted-foreground">
            {currentXp.toLocaleString()} XP
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          {xpInLevel} / {xpInLevel + xpToNextLevel} XP
        </span>
      </div>
      <div className="relative h-2.5 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full bg-gradient-to-r from-primary via-primary to-yellow-500 transition-all duration-1000 ease-out",
            progress > 90 && "from-primary via-yellow-500 to-emerald-400"
          )}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      </div>
    </div>
  )
}
