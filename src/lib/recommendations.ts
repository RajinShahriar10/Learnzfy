import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export interface RecommendedCourse {
  id: string
  title: string
  slug: string
  description: string
  thumbnailUrl: string | null
  difficulty: string
  category: { id: string; name: string; slug: string } | null
  teacher: { id: string; name: string | null; image: string | null }
  studentCount: number
  rating: number
  matchReason: string
}

export interface RecommendedTeacher {
  id: string
  name: string | null
  image: string | null
  bio: string | null
  courseCount: number
  studentCount: number
  rating: number
  matchReason: string
}

export interface ContinueLearningCourse {
  id: string
  courseId: string
  title: string
  slug: string
  thumbnailUrl: string | null
  teacherName: string | null
  progress: number
  lastAccessedAt: Date | null
  enrolledAt: Date
}

export interface RecommendationData {
  continueLearning: ContinueLearningCourse[]
  recommendedCourses: RecommendedCourse[]
  trendingCourses: RecommendedCourse[]
  recommendedTeachers: RecommendedTeacher[]
}

type CategoryScore = { categoryId: string; categoryName: string; categorySlug: string; score: number }

async function getUserCategoryScores(userId: string): Promise<CategoryScore[]> {
  const [enrollments, bookmarks] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId },
      include: { course: { include: { category: true } } },
    }),
    prisma.bookmark.findMany({
      where: { userId, courseId: { not: null } },
      include: { course: { include: { category: true } } },
    }),
  ])

  const scores = new Map<string, CategoryScore>()

  for (const e of enrollments) {
    const cat = e.course.category
    if (!cat) continue
    const weight = e.status === "COMPLETED" ? 3 : e.progress > 0 ? 2 : 1
    const existing = scores.get(cat.id)
    if (existing) {
      existing.score += weight
    } else {
      scores.set(cat.id, { categoryId: cat.id, categoryName: cat.name, categorySlug: cat.slug, score: weight })
    }
  }

  for (const b of bookmarks) {
    const cat = b.course?.category
    if (!cat) continue
    const existing = scores.get(cat.id)
    if (existing) {
      existing.score += 1
    } else {
      scores.set(cat.id, { categoryId: cat.id, categoryName: cat.name, categorySlug: cat.slug, score: 1 })
    }
  }

  return Array.from(scores.values()).sort((a, b) => b.score - a.score)
}

async function getCourseRating(courseId: string): Promise<number> {
  const reviews = await prisma.review.findMany({
    where: { courseId, isHidden: false },
    select: { rating: true },
  })
  if (reviews.length === 0) return 0
  return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
}

async function getTeacherRating(teacherId: string): Promise<number> {
  const reviews = await prisma.teacherReview.findMany({
    where: { teacherId, isHidden: false },
    select: { rating: true },
  })
  if (reviews.length === 0) return 0
  return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
}

export async function getRecommendations(userId: string): Promise<RecommendationData> {
  const [enrolledCourseIds, categoryScores] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId },
      select: { courseId: true },
    }),
    getUserCategoryScores(userId),
  ])

  const enrolledIds = new Set(enrolledCourseIds.map((e) => e.courseId))

  const topCategoryIds = categoryScores.slice(0, 3).map((c) => c.categoryId)
  const topCategoryNames = categoryScores.slice(0, 3).map((c) => c.categoryName)

  // Continue Learning
  const continueLearningRaw = await prisma.enrollment.findMany({
    where: { userId, progress: { lt: 100 }, status: "ACTIVE" },
    include: {
      course: {
        include: { teacher: { select: { name: true } } },
      },
    },
    orderBy: { updatedAt: "desc" },
    take: 6,
  })

  const continueLearning: ContinueLearningCourse[] = continueLearningRaw.map((e) => ({
    id: e.id,
    courseId: e.courseId,
    title: e.course.title,
    slug: e.course.slug,
    thumbnailUrl: e.course.thumbnailUrl,
    teacherName: e.course.teacher.name,
    progress: e.progress,
    lastAccessedAt: e.updatedAt,
    enrolledAt: e.enrolledAt,
  }))

  // Recommended Courses (based on categories)
  const recommendedRaw = await prisma.course.findMany({
    where: {
      isPublished: true,
      id: { notIn: Array.from(enrolledIds) },
      ...(topCategoryIds.length > 0 ? { categoryId: { in: topCategoryIds } } : {}),
    },
    include: {
      teacher: { select: { id: true, name: true, image: true } },
      category: { select: { id: true, name: true, slug: true } },
      _count: { select: { enrollments: true } },
    },
    take: 50,
  })

  const recommendedWithRating = await Promise.all(
    recommendedRaw.map(async (c) => ({
      ...c,
      avgRating: await getCourseRating(c.id),
    }))
  )

  const recommendedCourses: RecommendedCourse[] = recommendedWithRating
    .sort((a, b) => {
      const aCatScore = topCategoryIds.includes(a.categoryId ?? "") ? 10 : 0
      const bCatScore = topCategoryIds.includes(b.categoryId ?? "") ? 10 : 0
      return bCatScore + b._count.enrollments + b.avgRating * 5 -
             (aCatScore + a._count.enrollments + a.avgRating * 5)
    })
    .slice(0, 8)
    .map((c) => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      description: c.shortDescription ?? c.description.slice(0, 150),
      thumbnailUrl: c.thumbnailUrl,
      difficulty: c.difficulty,
      category: c.category,
      teacher: c.teacher,
      studentCount: c._count.enrollments,
      rating: Math.round(c.avgRating * 10) / 10,
      matchReason: topCategoryNames.includes(c.category?.name ?? "")
        ? `Matches your interest in ${c.category?.name}`
        : "Popular course",
    }))

  // Trending Courses (most enrolled)
  const trendingRaw = await prisma.course.findMany({
    where: { isPublished: true },
    include: {
      teacher: { select: { id: true, name: true, image: true } },
      category: { select: { id: true, name: true, slug: true } },
      _count: { select: { enrollments: true } },
    },
    orderBy: { enrollments: { _count: "desc" } },
    take: 8,
  })

  const trendingWithRating = await Promise.all(
    trendingRaw.map(async (c) => ({
      ...c,
      avgRating: await getCourseRating(c.id),
    }))
  )

  const trendingCourses: RecommendedCourse[] = trendingWithRating.map((c) => ({
    id: c.id,
    title: c.title,
    slug: c.slug,
    description: c.shortDescription ?? c.description.slice(0, 150),
    thumbnailUrl: c.thumbnailUrl,
    difficulty: c.difficulty,
    category: c.category,
    teacher: c.teacher,
    studentCount: c._count.enrollments,
    rating: Math.round(c.avgRating * 10) / 10,
    matchReason: `${c._count.enrollments} students enrolled`,
  }))

  // Recommended Teachers
  const teacherWhere = topCategoryIds.length > 0
    ? { courses: { some: { categoryId: { in: topCategoryIds }, isPublished: true } } }
    : { courses: { some: { isPublished: true } } }

  const teachersRaw = await prisma.user.findMany({
    where: {
      role: "TEACHER",
      id: { not: userId },
      ...teacherWhere,
    },
    include: {
      profile: { select: { bio: true } },
      _count: { select: { createdCourses: true, enrollments: true } },
      teacherApplication: true,
    },
    take: 20,
  })

  const approvedTeachers = teachersRaw.filter((t) => t.teacherApplication?.status === "APPROVED")

  const teachersWithRating = await Promise.all(
    approvedTeachers.map(async (t) => ({
      ...t,
      avgRating: await getTeacherRating(t.id),
    }))
  )

  const recommendedTeachers: RecommendedTeacher[] = teachersWithRating
    .sort((a, b) => b.avgRating * 10 + b._count.enrollments - (a.avgRating * 10 + a._count.enrollments))
    .slice(0, 6)
    .map((t) => ({
      id: t.id,
      name: t.name,
      image: t.image,
      bio: t.profile?.bio ?? null,
      courseCount: t._count.createdCourses,
      studentCount: t._count.enrollments,
      rating: Math.round(t.avgRating * 10) / 10,
      matchReason: categoryScores.length > 0
        ? "Teaches in your areas of interest"
        : "Top rated instructor",
    }))

  return { continueLearning, recommendedCourses, trendingCourses, recommendedTeachers }
}

export async function getUserRecommendations(): Promise<RecommendationData> {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")
  return getRecommendations(session.user.id)
}
