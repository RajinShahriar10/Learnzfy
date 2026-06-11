import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const userId = session.user.id

  const [reward, xp] = await Promise.all([
    prisma.reward.findUnique({ where: { id } }),
    prisma.xP.findUnique({ where: { userId } }),
  ])

  if (!reward || !reward.isActive) {
    return NextResponse.json({ error: "Reward not available" }, { status: 404 })
  }

  if (reward.stock !== null && reward.stock <= 0) {
    return NextResponse.json({ error: "Reward out of stock" }, { status: 400 })
  }

  const userPoints = xp?.points ?? 0
  if (userPoints < reward.pointsCost) {
    return NextResponse.json({ error: "Insufficient points" }, { status: 400 })
  }

  const redemption = await prisma.$transaction(async (tx) => {
    const existing = await tx.rewardRedemption.findFirst({
      where: { userId, rewardId: id, status: "pending" },
    })
    if (existing) {
      throw new Error("You already have a pending redemption for this reward")
    }

    await tx.xP.update({
      where: { userId },
      data: { points: { decrement: reward.pointsCost } },
    })

    if (reward.stock !== null) {
      await tx.reward.update({
        where: { id },
        data: { stock: { decrement: 1 } },
      })
    }

    const code = generateCode()

    return tx.rewardRedemption.create({
      data: {
        userId,
        rewardId: id,
        pointsSpent: reward.pointsCost,
        code,
        status: "approved",
      },
      include: { reward: { select: { title: true, type: true, value: true } } },
    })
  })

  return NextResponse.json(redemption, { status: 201 })
}

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let code = ""
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      code += chars[Math.floor(Math.random() * chars.length)]
    }
    if (i < 2) code += "-"
  }
  return code
}
