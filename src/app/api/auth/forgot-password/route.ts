import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateRandomString } from "@/lib/utils"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ success: true })
    }

    const token = generateRandomString(48)
    const expires = new Date(Date.now() + 3600000)

    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expires,
      },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
