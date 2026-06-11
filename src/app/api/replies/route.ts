import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { content, discussionId, parentId } = await req.json()
  if (!content?.trim() || !discussionId) {
    return NextResponse.json({ error: "Content and discussionId are required" }, { status: 400 })
  }

  const reply = await prisma.reply.create({
    data: {
      content: content.trim(),
      userId: session.user.id,
      discussionId,
      parentId: parentId || null,
    },
    include: {
      user: { select: { id: true, name: true, image: true, role: true } },
      _count: { select: { votes: true } },
    },
  })

  return NextResponse.json(
    { ...reply, upvotes: 0, hasUpvoted: false, createdAt: reply.createdAt.toISOString(), replies: [] },
    { status: 201 }
  )
}
