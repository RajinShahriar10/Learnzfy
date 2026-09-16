import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ok, err, unauthorized } from "@/lib/api-helpers"
import { toYouTubeEmbedUrl } from "@/lib/youtube"

function parseDuration(value: unknown): number | null {
  const num = value ? parseInt(String(value).replace(/\D/g, ""), 10) : null
  return num !== null && !isNaN(num) ? num : null
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return unauthorized()

  const { lessonId } = await params

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { module: { include: { course: { select: { teacherId: true } } } } },
  })
  if (!lesson) return err("Lesson not found", 404)

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })
  const isOwner = lesson.module.course.teacherId === session.user.id
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"
  if (!isOwner && !isAdmin) {
    return err("You can only edit lessons in your own courses", 403)
  }

  const body = await req.json()
  const { title, youtubeUrl, description, content, duration, isFree } = body

  let videoUrl = lesson.videoUrl
  if (youtubeUrl !== undefined) {
    const normalized = youtubeUrl ? toYouTubeEmbedUrl(youtubeUrl) : null
    if (youtubeUrl && !normalized) {
      return err("Invalid YouTube link. Please provide a valid YouTube URL.", 422)
    }
    videoUrl = normalized
  }

  const updated = await prisma.lesson.update({
    where: { id: lessonId },
    data: {
      title: title ?? lesson.title,
      description: description !== undefined ? description : lesson.description,
      content: content !== undefined ? content : lesson.content,
      videoUrl,
      duration:
        duration !== undefined && duration !== "" ? parseDuration(duration) : lesson.duration,
      isFree: typeof isFree === "boolean" ? isFree : lesson.isFree,
    },
  })

  return ok(updated)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return unauthorized()

  const { lessonId } = await params

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { module: { include: { course: { select: { teacherId: true } } } } },
  })
  if (!lesson) return err("Lesson not found", 404)

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })
  const isOwner = lesson.module.course.teacherId === session.user.id
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"
  if (!isOwner && !isAdmin) {
    return err("You can only delete lessons in your own courses", 403)
  }

  await prisma.lesson.delete({ where: { id: lessonId } })

  return ok({ deleted: true })
}