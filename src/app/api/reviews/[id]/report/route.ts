import { prisma } from "@/lib/prisma"
import { NextRequest } from "next/server"
import { ok, err, notFound, serverError, requireAuth } from "@/lib/api-helpers"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { session, error } = await requireAuth()
    if (error) return error

    const { id } = await params

    const review = await prisma.review.findUnique({ where: { id } })
    if (!review) return notFound("Review")

    if (review.userId === session.user.id) return err("You cannot report your own review", 400)

    await prisma.review.update({
      where: { id },
      data: { isReported: true },
    })

    return ok({ message: "Review reported" })
  } catch (e) {
    return serverError(e)
  }
}
