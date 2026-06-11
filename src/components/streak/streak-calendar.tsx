"use client"

import { useMemo } from "react"
import { cn } from "@/lib/utils"

interface StreakCalendarProps {
  activityDays: Record<string, number>
  months?: number
}

export function StreakCalendar({ activityDays, months = 2 }: StreakCalendarProps) {
  const weeks = useMemo(() => {
    const today = new Date()
    const days: { date: string; day: number; count: number; isToday: boolean }[] = []

    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - (29 - i))
      const dateStr = date.toISOString().slice(0, 10)
      days.push({
        date: dateStr,
        day: date.getDate(),
        count: activityDays[dateStr] ?? 0,
        isToday: i === 29,
      })
    }

    // Group into weeks (Sun-Sat)
    const weeks: typeof days[] = []
    let currentWeek: typeof days = []
    for (const day of days) {
      currentWeek.push(day)
      if (currentWeek.length === 7 || day === days[days.length - 1]) {
        weeks.push(currentWeek)
        currentWeek = []
      }
    }
    if (currentWeek.length > 0) {
      // Pad incomplete first week
      while (currentWeek.length < 7) {
        currentWeek.unshift({ date: "", day: 0, count: -1, isToday: false })
      }
      weeks[0] = currentWeek
    }

    return weeks
  }, [activityDays])

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div>
      <div className="flex items-center gap-1 mb-2">
        <span className="text-xs text-muted-foreground font-medium">Last 30 days</span>
      </div>
      <div className="flex gap-1">
        <div className="flex flex-col gap-1 pr-1 pt-5">
          {dayLabels.map((label) => (
            <div key={label} className="h-3 text-[9px] text-muted-foreground leading-none">
              {label[0]}
            </div>
          ))}
        </div>
        <div className="flex gap-1">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((day, di) => {
                if (day.count < 0) return <div key={di} className="h-3 w-3" />
                return (
                  <div
                    key={day.date}
                    title={`${day.date}: ${day.count} activities`}
                    className={cn(
                      "h-3 w-3 rounded-sm transition-colors",
                      day.isToday && "ring-1 ring-primary ring-offset-1",
                      day.count === 0 && "bg-muted/30",
                      day.count === 1 && "bg-emerald-200 dark:bg-emerald-800",
                      day.count >= 2 && day.count < 4 && "bg-emerald-400 dark:bg-emerald-600",
                      day.count >= 4 && "bg-emerald-500 dark:bg-emerald-400"
                    )}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
        <span>Less</span>
        <div className="h-2.5 w-2.5 rounded-sm bg-muted/30" />
        <div className="h-2.5 w-2.5 rounded-sm bg-emerald-200 dark:bg-emerald-800" />
        <div className="h-2.5 w-2.5 rounded-sm bg-emerald-400 dark:bg-emerald-600" />
        <div className="h-2.5 w-2.5 rounded-sm bg-emerald-500 dark:bg-emerald-400" />
        <span>More</span>
      </div>
    </div>
  )
}
