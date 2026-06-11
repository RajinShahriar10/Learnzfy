"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { logout } from "@/lib/auth-actions"
import { NotificationBell } from "@/components/notifications/notification-bell"
import { SearchBar } from "@/components/search/search-bar"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-xl font-bold text-primary">Learnzfy</span>
        </Link>

        {/* Desktop search */}
        <div className="hidden md:flex flex-1 max-w-lg mx-auto">
          <SearchBar />
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-4 shrink-0">
          <Link
            href="/courses"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Courses
          </Link>
          <Link
            href="/teachers"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Teachers
          </Link>
          <Link
            href="/api-docs"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            API Docs
          </Link>
          <ThemeToggle />
          {session?.user ? (
            <div className="flex items-center gap-2">
              {session.user.role === "STUDENT" && (
                <NotificationBell />
              )}
              <Link
                href={
                  session.user.role === "STUDENT"
                    ? "/student"
                    : session.user.role === "TEACHER"
                      ? "/teacher"
                      : session.user.role === "ADMIN"
                        ? "/admin"
                        : "/super-admin"
                }
              >
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              <form action={logout}>
                <Button variant="outline" size="sm" type="submit">
                  Logout
                </Button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile menu toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background px-4 py-4 space-y-4">
          <SearchBar />
          <nav className="flex flex-col gap-2">
            <Link
              href="/courses"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Courses
            </Link>
            <Link
              href="/teachers"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Teachers
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/api-docs"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              API Docs
            </Link>
          </nav>
          <div className="flex items-center justify-between pt-2 border-t">
            <ThemeToggle />
          </div>
          <div className="pt-2 border-t">
            {session?.user ? (
              <div className="flex items-center gap-2">
                <Link
                  href={
                    session.user.role === "STUDENT"
                      ? "/student"
                      : session.user.role === "TEACHER"
                        ? "/teacher"
                        : session.user.role === "ADMIN"
                          ? "/admin"
                          : "/super-admin"
                  }
                  className="flex-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="ghost" size="sm" className="w-full">
                    Dashboard
                  </Button>
                </Link>
                <form action={logout}>
                  <Button variant="outline" size="sm" type="submit">
                    Logout
                  </Button>
                </form>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/register" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                  <Button size="sm" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
