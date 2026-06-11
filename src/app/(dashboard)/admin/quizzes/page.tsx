import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/rbac"
import { DeleteButton } from "@/components/admin/delete-button"

export default async function AdminQuizzesPage() {
  await requireRole("ADMIN")

  const quizzes = await prisma.quiz.findMany({
    include: { teacher: true, _count: { select: { questions: true } } },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Quizzes</h1>
        <p className="text-sm text-muted-foreground">
          {quizzes.length} quiz{quizzes.length !== 1 ? "zes" : ""} on the platform
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Title</th>
              <th className="px-4 py-3 text-left font-medium">Teacher</th>
              <th className="px-4 py-3 text-center font-medium">Questions</th>
              <th className="px-4 py-3 text-center font-medium">Time Limit</th>
              <th className="px-4 py-3 text-center font-medium">Pass Score</th>
              <th className="px-4 py-3 text-left font-medium">Created</th>
              <th className="px-4 py-3 text-center font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((q) => (
              <tr key={q.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{q.title}</td>
                <td className="px-4 py-3 text-muted-foreground">{q.teacher.name ?? "—"}</td>
                <td className="px-4 py-3 text-center">{q._count.questions}</td>
                <td className="px-4 py-3 text-center">{q.timeLimit ? `${q.timeLimit}m` : "—"}</td>
                <td className="px-4 py-3 text-center">{q.passingScore}%</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(q.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-center">
                  <DeleteButton entity="quiz" id={q.id} />
                </td>
              </tr>
            ))}
            {quizzes.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                  No quizzes created yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
