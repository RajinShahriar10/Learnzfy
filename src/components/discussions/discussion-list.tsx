"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ChevronUp, MessageSquare, Pin, Loader2, Inbox } from "lucide-react"

interface DiscussionItem {
  id: string
  title: string
  content: string
  isPinned: boolean
  upvotes: number
  replyCount: number
  hasUpvoted: boolean
  user: { id: string; name: string | null; image: string | null; role: string }
  createdAt: string
}

interface DiscussionListProps {
  courseId?: string
  lessonId?: string
  basePath: string
}

export function DiscussionList({ courseId, lessonId, basePath }: DiscussionListProps) {
  const [discussions, setDiscussions] = useState<DiscussionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState<string>("recent")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchDiscussions = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (courseId) params.set("courseId", courseId)
    if (lessonId) params.set("lessonId", lessonId)
    params.set("sort", sort)
    params.set("page", String(page))

    try {
      const res = await fetch(`/api/discussions?${params}`)
      if (res.ok) {
        const data = await res.json()
        setDiscussions(data.discussions)
        setTotalPages(data.pages)
      }
    } finally {
      setLoading(false)
    }
  }, [courseId, lessonId, sort, page])

  useEffect(() => {
    fetchDiscussions()
  }, [fetchDiscussions])

  const getInitials = (name: string | null) =>
    name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "?"

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "now"
    if (mins < 60) return `${mins}m`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d`
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {["recent", "votes"].map((s) => (
            <button
              key={s}
              onClick={() => { setSort(s); setPage(1) }}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                sort === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {s === "recent" ? "Recent" : "Most Upvoted"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : discussions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
            <Inbox className="h-7 w-7 text-muted-foreground/50" />
          </div>
          <h3 className="mt-3 text-sm font-semibold">No questions yet</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Be the first to ask a question about this content.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {discussions.map((d) => (
            <Link
              key={d.id}
              href={`${basePath}/${d.id}`}
              className="flex items-start gap-3 rounded-lg border p-4 transition-all hover:shadow-sm hover:border-primary/20"
            >
              <div className="flex flex-col items-center gap-0.5 min-w-[36px]">
                <ChevronUp className={cn("h-3.5 w-3.5", d.hasUpvoted ? "text-primary" : "text-muted-foreground/40")} />
                <span className={cn("text-xs font-medium", d.hasUpvoted && "text-primary")}>
                  {d.upvotes}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  {d.isPinned && (
                    <Pin className="h-3.5 w-3.5 text-primary shrink-0" />
                  )}
                  <h3 className="text-sm font-medium truncate">{d.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                  {d.content}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1.5">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="text-[9px] bg-primary/10 text-primary">
                        {getInitials(d.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-[11px] text-muted-foreground">
                      {d.user.name?.split(" ")[0] || "Anonymous"}
                    </span>
                    {d.user.role === "TEACHER" && (
                      <Badge variant="secondary" className="text-[9px] px-1 py-0 h-3.5 font-normal">
                        Teacher
                      </Badge>
                    )}
                  </div>
                  <span className="text-[11px] text-muted-foreground/60">{timeAgo(d.createdAt)}</span>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground/60 ml-auto">
                    <MessageSquare className="h-3 w-3" />
                    {d.replyCount}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              variant={page === i + 1 ? "default" : "outline"}
              size="sm"
              className="h-7 w-7 p-0 text-xs"
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
