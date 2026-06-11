"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { StarRating } from "@/components/reviews/star-rating"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, EyeOff, Eye, Trash2, Flag, AlertCircle } from "lucide-react"

interface ReviewItem {
  id: string
  userId: string
  userName: string
  userAvatar: string | null
  rating: number
  comment: string | null
  courseId?: string
  courseName?: string
  isEdited: boolean
  isHidden: boolean
  isReported: boolean
  createdAt: string
}

export default function AdminReviewsPage() {
  const [courseReviews, setCourseReviews] = useState<ReviewItem[]>([])
  const [teacherReviews, setTeacherReviews] = useState<ReviewItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const fetchAllReviews = useCallback(async () => {
    setLoading(true)
    try {
      const [courses, teachers] = await Promise.all([
        fetch("/api/admin/reviews/course").then((r) => r.json()),
        fetch("/api/admin/reviews/teacher").then((r) => r.json()),
      ])
      setCourseReviews(courses.data ?? [])
      setTeacherReviews(teachers.data ?? [])
    } catch {
      //
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAllReviews()
  }, [fetchAllReviews])

  const handleToggleHide = async (id: string, hidden: boolean) => {
    const res = await fetch(`/api/admin/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isHidden: hidden }),
    })
    if (res.ok) {
      setCourseReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, isHidden: hidden } : r))
      )
      setTeacherReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, isHidden: hidden } : r))
      )
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this review?")) return
    const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" })
    if (res.ok) {
      setCourseReviews((prev) => prev.filter((r) => r.id !== id))
      setTeacherReviews((prev) => prev.filter((r) => r.id !== id))
    }
  }

  const filterReviews = (reviews: ReviewItem[]) =>
    reviews.filter(
      (r) =>
        r.userName.toLowerCase().includes(search.toLowerCase()) ||
        (r.comment ?? "").toLowerCase().includes(search.toLowerCase())
    )

  const renderReviewRow = (review: ReviewItem) => (
    <Card key={review.id} className={cn(review.isHidden && "opacity-50")}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="text-xs">
                {review.userName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold">{review.userName}</span>
                <StarRating value={review.rating} size="sm" />
                {(review as any).courseName && (
                  <Badge variant="secondary" className="text-[10px]">
                    {(review as any).courseName}
                  </Badge>
                )}
              </div>
              {review.comment && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {review.comment}
                </p>
              )}
              <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
                <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                {review.isEdited && <span className="italic">edited</span>}
                {review.isReported && (
                  <span className="flex items-center gap-1 text-amber-600">
                    <Flag className="h-3 w-3" />
                    Reported
                  </span>
                )}
                {review.isHidden && (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <EyeOff className="h-3 w-3" />
                    Hidden
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => handleToggleHide(review.id, !review.isHidden)}
              title={review.isHidden ? "Unhide" : "Hide"}
            >
              {review.isHidden ? (
                <Eye className="h-3.5 w-3.5" />
              ) : (
                <EyeOff className="h-3.5 w-3.5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-red-500 hover:text-red-600"
              onClick={() => handleDelete(review.id)}
              title="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const filteredCourseReviews = filterReviews(courseReviews)
  const filteredTeacherReviews = filterReviews(teacherReviews)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Review Moderation</h1>
        <p className="text-muted-foreground">
          Moderate course and teacher reviews across the platform
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search reviews by name or content..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Tabs defaultValue="course">
        <TabsList>
          <TabsTrigger value="course">
            Course Reviews ({filteredCourseReviews.length})
            {courseReviews.filter((r) => r.isReported).length > 0 && (
              <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-[10px] font-medium text-red-600 dark:bg-red-950 dark:text-red-400">
                {courseReviews.filter((r) => r.isReported).length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="teacher">
            Teacher Reviews ({filteredTeacherReviews.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="course" className="mt-6 space-y-3">
          {filteredCourseReviews.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <AlertCircle className="mx-auto h-8 w-8 mb-2" />
              No course reviews found
            </div>
          )}
          {filteredCourseReviews.map(renderReviewRow)}
        </TabsContent>

        <TabsContent value="teacher" className="mt-6 space-y-3">
          {filteredTeacherReviews.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <AlertCircle className="mx-auto h-8 w-8 mb-2" />
              No teacher reviews found
            </div>
          )}
          {filteredTeacherReviews.map(renderReviewRow)}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}
