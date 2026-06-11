import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { hasRole } from "@/lib/rbac"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user || !hasRole(session.user.role, "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { title, message, type = "info" } = await request.json()
    if (!title || !message) {
      return NextResponse.json({ error: "Title and message required" }, { status: 400 })
    }

    const users = await prisma.user.findMany({
      where: { isActive: true },
      select: { id: true },
    })

    const notifications = users.map((user) => ({
      userId: user.id,
      title,
      message,
      type,
      isRead: false,
    }))

    await prisma.notification.createMany({ data: notifications })

    return NextResponse.json({ sent: users.length })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to broadcast" },
      { status: 500 }
    )
  }
}
