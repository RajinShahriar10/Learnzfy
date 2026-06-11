import { getCurrentLeaderboard } from "@/lib/student-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trophy, Zap } from "lucide-react"

export default function LeaderboardPage() {
  const entries = getCurrentLeaderboard()

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
        <CardHeader className="pb-3">
          <CardTitle className="text-base">This Month</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-[auto_1fr_auto] gap-4 px-6 py-3 border-b bg-muted/30 text-sm font-medium text-muted-foreground">
            <span>Rank</span>
            <span>Student</span>
            <span>XP</span>
          </div>
          {entries.map((entry) => {
            const initials = entry.name
              .split(" ")
              .map((n) => n[0])
              .join("")

            return (
              <div
                key={entry.rank}
                className="grid grid-cols-[auto_1fr_auto] gap-4 px-6 py-4 items-center border-b last:border-0 hover:bg-muted/20 transition-colors"
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
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {initials}
                    </AvatarFallback>
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
        </CardContent>
      </Card>
    </div>
  )
}
