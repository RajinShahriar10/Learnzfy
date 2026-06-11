import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!["TEACHER", "ADMIN", "SUPER_ADMIN"].includes(session.user.role ?? "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id } = await params
  const { isPinned } = await req.json()

  const discussion = await prisma.discussion.update({
    where: { id },
    data: { isPinned: !!isPinned },
  })

  return NextResponse.json(discussion)
}
