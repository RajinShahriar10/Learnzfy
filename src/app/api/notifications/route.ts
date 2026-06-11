import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getUserNotifications, markAllNotificationsRead, getUnreadCount } from "@/lib/notifications"

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const url = new URL(request.url)
  const type = url.searchParams.get("type") ?? undefined
  const limit = parseInt(url.searchParams.get("limit") ?? "50")
  const offset = parseInt(url.searchParams.get("offset") ?? "0")

  const result = await getUserNotifications(session.user.id, { type, limit, offset })
  const unread = await getUnreadCount(session.user.id)

  return NextResponse.json({ ...result, unread })
}

export async function PUT() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await markAllNotificationsRead(session.user.id)
  return NextResponse.json({ success: true })
}
