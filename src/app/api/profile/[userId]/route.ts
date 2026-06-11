import { NextResponse } from "next/server"
import { getPublicProfile } from "@/lib/public-profile"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params

  const data = await getPublicProfile(userId)

  if (!data.exists) {
    return NextResponse.json({ success: false, error: "Profile not found or private" }, { status: 404 })
  }

  return NextResponse.json({ success: true, data })
}
