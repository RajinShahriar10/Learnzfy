"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle, ThemeToggleIcon } from "@/components/theme/theme-toggle"
import {
  ChevronLeft,
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  FolderTree,
  ClipboardList,
  FileCheck,
  Award,
  Medal,
  Trophy,
  Bell,
  Handshake,
  Globe,
  BarChart3,
  Gift,
  Star,
  Flame,
  FileText,
  ShieldCheck,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface SidebarItem {
  href: string
  icon: LucideIcon
  label: string
}

interface SidebarGroup {
  label: string
  items: SidebarItem[]
}

const sidebarGroups: SidebarGroup[] = [
  {
    label: "Management",
    items: [
      { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
      { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
      { href: "/admin/teacher-applications", icon: FileText, label: "Applications" },
      { href: "/admin/teacher-verification", icon: ShieldCheck, label: "Verification" },
      { href: "/admin/students", icon: Users, label: "Students" },
      { href: "/admin/teachers", icon: GraduationCap, label: "Teachers" },
      { href: "/admin/courses", icon: BookOpen, label: "Courses" },
      { href: "/admin/categories", icon: FolderTree, label: "Categories" },
    ],
  },
  {
    label: "Assessments",
    items: [
      { href: "/admin/quizzes", icon: ClipboardList, label: "Quizzes" },
      { href: "/admin/exams", icon: FileCheck, label: "Exams" },
      { href: "/admin/certificates", icon: Award, label: "Certificates" },
    ],
  },
  {
    label: "Engagement",
    items: [
      { href: "/admin/leaderboards", icon: Medal, label: "Leaderboards" },
      { href: "/admin/badges", icon: Trophy, label: "Badges" },
      { href: "/admin/rewards", icon: Gift, label: "Rewards" },
      { href: "/admin/reviews", icon: Star, label: "Reviews" },
      { href: "/admin/streak", icon: Flame, label: "Streak" },
      { href: "/admin/notifications", icon: Bell, label: "Notifications" },
      { href: "/admin/sponsors", icon: Handshake, label: "Sponsors" },
    ],
  },
  {
    label: "Appearance",
    items: [
      { href: "/admin/website", icon: Globe, label: "Website" },
    ],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
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
      <nav className="flex-1 space-y-4 overflow-y-auto px-2 pb-4">
        {sidebarGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                {group.label}
              </p>
            )}
            <div className="mt-1 space-y-0.5">
              {group.items.map((item) => {
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href)
                const Icon = item.icon

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
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
