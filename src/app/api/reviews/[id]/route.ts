import { prisma } from "@/lib/prisma"
import { NextRequest } from "next/server"
import { ok, err, unauthorized, validation, serverError, requireAuth, notFound } from "@/lib/api-helpers"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { session, error } = await requireAuth()
    if (error) return error

    const { id } = await params

    const review = await prisma.review.findUnique({ where: { id } })
    if (!review) return notFound("Review")
    if (review.userId !== session.user.id) return unauthorized()

    const body = await req.json()
    const { rating, comment } = body as { rating?: number; comment?: string }

    if (rating !== undefined && (rating < 1 || rating > 5)) return validation("Rating must be between 1 and 5")
    if (comment && comment.length > 2000) return validation("Comment must be under 2000 characters")

    const updated = await prisma.review.update({
      where: { id },
      data: {
        rating: rating ?? review.rating,
        comment: comment ?? review.comment,
        isEdited: true,
      },
      include: { user: { select: { id: true, name: true, image: true } } },
    })

    return ok({
      id: updated.id,
      userId: updated.userId,
      userName: updated.user.name ?? "Anonymous",
      userAvatar: updated.user.image,
      rating: updated.rating,
      comment: updated.comment,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
      isEdited: updated.isEdited,
      isHidden: updated.isHidden,
      isReported: updated.isReported,
    })
  } catch (e) {
    return serverError(e)
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { session, error } = await requireAuth()
    if (error) return error

    const { id } = await params

    const review = await prisma.review.findUnique({ where: { id } })
    if (!review) return notFound("Review")
    if (review.userId !== session.user.id && !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
      return unauthorized()
    }

    await prisma.review.delete({ where: { id } })
    return ok({ message: "Review deleted" })
  } catch (e) {
    return serverError(e)
  }
}
