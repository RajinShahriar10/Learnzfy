"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Bookmark } from "lucide-react"

interface BookmarkButtonProps {
  courseId?: string
  lessonId?: string
  size?: "sm" | "md" | "icon"
  variant?: "ghost" | "outline" | "default"
  className?: string
  onToggle?: (bookmarked: boolean) => void
}

export function BookmarkButton({
  courseId,
  lessonId,
  size = "icon",
  variant = "ghost",
  className,
  onToggle,
}: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(false)
  const [loading, setLoading] = useState(false)

  const checkBookmark = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (courseId) params.set("courseId", courseId)
      if (lessonId) params.set("lessonId", lessonId)
      const res = await fetch(`/api/bookmarks/check?${params}`)
      if (res.ok) {
        const json = await res.json()
        setBookmarked(json.data.bookmarked)
      }
    } catch {
      //
    }
  }, [courseId, lessonId])

  useEffect(() => {
    if (courseId || lessonId) checkBookmark()
  }, [checkBookmark, courseId, lessonId])

  const toggle = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: courseId || null, lessonId: lessonId || null }),
      })
      if (res.ok) {
        const json = await res.json()
        setBookmarked(json.data.bookmarked)
        onToggle?.(json.data.bookmarked)
      }
    } catch {
      //
    } finally {
      setLoading(false)
    }
  }

  const sizeClasses = size === "sm" ? "h-7 w-7" : size === "md" ? "h-9 w-9" : "h-8 w-8"
  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"

  return (
    <Button
      variant={variant}
      size="icon"
      className={cn(sizeClasses, className)}
      onClick={toggle}
      disabled={loading}
      title={bookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      <Bookmark
        className={cn(
          iconSize,
          "transition-all",
          bookmarked && "fill-primary text-primary"
        )}
      />
    </Button>
  )
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}
