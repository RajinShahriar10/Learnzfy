"use client"

import { useState, useMemo } from "react"
import { CourseCard } from "@/components/shared/course-card"
import { CourseFilters } from "@/components/sections/course-filters"
import { Pagination } from "@/components/shared/pagination"
import {
  searchCourses,
  getCoursesByCategory,
  getCoursesByDifficulty,
  courses as allCourses,
} from "@/lib/mock-data"
import { BookOpen } from "lucide-react"

const ITEMS_PER_PAGE = 6

export default function CoursesPage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [difficulty, setDifficulty] = useState("all")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let result = search
      ? searchCourses(search)
      : category !== "All"
        ? getCoursesByCategory(category)
        : allCourses

    if (difficulty !== "all") {
      result = result.filter(
        (c) => c.difficulty === difficulty
      )
    }

    return result
  }, [search, category, difficulty])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  )

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
          {paginated.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/40" />
              <h3 className="mt-4 text-lg font-semibold">No courses found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {paginated.map((course) => (
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
