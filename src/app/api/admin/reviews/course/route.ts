import { prisma } from "@/lib/prisma"
import { NextRequest } from "next/server"
import { ok, serverError, requireRole } from "@/lib/api-helpers"

export async function GET() {
  try {
    const { session, error } = await requireRole("ADMIN")
    if (error) return error

    const reviews = await prisma.review.findMany({
      include: {
        user: { select: { id: true, name: true, image: true } },
        course: { select: { title: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 500,
    })

    const data = reviews.map((r) => ({
      id: r.id,
      userId: r.userId,
      userName: r.user.name ?? "Anonymous",
      userAvatar: r.user.image,
      rating: r.rating,
      comment: r.comment,
      courseId: r.courseId,
      courseName: r.course.title,
      isEdited: r.isEdited,
      isHidden: r.isHidden,
      isReported: r.isReported,
      createdAt: r.createdAt.toISOString(),
    }))

    return ok(data)
  } catch (e) {
    return serverError(e)
  }
}
