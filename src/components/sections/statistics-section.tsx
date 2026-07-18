import { prisma } from "@/lib/prisma"
import { BookOpen, GraduationCap, Trophy, Users } from "lucide-react"

export async function StatisticsSection() {
  const [studentCount, courseCount, teacherCount, enrollmentCount, completedCount] =
    await Promise.all([
      prisma.user.count({ where: { role: "STUDENT", isActive: true } }),
      prisma.course.count({ where: { isPublished: true } }),
      prisma.user.count({ where: { role: "TEACHER", isActive: true } }),
      prisma.enrollment.count(),
      prisma.enrollment.count({ where: { status: "COMPLETED" } }),
    ])

  const satisfactionRate =
    enrollmentCount > 0
      ? Math.round((completedCount / enrollmentCount) * 100)
      : 0

  const stats = [
    { icon: GraduationCap, value: studentCount.toLocaleString() + "+", label: "Active Students" },
    { icon: BookOpen, value: courseCount.toLocaleString() + "+", label: "Free Courses" },
    { icon: Users, value: teacherCount.toLocaleString() + "+", label: "Expert Teachers" },
    { icon: Trophy, value: satisfactionRate + "%", label: "Satisfaction Rate" },
  ]

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group relative overflow-hidden rounded-2xl border bg-card p-8 text-center transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
