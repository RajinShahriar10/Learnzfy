"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  Users,
  TrendingUp,
  Clock,
} from "lucide-react"

interface TeacherCourse {
  id: string
  title: string
  slug: string
  description: string
  category: string | null
  difficulty: string
  duration: string
  isPublished: boolean
  studentCount: number
  moduleCount: number
}

const difficultyColors: Record<string, string> = {
  beginner: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
  intermediate: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400",
  advanced: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
}

export default function TeacherCoursesPage() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all")
  const [courses, setCourses] = useState<TeacherCourse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/v1/courses?limit=100")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setCourses(
            d.data.map((c: Record<string, unknown>) => ({
              id: c.id as string,
              title: c.title as string,
              slug: c.slug as string,
              description: c.description as string,
              category: (c.category as { name: string } | null)?.name ?? null,
              difficulty: (c.difficulty as string) || "beginner",
              duration: c.duration ? `${c.duration}h` : "Self-paced",
              isPublished: c.isPublished as boolean,
              studentCount: (c._count as { enrollments: number })?.enrollments ?? 0,
              moduleCount: (c._count as { modules: number })?.modules ?? 0,
            }))
          )
        }
      })
      .catch(() => setCourses([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.category && c.category.toLowerCase().includes(search.toLowerCase()))
    if (filter === "published") return matchesSearch && c.isPublished
    if (filter === "draft") return matchesSearch && !c.isPublished
    return matchesSearch
  })

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Courses</h1>
          <p className="mt-1 text-muted-foreground">
            Create, edit, and manage your courses
          </p>
        </div>
        <Button asChild>
          <Link href="/teacher/courses/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Course
          </Link>
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-md border bg-background py-2 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex gap-2">
              {(["all", "published", "draft"] as const).map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(f)}
                  className="capitalize"
                >
                  {f === "all" && <Filter className="mr-1.5 h-3.5 w-3.5" />}
                  {f === "published" && <Eye className="mr-1.5 h-3.5 w-3.5" />}
                  {f === "draft" && <EyeOff className="mr-1.5 h-3.5 w-3.5" />}
                  {f}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading courses...</div>
        ) : (
          filtered.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge
                        className={cn(
                          "font-normal",
                          difficultyColors[course.difficulty] || difficultyColors.beginner
                        )}
                      >
                        {course.difficulty}
                      </Badge>
                      {course.category && <Badge variant="outline">{course.category}</Badge>}
                      {course.isPublished ? (
                        <Badge
                          variant="outline"
                          className="border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                        >
                          Published
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="border-amber-300 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                        >
                          Draft
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold">{course.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {course.description}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {course.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5" />
                        {course.moduleCount} modules
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {course.studentCount} students
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/teacher/courses/${course.id}`}>
                        <Pencil className="mr-1.5 h-3.5 w-3.5" />
                        Edit
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">No courses found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {search
                ? "Try a different search term"
                : filter !== "all"
                  ? `No ${filter} courses yet`
                  : "Create your first course to get started"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}
