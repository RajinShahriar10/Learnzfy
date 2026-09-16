import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ok, err, unauthorized } from "@/lib/api-helpers"

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
  const { courseId, title, description } = body

  if (!courseId || !title) return err("Course and module title are required")

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { id: true, teacherId: true },
  })
  if (!course) return err("Course not found", 404)

  const isOwner = course.teacherId === session.user.id
  if (!isOwner && user?.role !== "ADMIN" && user?.role !== "SUPER_ADMIN") {
    return err("You can only add modules to your own courses", 403)
  }

  const count = await prisma.module.count({ where: { courseId } })

  const module = await prisma.module.create({
    data: {
      courseId,
      title,
      description: description || null,
      order: count + 1,
    },
  })

  return ok(module)
}