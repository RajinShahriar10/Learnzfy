import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { ok } from "@/lib/api-helpers"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get("search")
  const specialty = searchParams.get("specialty")

  const where: Record<string, unknown> = {
    role: "TEACHER",
    isActive: true,
    teacherApplication: { status: "APPROVED" },
  }

  const teachers = await prisma.user.findMany({
    where,
    include: {
      profile: { select: { bio: true, avatarUrl: true } },
      teacherApplication: { select: { expertiseArea: true } },
      _count: { select: { createdCourses: true, enrollments: true } },
      createdCourses: {
        where: { isPublished: true },
        select: {
          category: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  let enriched = teachers.map((t) => {
    const specialties: string[] = [
      ...new Set(t.createdCourses.map((c) => c.category?.name).filter(Boolean) as string[]),
    ]
    if (t.teacherApplication?.expertiseArea) {
      const expertise = t.teacherApplication.expertiseArea
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
      for (const e of expertise) {
        if (!specialties.includes(e)) specialties.push(e)
      }
    }

    return {
      id: t.id,
      name: t.name,
      image: t.image,
      bio: t.profile?.bio ?? null,
      specialties,
      courseCount: t._count.createdCourses,
      studentCount: t._count.enrollments,
      rating: 0,
    }
  })

  if (search) {
    const q = search.toLowerCase()
    enriched = enriched.filter(
      (t) =>
        t.name?.toLowerCase().includes(q) ||
        t.bio?.toLowerCase().includes(q) ||
        t.specialties.some((s) => s?.toLowerCase().includes(q))
    )
  }

  if (specialty && specialty !== "All") {
    enriched = enriched.filter((t) =>
      t.specialties.some((s) => s?.toLowerCase() === specialty.toLowerCase())
    )
  }

  const ratings = await Promise.all(
    enriched.map(async (t) => {
      const reviews = await prisma.teacherReview.findMany({
        where: { teacherId: t.id, isHidden: false },
        select: { rating: true },
      })
      const avg =
        reviews.length > 0
          ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
          : 0
      return { ...t, rating: avg }
    })
  )

  return ok(ratings)
}
