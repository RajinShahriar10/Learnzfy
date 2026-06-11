import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"

export interface SearchParams {
  q: string
  type?: string
  difficulty?: string
  category?: string
  sort?: string
  page?: number
  limit?: number
}

export interface SearchResults {
  courses: {
    id: string
    title: string
    slug: string
    description: string
    thumbnailUrl: string | null
    difficulty: string
    price: number
    teacher: { id: string; name: string | null; image: string | null }
    category: { id: string; name: string; slug: string } | null
    _count: { enrollments: number; reviews: number }
    avgRating: number
    matchType: "title" | "description"
  }[]
  teachers: {
    id: string
    name: string | null
    image: string | null
    bio: string | null
    _count: { createdCourses: number }
    avgRating: number
  }[]
  lessons: {
    id: string
    title: string
    description: string | null
    module: { course: { id: string; title: string; slug: string } }
    matchType: "title" | "description"
  }[]
  categories: {
    id: string
    name: string
    slug: string
    description: string | null
    _count: { courses: number }
  }[]
  certificates: {
    id: string
    studentName: string
    courseName: string
    teacherName: string
    verificationId: string
    issuedAt: Date
  }[]
}

export interface SearchResponse {
  results: SearchResults
  total: number
  totalResults: number
  facets: {
    types: { type: string; count: number }[]
    difficulties: { difficulty: string; count: number }[]
    categories: { id: string; name: string; slug: string; count: number }[]
  }
  took: number
}

const MAX_RESULTS_PER_TYPE = 5
const SNIPPET_LENGTH = 160

function snippet(text: string, query: string): string {
  const lower = text.toLowerCase()
  const idx = lower.indexOf(query.toLowerCase())
  if (idx === -1) return text.slice(0, SNIPPET_LENGTH) + (text.length > SNIPPET_LENGTH ? "..." : "")
  const start = Math.max(0, idx - 60)
  const end = Math.min(text.length, idx + query.length + 80)
  return (start > 0 ? "..." : "") + text.slice(start, end) + (end < text.length ? "..." : "")
}

export async function searchAll(params: SearchParams): Promise<SearchResponse> {
  const start = performance.now()
  const { q, type, difficulty, category, sort = "relevance", page = 1, limit = 10 } = params

  if (!q || q.trim().length < 2) {
    return {
      results: { courses: [], teachers: [], lessons: [], categories: [], certificates: [] },
      total: 0,
      totalResults: 0,
      facets: { types: [], difficulties: [], categories: [] },
      took: 0,
    }
  }

  const query = q.trim()
  const lowerQuery = query.toLowerCase()

  const filters: {
    courses?: { difficulty?: string; categoryId?: string }
  } = {}
  if (difficulty) filters.courses = { ...filters.courses, difficulty }
  if (category) filters.courses = { ...filters.courses, categoryId: category }

  const skip = (page - 1) * limit

  async function searchCourses() {
    const where: Prisma.CourseWhereInput = {
      isPublished: true,
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { shortDescription: { contains: query, mode: "insensitive" } },
      ],
    }
    if (difficulty) where.difficulty = difficulty
    if (category) where.categoryId = category

    const orderBy: Prisma.CourseOrderByWithRelationInput =
      sort === "popular" ? { enrollments: { _count: "desc" } }
      : sort === "rating" ? { reviews: { _count: "desc" } }
      : sort === "newest" ? { createdAt: "desc" }
      : sort === "enrolled" ? { enrollments: { _count: "desc" } }
      : { createdAt: "desc" }

    const courses = await prisma.course.findMany({
      where,
      orderBy,
      take: type ? limit : MAX_RESULTS_PER_TYPE,
      ...(type ? { skip } : {}),
      include: {
        teacher: { select: { id: true, name: true, image: true } },
        category: { select: { id: true, name: true, slug: true } },
        _count: { select: { enrollments: true, reviews: true } },
        reviews: { select: { rating: true } },
      },
    })

    return courses.map((c) => {
      const totalRatings = c.reviews.length
      const avgRating = totalRatings > 0
        ? Math.round((c.reviews.reduce((s, r) => s + r.rating, 0) / totalRatings) * 10) / 10
        : 0
      const titleMatch = c.title.toLowerCase().includes(lowerQuery)
      const { reviews, ...rest } = c
      return {
        ...rest,
        description: snippet(c.description, query),
        avgRating,
        matchType: titleMatch ? ("title" as const) : ("description" as const),
      }
    })
  }

  async function searchTeachers() {
    const teachers = await prisma.user.findMany({
      where: {
        role: "TEACHER",
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { profile: { bio: { contains: query, mode: "insensitive" } } },
        ],
      },
      take: type ? limit : MAX_RESULTS_PER_TYPE,
      ...(type ? { skip } : {}),
      include: {
        profile: { select: { bio: true } },
        _count: { select: { createdCourses: true } },
        teacherReviewsGiven: { select: { rating: true } },
      },
    })

    return teachers.map((t) => {
      const totalRatings = t.teacherReviewsGiven.length
      const avgRating = totalRatings > 0
        ? Math.round((t.teacherReviewsGiven.reduce((s, r) => s + r.rating, 0) / totalRatings) * 10) / 10
        : 0
      return {
        id: t.id,
        name: t.name,
        image: t.image,
        bio: t.profile?.bio ? snippet(t.profile.bio, query) : null,
        _count: t._count,
        avgRating,
      }
    })
  }

  async function searchLessons() {
    const lessons = await prisma.lesson.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      take: type ? limit : MAX_RESULTS_PER_TYPE,
      ...(type ? { skip } : {}),
      include: {
        module: {
          select: { course: { select: { id: true, title: true, slug: true } } },
        },
      },
    })

    return lessons.map((l) => {
      const titleMatch = l.title.toLowerCase().includes(lowerQuery)
      return {
        id: l.id,
        title: l.title,
        description: l.description ? snippet(l.description, query) : null,
        module: l.module,
        matchType: titleMatch ? ("title" as const) : ("description" as const),
      }
    })
  }

  async function searchCategories() {
    return prisma.category.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      take: MAX_RESULTS_PER_TYPE,
      include: { _count: { select: { courses: true } } },
    })
  }

  async function searchCertificates() {
    return prisma.certificate.findMany({
      where: {
        OR: [
          { studentName: { contains: query, mode: "insensitive" } },
          { courseName: { contains: query, mode: "insensitive" } },
          { teacherName: { contains: query, mode: "insensitive" } },
          { verificationId: { contains: query, mode: "insensitive" } },
        ],
      },
      take: MAX_RESULTS_PER_TYPE,
    })
  }

  const [courses, teachers, lessons, categories, certificates] = await Promise.all([
    searchCourses(),
    searchTeachers(),
    searchLessons(),
    searchCategories(),
    searchCertificates(),
  ])

  const totalResults = courses.length + teachers.length + lessons.length + categories.length + certificates.length

  const facets = {
    types: [
      { type: "courses", count: courses.length },
      { type: "teachers", count: teachers.length },
      { type: "lessons", count: lessons.length },
      { type: "categories", count: categories.length },
      { type: "certificates", count: certificates.length },
    ].filter((f) => f.count > 0),
    difficulties: await getDifficultyFacets(query),
    categories: await getCategoryFacets(query),
  }

  const took = Math.round(performance.now() - start)

  return {
    results: { courses, teachers, lessons, categories, certificates },
    total: totalResults,
    totalResults,
    facets,
    took,
  }
}

async function getDifficultyFacets(query: string) {
  const result = await prisma.course.groupBy({
    by: ["difficulty"],
    where: {
      isPublished: true,
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    },
    _count: true,
  })
  return result.map((r) => ({ difficulty: r.difficulty, count: r._count }))
}

async function getCategoryFacets(query: string) {
  const courses = await prisma.course.findMany({
    where: {
      isPublished: true,
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    },
    select: { categoryId: true },
  })

  const categoryCount = new Map<string, number>()
  for (const c of courses) {
    if (c.categoryId) {
      categoryCount.set(c.categoryId, (categoryCount.get(c.categoryId) ?? 0) + 1)
    }
  }

  if (categoryCount.size === 0) return []

  const categories = await prisma.category.findMany({
    where: { id: { in: Array.from(categoryCount.keys()) } },
  })

  return categories
    .map((c) => ({ id: c.id, name: c.name, slug: c.slug, count: categoryCount.get(c.id) ?? 0 }))
    .sort((a, b) => b.count - a.count)
}

export async function getSuggestions(q: string, limit = 5) {
  if (!q || q.trim().length < 2) return []

  const query = q.trim()
  const suggestions: { text: string; type: string; link: string }[] = []

  const [courses, teachers, categories] = await Promise.all([
    prisma.course.findMany({
      where: {
        isPublished: true,
        title: { contains: query, mode: "insensitive" },
      },
      take: limit,
      select: { id: true, title: true, slug: true },
    }),
    prisma.user.findMany({
      where: {
        role: "TEACHER",
        name: { contains: query, mode: "insensitive" },
      },
      take: limit,
      select: { id: true, name: true },
    }),
    prisma.category.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { slug: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 3,
      select: { id: true, name: true, slug: true },
    }),
  ])

  for (const c of courses) {
    suggestions.push({ text: c.title, type: "Course", link: `/courses/${c.slug}` })
  }
  for (const t of teachers) {
    if (t.name) suggestions.push({ text: t.name, type: "Teacher", link: `/teachers/${t.id}` })
  }
  for (const cat of categories) {
    suggestions.push({ text: cat.name, type: "Category", link: `/courses?category=${cat.slug}` })
  }

  return suggestions.slice(0, limit)
}

export async function getPopularSearches(limit = 8) {
  return prisma.searchQuery.findMany({
    where: { count: { gte: 2 } },
    orderBy: { count: "desc" },
    take: limit,
    select: { query: true, count: true },
    distinct: ["query"],
  })
}

export async function getRecentSearches(userId: string, limit = 8) {
  return prisma.searchQuery.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: { query: true, createdAt: true },
    distinct: ["query"],
  })
}

export async function logSearch(query: string, userId?: string) {
  if (!query || query.trim().length < 2) return

  const trimmed = query.trim()

  if (userId) {
    const existing = await prisma.searchQuery.findFirst({
      where: { query: trimmed, userId },
      orderBy: { createdAt: "desc" },
    })

    if (existing) {
      await prisma.searchQuery.update({
        where: { id: existing.id },
        data: { count: { increment: 1 }, createdAt: new Date() },
      })
      return
    }
  }

  // Also check/update global count
  const global = await prisma.searchQuery.findFirst({
    where: { query: trimmed, userId: null },
    orderBy: { createdAt: "desc" },
  })

  if (global) {
    await prisma.searchQuery.update({
      where: { id: global.id },
      data: { count: { increment: 1 } },
    })
  } else {
    await prisma.searchQuery.create({
      data: { query: trimmed, userId: userId ?? null, count: 1 },
    })
  }

  if (userId) {
    await prisma.searchQuery.create({
      data: { query: trimmed, userId, count: 1 },
    })
  }
}
