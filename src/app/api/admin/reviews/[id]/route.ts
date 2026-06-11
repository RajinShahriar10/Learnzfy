import { prisma } from "@/lib/prisma"
import { NextRequest } from "next/server"
import { ok, err, serverError, requireRole, notFound } from "@/lib/api-helpers"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { session, error } = await requireRole("ADMIN")
    if (error) return error

    const { id } = await params

    const review = await prisma.review.findUnique({ where: { id } })
    if (!review) return notFound("Review")

    const body = await req.json()
    const { isHidden } = body

    if (typeof isHidden !== "boolean") return err("isHidden (boolean) is required", 400)

    const updated = await prisma.review.update({
      where: { id },
      data: { isHidden },
    })

    return ok({
      id: updated.id,
      isHidden: updated.isHidden,
    })
  } catch (e) {
    return serverError(e)
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { session, error } = await requireRole("ADMIN")
    if (error) return error

    const { id } = await params

    const review = await prisma.review.findUnique({ where: { id } })
    if (!review) return notFound("Review")

    await prisma.review.delete({ where: { id } })

    return ok({ message: "Review deleted by admin" })
  } catch (e) {
    return serverError(e)
  }
}
