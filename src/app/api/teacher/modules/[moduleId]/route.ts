import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ok, err, unauthorized } from "@/lib/api-helpers"

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return unauthorized()

  const { moduleId } = await params

  const module = await prisma.module.findUnique({
    where: { id: moduleId },
    include: { course: { select: { teacherId: true } } },
  })
  if (!module) return err("Module not found", 404)

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })
  const isOwner = module.course.teacherId === session.user.id
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"
  if (!isOwner && !isAdmin) {
    return err("You can only edit modules in your own courses", 403)
  }

  const body = await req.json()
  const updated = await prisma.module.update({
    where: { id: moduleId },
    data: {
      title: body.title ?? module.title,
      description: body.description !== undefined ? body.description : module.description,
    },
  })

  return ok(updated)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return unauthorized()

  const { moduleId } = await params

  const module = await prisma.module.findUnique({
    where: { id: moduleId },
    include: { course: { select: { teacherId: true } } },
  })
  if (!module) return err("Module not found", 404)

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })
  const isOwner = module.course.teacherId === session.user.id
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"
  if (!isOwner && !isAdmin) {
    return err("You can only delete modules in your own courses", 403)
  }

  await prisma.module.delete({ where: { id: moduleId } })

  return ok({ deleted: true })
}