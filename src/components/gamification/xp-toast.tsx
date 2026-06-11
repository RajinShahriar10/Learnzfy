"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { X, Zap, Trophy, Flame, Star, Award } from "lucide-react"

interface XpToastProps {
  xp: number
  reason: string
  onClose: () => void
  duration?: number
}

const icons: Record<string, typeof Zap> = {
  lesson: Zap,
  quiz: Trophy,
  exam: Award,
  course: Star,
  streak: Flame,
  achievement: Trophy,
  login: Zap,
}

export function XpToast({ xp, reason, onClose, duration = 3000 }: XpToastProps) {
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    const interval = setInterval(() => setProgress((p) => Math.max(0, p - 100 / (duration / 50))), 50)
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300)
    }, duration)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [duration, onClose])

  const Icon = icons[reason.split("_")[0]] || Zap

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border bg-card px-5 py-4 shadow-lg transition-all duration-300",
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-orange-500/20">
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
          +{xp} XP
        </p>
        <p className="text-xs text-muted-foreground">{reason}</p>
      </div>
      <button onClick={() => { setVisible(false); setTimeout(onClose, 300) }} className="shrink-0 text-muted-foreground/50 hover:text-foreground transition-colors">
        <X className="h-4 w-4" />
      </button>
      <div
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-1000 ease-linear"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
