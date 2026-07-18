import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { prisma } from "@/lib/prisma"
import { Trophy, Zap } from "lucide-react"

const rankColors = ["text-yellow-500", "text-gray-400", "text-amber-600"]

export async function LeaderboardPreview() {
  const entries = await prisma.leaderboard.findMany({
    take: 5,
    orderBy: { points: "desc" },
  })

  const userIds = entries.map((e) => e.userId)
  const [users, xpRecords, userBadges] = await Promise.all([
    prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, image: true },
    }),
    prisma.xP.findMany({
      where: { userId: { in: userIds } },
      select: { userId: true, level: true },
    }),
    prisma.userBadge.findMany({
      where: { userId: { in: userIds } },
      select: { userId: true, badge: { select: { name: true } } },
    }),
  ])

  const userMap = new Map(users.map((u) => [u.id, u]))
  const xpMap = new Map(xpRecords.map((x) => [x.userId, x.level]))
  const badgeMap = new Map(userBadges.map((b) => [b.userId, b.badge.name]))

  const leaderboard = entries.map((e, idx) => ({
    rank: idx + 1,
    name: userMap.get(e.userId)?.name || "Anonymous",
    image: userMap.get(e.userId)?.image,
    xp: e.points,
    level: xpMap.get(e.userId) ?? 1,
    badge: badgeMap.get(e.userId) || "Learner",
  }))

  if (leaderboard.length === 0) return null

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">
            Leaderboard
          </h2>
          <p className="mt-2 text-muted-foreground">
            Top learners this month. Earn XP to climb the ranks.
          </p>
        </div>
        <div className="mx-auto max-w-2xl">
          <div className="rounded-xl border bg-card overflow-hidden">
            <div className="grid grid-cols-[auto_1fr_auto] gap-4 p-4 border-b bg-muted/50 text-sm font-medium text-muted-foreground">
              <span>Rank</span>
              <span>Student</span>
              <span>XP</span>
            </div>
            {leaderboard.map((entry) => {
              const initials = entry.name
                .split(" ")
                .map((n) => n[0])
                .join("")

              return (
                <div
                  key={entry.rank}
                  className="grid grid-cols-[auto_1fr_auto] gap-4 p-4 items-center border-b last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center justify-center w-8">
                    {entry.rank <= 3 ? (
                      <Trophy
                        className={`h-5 w-5 ${rankColors[entry.rank - 1]}`}
                      />
                    ) : (
                      <span className="text-sm font-medium text-muted-foreground">
                        {entry.rank}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">{entry.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Level {entry.level}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-orange-400" />
                    <span className="text-sm font-medium tabular-nums">
                      {entry.xp.toLocaleString()}
                    </span>
                    <Badge variant="secondary" className="text-[10px] ml-1">
                      {entry.badge}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
