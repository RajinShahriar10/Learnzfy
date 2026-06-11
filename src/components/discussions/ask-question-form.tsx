"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, MessageSquarePlus, X } from "lucide-react"

interface AskQuestionFormProps {
  courseId?: string
  lessonId?: string
  onSuccess?: () => void
}

export function AskQuestionForm({ courseId, lessonId, onSuccess }: AskQuestionFormProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    setSubmitting(true)

    try {
      const res = await fetch("/api/discussions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), content: content.trim(), courseId, lessonId }),
      })

      if (res.ok) {
        setTitle("")
        setContent("")
        setOpen(false)
        onSuccess?.()
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} className="gap-1.5">
        <MessageSquarePlus className="h-4 w-4" />
        Ask a Question
      </Button>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <CardTitle className="text-sm font-medium">Ask a Question</CardTitle>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="pb-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            placeholder="Question title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            maxLength={200}
            required
          />
          <textarea
            placeholder="Describe your question in detail..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y"
            required
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {title.length}/200
            </span>
            <Button type="submit" size="sm" disabled={submitting || !title.trim() || !content.trim()}>
              {submitting && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
              Post Question
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
