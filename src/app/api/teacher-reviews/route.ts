import { prisma } from "@/lib/prisma"
import { NextRequest } from "next/server"
import { ok, created, err, validation, serverError, requireAuth } from "@/lib/api-helpers"

export async function POST(req: NextRequest) {
  try {
    const { session, error } = await requireAuth()
    if (error) return error
    if (session.user.role !== "STUDENT") return err("Only students can review teachers", 403)

    const body = await req.json()
    const { teacherId, courseId, rating, comment } = body

    if (!teacherId || !rating) return validation("teacherId and rating are required")
    if (rating < 1 || rating > 5) return validation("Rating must be between 1 and 5")
    if (comment && comment.length > 2000) return validation("Comment must be under 2000 characters")

    const enrollment = courseId
      ? await prisma.enrollment.findUnique({
          where: { userId_courseId: { userId: session.user.id, courseId } },
        })
      : null

    if (courseId && !enrollment) return err("You must be enrolled to review this teacher for a course", 403)

    const existing = await prisma.teacherReview.findUnique({
      where: { userId_teacherId: { userId: session.user.id, teacherId } },
    })
    if (existing) return validation("You have already reviewed this teacher")

    const review = await prisma.teacherReview.create({
      data: { userId: session.user.id, teacherId, courseId, rating, comment },
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
