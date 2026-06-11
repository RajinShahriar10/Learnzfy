import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/rbac"
import { UserActions } from "../_components/user-actions"

export default async function AdminTeachersPage() {
  await requireRole("ADMIN")

  const teachers = await prisma.user.findMany({
    where: { role: "TEACHER" },
    include: {
      profile: true,
      _count: { select: { createdCourses: true, createdQuizzes: true, createdExams: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Teachers</h1>
        <p className="text-sm text-muted-foreground">
          {teachers.length} registered teacher{teachers.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Email</th>
              <th className="px-4 py-3 text-center font-medium">Courses</th>
              <th className="px-4 py-3 text-center font-medium">Quizzes</th>
              <th className="px-4 py-3 text-center font-medium">Exams</th>
              <th className="px-4 py-3 text-center font-medium">Status</th>
              <th className="px-4 py-3 text-center font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((t) => (
              <tr key={t.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{t.name ?? "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{t.email}</td>
                <td className="px-4 py-3 text-center">{t._count.createdCourses}</td>
                <td className="px-4 py-3 text-center">{t._count.createdQuizzes}</td>
                <td className="px-4 py-3 text-center">{t._count.createdExams}</td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      t.isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {t.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <UserActions userId={t.id} isActive={t.isActive} />
                </td>
              </tr>
            ))}
            {teachers.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                  No teachers registered yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
