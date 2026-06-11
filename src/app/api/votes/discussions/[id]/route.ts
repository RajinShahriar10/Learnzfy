import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const existing = await prisma.discussionVote.findUnique({
    where: { userId_discussionId: { userId: session.user.id, discussionId: id } },
  })

  if (existing) {
    await prisma.discussionVote.delete({ where: { id: existing.id } })
    return NextResponse.json({ upvoted: false })
  }

  await prisma.discussionVote.create({
    data: { userId: session.user.id, discussionId: id },
  })

  return NextResponse.json({ upvoted: true })
}
