import { getPublicProfile } from "@/lib/public-profile"
import { notFound } from "next/navigation"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Trophy,
  Flame,
  BookOpen,
  Award,
  Star,
  Zap,
  Shield,
  Target,
  CheckCircle2,
  Brain,
  Rocket,
  MessageSquare,
  Lock,
} from "lucide-react"
import { tiers } from "@/lib/gamification-data"
import { cn } from "@/lib/utils"

const iconMap: Record<string, React.ElementType> = {
  rocket: Rocket,
  book: BookOpen,
  trophy: Trophy,
  flame: Flame,
  brain: Brain,
  award: Award,
  zap: Zap,
  message: MessageSquare,
}

function AchievementCard({
  name,
  description,
  icon,
  progress,
  total,
  unlockedAt,
}: {
  name: string
  description: string
  icon: string
  progress: number
  total: number
  unlockedAt: Date | null
}) {
  const Icon = iconMap[icon] || Trophy
  const isUnlocked = !!unlockedAt
  const pct = Math.min((progress / total) * 100, 100)

  return (
    <Card className={cn("transition-all", !isUnlocked && "opacity-60")}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
              isUnlocked ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            )}
          >
            {isUnlocked ? <Icon className="h-5 w-5" /> : <Lock className="h-4 w-4" />}
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">{name}</span>
              {isUnlocked && <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />}
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1">{description}</p>
            {!isUnlocked && (
              <div className="space-y-1 pt-1">
                <Progress value={pct} className="h-1.5" />
                <p className="text-[10px] text-muted-foreground">
                  {progress} / {total}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function getTier(points: number) {
  return [...tiers].reverse().find((t) => points >= t.minXp) ?? tiers[0]
}

export default async function PublicProfilePage(props: { params: Promise<{ userId: string }> }) {
  const { userId } = await props.params
  const profile = await getPublicProfile(userId)

  if (!profile.exists) {
    notFound()
  }

  const { user, profile: profileData, xp, badges, certificates, completedCourses, currentStreak, longestStreak, leaderboardRank, achievements } = profile
  const tier = xp ? getTier(xp.points) : tiers[0]
  const unlockedAchievements = achievements.filter((a) => a.unlockedAt).length
  const totalAchievements = achievements.length

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <Card className="mb-8 overflow-hidden border-0 shadow-lg">
          <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent px-6 pb-6 pt-10">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:gap-6">
              <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                <AvatarImage src={profileData?.avatarUrl ?? user?.image ?? undefined} />
                <AvatarFallback className="text-2xl font-bold bg-primary/10">
                  {user?.name?.[0]?.toUpperCase() ?? "S"}
                </AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl font-bold">{user?.name ?? "Student"}</h1>
                <p className="text-sm text-muted-foreground">
                  {profileData?.bio ?? "No bio yet"}
                </p>
                <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <Badge variant="secondary" className="gap-1">
                    <Shield className="h-3 w-3" />
                    {user ? user.role.charAt(0) + user.role.slice(1).toLowerCase() : "Student"}
                  </Badge>
                  {tier && (
                    <Badge variant="outline" className="gap-1">
                      <Award className="h-3 w-3 text-amber-500" />
                      Tier {tier.name}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <Card>
            <CardContent className="flex flex-col items-center p-4 text-center">
              <Zap className="mb-1 h-5 w-5 text-amber-500" />
              <span className="text-xl font-bold">{xp?.points ?? 0}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">XP</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center p-4 text-center">
              <Trophy className="mb-1 h-5 w-5 text-purple-500" />
              <span className="text-xl font-bold">{tier?.name ?? "-"}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Tier</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center p-4 text-center">
              <Award className="mb-1 h-5 w-5 text-blue-500" />
              <span className="text-xl font-bold">{badges.length}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Badges</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center p-4 text-center">
              <BookOpen className="mb-1 h-5 w-5 text-green-500" />
              <span className="text-xl font-bold">{completedCourses}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Courses</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center p-4 text-center">
              <Flame className="mb-1 h-5 w-5 text-orange-500" />
              <span className="text-xl font-bold">{currentStreak}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Streak</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center p-4 text-center">
              <Star className="mb-1 h-5 w-5 text-rose-500" />
              <span className="text-xl font-bold">{leaderboardRank ? `#${leaderboardRank}` : "-"}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Rank</span>
            </CardContent>
          </Card>
        </div>

        {/* Certificates */}
        {certificates.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Certificates ({certificates.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {certificates.slice(0, 10).map((cert) => (
                <div
                  key={cert.id}
                  className="flex items-center justify-between rounded-lg border bg-card p-3 transition hover:shadow-sm"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{cert.courseName}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(cert.issuedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge
                    variant={
                      cert.status === "VALID" ? "default" : cert.status === "EXPIRED" ? "secondary" : "destructive"
                    }
                    className="shrink-0 text-[10px]"
                  >
                    {cert.status}
                  </Badge>
                </div>
              ))}
              {certificates.length > 10 && (
                <p className="text-center text-xs text-muted-foreground">
                  +{certificates.length - 10} more certificates
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Badges */}
        {badges.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Award className="h-5 w-5 text-amber-500" />
                Badges ({badges.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {badges.map((badge) => {
                  const Icon = iconMap[badge.icon] || Award
                  return (
                    <div
                      key={badge.id}
                      className="group relative flex h-16 w-16 items-center justify-center rounded-xl border bg-card transition hover:shadow-md hover:border-primary/50"
                      title={`${badge.name}: ${badge.description}`}
                    >
                      <Icon className="h-7 w-7 text-primary" />
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-primary px-1.5 py-0.5 text-[8px] font-medium text-primary-foreground opacity-0 transition group-hover:opacity-100">
                        {badge.name}
                      </span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Achievements */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-primary" />
              Achievements ({unlockedAchievements}/{totalAchievements})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {achievements.map((a) => (
                <AchievementCard key={a.id} {...a} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Streak Details (if shareLearningActivity) */}
        {profileData?.shareLearningActivity && longestStreak > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Flame className="h-5 w-5 text-orange-500" />
                Learning Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border bg-card p-4 text-center">
                  <div className="text-2xl font-bold text-orange-500">{currentStreak}</div>
                  <div className="text-xs text-muted-foreground">Current Streak (days)</div>
                </div>
                <div className="rounded-lg border bg-card p-4 text-center">
                  <div className="text-2xl font-bold text-amber-500">{longestStreak}</div>
                  <div className="text-xs text-muted-foreground">Longest Streak (days)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
