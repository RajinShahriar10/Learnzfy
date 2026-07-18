import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trophy, Zap } from "lucide-react"

export default async function LeaderboardPage() {
  const session = await auth()

  const entries = await prisma.leaderboard.findMany({
    take: 20,
    orderBy: { points: "desc" },
  })

  const userIds = entries.map((e) => e.userId)
  const [users, xpRecords, badges] = await Promise.all([
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
  const badgeMap = new Map(badges.map((b) => [b.userId, b.badge.name]))

  const leaderboard = entries.map((e, idx) => {
    const user = userMap.get(e.userId)
    return {
      rank: idx + 1,
      name: user?.name || "Anonymous",
      image: user?.image,
      xp: e.points,
      level: xpMap.get(e.userId) ?? 1,
      badge: badgeMap.get(e.userId) || "Learner",
      isCurrentUser: e.userId === session?.user?.id,
    }
  })

  const rankColors = ["text-yellow-500", "text-gray-400", "text-amber-600"]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Leaderboard</h1>
        <p className="text-sm text-muted-foreground">
          Top learners ranked by XP. Keep learning to climb the ranks.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-[auto_1fr_auto] gap-4 px-6 py-3 border-b bg-muted/30 text-sm font-medium text-muted-foreground">
            <span>Rank</span>
            <span>Student</span>
            <span>XP</span>
          </div>

          {leaderboard.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No leaderboard data yet. Start learning to earn XP!
            </div>
          ) : (
            leaderboard.map((entry) => {
              const initials = entry.name
                .split(" ")
                .map((n) => n[0])
                .join("")

              return (
                <div
                  key={entry.rank}
                  className={`grid grid-cols-[auto_1fr_auto] gap-4 px-6 py-4 items-center border-b last:border-0 hover:bg-muted/30 transition-colors ${
                    entry.isCurrentUser ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="flex items-center justify-center w-8">
                    {entry.rank <= 3 ? (
                      <Trophy className={`h-5 w-5 ${rankColors[entry.rank - 1]}`} />
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
                      <div className="text-sm font-medium">
                        {entry.name}
                        {entry.isCurrentUser && (
                          <Badge variant="secondary" className="ml-2 text-[10px]">You</Badge>
                        )}
                      </div>
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
            })
          )}
        </CardContent>
      </Card>
    </div>
  )
}
