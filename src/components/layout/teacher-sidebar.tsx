"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Settings,
  ChevronLeft,
  PlusCircle,
  BarChart3,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle, ThemeToggleIcon } from "@/components/theme/theme-toggle"
import { useState } from "react"

const sidebarItems = [
  { href: "/teacher", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/teacher/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/teacher/courses", icon: BookOpen, label: "My Courses" },
  { href: "/teacher/students", icon: Users, label: "Students" },
  { href: "/teacher/apply", icon: FileText, label: "Application" },
  { href: "/teacher/settings", icon: Settings, label: "Settings" },
]

export function TeacherSidebar() {
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
      <nav className="flex-1 space-y-1 px-2 pb-4">
        {sidebarItems.map((item) => {
          const isActive =
            item.href === "/teacher"
              ? pathname === "/teacher"
              : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>
      <div className={cn("border-t p-2", collapsed && "flex justify-center")}>
        <Button asChild variant="default" className={cn("w-full gap-2", collapsed && "w-10 h-10 p-0")}>
          <Link href="/teacher/courses/new">
            <PlusCircle className="h-4 w-4" />
            {!collapsed && "New Course"}
          </Link>
        </Button>
      </div>
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
