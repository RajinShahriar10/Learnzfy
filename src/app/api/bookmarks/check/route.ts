import { prisma } from "@/lib/prisma"
import { NextRequest } from "next/server"
import { ok, err, serverError, requireAuth, notFound } from "@/lib/api-helpers"

export async function GET(req: NextRequest) {
  try {
    const { session, error } = await requireAuth()
    if (error) return error

    const { searchParams } = new URL(req.url)
    const courseId = searchParams.get("courseId")
    const lessonId = searchParams.get("lessonId")

    if (!courseId && !lessonId) return err("Provide courseId or lessonId", 400)

    const where = courseId
      ? { userId: session.user.id, courseId, lessonId: null }
      : { userId: session.user.id, lessonId, courseId: null }

    const bookmark = await prisma.bookmark.findFirst({ where })

    return ok({ bookmarked: !!bookmark })
  } catch (e) {
    return serverError(e)
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { session, error } = await requireAuth()
    if (error) return error

    const { searchParams } = new URL(req.url)
    const courseId = searchParams.get("courseId")
    const lessonId = searchParams.get("lessonId")

    if (!courseId && !lessonId) return err("Provide courseId or lessonId", 400)

    const where = courseId
      ? { userId: session.user.id, courseId, lessonId: null }
      : { userId: session.user.id, lessonId, courseId: null }

    const bookmark = await prisma.bookmark.findFirst({ where })

    if (!bookmark) return notFound("Bookmark")

    await prisma.bookmark.delete({ where: { id: bookmark.id } })
    return ok({ bookmarked: false })
  } catch (e) {
    return serverError(e)
  }
}
