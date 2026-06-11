import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const redemptions = await prisma.rewardRedemption.findMany({
    where: { userId: session.user.id },
    include: { reward: { select: { title: true, type: true, value: true, pointsCost: true } } },
    orderBy: { redeemedAt: "desc" },
  })

  return NextResponse.json({ redemptions })
}
