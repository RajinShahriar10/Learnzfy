import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { updatePrivacySettings } from "@/lib/public-profile"

export async function PUT(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { profileVisibility, showOnLeaderboard, shareLearningActivity } = body

  if (profileVisibility && !["public", "private", "friends_only"].includes(profileVisibility)) {
    return NextResponse.json({ success: false, error: "Invalid visibility setting" }, { status: 400 })
  }

  const result = await updatePrivacySettings(session.user.id, {
    ...(profileVisibility && { profileVisibility }),
    ...(typeof showOnLeaderboard === "boolean" && { showOnLeaderboard }),
    ...(typeof shareLearningActivity === "boolean" && { shareLearningActivity }),
  })

  return NextResponse.json({ success: true, data: result })
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  const { prisma } = await import("@/lib/prisma")
  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    select: {
      profileVisibility: true,
      showOnLeaderboard: true,
      shareLearningActivity: true,
    },
  })

  return NextResponse.json({
    success: true,
    data: profile ?? {
      profileVisibility: "public",
      showOnLeaderboard: true,
      shareLearningActivity: true,
    },
  })
}
