"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { VoteButtons } from "./vote-buttons"
import {
  ArrowLeft,
  Pin,
  PinOff,
  Trash2,
  Loader2,
  MessageSquare,
  BookOpen,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface ReplyItem {
  id: string
  content: string
  userId: string
  isPinned: boolean
  parentId: string | null
  upvotes: number
  hasUpvoted: boolean
  createdAt: string
  user: { id: string; name: string | null; image: string | null; role: string }
  replies: ReplyItem[]
}

interface ThreadData {
  id: string
  title: string
  content: string
  isPinned: boolean
  upvotes: number
  hasUpvoted: boolean
  userId: string
  createdAt: string
  user: { id: string; name: string | null; image: string | null; role: string }
  course: { id: string; title: string } | null
  lesson: { id: string; title: string } | null
  replies: ReplyItem[]
}

interface DiscussionThreadProps {
  discussionId: string
  backUrl: string
}

export function DiscussionThread({ discussionId, backUrl }: DiscussionThreadProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [thread, setThread] = useState<ThreadData | null>(null)
  const [loading, setLoading] = useState(true)
  const [replyText, setReplyText] = useState("")
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const isTeacher = ["TEACHER", "ADMIN", "SUPER_ADMIN"].includes(session?.user?.role ?? "")
  const isOwner = (uid: string) => session?.user?.id === uid

  const fetchThread = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/discussions/${discussionId}`)
      if (res.ok) setThread(await res.json())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchThread()
  }, [discussionId])

  const handleVote = async (type: "discussion" | "reply", id: string) => {
    await fetch(`/api/votes/${type}s/${id}`, { method: "POST" })
    fetchThread()
  }

  const handlePin = async (type: "discussion" | "reply", id: string, isPinned: boolean) => {
    await fetch(`/api/${type}s/${id}/pin`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPinned: !isPinned }),
    })
    fetchThread()
  }

  const handleDelete = async () => {
    if (!confirm("Delete this discussion?")) return
    await fetch(`/api/discussions/${discussionId}`, { method: "DELETE" })
    router.push(backUrl)
  }

  const handleReply = async (parentId: string | null = null) => {
    if (!replyText.trim()) return
    setSubmitting(true)
    try {
      await fetch("/api/replies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: replyText.trim(), discussionId, parentId }),
      })
      setReplyText("")
      setReplyTo(null)
      fetchThread()
    } finally {
      setSubmitting(false)
    }
  }

  const getInitials = (name: string | null) =>
    name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "?"

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!thread) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Discussion not found
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild className="gap-1">
        <Link href={backUrl}>
          <ArrowLeft className="h-4 w-4" />
          Back to discussions
        </Link>
      </Button>

      <div className="rounded-lg border p-6">
        <div className="flex items-start gap-4">
          <VoteButtons
            upvotes={thread.upvotes}
            hasUpvoted={thread.hasUpvoted}
            onVote={() => handleVote("discussion", thread.id)}
          />

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              {thread.isPinned && (
                <Badge variant="secondary" className="gap-1 text-[10px] px-1.5">
                  <Pin className="h-3 w-3" /> Pinned
                </Badge>
              )}
              <h1 className="text-lg font-semibold">{thread.title}</h1>
            </div>

            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-[9px] bg-primary/10 text-primary">
                  {getInitials(thread.user.name)}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-foreground">{thread.user.name || "Anonymous"}</span>
              {thread.user.role === "TEACHER" && (
                <Badge variant="secondary" className="text-[9px] px-1 py-0 h-4">Teacher</Badge>
              )}
              <span>{timeAgo(thread.createdAt)}</span>
            </div>

            {thread.course && (
              <Link
                href={`/student/courses/${thread.course.id}/discussions`}
                className="flex items-center gap-1 mt-2 text-xs text-primary hover:underline"
              >
                <BookOpen className="h-3 w-3" />
                {thread.course.title}
                <ChevronRight className="h-3 w-3" />
              </Link>
            )}

            <p className="mt-4 text-sm leading-relaxed whitespace-pre-wrap">{thread.content}</p>

            <div className="flex items-center gap-2 mt-4 pt-3 border-t">
              {isTeacher && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1 text-xs"
                  onClick={() => handlePin("discussion", thread.id, thread.isPinned)}
                >
                  {thread.isPinned ? <PinOff className="h-3 w-3" /> : <Pin className="h-3 w-3" />}
                  {thread.isPinned ? "Unpin" : "Pin"}
                </Button>
              )}
              {(isOwner(thread.userId) || isTeacher) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-medium">
            {thread.replies.length} {thread.replies.length === 1 ? "Reply" : "Replies"}
          </h2>
        </div>

        {thread.replies.length === 0 && (
          <p className="text-sm text-muted-foreground py-6 text-center">
            No replies yet. Be the first to respond!
          </p>
        )}

        {thread.replies.map((reply) => (
          <ReplyItem
            key={reply.id}
            reply={reply}
            threadId={thread.id}
            isTeacher={isTeacher}
            isOwner={isOwner(reply.userId)}
            onVote={() => handleVote("reply", reply.id)}
            onPin={() => handlePin("reply", reply.id, reply.isPinned)}
            onReply={() => setReplyTo(reply.id)}
          />
        ))}
      </div>

      <div className="rounded-lg border p-4">
        {replyTo && (
          <div className="flex items-center justify-between mb-2 pb-2 border-b">
            <span className="text-xs text-muted-foreground">
              Replying to a comment
            </span>
            <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setReplyTo(null)}>
              Cancel
            </Button>
          </div>
        )}
        <div className="flex gap-3">
          <textarea
            placeholder={replyTo ? "Write your reply..." : "Write a reply..."}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="flex min-h-[60px] flex-1 rounded-md border border-input bg-transparent px-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y"
          />
          <Button
            size="sm"
            className="self-end"
            disabled={submitting || !replyText.trim()}
            onClick={() => handleReply(replyTo)}
          >
            {submitting && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
            Reply
          </Button>
        </div>
      </div>
    </div>
  )
}

function ReplyItem({
  reply,
  threadId,
  isTeacher,
  isOwner,
  onVote,
  onPin,
  onReply,
}: {
  reply: ReplyItem
  threadId: string
  isTeacher: boolean
  isOwner: boolean
  onVote: () => Promise<void>
  onPin: () => Promise<void>
  onReply: () => void
}) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-start gap-3">
        <VoteButtons
          upvotes={reply.upvotes}
          hasUpvoted={reply.hasUpvoted}
          onVote={onVote}
          size="sm"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-[9px] bg-primary/10 text-primary">
                {reply.user.name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{reply.user.name || "Anonymous"}</span>
            {reply.user.role === "TEACHER" && (
              <Badge variant="secondary" className="text-[9px] px-1 py-0 h-4 font-normal">Teacher</Badge>
            )}
            <span className="text-xs text-muted-foreground">{timeAgo(reply.createdAt)}</span>
            {reply.isPinned && <Pin className="h-3 w-3 text-primary" />}
          </div>

          <p className="mt-1.5 text-sm leading-relaxed whitespace-pre-wrap">{reply.content}</p>

          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={onReply}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Reply
            </button>
            {isTeacher && (
              <button
                onClick={onPin}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {reply.isPinned ? "Unpin" : "Pin"}
              </button>
            )}
          </div>

          {reply.replies.length > 0 && (
            <div className="mt-3 pl-4 border-l-2 space-y-2">
              {reply.replies.map((rr) => (
                <div key={rr.id} className="pt-2">
                  <div className="flex items-start gap-2">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="text-[8px] bg-primary/10 text-primary">
                        {rr.user.name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">{rr.user.name || "Anonymous"}</span>
                        {rr.user.role === "TEACHER" && (
                          <Badge variant="secondary" className="text-[8px] px-1 py-0 h-3 font-normal">T</Badge>
                        )}
                        <span className="text-[11px] text-muted-foreground">{timeAgo(rr.createdAt)}</span>
                      </div>
                      <p className="text-xs mt-0.5 leading-relaxed">{rr.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "Just now"
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}
