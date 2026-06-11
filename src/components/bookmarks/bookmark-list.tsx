"use client"

import Link from "next/link"
import { BookOpen, Search, Bookmark } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BookmarkButton } from "./bookmark-button"
import { useState, useMemo } from "react"

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

interface BookmarkListProps {
  items: BookmarkItem[]
  type: "course" | "lesson"
  loading: boolean
  onRemove: (id: string) => void
}

export function BookmarkList({ items, type, loading, onRemove }: BookmarkListProps) {
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    if (!search) return items
    const q = search.toLowerCase()
    return items.filter((item) => {
      const title = item.course?.title ?? item.lesson?.title ?? ""
      return title.toLowerCase().includes(q)
    })
  }, [items, search])

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={`Search saved ${type}s...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-10"
        />
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Bookmark className="mx-auto h-10 w-10 text-muted-foreground/40" />
          <h3 className="mt-4 text-lg font-semibold">
            {search ? "No results found" : `No saved ${type}s yet`}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {search
              ? "Try a different search term"
              : `Bookmark ${type}s to save them here for quick access`}
          </p>
          {!search && (
            <Button variant="outline" size="sm" asChild className="mt-4">
              <Link href={type === "course" ? "/courses" : "/student/courses"}>
                <BookOpen className="mr-2 h-4 w-4" />
                Browse {type === "course" ? "Courses" : "Lessons"}
              </Link>
            </Button>
          )}
        </div>
      )}

      <div className="space-y-3">
        {filtered.map((item) => (
          <Card key={item.id} className="group transition-all hover:shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {type === "course" && item.course && (
                    <Link
                      href={`/student/courses/${item.course.id}`}
                      className="block"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="text-[10px]">
                          {item.course.difficulty}
                        </Badge>
                      </div>
                      <h3 className="font-semibold group-hover:text-primary transition-colors truncate">
                        {item.course.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {item.course.teacherName}
                      </p>
                    </Link>
                  )}
                  {type === "lesson" && item.lesson && (
                    <Link
                      href={`/student/courses/${item.lesson.courseId}/lessons/${item.lesson.id}`}
                      className="block"
                    >
                      <h3 className="font-semibold group-hover:text-primary transition-colors truncate">
                        {item.lesson.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {item.lesson.courseTitle}
                      </p>
                    </Link>
                  )}
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    Saved {formatDate(item.createdAt)}
                  </p>
                </div>
                <BookmarkButton
                  courseId={item.courseId ?? undefined}
                  lessonId={item.lessonId ?? undefined}
                  size="sm"
                  variant="ghost"
                  onToggle={(bookmarked) => {
                    if (!bookmarked) onRemove(item.id)
                  }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  const diff = Date.now() - date.getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return "today"
  if (days === 1) return "yesterday"
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}
