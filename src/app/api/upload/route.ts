import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ok, err, unauthorized, serverError } from "@/lib/api-helpers"
import { uploadImage, deleteImage, isCloudinaryConfigured } from "@/lib/cloudinary"

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"])

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return unauthorized()

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })
  const role = user?.role
  const canUpload = role === "TEACHER" || role === "ADMIN" || role === "SUPER_ADMIN"
  if (!canUpload) {
    return err("Only teachers and admins can upload images", 403)
  }

  if (!isCloudinaryConfigured()) {
    return err("Image upload is not configured. Missing Cloudinary credentials.", 500)
  }

  const formData = await req.formData()
  const file = formData.get("file")

  if (!file || typeof file === "string") {
    return err("No file provided")
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return err("Only JPG, PNG, WEBP, GIF, and AVIF images are allowed", 422)
  }

  if (file.size > MAX_FILE_SIZE) {
    return err("Image size must be 5MB or less", 422)
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const { url, publicId } = await uploadImage(buffer)

    return ok({ url, publicId })
  } catch (error) {
    return serverError(error)
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return unauthorized()

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })
  const role = user?.role
  const canDelete = role === "TEACHER" || role === "ADMIN" || role === "SUPER_ADMIN"
  if (!canDelete) {
    return err("Only teachers and admins can delete images", 403)
  }

  if (!isCloudinaryConfigured()) {
    return err("Image upload is not configured. Missing Cloudinary credentials.", 500)
  }

  const { searchParams } = new URL(req.url)
  const publicId = searchParams.get("publicId")

  if (!publicId) {
    return err("Missing publicId")
  }

  try {
    await deleteImage(publicId)
    return ok({ deleted: true })
  } catch (error) {
    return serverError(error)
  }
}