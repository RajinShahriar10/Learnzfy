"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Send } from "lucide-react"

export function SendNotificationForm() {
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [type, setType] = useState<"info" | "success" | "warning" | "achievement">("info")
  const [broadcast, setBroadcast] = useState(true)
  const [userId, setUserId] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !message.trim()) return
    setLoading(true)

    try {
      if (broadcast) {
        const res = await fetch("/api/admin/notifications/broadcast", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, message, type }),
        })
        if (!res.ok) throw new Error()
      } else {
        if (!userId.trim()) {
          alert("Please enter a user ID")
          setLoading(false)
          return
        }
        const res = await fetch("/api/admin/action", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            entity: "notification",
            data: { userId, title, message, type },
          }),
        })
        if (!res.ok) throw new Error()
      }

      setTitle("")
      setMessage("")
      setUserId("")
      router.refresh()
    } catch {
      alert("Failed to send notification")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border p-4">
      <h3 className="text-sm font-semibold">Send Notification</h3>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            checked={broadcast}
            onChange={() => setBroadcast(true)}
            className="h-4 w-4"
          />
          Broadcast to all
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            checked={!broadcast}
            onChange={() => setBroadcast(false)}
            className="h-4 w-4"
          />
          Specific user
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Notification title"
            className="h-9"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as typeof type)}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
          >
            <option value="info">Info</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="achievement">Achievement</option>
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Notification message"
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
          required
        />
      </div>

      {!broadcast && (
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">User ID</label>
          <Input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter user ID"
            className="h-9"
            required
          />
        </div>
      )}

      <Button type="submit" disabled={loading} size="sm" className="gap-1">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        {loading ? "Sending..." : "Send Notification"}
      </Button>
    </form>
  )
}
