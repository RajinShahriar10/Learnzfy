"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { StarRating } from "./star-rating"
import { MessageSquare, AlertCircle } from "lucide-react"

interface ReviewFormProps {
  onSubmit: (data: { rating: number; comment: string }) => Promise<void>
  initialRating?: number
  initialComment?: string
  isEditing?: boolean
  onCancel?: () => void
}

export function ReviewForm({
  onSubmit,
  initialRating = 0,
  initialComment = "",
  isEditing = false,
  onCancel,
}: ReviewFormProps) {
  const [rating, setRating] = useState(initialRating)
  const [comment, setComment] = useState(initialComment)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      setError("Please select a rating")
      return
    }
    if (comment.trim().length < 10) {
      setError("Review must be at least 10 characters")
      return
    }
    setError("")
    setSubmitting(true)
    try {
      await onSubmit({ rating, comment: comment.trim() })
      if (!isEditing) {
        setRating(0)
        setComment("")
      }
    } catch {
      setError("Failed to submit review. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-5 rounded-lg border bg-muted/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">
            {isEditing ? "Edit your review" : "Write a review"}
          </span>
        </div>
        <StarRating
          value={rating}
          onChange={setRating}
          size="md"
          interactive
        />
      </div>
      <Textarea
        placeholder="Share your thoughts about this course... (min 10 characters)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        maxLength={2000}
        className="resize-none"
      />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {error && (
            <span className="flex items-center gap-1 text-xs text-red-500">
              <AlertCircle className="h-3 w-3" />
              {error}
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            {comment.length}/2000
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isEditing && onCancel && (
            <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            size="sm"
            disabled={submitting || rating === 0}
          >
            {submitting ? "Submitting..." : isEditing ? "Update" : "Submit"}
          </Button>
        </div>
      </div>
    </form>
  )
}
