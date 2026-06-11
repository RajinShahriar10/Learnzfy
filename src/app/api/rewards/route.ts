import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const rewards = await prisma.reward.findMany({
    where: { isActive: true, stock: { gt: 0, not: null } },
    include: { sponsor: { select: { name: true, logoUrl: true, websiteUrl: true } } },
    orderBy: { pointsCost: "asc" },
  })

  const xp = await prisma.xP.findUnique({ where: { userId: session.user.id } })

  return NextResponse.json({
    rewards,
    userPoints: xp?.points ?? 0,
  })
}
