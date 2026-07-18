import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { ok } from "@/lib/api-helpers"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const limit = Math.min(20, Math.max(1, parseInt(searchParams.get("limit") || "10")))

  const reviews = await prisma.review.findMany({
    where: { isHidden: false, comment: { not: null } },
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true, image: true } },
      course: { select: { title: true } },
    },
  })

  const result = reviews.map((r) => ({
    id: r.id,
    name: r.user.name || "Anonymous",
    image: r.user.image,
    role: r.course?.title || "Student",
    content: r.comment,
    rating: r.rating,
  }))

  return ok(result)
}
