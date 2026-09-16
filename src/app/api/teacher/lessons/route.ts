import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ok, err, unauthorized } from "@/lib/api-helpers"
import { toYouTubeEmbedUrl } from "@/lib/youtube"

function parseDuration(value: unknown): number | null {
  const num = value ? parseInt(String(value).replace(/\D/g, ""), 10) : null
  return num !== null && !isNaN(num) ? num : null
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return unauthorized()

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })
  const canManage =
    user?.role === "TEACHER" || user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"
  if (!canManage) return err("Only teachers and admins can manage courses", 403)

  const body = await req.json()
  const { moduleId, title, youtubeUrl, description, content, duration, isFree } = body

  if (!moduleId || !title) return err("Module and lesson title are required")

  const module = await prisma.module.findUnique({
    where: { id: moduleId },
    include: { course: { select: { teacherId: true } } },
  })
  if (!module) return err("Module not found", 404)

  const isOwner = module.course.teacherId === session.user.id
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"
  if (!isOwner && !isAdmin) {
    return err("You can only add lessons to your own courses", 403)
  }

  const normalizedVideoUrl = youtubeUrl ? toYouTubeEmbedUrl(youtubeUrl) : null
  if (youtubeUrl && !normalizedVideoUrl) {
    return err("Invalid YouTube link. Please provide a valid YouTube URL.", 422)
  }

  if (!normalizedVideoUrl && !content) {
    return err("Provide a YouTube link or write article content for this lesson", 422)
  }

  const count = await prisma.lesson.count({ where: { moduleId } })

  const lesson = await prisma.lesson.create({
    data: {
      moduleId,
      title,
      description: description || null,
      content: content || description || "",
      videoUrl: normalizedVideoUrl,
      duration: parseDuration(duration),
      isFree: Boolean(isFree),
      order: count + 1,
    },
  })

  return ok(lesson)
}