import { prisma } from "@/lib/prisma"
import { ok } from "@/lib/api-helpers"

export async function GET() {
  const [studentCount, courseCount, teacherCount, enrollmentCount] =
    await Promise.all([
      prisma.user.count({ where: { role: "STUDENT", isActive: true } }),
      prisma.course.count({ where: { isPublished: true } }),
      prisma.user.count({ where: { role: "TEACHER", isActive: true } }),
      prisma.enrollment.count(),
    ])

  const completedEnrollments = await prisma.enrollment.count({
    where: { status: "COMPLETED" },
  })
  const satisfactionRate =
    enrollmentCount > 0
      ? Math.round((completedEnrollments / enrollmentCount) * 100)
      : 0

  return ok({
    students: studentCount,
    courses: courseCount,
    teachers: teacherCount,
    enrollments: enrollmentCount,
    satisfactionRate,
  })
}
