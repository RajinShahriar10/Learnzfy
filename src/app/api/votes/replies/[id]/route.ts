import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const existing = await prisma.replyVote.findUnique({
    where: { userId_replyId: { userId: session.user.id, replyId: id } },
  })

  if (existing) {
    await prisma.replyVote.delete({ where: { id: existing.id } })
    return NextResponse.json({ upvoted: false })
  }

  await prisma.replyVote.create({
    data: { userId: session.user.id, replyId: id },
  })

  return NextResponse.json({ upvoted: true })
}
