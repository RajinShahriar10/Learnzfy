"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Search,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

interface Student {
  id: string
  name: string | null
  email: string
  enrolledAt: string
  progress: number
  courseName: string
}

export default function TeacherStudentsPage() {
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "progress" | "enrolledAt">("enrolledAt")
  const [sortAsc, setSortAsc] = useState(false)
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/analytics/teacher")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data?.enrollments) {
          setStudents(
            d.data.enrollments.map((e: Record<string, unknown>) => ({
              id: e.id as string,
              name: (e.user as { name: string | null })?.name || "Unknown",
              email: (e.user as { email: string })?.email || "",
              enrolledAt: e.enrolledAt as string,
              progress: (e.progress as number) || 0,
              courseName: (e.course as { title: string })?.title || "",
            }))
          )
        }
      })
      .catch(() => setStudents([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = students
    .filter(
      (s) =>
        s.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      let cmp = 0
      if (sortBy === "name") cmp = (a.name || "").localeCompare(b.name || "")
      else if (sortBy === "progress") cmp = a.progress - b.progress
      else cmp = new Date(a.enrolledAt).getTime() - new Date(b.enrolledAt).getTime()
      return sortAsc ? cmp : -cmp
    })

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) setSortAsc(!sortAsc)
    else {
      setSortBy(field)
      setSortAsc(false)
    }
  }

  const SortIcon = sortAsc ? ChevronUp : ChevronDown

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Students</h1>
        <p className="mt-1 text-muted-foreground">
          View and manage your enrolled students
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search students by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border bg-background py-2 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="hidden sm:grid sm:grid-cols-5 gap-4 p-4 border-b bg-muted/50 text-sm font-medium text-muted-foreground">
            <button
              className="col-span-2 flex items-center gap-1 text-left"
              onClick={() => toggleSort("name")}
            >
              Student
              <SortIcon className="h-3.5 w-3.5" />
            </button>
            <button
              className="flex items-center gap-1 text-left"
              onClick={() => toggleSort("enrolledAt")}
            >
              Enrolled
              <SortIcon className="h-3.5 w-3.5" />
            </button>
            <button
              className="flex items-center gap-1 text-left"
              onClick={() => toggleSort("progress")}
            >
              Progress
              <SortIcon className="h-3.5 w-3.5" />
            </button>
            <span className="text-left">Course</span>
          </div>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading students...</div>
          ) : (
            filtered.map((student) => (
              <div
                key={student.id}
                className="grid sm:grid-cols-5 gap-4 p-4 border-b last:border-0 items-center hover:bg-muted/30 transition-colors"
              >
                <div className="col-span-2 flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {(student.name || "U").charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{student.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{student.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 shrink-0" />
                  {new Date(student.enrolledAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        student.progress >= 80
                          ? "bg-emerald-500"
                          : student.progress >= 40
                            ? "bg-amber-500"
                            : "bg-blue-500"
                      )}
                      style={{ width: `${student.progress}%` }}
                    />
                  </div>
                  <span className={cn(
                    "text-sm font-medium shrink-0 w-10 text-right",
                    student.progress >= 80
                      ? "text-emerald-600 dark:text-emerald-400"
                      : student.progress >= 40
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-blue-600 dark:text-blue-400"
                  )}>
                    {student.progress}%
                  </span>
                </div>
                <div className="text-sm text-muted-foreground hidden sm:block truncate">
                  {student.courseName}
                </div>
              </div>
            ))
          )}

          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">
                {search ? "No students match your search" : "No students enrolled yet"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}
