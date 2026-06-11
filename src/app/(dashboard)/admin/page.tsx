import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/rbac"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, GraduationCap, Award, FileCheck, Trophy, Bell, Handshake } from "lucide-react"

export default async function AdminDashboard() {
  await requireRole("ADMIN")

  const [userCount, courseCount, teacherCount, studentCount, certCount, examCount, sponsorCount] =
    await Promise.all([
      prisma.user.count(),
      prisma.course.count(),
      prisma.user.count({ where: { role: "TEACHER" } }),
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.certificate.count(),
      prisma.exam.count(),
      prisma.sponsor.count({ where: { isActive: true } }),
    ])

  const stats = [
    { icon: Users, label: "Total Users", value: userCount, color: "text-blue-600" },
    { icon: GraduationCap, label: "Teachers", value: teacherCount, color: "text-emerald-600" },
    { icon: BookOpen, label: "Courses", value: courseCount, color: "text-purple-600" },
    { icon: Users, label: "Students", value: studentCount, color: "text-amber-600" },
    { icon: Award, label: "Certificates", value: certCount, color: "text-rose-600" },
    { icon: FileCheck, label: "Exams", value: examCount, color: "text-cyan-600" },
    { icon: Trophy, label: "Categories", value: 5, color: "text-orange-600" },
    { icon: Handshake, label: "Active Sponsors", value: sponsorCount, color: "text-indigo-600" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Manage your Learnzfy platform from one place.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
