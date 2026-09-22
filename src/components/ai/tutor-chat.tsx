"use client"

import { useState, useRef, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Bot, Send, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  mode?: string
}

interface AiTutorChatProps {
  courseId?: string
  lessonId?: string
  conversationId?: string
  onConversationIdChange?: (id: string) => void
  className?: string
  placeholder?: string
  autoFocus?: boolean
}

const SUGGESTIONS = [
  "Summarize this lesson in 3 points",
  "Explain the hardest concept here simply",
  "Give me 2 practice questions",
]

export function AiTutorChat({
  courseId,
  lessonId,
  conversationId,
  onConversationIdChange,
  className,
  placeholder,
  autoFocus,
}: AiTutorChatProps) {
  const { data: session, status: authStatus } = useSession()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [aiMode, setAiMode] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messages.length === 0 && conversationId) {
      fetch(`/api/ai/tutor/${conversationId}`)
        .then((r) => r.json())
        .then((res) => {
          if (res.success) {
            setMessages(
              res.data.messages.map((m: { id: string; role: string; content: string }) => ({
                id: m.id,
                role: m.role as "user" | "assistant",
                content: m.content,
              }))
            )
          }
        })
        .catch(() => {})
    }
  }, [conversationId, messages.length])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, loading])

  const send = async (text?: string) => {
    const value = (text ?? input).trim()
    if (!value || loading) return
    setInput("")
    setMessages((prev) => [...prev, { id: `local-${Date.now()}`, role: "user", content: value }])
    setLoading(true)

    try {
      const res = await fetch("/api/ai/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: value, conversationId, courseId, lessonId }),
      })
      const json = await res.json()
      if (json.success) {
        if (json.data.aiMode && !aiMode) setAiMode(json.data.aiMode)
        setMessages((prev) => [
          ...prev,
          { id: `reply-${Date.now()}`, role: "assistant", content: json.data.reply, mode: json.data.mode },
        ])
        if (conversationId !== json.data.conversation.id && onConversationIdChange) {
          onConversationIdChange(json.data.conversation.id)
        }
      } else {
        setMessages((prev) => [
          ...prev,
          { id: `reply-${Date.now()}`, role: "assistant", content: `Something went wrong: ${json.error || "please try again"}` },
        ])
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: `reply-${Date.now()}`, role: "assistant", content: "Network error. Please try again." },
      ])
    } finally {
      setLoading(false)
    }
  }

  if (authStatus !== "authenticated") {
    return (
      <div className="rounded-lg border bg-card p-6 text-center text-sm text-muted-foreground">
        Sign in to chat with your AI Tutor.
      </div>
    )
  }

  return (
    <div className={cn("flex h-full min-h-0 flex-col rounded-lg border bg-card", className)}>
      <div className="flex items-center gap-2 border-b px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Bot className="h-4.5 w-4.5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold leading-tight">AI Tutor</p>
          <p className="text-[11px] text-muted-foreground leading-tight">
            {aiMode || "Personal tutor for this lesson"}
          </p>
        </div>
        <Sparkles className="h-4 w-4 text-primary/60" />
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="space-y-3 py-2">
            <div className="rounded-lg bg-muted p-4 text-sm">
              <p className="font-medium mb-1">Hello{session?.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""}! 👋</p>
              <p className="text-muted-foreground">
                Ask me anything about this lesson — concepts, doubts, or practice ideas. Learning here is free, and so is my help.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <Button key={s} variant="outline" size="sm" className="h-auto px-3 py-1.5 text-xs" onClick={() => send(s)}>
                  {s}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "flex",
                m.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm leading-relaxed",
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                )}
              >
                {m.content}
                {m.mode === "fallback" && (
                  <span className="mt-1 block text-[10px] opacity-60">Smart offline reply</span>
                )}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Thinking...
            </div>
          </div>
        )}
      </div>

      <div className="border-t p-3">
        <div className="flex items-end gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                send()
              }
            }}
            placeholder={placeholder || "Ask about this lesson..."}
            rows={2}
            className="min-h-[44px] resize-none"
            autoFocus={autoFocus}
          />
          <Button size="icon" className="h-11 w-11 shrink-0" onClick={() => send()} disabled={loading || !input.trim()}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}