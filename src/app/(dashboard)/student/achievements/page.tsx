import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import {
  Trophy,
  Lock,
  CheckCircle2,
  Share2,
  Globe,
  Award,
} from "lucide-react"

export default async function AchievementsPage() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Please sign in to view achievements.</p>
      </div>
    )
  }

  const profile = await prisma.profile.findUnique({
    where: { userId },
  })

  const allBadges = await prisma.badge.findMany({
    orderBy: { name: "asc" },
  })

  const userBadges = await prisma.userBadge.findMany({
    where: { userId },
    include: { badge: true },
  })

  const earnedBadgeIds = new Set(userBadges.map((ub) => ub.badgeId))
  const earnedBadges = userBadges.map((ub) => ({
    ...ub.badge,
    unlockedAt: ub.earnedAt,
  }))

  const lockedBadges = allBadges
    .filter((b) => !earnedBadgeIds.has(b.id))
    .map((b) => ({
      ...b,
      unlockedAt: null as Date | null,
    }))

  const profileVisibility = profile?.profileVisibility ?? "public"
  const profileUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/profile/${userId}`

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Achievements</h1>
          <p className="text-sm text-muted-foreground">
            {earnedBadges.length} of {allBadges.length} unlocked
          </p>
        </div>
        {profileVisibility !== "private" && (
          <div className="shrink-0">
            <a
              href={profileUrl}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2 text-sm font-medium transition hover:bg-accent hover:shadow-sm"
            >
              <Globe className="h-4 w-4 text-primary" />
              View Public Profile
              <Share2 className="h-3.5 w-3.5 text-muted-foreground" />
            </a>
          </div>
        )}
      </div>

      {earnedBadges.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Unlocked
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {earnedBadges.map((badge) => (
              <Card key={badge.id} className="transition-all hover:shadow-md">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{badge.name}</h3>
                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {badge.description || "Badge earned"}
                      </p>
                      <p className="text-xs text-green-600 mt-2">
                        Unlocked {new Date(badge.unlockedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {lockedBadges.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Lock className="h-5 w-5 text-muted-foreground" />
            Locked
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {lockedBadges.map((badge) => (
              <Card key={badge.id} className="transition-all hover:shadow-md opacity-70">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted">
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold">{badge.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {badge.description || "Complete challenges to unlock"}
                      </p>
                      {badge.criteria && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {badge.criteria}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {allBadges.length === 0 && (
        <div className="text-center py-20">
          <Trophy className="mx-auto h-12 w-12 text-muted-foreground/40" />
          <h3 className="mt-4 text-lg font-semibold">No achievements yet</h3>
          <p className="text-sm text-muted-foreground">
            Complete courses and activities to earn badges
          </p>
        </div>
      )}
    </div>
  )
}
