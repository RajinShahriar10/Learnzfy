import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const certificate = await prisma.certificate.findUnique({
      where: { id },
    })

    if (!certificate) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 })
    }

    if (certificate.userId !== session.user.id && session.user.role === "STUDENT") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json(certificate)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch certificate" }, { status: 500 })
  }
}
