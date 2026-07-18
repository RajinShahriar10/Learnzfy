import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { ok, paginated } from "@/lib/api-helpers"
import type { Prisma } from "@prisma/client"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12")))
  const skip = (page - 1) * limit
  const category = searchParams.get("category")
  const difficulty = searchParams.get("difficulty")
  const search = searchParams.get("search")
  const featured = searchParams.get("featured")

  const where: Prisma.CourseWhereInput = { isPublished: true }
  if (category && category !== "All") where.category = { slug: category }
  if (difficulty && difficulty !== "all") where.difficulty = difficulty
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ]
  }

  const take = featured ? Math.min(parseInt(featured), 12) : limit
  const courses = await prisma.course.findMany({
    where,
    skip: featured ? 0 : skip,
    take,
    orderBy: { createdAt: "desc" },
    include: {
      teacher: { select: { id: true, name: true, image: true } },
      category: { select: { id: true, name: true, slug: true } },
      _count: { select: { enrollments: true, modules: true, reviews: true } },
      reviews: { select: { rating: true } },
    },
  })

  const enriched = courses.map((c) => {
    const totalRatings = c.reviews.length
    const avgRating =
      totalRatings > 0
        ? Math.round((c.reviews.reduce((s, r) => s + r.rating, 0) / totalRatings) * 10) / 10
        : 0
    const { reviews, ...rest } = c
    return {
      ...rest,
      avgRating,
      totalRatings,
      studentCount: rest._count.enrollments,
      moduleCount: rest._count.modules,
    }
  })

  if (featured) return ok(enriched)
  const total = await prisma.course.count({ where })
  return paginated(enriched, total, page, limit)
}
