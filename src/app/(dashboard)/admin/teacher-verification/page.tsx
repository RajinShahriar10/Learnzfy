import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/rbac"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Clock, AlertTriangle, Eye, GraduationCap } from "lucide-react"
import { cn } from "@/lib/utils"

const STATUS_CONFIG: Record<string, { label: string; className: string; icon: any }> = {
  SUBMITTED: { label: "Submitted", className: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 border-blue-200", icon: Clock },
  UNDER_REVIEW: { label: "Under Review", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400 border-yellow-200", icon: AlertTriangle },
  APPROVED: { label: "Approved", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border-emerald-200", icon: CheckCircle2 },
  REJECTED: { label: "Rejected", className: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 border-red-200", icon: XCircle },
  CHANGES_REQUESTED: { label: "Changes", className: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400 border-orange-200", icon: AlertTriangle },
}

export default async function AdminTeacherVerificationPage() {
  await requireRole("ADMIN")

  const teachers = await prisma.user.findMany({
    where: { role: "TEACHER" },
    include: {
      profile: true,
      teacherApplication: true,
      _count: { select: { createdCourses: true, createdQuizzes: true, createdExams: true, enrollments: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  const totalTeachers = teachers.length
  const verifiedTeachers = teachers.filter((t) => t.teacherApplication?.status === "APPROVED").length
  const pendingTeachers = teachers.filter((t) =>
    !t.teacherApplication || ["SUBMITTED", "UNDER_REVIEW", "CHANGES_REQUESTED"].includes(t.teacherApplication.status)
  ).length

  const totalCourses = teachers.reduce((s, t) => s + t._count.createdCourses, 0)
  const totalStudents = teachers.reduce((s, t) => s + t._count.enrollments, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Teacher Verification</h1>
        <p className="text-sm text-muted-foreground">
          Monitor teacher verification status and performance metrics
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-blue-100 p-2.5 dark:bg-blue-950">
              <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalTeachers}</p>
              <p className="text-xs text-muted-foreground">Total Teachers</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-emerald-100 p-2.5 dark:bg-emerald-950">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{verifiedTeachers}</p>
              <p className="text-xs text-muted-foreground">Verified</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-yellow-100 p-2.5 dark:bg-yellow-950">
              <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingTeachers}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-violet-100 p-2.5 dark:bg-violet-950">
              <Eye className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalCourses}</p>
              <p className="text-xs text-muted-foreground">Total Courses</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Email</th>
              <th className="px-4 py-3 text-center font-medium">Verification</th>
              <th className="px-4 py-3 text-center font-medium">Courses</th>
              <th className="px-4 py-3 text-center font-medium">Students</th>
              <th className="px-4 py-3 text-center font-medium">Quizzes</th>
              <th className="px-4 py-3 text-center font-medium">Exams</th>
              <th className="px-4 py-3 text-center font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((t) => {
              const app = t.teacherApplication
              const statusKey = (app?.status as string) ?? null
              const StatusIcon = statusKey ? STATUS_CONFIG[statusKey]?.icon ?? Clock : Clock

              return (
                <tr key={t.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{t.name ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t.email}</td>
                  <td className="px-4 py-3 text-center">
                    {statusKey ? (
                      <span className={cn(
                        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                        STATUS_CONFIG[statusKey]?.className
                      )}>
                        <StatusIcon className="h-3 w-3" />
                        {STATUS_CONFIG[statusKey]?.label}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                        <XCircle className="h-3 w-3" />
                        No Application
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">{t._count.createdCourses}</td>
                  <td className="px-4 py-3 text-center">{t._count.enrollments}</td>
                  <td className="px-4 py-3 text-center">{t._count.createdQuizzes}</td>
                  <td className="px-4 py-3 text-center">{t._count.createdExams}</td>
                  <td className="px-4 py-3 text-center">
                    {app && (
                      <Link href={`/admin/teacher-applications/${app.id}`}>
                        <Button size="sm" variant="ghost" className="gap-1">
                          <Eye className="h-3 w-3" /> View
                        </Button>
                      </Link>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
