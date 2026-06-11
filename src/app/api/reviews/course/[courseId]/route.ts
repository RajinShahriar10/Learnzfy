import { prisma } from "@/lib/prisma"
import { NextRequest } from "next/server"
import { ok, serverError, parsePagination } from "@/lib/api-helpers"

function computeStats(reviews: { rating: number }[]) {
  const total = reviews.length
  if (total === 0) return { average: 0, total: 0, breakdown: [] }

  const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
  const breakdown = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length
    return { stars, count, percentage: total > 0 ? (count / total) * 100 : 0 }
  })

  return { average: sum / total, total, breakdown }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params
    const { searchParams } = new URL(req.url)
    const { page, limit, skip } = parsePagination(searchParams)
    const sort = searchParams.get("sort") || "recent"

    const allReviews = await prisma.review.findMany({
      where: { courseId, isHidden: false },
      include: { user: { select: { id: true, name: true, image: true } } },
    })

    const total = allReviews.length
    const stats = computeStats(allReviews)

    const orderBy: Record<string, "asc" | "desc"> =
      sort === "highest" ? { rating: "desc" as const }
      : sort === "lowest" ? { rating: "asc" as const }
      : { createdAt: "desc" as const }

    const sorted = [...allReviews].sort((a, b) => {
      if (sort === "highest") return b.rating - a.rating
      if (sort === "lowest") return a.rating - b.rating
      return b.createdAt.getTime() - a.createdAt.getTime()
    })

    const paged = sorted.slice(skip, skip + limit)

    const data = paged.map((r) => ({
      id: r.id,
      userId: r.userId,
      userName: r.user.name ?? "Anonymous",
      userAvatar: r.user.image,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
      isEdited: r.isEdited,
      isHidden: r.isHidden,
      isReported: r.isReported,
    }))

    return ok({
      data,
      stats,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    })
  } catch (e) {
    return serverError(e)
  }
}
