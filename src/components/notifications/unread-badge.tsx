"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface UnreadBadgeProps {
  className?: string
  onCount?: (count: number) => void
}

export function UnreadBadge({ className, onCount }: UnreadBadgeProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch("/api/notifications/unread-count")
        if (res.ok) {
          const data = await res.json()
          setCount(data.unread)
          onCount?.(data.unread)
        }
      } catch {}
    }

    fetchCount()
    const interval = setInterval(fetchCount, 30000)
    return () => clearInterval(interval)
  }, [onCount])

  if (count === 0) return null

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white min-w-[18px] h-[18px]",
        className
      )}
    >
      {count > 99 ? "99+" : count}
    </span>
  )
}
