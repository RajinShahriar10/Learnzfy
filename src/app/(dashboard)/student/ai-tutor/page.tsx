"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Bot, Plus, Loader2, MessageSquare } from "lucide-react"
import { AiTutorChat } from "@/components/ai/tutor-chat"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ConversationSummary {
  id: string
  title: string
  updatedAt: string
  lessonId: string | null
  course: { title: string; slug: string } | null
  lesson: { title: string } | null
  _count: { messages: number }
}

export default function AiTutorPage() {
  const { status: authStatus } = useSession()
  const [conversations, setConversations] = useState<ConversationSummary[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/ai/tutor")
      const json = await res.json()
      if (json.success) {
        setConversations(json.data.conversations)
        if (!activeId && json.data.conversations.length > 0) {
          setActiveId(json.data.conversations[0].id)
        }
      }
    } finally {
      setLoading(false)
    }
  }, [activeId])

  useEffect(() => {
    if (authStatus === "unauthenticated") redirect("/login")
    if (authStatus !== "authenticated") return
    refresh()
  }, [authStatus, refresh])

  const newChat = () => {
    setActiveId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Bot className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">AI Tutor</h1>
            <p className="text-sm text-muted-foreground">
              Your free 24/7 study partner across every course
            </p>
          </div>
        </div>
        <Button size="sm" onClick={newChat} className="gap-2">
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="flex h-[72vh] flex-col rounded-lg border bg-card">
            <div className="px-4 py-3 text-sm font-semibold border-b">Conversations</div>
            <div className="flex-1 space-y-1 overflow-y-auto p-2">
              {loading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : conversations.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                  No conversations yet. Start chatting to create one.
                </p>
              ) : (
                conversations.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveId(c.id)}
                    className={cn(
                      "w-full rounded-lg px-3 py-2.5 text-left transition-colors",
                      activeId === c.id
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 shrink-0" />
                      <span className="truncate text-sm font-medium">{c.title}</span>
                    </div>
                    <p className="mt-1 truncate pl-6 text-[11px] text-muted-foreground">
                      {c.lesson?.title || c.course?.title || "General chat"} · {c._count.messages} messages
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <AiTutorChat
            conversationId={activeId || undefined}
            onConversationIdChange={(id) => {
              setActiveId(id)
              refresh()
            }}
            className="h-[72vh]"
            placeholder="Ask anything, in English or Bangla..."
            autoFocus
          />
        </div>
      </div>
    </div>
  )
}