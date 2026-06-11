"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  Award,
  Medal,
  Bell,
  Settings,
  ChevronLeft,
  BarChart3,
  Gift,
  Bookmark,
  Compass,
  User,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle, ThemeToggleIcon } from "@/components/theme/theme-toggle"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { UnreadBadge } from "@/components/notifications/unread-badge"

const sidebarItems = [
  { href: "/student", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/student/recommendations", icon: Compass, label: "Recommendations" },
  { href: "/student/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/student/courses", icon: BookOpen, label: "My Courses" },
  { href: "/student/leaderboard", icon: Medal, label: "Leaderboard" },
  { href: "/student/saved/courses", icon: Bookmark, label: "Saved" },
  { href: "/student/rewards", icon: Gift, label: "Rewards" },
  { href: "/student/certificates", icon: Award, label: "Certificates" },
  { href: "/student/achievements", icon: Trophy, label: "Achievements" },
  { href: "/student/notifications", icon: Bell, label: "Notifications", showBadge: true },
  { href: "/student/settings", icon: Settings, label: "Settings" },
  { href: "#", icon: User, label: "Public Profile", external: true },
]

export function StudentSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "fixed left-0 top-16 z-30 flex h-[calc(100vh-4rem)] flex-col border-r bg-background transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-end p-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform",
              collapsed && "rotate-180"
            )}
          />
        </Button>
      </div>
      <nav className="flex-1 space-y-1 px-2 pb-4">
        {sidebarItems.map((item) => {
          const isActive =
            item.href === "/student"
              ? pathname === "/student"
              : pathname.startsWith(item.href)
          const Icon = item.icon

          if (item.external) {
            const profileHref = session?.user?.id ? `/profile/${session.user.id}` : "#"
            return (
              <Link
                key={item.label}
                href={profileHref}
                target="_blank"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors relative",
                  "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && (
                  <>
                    <span>{item.label}</span>
                    <ExternalLink className="ml-auto h-3.5 w-3.5 text-muted-foreground/50" />
                  </>
                )}
              </Link>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors relative",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
              {item.showBadge && (
                <div className={cn("ml-auto", collapsed && "absolute -right-1 -top-1")}>
                  <UnreadBadge />
                </div>
              )}
            </Link>
          )
        })}
      </nav>
      <div className="border-t p-2">
        {collapsed ? (
          <div className="flex justify-center">
            <ThemeToggleIcon />
          </div>
        ) : (
          <ThemeToggle />
        )}
      </div>
    </aside>
  )
}
