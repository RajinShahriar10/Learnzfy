"use client"

import { useState, useEffect, useCallback } from "react"
import { ReviewCard } from "./review-card"
import { ReviewForm } from "./review-form"
import { RatingSummary } from "./rating-summary"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, MessageSquare, Star, Filter } from "lucide-react"

interface Review {
  id: string
  userId: string
  userName: string
  userAvatar: string | null
  rating: number
  comment: string | null
  createdAt: string
  updatedAt: string
  isEdited: boolean
  isHidden: boolean
  isReported: boolean
}

interface ReviewStats {
  average: number
  total: number
  breakdown: { stars: number; count: number; percentage: number }[]
  userReview: Review | null
}

interface ReviewListProps {
  entityType: "course" | "teacher"
  entityId: string
  currentUserId?: string
  canReview: boolean
  eligibilityMessage?: string
  isAdmin?: boolean
}

export function ReviewList({
  entityType,
  entityId,
  currentUserId,
  canReview,
  eligibilityMessage,
  isAdmin,
}: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingReview, setEditingReview] = useState<Review | null>(null)
  const [sortBy, setSortBy] = useState<"recent" | "highest" | "lowest">("recent")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const limit = 10

  const fetchReviews = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const endpoint = entityType === "course"
        ? `/api/reviews/course/${entityId}`
        : `/api/teacher-reviews/teacher/${entityId}`

      const res = await fetch(
        `${endpoint}?page=${page}&limit=${limit}&sort=${sortBy}`
      )
      if (!res.ok) throw new Error("Failed to load reviews")

      const json = await res.json()

      if (page === 1) {
        setReviews(json.data)
      } else {
        setReviews((prev) => [...prev, ...json.data])
      }

      if (json.stats) {
        setStats(json.stats)
      }

      setHasMore(json.pagination?.hasMore ?? false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load reviews")
    } finally {
      setLoading(false)
    }
  }, [entityType, entityId, page, sortBy])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const handleCreate = async (data: { rating: number; comment: string }) => {
    const endpoint = entityType === "course"
      ? "/api/reviews"
      : "/api/teacher-reviews"

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        [entityType === "course" ? "courseId" : "teacherId"]: entityId,
        ...data,
      }),
    })

    if (!res.ok) {
      const json = await res.json()
      throw new Error(json.error || "Failed to submit review")
    }

    setShowForm(false)
    setPage(1)
    fetchReviews()
  }

  const handleEdit = async (data: { rating: number; comment: string }) => {
    if (!editingReview) return

    const endpoint = entityType === "course"
      ? `/api/reviews/${editingReview.id}`
      : `/api/teacher-reviews/${editingReview.id}`

    const res = await fetch(endpoint, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const json = await res.json()
      throw new Error(json.error || "Failed to update review")
    }

    setEditingReview(null)
    fetchReviews()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return

    const endpoint = entityType === "course"
      ? `/api/reviews/${id}`
      : `/api/teacher-reviews/${id}`

    const res = await fetch(endpoint, { method: "DELETE" })

    if (!res.ok) {
      const json = await res.json()
      alert(json.error || "Failed to delete review")
      return
    }

    setReviews((prev) => prev.filter((r) => r.id !== id))
    setPage(1)
    fetchReviews()
  }

  const handleReport = async (id: string) => {
    const res = await fetch(`/api/reviews/${id}/report`, { method: "POST" })

    if (!res.ok) {
      const json = await res.json()
      alert(json.error || "Failed to report review")
      return
    }

    alert("Review reported. Thank you for helping keep our community safe.")
  }

  const handleToggleHide = async (id: string, hidden: boolean) => {
    const res = await fetch(`/api/admin/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isHidden: hidden }),
    })

    if (!res.ok) {
      alert("Failed to update review")
      return
    }

    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isHidden: hidden } : r))
    )
    setPage(1)
    fetchReviews()
  }

  const sortOptions: { label: string; value: typeof sortBy }[] = [
    { label: "Most Recent", value: "recent" },
    { label: "Highest Rated", value: "highest" },
    { label: "Lowest Rated", value: "lowest" },
  ]

  if (loading && page === 1) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full rounded-lg" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {stats && (
        <RatingSummary
          average={stats.average}
          total={stats.total}
          breakdown={stats.breakdown}
        />
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-600 text-sm dark:bg-red-950 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {canReview && !stats?.userReview && !showForm && !editingReview && (
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Star className="h-4 w-4" />
          Write a Review
        </Button>
      )}

      {!canReview && eligibilityMessage && (
        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
          <AlertCircle className="h-3.5 w-3.5" />
          {eligibilityMessage}
        </p>
      )}

      {stats?.userReview && !showForm && !editingReview && (
        <div className="p-3 rounded-lg border border-primary/20 bg-primary/5">
          <p className="text-xs font-semibold text-primary mb-2">Your Review</p>
          <ReviewCard
            {...stats.userReview}
            isOwner={stats.userReview.userId === currentUserId}
            onEdit={(id) => {
              const r = stats.userReview
              if (r) setEditingReview(r)
            }}
            onDelete={handleDelete}
          />
        </div>
      )}

      {showForm && (
        <ReviewForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingReview && (
        <ReviewForm
          onSubmit={handleEdit}
          initialRating={editingReview.rating}
          initialComment={editingReview.comment ?? ""}
          isEditing
          onCancel={() => setEditingReview(null)}
        />
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Reviews ({stats?.total ?? reviews.length})
        </h3>
        <div className="flex items-center gap-1.5">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setSortBy(opt.value)
                setPage(1)
              }}
              className={cn(
                "text-xs px-2 py-1 rounded-md transition-colors",
                sortBy === opt.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {reviews.length === 0 && !loading && (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground/40" />
          <p className="mt-2 text-sm text-muted-foreground">No reviews yet</p>
          {canReview && (
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => setShowForm(true)}
            >
              Be the first to review
            </Button>
          )}
        </div>
      )}

      <div className="space-y-3">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            {...review}
            isOwner={review.userId === currentUserId}
            isAdmin={isAdmin}
            onEdit={
              review.userId === currentUserId
                ? () => setEditingReview(review)
                : undefined
            }
            onDelete={review.userId === currentUserId || isAdmin ? handleDelete : undefined}
            onReport={review.userId !== currentUserId ? handleReport : undefined}
            onToggleHide={isAdmin ? handleToggleHide : undefined}
          />
        ))}
      </div>

      {hasMore && (
        <div className="text-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More Reviews"}
          </Button>
        </div>
      )}
    </div>
  )
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}
