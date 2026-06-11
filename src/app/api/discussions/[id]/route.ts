import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  const discussion = await prisma.discussion.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, image: true, role: true } },
      _count: { select: { replies: true, votes: true } },
      votes: { where: { userId: session.user.id }, select: { id: true } },
      replies: {
        orderBy: [{ isPinned: "desc" }, { createdAt: "asc" }],
        include: {
          user: { select: { id: true, name: true, image: true, role: true } },
          _count: { select: { votes: true } },
          votes: { where: { userId: session.user.id }, select: { id: true } },
          replies: {
            orderBy: { createdAt: "asc" },
            include: {
              user: { select: { id: true, name: true, image: true, role: true } },
              _count: { select: { votes: true } },
              votes: { where: { userId: session.user.id }, select: { id: true } },
            },
          },
        },
      },
      course: { select: { id: true, title: true } },
      lesson: { select: { id: true, title: true } },
    },
  })

  if (!discussion) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json({
    ...discussion,
    upvotes: discussion._count.votes,
    hasUpvoted: discussion.votes.length > 0,
    createdAt: discussion.createdAt.toISOString(),
    updatedAt: discussion.updatedAt.toISOString(),
    replies: discussion.replies.map((r) => ({
      ...r,
      upvotes: r._count.votes,
      hasUpvoted: r.votes.length > 0,
      createdAt: r.createdAt.toISOString(),
      replies: r.replies.map((rr) => ({
        ...rr,
        upvotes: rr._count.votes,
        hasUpvoted: rr.votes.length > 0,
        createdAt: rr.createdAt.toISOString(),
      })),
    })),
  })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const discussion = await prisma.discussion.findUnique({ where: { id } })

  if (!discussion) return NextResponse.json({ error: "Not found" }, { status: 404 })
  if (discussion.userId !== session.user.id && !["TEACHER", "ADMIN", "SUPER_ADMIN"].includes(session.user.role ?? "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  await prisma.discussion.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
