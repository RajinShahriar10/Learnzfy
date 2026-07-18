import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TeacherCard } from "@/components/shared/teacher-card"
import { prisma } from "@/lib/prisma"
import { ArrowRight } from "lucide-react"

export async function TopTeachers() {
  const rawTeachers = await prisma.user.findMany({
    where: {
      role: "TEACHER",
      isActive: true,
      teacherApplication: { status: "APPROVED" },
    },
    take: 5,
    include: {
      profile: { select: { bio: true } },
      teacherApplication: { select: { expertiseArea: true } },
      _count: { select: { createdCourses: true, enrollments: true } },
      createdCourses: {
        where: { isPublished: true },
        select: { category: { select: { name: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  const teacherIds = rawTeachers.map((t) => t.id)
  const teacherReviews = await prisma.teacherReview.groupBy({
    by: ["teacherId"],
    where: { teacherId: { in: teacherIds }, isHidden: false },
    _avg: { rating: true },
  })
  const ratingMap = new Map(
    teacherReviews.map((r) => [r.teacherId, Math.round((r._avg.rating || 0) * 10) / 10])
  )

  const teachers = rawTeachers.map((t) => {
    const specialties: string[] = [
      ...new Set(t.createdCourses.map((c) => c.category?.name).filter(Boolean) as string[]),
    ]
    if (t.teacherApplication?.expertiseArea) {
      for (const e of t.teacherApplication.expertiseArea.split(",").map((s) => s.trim()).filter(Boolean)) {
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
      rating: ratingMap.get(t.id) || 0,
    }
  })

  if (teachers.length === 0) return null

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Top Teachers</h2>
            <p className="mt-2 text-muted-foreground">
              Learn from industry experts
            </p>
          </div>
          <Link href="/teachers">
            <Button variant="ghost" className="gap-2 hidden sm:flex">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {teachers.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} />
          ))}
        </div>
      </div>
    </section>
  )
}
