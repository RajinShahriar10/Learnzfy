"use client"

import { useState, useEffect, useCallback } from "react"
import { CourseCard, type CourseData } from "@/components/shared/course-card"
import { CourseFilters } from "@/components/sections/course-filters"
import { Pagination } from "@/components/shared/pagination"
import { BookOpen } from "lucide-react"

const ITEMS_PER_PAGE = 6

interface ApiResponse {
  success: boolean
  data: CourseData[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export default function CoursesPage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [difficulty, setDifficulty] = useState("all")
  const [page, setPage] = useState(1)
  const [courses, setCourses] = useState<CourseData[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  const fetchCourses = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    params.set("page", page.toString())
    params.set("limit", ITEMS_PER_PAGE.toString())
    if (search) params.set("search", search)
    if (category !== "All") params.set("category", category)
    if (difficulty !== "all") params.set("difficulty", difficulty)

    try {
      const res = await fetch(`/api/public/courses?${params}`)
      const data: ApiResponse = await res.json()
      if (data.success) {
        setCourses(data.data)
        setTotalPages(data.pagination.totalPages)
      }
    } catch {
      setCourses([])
    } finally {
      setLoading(false)
    }
  }, [page, search, category, difficulty])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  const handleCategoryChange = (cat: string) => {
    setCategory(cat)
    setPage(1)
  }

  const handleDifficultyChange = (diff: string) => {
    setDifficulty(diff)
    setPage(1)
  }

  return (
    <div className="min-h-screen">
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold tracking-tight">Courses</h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            Explore our complete catalog of free courses. Filter by category,
            difficulty, or search for specific topics.
          </p>
        </div>
      </section>

      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <CourseFilters
            search={search}
            category={category}
            difficulty={difficulty}
            onSearchChange={(v) => {
              setSearch(v)
              setPage(1)
            }}
            onCategoryChange={handleCategoryChange}
            onDifficultyChange={handleDifficultyChange}
          />
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-pulse text-muted-foreground">Loading courses...</div>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/40" />
              <h3 className="mt-4 text-lg font-semibold">No courses found</h3>
              <p className="text-muted-foreground">
                {search || category !== "All" || difficulty !== "all"
                  ? "Try adjusting your search or filters"
                  : "Courses will appear here once teachers create them"}
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
              <Pagination
                current={page}
                total={totalPages}
                onPageChange={setPage}
              />
            </>
          )}
        </div>
      </section>
    </div>
  )
}
