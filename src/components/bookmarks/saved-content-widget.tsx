"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bookmark, BookOpen, ChevronRight } from "lucide-react"

interface SavedItem {
  id: string
  courseId: string | null
  lessonId: string | null
  createdAt: string
  course: { id: string; title: string; slug: string } | null
  lesson: { id: string; title: string; courseId: string; courseTitle: string; courseSlug: string } | null
}

export function SavedContentWidget() {
  const [items, setItems] = useState<SavedItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSaved = useCallback(async () => {
    try {
      const res = await fetch("/api/bookmarks?limit=5")
      if (res.ok) {
        const json = await res.json()
        setItems((json.data ?? []).slice(0, 5))
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

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Bookmark className="h-4 w-4 text-primary" />
            Recently Saved
          </h3>
          <Button variant="ghost" size="sm" asChild className="gap-1 h-7 text-xs">
            <Link href="/student/saved/courses">
              View All <ChevronRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>

        {loading && (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 rounded-md bg-muted animate-pulse" />
            ))}
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="text-center py-6">
            <BookOpen className="mx-auto h-6 w-6 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground mt-2">
              No saved items yet
            </p>
            <Button variant="outline" size="sm" asChild className="mt-3">
              <Link href="/courses">Browse Courses</Link>
            </Button>
          </div>
        )}

        {!loading && items.length > 0 && (
          <div className="space-y-1">
            {items.map((item) => (
              <Link
                key={item.id}
                href={
                  item.course
                    ? `/student/courses/${item.course.id}`
                    : `/student/courses/${item.lesson!.courseId}/lessons/${item.lesson!.id}`
                }
                className="flex items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-muted/50 transition-colors group"
              >
                <BookOpen className="h-4 w-4 shrink-0 text-muted-foreground/60 group-hover:text-primary transition-colors" />
                <span className="truncate flex-1">
                  {item.course?.title ?? item.lesson?.title}
                </span>
                <span className="text-xs text-muted-foreground/60 shrink-0">
                  {item.course ? "Course" : "Lesson"}
                </span>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
