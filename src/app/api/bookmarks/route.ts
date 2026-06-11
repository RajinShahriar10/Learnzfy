import { prisma } from "@/lib/prisma"
import { NextRequest } from "next/server"
import { ok, created, err, validation, serverError, requireAuth } from "@/lib/api-helpers"

export async function POST(req: NextRequest) {
  try {
    const { session, error } = await requireAuth()
    if (error) return error

    const body = await req.json()
    const { courseId, lessonId } = body

    if (!courseId && !lessonId) return validation("Provide courseId or lessonId to bookmark")

    const where = courseId
      ? { userId: session.user.id, courseId, lessonId: null }
      : { userId: session.user.id, lessonId, courseId: null }

    const existing = await prisma.bookmark.findFirst({ where })

    if (existing) {
      await prisma.bookmark.delete({ where: { id: existing.id } })
      return ok({ bookmarked: false, message: "Bookmark removed" })
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        userId: session.user.id,
        ...(courseId ? { courseId } : {}),
        ...(lessonId ? { lessonId } : {}),
      },
      include: {
        course: { select: { id: true, title: true, slug: true, thumbnailUrl: true } },
        lesson: { select: { id: true, title: true } },
      },
    })

    return created({ bookmarked: true, bookmark })
  } catch (e) {
    return serverError(e)
  }
}

export async function GET(req: NextRequest) {
  try {
    const { session, error } = await requireAuth()
    if (error) return error

    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type")
    const search = searchParams.get("search")?.toLowerCase()

    const where: Record<string, unknown> = { userId: session.user.id }
    if (type === "course") where.lessonId = null
    if (type === "lesson") where.courseId = null

    const bookmarks = await prisma.bookmark.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        course: { select: { id: true, title: true, slug: true, thumbnailUrl: true, difficulty: true, teacher: { select: { name: true } } } },
        lesson: { select: { id: true, title: true, module: { select: { course: { select: { id: true, title: true, slug: true } } } } } },
      },
    })

    let filtered = bookmarks
    if (search) {
      filtered = bookmarks.filter((b) => {
        const title = b.course?.title ?? b.lesson?.title ?? ""
        return title.toLowerCase().includes(search)
      })
    }

    const data = filtered.map((b) => ({
      id: b.id,
      userId: b.userId,
      courseId: b.courseId,
      lessonId: b.lessonId,
      createdAt: b.createdAt.toISOString(),
      course: b.course
        ? { id: b.course.id, title: b.course.title, slug: b.course.slug, thumbnailUrl: b.course.thumbnailUrl, difficulty: b.course.difficulty, teacherName: b.course.teacher.name }
        : null,
      lesson: b.lesson
        ? { id: b.lesson.id, title: b.lesson.title, courseId: b.lesson.module.course.id, courseTitle: b.lesson.module.course.title, courseSlug: b.lesson.module.course.slug }
        : null,
    }))

    return ok(data)
  } catch (e) {
    return serverError(e)
  }
}
