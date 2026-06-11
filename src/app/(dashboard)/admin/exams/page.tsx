import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/rbac"
import { DeleteButton } from "@/components/admin/delete-button"
import { Badge } from "@/components/ui/badge"

export default async function AdminExamsPage() {
  await requireRole("ADMIN")

  const exams = await prisma.exam.findMany({
    include: { teacher: true, _count: { select: { examAttempts: true } } },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Exams</h1>
        <p className="text-sm text-muted-foreground">
          {exams.length} exam{exams.length !== 1 ? "s" : ""} on the platform
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Title</th>
              <th className="px-4 py-3 text-left font-medium">Teacher</th>
              <th className="px-4 py-3 text-center font-medium">Attempts</th>
              <th className="px-4 py-3 text-center font-medium">Time Limit</th>
              <th className="px-4 py-3 text-center font-medium">Pass Score</th>
              <th className="px-4 py-3 text-center font-medium">Status</th>
              <th className="px-4 py-3 text-center font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((e) => (
              <tr key={e.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{e.title}</td>
                <td className="px-4 py-3 text-muted-foreground">{e.teacher.name ?? "—"}</td>
                <td className="px-4 py-3 text-center">{e._count.examAttempts}</td>
                <td className="px-4 py-3 text-center">{e.timeLimit ? `${e.timeLimit}m` : "—"}</td>
                <td className="px-4 py-3 text-center">{e.passingScore}%</td>
                <td className="px-4 py-3 text-center">
                  <Badge variant={e.isPublished ? "default" : "secondary"} className="text-xs">
                    {e.isPublished ? "Published" : "Draft"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-center">
                  <DeleteButton entity="exam" id={e.id} />
                </td>
              </tr>
            ))}
            {exams.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                  No exams created yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
