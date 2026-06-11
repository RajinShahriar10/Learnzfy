import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/rbac"
import { DeleteButton } from "@/components/admin/delete-button"
import { Badge } from "@/components/ui/badge"

export default async function AdminLeaderboardsPage() {
  await requireRole("ADMIN")

  const leaderboards = await prisma.leaderboard.findMany({
    orderBy: [{ period: "asc" }, { rank: "asc" }],
  })

  const users = await prisma.user.findMany({
    where: { id: { in: leaderboards.map((l) => l.userId) } },
  })
  const userMap = new Map(users.map((u) => [u.id, u]))

  const periods = [...new Set(leaderboards.map((l) => l.period))]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Leaderboards</h1>
        <p className="text-sm text-muted-foreground">
          {leaderboards.length} entr{leaderboards.length !== 1 ? "ies" : "y"} across {periods.length} period{periods.length !== 1 ? "s" : ""}
        </p>
      </div>

      {periods.map((period) => {
        const entries = leaderboards.filter((l) => l.period === period)
        return (
          <div key={period} className="space-y-2">
            <h3 className="text-sm font-semibold capitalize">{period.replace("_", " ")}</h3>
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-center font-medium w-12">#</th>
                    <th className="px-4 py-3 text-left font-medium">User</th>
                    <th className="px-4 py-3 text-right font-medium">Points</th>
                    <th className="px-4 py-3 text-center font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((e) => (
                    <tr key={e.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-3 text-center font-bold">
                        {e.rank ?? "—"}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {userMap.get(e.userId)?.name ?? userMap.get(e.userId)?.email ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-right font-mono">{e.points.toLocaleString()}</td>
                      <td className="px-4 py-3 text-center">
                        <DeleteButton entity="leaderboard" id={e.id} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      })}

      {leaderboards.length === 0 && (
        <div className="rounded-lg border p-12 text-center text-muted-foreground">
          No leaderboard entries yet.
        </div>
      )}
    </div>
  )
}
