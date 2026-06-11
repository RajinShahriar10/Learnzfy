"use client"

import Link from "next/link"
import { Bell } from "lucide-react"
import { UnreadBadge } from "./unread-badge"
import { useState } from "react"

export function NotificationBell() {
  const [unread, setUnread] = useState(0)

  return (
    <Link
      href="/student/notifications"
      className="relative flex items-center justify-center"
    >
      <Bell className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
      {unread > 0 && (
        <span className="absolute -right-1.5 -top-1.5 inline-flex items-center justify-center rounded-full bg-red-500 px-1 py-0.5 text-[9px] font-bold text-white min-w-[16px] h-[16px]">
          {unread > 99 ? "99+" : unread}
        </span>
      )}
      <UnreadBadge className="hidden" onCount={setUnread} />
    </Link>
  )
}
