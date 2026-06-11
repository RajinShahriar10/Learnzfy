"use client"

import { useState, useEffect, useCallback } from "react"
import { BookmarkList } from "@/components/bookmarks/bookmark-list"
import { Bookmark } from "lucide-react"

interface BookmarkItem {
  id: string
  courseId: string | null
  lessonId: string | null
  createdAt: string
  course: {
    id: string
    title: string
    slug: string
    thumbnailUrl: string | null
    difficulty: string
    teacherName: string
  } | null
  lesson: {
    id: string
    title: string
    courseId: string
    courseTitle: string
    courseSlug: string
  } | null
}

export default function SavedCoursesPage() {
  const [items, setItems] = useState<BookmarkItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSaved = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/bookmarks?type=course")
      if (res.ok) {
        const json = await res.json()
        setItems(json.data ?? [])
      }
    } catch {
      //
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSaved()
  }, [fetchSaved])

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Bookmark className="h-6 w-6 text-primary" />
          Saved Courses
        </h1>
        <p className="text-muted-foreground mt-1">
          Courses you&apos;ve bookmarked for later
        </p>
      </div>

      <BookmarkList
        items={items}
        type="course"
        loading={loading}
        onRemove={handleRemove}
      />
    </div>
  )
}
