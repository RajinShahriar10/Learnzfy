import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/rbac"
import { RewardsClient } from "./rewards-client"

export default async function AdminRewardsPage() {
  await requireRole("ADMIN")

  const [rewards, sponsors] = await Promise.all([
    prisma.reward.findMany({
      include: {
        sponsor: { select: { id: true, name: true } },
        _count: { select: { redemptions: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.sponsor.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    }),
  ])

  const serialized = rewards.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    pointsCost: r.pointsCost,
    type: r.type,
    value: r.value,
    isActive: r.isActive,
    stock: r.stock,
    sponsorId: r.sponsorId,
    createdAt: r.createdAt.toISOString(),
    sponsor: r.sponsor
      ? { id: r.sponsor.id, name: r.sponsor.name }
      : null,
    _count: { redemptions: r._count.redemptions },
  }))

  return <RewardsClient rewards={serialized} sponsors={sponsors} />
}
