import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/rbac"
import { UserActions } from "../_components/user-actions"

export default async function AdminStudentsPage() {
  await requireRole("ADMIN")

  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    include: { profile: true, enrollments: true, xp: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Students</h1>
        <p className="text-sm text-muted-foreground">
          {students.length} registered student{students.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Email</th>
              <th className="px-4 py-3 text-left font-medium">Joined</th>
              <th className="px-4 py-3 text-center font-medium">Courses</th>
              <th className="px-4 py-3 text-center font-medium">XP</th>
              <th className="px-4 py-3 text-center font-medium">Status</th>
              <th className="px-4 py-3 text-center font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{s.name ?? "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{s.email}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(s.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-center">{s.enrollments.length}</td>
                <td className="px-4 py-3 text-center">{s.xp?.points ?? 0}</td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      s.isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {s.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <UserActions userId={s.id} isActive={s.isActive} />
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                  No students registered yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
