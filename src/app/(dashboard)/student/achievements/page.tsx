import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { achievements } from "@/lib/student-data"
import { Card, CardContent } from "@/components/ui/card"
import { CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  Rocket,
  Book,
  Trophy,
  Flame,
  Brain,
  Award,
  Zap,
  MessageSquare,
  Lock,
  CheckCircle2,
  Share2,
  Globe,
  User,
} from "lucide-react"

const iconMap: Record<string, any> = {
  rocket: Rocket,
  book: Book,
  trophy: Trophy,
  flame: Flame,
  brain: Brain,
  award: Award,
  zap: Zap,
  message: MessageSquare,
}

function AchievementCard({
  achievement,
}: {
  achievement: (typeof achievements)[number]
}) {
  const Icon = iconMap[achievement.icon] || Trophy
  const isUnlocked = !!achievement.unlockedAt
  const progressPct = Math.min(
    (achievement.progress / achievement.total) * 100,
    100
  )

  return (
    <Card
      className={cn(
        "transition-all hover:shadow-md",
        !isUnlocked && "opacity-70"
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
              isUnlocked ? "bg-primary/10" : "bg-muted"
            )}
          >
            {isUnlocked ? (
              <Icon className="h-6 w-6 text-primary" />
            ) : (
              <Lock className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{achievement.name}</h3>
              {isUnlocked && (
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {achievement.description}
            </p>
            {isUnlocked ? (
              <p className="text-xs text-green-600 mt-2">
                Unlocked{" "}
                {new Date(achievement.unlockedAt!).toLocaleDateString()}
              </p>
            ) : (
              <div className="mt-3 space-y-1">
                <Progress value={progressPct} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {achievement.progress}/{achievement.total}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default async function AchievementsPage() {
  const session = await auth()
  const profile = session?.user?.id
    ? await prisma.profile.findUnique({ where: { userId: session.user.id } })
    : null

  const profileVisibility = profile?.profileVisibility ?? "public"
  const profileUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/profile/${session?.user?.id ?? ""}`

  const unlocked = achievements.filter((a) => a.unlockedAt)
  const locked = achievements.filter((a) => !a.unlockedAt)

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Achievements</h1>
          <p className="text-sm text-muted-foreground">
            {unlocked.length} of {achievements.length} unlocked
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

      {unlocked.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Unlocked
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {unlocked.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </div>
      )}

      {locked.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Lock className="h-5 w-5 text-muted-foreground" />
            Locked
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {locked.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
