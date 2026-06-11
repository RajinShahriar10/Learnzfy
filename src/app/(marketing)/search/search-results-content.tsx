"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { SearchBar } from "@/components/search/search-bar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Search,
  BookOpen,
  Users,
  FolderTree,
  Award,
  Clock,
  Star,
  TrendingUp,
  ChevronRight,
  SlidersHorizontal,
  X,
  GraduationCap,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchResults {
  courses: any[]
  teachers: any[]
  lessons: any[]
  categories: any[]
  certificates: any[]
}

interface Facets {
  types: { type: string; count: number }[]
  difficulties: { difficulty: string; count: number }[]
  categories: { id: string; name: string; slug: string; count: number }[]
}

interface ResultsData {
  results: SearchResults
  total: number
  totalResults: number
  facets: Facets
  took: number
}

const TYPE_LABELS: Record<string, string> = {
  courses: "Courses",
  teachers: "Teachers",
  lessons: "Lessons",
  categories: "Categories",
  certificates: "Certificates",
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  courses: <BookOpen className="h-4 w-4" />,
  teachers: <Users className="h-4 w-4" />,
  lessons: <GraduationCap className="h-4 w-4" />,
  categories: <FolderTree className="h-4 w-4" />,
  certificates: <Award className="h-4 w-4" />,
}

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "popular", label: "Popularity" },
  { value: "rating", label: "Rating" },
  { value: "newest", label: "Newest" },
  { value: "enrolled", label: "Most Enrolled" },
]

const DIFFICULTIES = ["beginner", "intermediate", "advanced"]

export function SearchResultsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const q = searchParams.get("q") || ""
  const typeFilter = searchParams.get("type") || ""
  const difficulty = searchParams.get("difficulty") || ""
  const categoryId = searchParams.get("category") || ""
  const sort = searchParams.get("sort") || "relevance"
  const page = parseInt(searchParams.get("page") || "1")

  const [data, setData] = useState<ResultsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  const fetchResults = useCallback(async () => {
    if (!q) {
      setData(null)
      setLoading(false)
      return
    }
    setLoading(true)
    const params = new URLSearchParams({ q, page: String(page), sort })
    if (typeFilter) params.set("type", typeFilter)
    if (difficulty) params.set("difficulty", difficulty)
    if (categoryId) params.set("category", categoryId)

    try {
      const res = await fetch(`/api/search?${params}`)
      if (res.ok) {
        const json = await res.json()
        setData(json.data)
      }
    } catch {
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [q, typeFilter, difficulty, categoryId, sort, page])

  useEffect(() => {
    fetchResults()
  }, [fetchResults])

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value)
      else params.delete(key)
    }
    if (updates.type !== undefined && updates.type !== typeFilter) params.set("page", "1")
    if (updates.difficulty !== undefined) params.set("page", "1")
    if (updates.category !== undefined) params.set("page", "1")
    if (updates.sort !== undefined) params.set("page", "1")
    router.push(`/search?${params.toString()}`)
  }

  const clearFilters = () => {
    const params = new URLSearchParams()
    params.set("q", q)
    router.push(`/search?${params.toString()}`)
  }

  const hasActiveFilters = typeFilter || difficulty || categoryId
  const activeFilterCount = [typeFilter, difficulty, categoryId].filter(Boolean).length

  if (!q) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Search className="h-16 w-16 mx-auto text-muted-foreground/40 mb-6" />
        <h1 className="text-2xl font-bold mb-2">Search Learnzfy</h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Find courses, teachers, lessons, and more across the platform
        </p>
        <div className="max-w-xl mx-auto">
          <SearchBar />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Search bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <SearchBar />
      </div>

      {loading ? (
        <LoadingState />
      ) : data && data.totalResults > 0 ? (
        <div className="flex gap-8">
          {/* Filters sidebar */}
          <aside className={cn(
            "shrink-0",
            showFilters
              ? "fixed inset-0 z-50 bg-background p-6 overflow-y-auto lg:relative lg:inset-auto lg:z-auto lg:p-0 lg:w-64"
              : "hidden lg:block w-64"
          )}>
            <div className="flex items-center justify-between mb-4 lg:hidden">
              <h3 className="font-semibold">Filters</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Type filter */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Type
              </h4>
              <div className="space-y-1">
                <button
                  onClick={() => updateParams({ type: "" })}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors text-left",
                    !typeFilter ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-muted-foreground"
                  )}
                >
                  All Results
                </button>
                {data.facets.types.map((t) => (
                  <button
                    key={t.type}
                    onClick={() => updateParams({ type: typeFilter === t.type ? "" : t.type })}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors text-left",
                      typeFilter === t.type ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-muted-foreground"
                    )}
                  >
                    {TYPE_ICONS[t.type]}
                    <span className="flex-1">{TYPE_LABELS[t.type] || t.type}</span>
                    <Badge variant="secondary" className="text-[10px] h-4 px-1.5">{t.count}</Badge>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty filter */}
            {data.facets.difficulties.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold mb-3">Difficulty</h4>
                <div className="space-y-1">
                  {DIFFICULTIES.map((d) => {
                    const facet = data.facets.difficulties.find((f) => f.difficulty === d)
                    if (!facet) return null
                    return (
                      <button
                        key={d}
                        onClick={() => updateParams({ difficulty: difficulty === d ? "" : d })}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors text-left capitalize",
                          difficulty === d ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-muted-foreground"
                        )}
                      >
                        <span className="flex-1">{d}</span>
                        <Badge variant="secondary" className="text-[10px] h-4 px-1.5">{facet.count}</Badge>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Category filter */}
            {data.facets.categories.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold mb-3">Category</h4>
                <div className="space-y-1">
                  {data.facets.categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => updateParams({ category: categoryId === c.id ? "" : c.id })}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors text-left",
                        categoryId === c.id ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-muted-foreground"
                      )}
                    >
                      <span className="flex-1">{c.name}</span>
                      <Badge variant="secondary" className="text-[10px] h-4 px-1.5">{c.count}</Badge>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters} className="w-full">
                Clear All Filters
              </Button>
            )}
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <h1 className="text-xl font-bold">
                Results for &ldquo;{q}&rdquo;
              </h1>
              <span className="text-sm text-muted-foreground">
                {data.total} results ({data.took}ms)
              </span>

              <div className="flex items-center gap-2 ml-auto">
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden gap-2"
                  onClick={() => setShowFilters(true)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>

                <select
                  value={sort}
                  onChange={(e) => updateParams({ sort: e.target.value })}
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active filter badges */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-4">
                {typeFilter && (
                  <Badge variant="secondary" className="gap-1">
                    {TYPE_LABELS[typeFilter] || typeFilter}
                    <button onClick={() => updateParams({ type: "" })}><X className="h-3 w-3" /></button>
                  </Badge>
                )}
                {difficulty && (
                  <Badge variant="secondary" className="gap-1 capitalize">
                    {difficulty}
                    <button onClick={() => updateParams({ difficulty: "" })}><X className="h-3 w-3" /></button>
                  </Badge>
                )}
                {categoryId && data.facets.categories.map((c) => c.id === categoryId ? (
                  <Badge key={c.id} variant="secondary" className="gap-1">
                    {c.name}
                    <button onClick={() => updateParams({ category: "" })}><X className="h-3 w-3" /></button>
                  </Badge>
                ) : null)}
              </div>
            )}

            {/* Results by type */}
            <div className="space-y-8">
              {typeFilter ? (
                <TypeResults type={typeFilter} items={data.results[typeFilter as keyof SearchResults] || []} q={q} />
              ) : (
                <>
                  {data.results.courses.length > 0 && (
                    <ResultSection type="courses" items={data.results.courses} q={q} total={data.facets.types.find(t => t.type === "courses")?.count || 0} />
                  )}
                  {data.results.teachers.length > 0 && (
                    <ResultSection type="teachers" items={data.results.teachers} q={q} total={data.facets.types.find(t => t.type === "teachers")?.count || 0} />
                  )}
                  {data.results.lessons.length > 0 && (
                    <ResultSection type="lessons" items={data.results.lessons} q={q} total={data.facets.types.find(t => t.type === "lessons")?.count || 0} />
                  )}
                  {data.results.categories.length > 0 && (
                    <ResultSection type="categories" items={data.results.categories} q={q} total={data.facets.types.find(t => t.type === "categories")?.count || 0} />
                  )}
                  {data.results.certificates.length > 0 && (
                    <ResultSection type="certificates" items={data.results.certificates} q={q} total={data.facets.types.find(t => t.type === "certificates")?.count || 0} />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <EmptyState q={q} />
      )}
    </div>
  )
}

function ResultSection({ type, items, q, total }: { type: string; items: any[]; q: string; total: number }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          {TYPE_ICONS[type]}
          {TYPE_LABELS[type] || type}
          <Badge variant="secondary" className="text-xs">{total}</Badge>
        </h2>
        {total > items.length && (
          <Link
            href={`/search?q=${encodeURIComponent(q)}&type=${type}`}
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            View all <ChevronRight className="h-3 w-3" />
          </Link>
        )}
      </div>
      <div className="space-y-3">
        {items.map((item: any, i: number) => (
          <ResultCard key={`${type}-${item.id || i}`} type={type} item={item} />
        ))}
      </div>
    </section>
  )
}

function TypeResults({ type, items, q }: { type: string; items: any[]; q: string }) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No {TYPE_LABELS[type]?.toLowerCase() || type} found for &ldquo;{q}&rdquo;
      </div>
    )
  }
  return (
    <section>
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
        {TYPE_ICONS[type]}
        {TYPE_LABELS[type] || type}
        <Badge variant="secondary" className="text-xs">{items.length}</Badge>
      </h2>
      <div className={cn(
        "grid gap-4",
        type === "courses" ? "sm:grid-cols-2" : "grid-cols-1"
      )}>
        {items.map((item: any, i: number) => (
          <ResultCard key={`${type}-${item.id || i}`} type={type} item={item} />
        ))}
      </div>
    </section>
  )
}

function ResultCard({ type, item }: { type: string; item: any }) {
  switch (type) {
    case "courses":
      return <CourseCard item={item} />
    case "teachers":
      return <TeacherCard item={item} />
    case "lessons":
      return <LessonCard item={item} />
    case "categories":
      return <CategoryCard item={item} />
    case "certificates":
      return <CertificateCard item={item} />
    default:
      return null
  }
}

function CourseCard({ item }: { item: any }) {
  return (
    <Link href={`/courses/${item.slug}`}>
      <Card className="group transition-all hover:shadow-md h-full">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {item.thumbnailUrl ? (
              <div className="shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-muted">
                <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="shrink-0 w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold truncate group-hover:text-primary transition-colors">{item.title}</h3>
                <Badge variant="outline" className="text-[10px] capitalize">{item.difficulty}</Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{item.description}</p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {item._count.enrollments}
                </span>
                {item.avgRating > 0 && (
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    {item.avgRating}
                  </span>
                )}
                {item.teacher && (
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {item.teacher.name}
                  </span>
                )}
                {item.price > 0 ? (
                  <span className="font-semibold">${item.price}</span>
                ) : (
                  <span className="text-emerald-600 font-medium">Free</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function TeacherCard({ item }: { item: any }) {
  return (
    <Link href={`/teachers/${item.id}`}>
      <Card className="group transition-all hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              {item.image ? (
                <img src={item.image} alt={item.name || ""} className="object-cover" />
              ) : null}
              <AvatarFallback>{(item.name || "T")[0]}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold group-hover:text-primary transition-colors">{item.name}</h3>
              {item.bio && <p className="text-sm text-muted-foreground line-clamp-1">{item.bio}</p>}
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  {item._count.createdCourses} courses
                </span>
                {item.avgRating > 0 && (
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    {item.avgRating}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function LessonCard({ item }: { item: any }) {
  return (
    <Link href={`/courses/${item.module.course.slug}?lesson=${item.id}`}>
      <Card className="group transition-all hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold group-hover:text-primary transition-colors">{item.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Course: {item.module.course.title}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function CategoryCard({ item }: { item: any }) {
  return (
    <Link href={`/courses?category=${item.slug}`}>
      <Card className="group transition-all hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="shrink-0 w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-950 flex items-center justify-center">
              <FolderTree className="h-5 w-5 text-orange-500" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold group-hover:text-primary transition-colors">{item.name}</h3>
              {item.description && <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>}
              <p className="text-xs text-muted-foreground mt-1">{item._count.courses} courses</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function CertificateCard({ item }: { item: any }) {
  return (
    <Link href={`/verify/${item.verificationId}`}>
      <Card className="group transition-all hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="shrink-0 w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-950 flex items-center justify-center">
              <Award className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold group-hover:text-primary transition-colors">{item.courseName}</h3>
              <p className="text-sm text-muted-foreground">
                {item.studentName} &middot; {item.teacherName}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {new Date(item.issuedAt).toLocaleDateString()}
              </p>
            </div>
            <Badge variant="outline" className="shrink-0">Verified</Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function LoadingState() {
  return (
    <div className="flex gap-8">
      <div className="hidden lg:block w-64 space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
      <div className="flex-1 space-y-6">
        <Skeleton className="h-6 w-64" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>
    </div>
  )
}

function EmptyState({ q }: { q: string }) {
  return (
    <div className="text-center py-20">
      <Search className="h-16 w-16 mx-auto text-muted-foreground/40 mb-6" />
      <h2 className="text-xl font-bold mb-2">No results for &ldquo;{q}&rdquo;</h2>
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        Try adjusting your search terms or browse our course catalog
      </p>
      <div className="flex items-center justify-center gap-4">
        <Link href="/courses">
          <Button variant="outline">Browse Courses</Button>
        </Link>
        <Link href="/teachers">
          <Button variant="outline">Browse Teachers</Button>
        </Link>
      </div>
    </div>
  )
}
