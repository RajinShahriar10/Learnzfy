import { prisma } from "@/lib/prisma"
import { ok, created, err, unauthorized, validation, serverError, requireAuth, parsePagination } from "@/lib/api-helpers"
import { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { session, error } = await requireAuth()
    if (error) return error
    if (session.user.role !== "STUDENT") return err("Only students can review courses", 403)

    const body = await req.json()
    const { courseId, rating, comment } = body

    if (!courseId || !rating) return validation("courseId and rating are required")
    if (rating < 1 || rating > 5) return validation("Rating must be between 1 and 5")
    if (comment && comment.length > 2000) return validation("Comment must be under 2000 characters")

    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId } },
    })

    if (!enrollment) return err("You must be enrolled in this course to review it", 403)
    if (enrollment.progress < 30) return err("You must complete at least 30% of the course to leave a review", 403)

    const existing = await prisma.review.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId } },
    })
    if (existing) return validation("You have already reviewed this course")

    const review = await prisma.review.create({
      data: { userId: session.user.id, courseId, rating, comment },
      include: { user: { select: { id: true, name: true, image: true } } },
    })

    return created({
      id: review.id,
      userId: review.userId,
      userName: review.user.name ?? "Anonymous",
      userAvatar: review.user.image,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt.toISOString(),
      updatedAt: review.updatedAt.toISOString(),
      isEdited: review.isEdited,
      isHidden: review.isHidden,
      isReported: review.isReported,
    })
  } catch (e) {
    return serverError(e)
  }
}
