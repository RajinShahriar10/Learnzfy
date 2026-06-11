"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  FileCheck,
  TrendingUp,
  Award,
  BookOpen,
  Megaphone,
  Trash2,
  Loader2,
  Inbox,
} from "lucide-react"

interface NotificationItem {
  id: string
  userId: string
  title: string
  message: string
  type: string
  isRead: boolean
  link: string | null
  createdAt: string
}

const typeConfig: Record<
  string,
  { icon: typeof Bell; color: string; bg: string; label: string }
> = {
  quiz_result: {
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    label: "Quiz",
  },
  exam_result: {
    icon: FileCheck,
    color: "text-blue-600",
    bg: "bg-blue-100 dark:bg-blue-900/30",
    label: "Exam",
  },
  rank_change: {
    icon: TrendingUp,
    color: "text-purple-600",
    bg: "bg-purple-100 dark:bg-purple-900/30",
    label: "Rank",
  },
  badge_earned: {
    icon: Award,
    color: "text-amber-600",
    bg: "bg-amber-100 dark:bg-amber-900/30",
    label: "Badge",
  },
  course_update: {
    icon: BookOpen,
    color: "text-indigo-600",
    bg: "bg-indigo-100 dark:bg-indigo-900/30",
    label: "Course",
  },
  announcement: {
    icon: Megaphone,
    color: "text-rose-600",
    bg: "bg-rose-100 dark:bg-rose-900/30",
    label: "Announcement",
  },
}

const typeTabs = [
  { value: "", label: "All" },
  { value: "quiz_result", label: "Quizzes" },
  { value: "exam_result", label: "Exams" },
  { value: "rank_change", label: "Rankings" },
  { value: "badge_earned", label: "Badges" },
  { value: "course_update", label: "Courses" },
  { value: "announcement", label: "Announcements" },
]

export default function NotificationsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [unread, setUnread] = useState(0)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("")
  const [markingAll, setMarkingAll] = useState(false)

  const fetchNotifications = useCallback(async () => {
    try {
      const params = activeTab ? `?type=${activeTab}` : ""
      const res = await fetch(`/api/notifications${params}`)
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.notifications)
        setUnread(data.unread)
      }
    } catch {
    } finally {
      setLoading(false)
    }
  }, [activeTab])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const markAsRead = async (id: string) => {
    await fetch(`/api/notifications/${id}`, { method: "PUT" })
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
    setUnread((prev) => Math.max(0, prev - 1))
  }

  const markAllRead = async () => {
    setMarkingAll(true)
    await fetch("/api/notifications", { method: "PUT" })
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    setUnread(0)
    setMarkingAll(false)
  }

  const handleLinkClick = (notification: NotificationItem) => {
    if (!notification.isRead) markAsRead(notification.id)
    if (notification.link) router.push(notification.link)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            {unread > 0
              ? `${unread} unread notification${unread !== 1 ? "s" : ""}`
              : "All caught up!"}
          </p>
        </div>
        {unread > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={markAllRead}
            disabled={markingAll}
          >
            {markingAll ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCheck className="h-4 w-4" />
            )}
            Mark all read
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {typeTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              activeTab === tab.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <Inbox className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No notifications</h3>
          <p className="text-sm text-muted-foreground">
            {activeTab
              ? "No notifications of this type yet."
              : "You're all caught up! Notifications will appear here."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => {
            const config = typeConfig[notification.type] ?? {
              icon: Bell,
              color: "text-muted-foreground",
              bg: "bg-muted",
              label: notification.type,
            }
            const Icon = config.icon
            const timeAgo = getTimeAgo(notification.createdAt)

            return (
              <div
                key={notification.id}
                onClick={() => handleLinkClick(notification)}
                className={`group relative flex items-start gap-4 rounded-xl border p-4 transition-all cursor-pointer hover:shadow-sm ${
                  notification.isRead
                    ? "bg-background"
                    : "bg-primary/[0.02] border-primary/10"
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.bg}`}
                >
                  <Icon className={`h-5 w-5 ${config.color}`} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p
                        className={`text-sm font-medium ${
                          !notification.isRead ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {notification.title}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                        {notification.message}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-[11px] text-muted-foreground/60 whitespace-nowrap">
                        {timeAgo}
                      </span>
                      {!notification.isRead && (
                        <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                      )}
                    </div>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-1.5 py-0 h-4 font-normal"
                    >
                      {config.label}
                    </Badge>
                  </div>
                </div>

                {!notification.isRead && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      markAsRead(notification.id)
                    }}
                    className="absolute right-2 top-2 hidden h-6 w-6 items-center justify-center rounded-full text-muted-foreground/40 hover:text-foreground group-hover:flex"
                    title="Mark as read"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function getTimeAgo(dateStr: string): string {
  const now = Date.now()
  const date = new Date(dateStr).getTime()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}
