import { prisma } from "@/lib/prisma"
import { ok } from "@/lib/api-helpers"

export async function GET() {
  const entries = await prisma.leaderboard.findMany({
    take: 10,
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
      select: { userId: true, points: true, level: true },
    }),
    prisma.userBadge.findMany({
      where: { userId: { in: userIds } },
      select: { userId: true, badge: { select: { name: true } } },
    }),
  ])

  const userMap = new Map(users.map((u) => [u.id, u]))
  const xpMap = new Map(xpRecords.map((x) => [x.userId, x]))
  const badgeMap = new Map(userBadges.map((b) => [b.userId, b.badge.name]))

  const result = entries.map((e, idx) => ({
    rank: idx + 1,
    name: userMap.get(e.userId)?.name || "Anonymous",
    image: userMap.get(e.userId)?.image,
    xp: e.points,
    level: xpMap.get(e.userId)?.level ?? 1,
    badge: badgeMap.get(e.userId) || "Learner",
  }))

  return ok(result)
}
