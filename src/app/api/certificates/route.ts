import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getUserCertificates, generateCertificate } from "@/lib/certificate-utils"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const certificates = await getUserCertificates()
    return NextResponse.json(certificates)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch certificates" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { courseId, examId, grade } = body

    if (!courseId) {
      return NextResponse.json({ error: "courseId is required" }, { status: 400 })
    }

    const certificate = await generateCertificate(session.user.id, courseId, examId, grade)
    return NextResponse.json(certificate, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate certificate"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
