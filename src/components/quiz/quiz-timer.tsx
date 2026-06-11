"use client"

import { useEffect, useState } from "react"
import { Clock, AlertTriangle } from "lucide-react"

interface QuizTimerProps {
  timeLimit: number
  onTimeUp: () => void
}

export function QuizTimer({ timeLimit, onTimeUp }: QuizTimerProps) {
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60)
  const [warning, setWarning] = useState(false)

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 60) setWarning(true)
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, onTimeUp])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <div className={cn(
      "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
      warning
        ? "border-red-200 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400 dark:border-red-800"
        : "border-border bg-background"
    )}>
      {warning ? (
        <AlertTriangle className="h-4 w-4 text-red-500 animate-pulse" />
      ) : (
        <Clock className="h-4 w-4" />
      )}
      <span className={cn(
        "tabular-nums",
        warning && "animate-pulse"
      )}>
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </span>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}
