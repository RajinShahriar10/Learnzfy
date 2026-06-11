"use client"

import { useEffect, useState, useRef } from "react"
import { Clock, AlertTriangle } from "lucide-react"

interface ExamTimerProps {
  timeLimit: number
  onTimeUp: () => void
  onTick?: (secondsLeft: number) => void
}

export function ExamTimer({ timeLimit, onTimeUp, onTick }: ExamTimerProps) {
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60)
  const [warning, setWarning] = useState(false)
  const [critical, setCritical] = useState(false)
  const submitted = useRef(false)

  useEffect(() => {
    if (timeLeft <= 0) {
      if (!submitted.current) {
        submitted.current = true
        onTimeUp()
      }
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1
        if (next <= 60) setCritical(true)
        else if (next <= 300) setWarning(true)
        onTick?.(next)
        return next
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, onTimeUp, onTick])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <div className={cn(
      "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors tabular-nums",
      critical
        ? "border-red-300 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400 dark:border-red-800 animate-pulse"
        : warning
          ? "border-amber-300 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800"
          : "border-border bg-background"
    )}>
      {critical || warning ? (
        <AlertTriangle className="h-4 w-4" />
      ) : (
        <Clock className="h-4 w-4" />
      )}
      <span className="font-mono">
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </span>
      {critical && (
        <span className="text-[10px] font-normal">Auto-submitting...</span>
      )}
    </div>
  )
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}
