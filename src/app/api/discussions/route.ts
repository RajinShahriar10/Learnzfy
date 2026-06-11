import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const courseId = searchParams.get("courseId")
  const lessonId = searchParams.get("lessonId")
  const sort = searchParams.get("sort") || "recent"
  const page = parseInt(searchParams.get("page") || "1")
  const limit = 20
  const skip = (page - 1) * limit

  const where: Record<string, unknown> = {}
  if (courseId) where.courseId = courseId
  if (lessonId) where.lessonId = lessonId

  const orderBy: Prisma.DiscussionOrderByWithRelationInput[] =
    sort === "votes"
      ? [{ votes: { _count: "desc" } }, { createdAt: "desc" }]
      : [{ isPinned: "desc" }, { createdAt: "desc" }]

  const [discussions, total] = await Promise.all([
    prisma.discussion.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        user: { select: { id: true, name: true, image: true, role: true } },
        _count: { select: { replies: true, votes: true } },
        votes: { where: { userId: session.user.id }, select: { id: true } },
      },
    }),
    prisma.discussion.count({ where }),
  ])

  return NextResponse.json({
    discussions: discussions.map((d) => ({
      id: d.id,
      title: d.title,
      content: d.content,
      isPinned: d.isPinned,
      upvotes: d._count.votes,
      replyCount: d._count.replies,
      hasUpvoted: d.votes.length > 0,
      user: d.user,
      createdAt: d.createdAt.toISOString(),
    })),
    total,
    pages: Math.ceil(total / limit),
  })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { title, content, courseId, lessonId } = await req.json()
  if (!title?.trim() || !content?.trim()) {
    return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
  }

  const discussion = await prisma.discussion.create({
    data: {
      title: title.trim(),
      content: content.trim(),
      userId: session.user.id,
      courseId: courseId || null,
      lessonId: lessonId || null,
    },
    include: {
      user: { select: { id: true, name: true, image: true, role: true } },
    },
  })

  return NextResponse.json(discussion, { status: 201 })
}
