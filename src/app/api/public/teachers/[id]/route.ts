import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { ok, notFound } from "@/lib/api-helpers"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const teacher = await prisma.user.findFirst({
    where: {
      id,
      role: "TEACHER",
      isActive: true,
    },
    include: {
      profile: { select: { bio: true, avatarUrl: true } },
      teacherApplication: { select: { expertiseArea: true, bio: true } },
      _count: { select: { createdCourses: true, enrollments: true } },
    },
  })

  if (!teacher) return notFound("Teacher")

  const specialties = teacher.teacherApplication?.expertiseArea
    ? teacher.teacherApplication.expertiseArea.split(",").map((s) => s.trim()).filter(Boolean)
    : []

  const reviews = await prisma.teacherReview.findMany({
    where: { teacherId: id, isHidden: false },
    select: { rating: true },
  })
  const avgRating =
    reviews.length > 0
      ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
      : 0

  const courses = await prisma.course.findMany({
    where: { teacherId: id, isPublished: true },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      _count: { select: { enrollments: true, reviews: true } },
      reviews: { select: { rating: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  const enrichedCourses = courses.map((c) => {
    const totalRatings = c.reviews.length
    const courseAvg =
      totalRatings > 0
        ? Math.round((c.reviews.reduce((s, r) => s + r.rating, 0) / totalRatings) * 10) / 10
        : 0
    const { reviews: _, ...rest } = c
    return { ...rest, avgRating: courseAvg, studentCount: rest._count.enrollments }
  })

  return ok({
    id: teacher.id,
    name: teacher.name,
    image: teacher.image,
    bio: teacher.teacherApplication?.bio ?? teacher.profile?.bio ?? null,
    specialties,
    courseCount: teacher._count.createdCourses,
    studentCount: teacher._count.enrollments,
    rating: avgRating,
    courses: enrichedCourses,
  })
}
