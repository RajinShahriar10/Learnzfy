import { NextResponse } from "next/server"
import { getCertificateByVerificationId, logVerification, getVerificationLogs } from "@/lib/certificate-utils"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ verificationId: string }> }
) {
  try {
    const { verificationId } = await params
    const certificate = await getCertificateByVerificationId(verificationId)

    if (!certificate) {
      return NextResponse.json(
        { valid: false, error: "Certificate not found" },
        { status: 404 }
      )
    }

    const ipAddress = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "unknown"
    const userAgent = request.headers.get("user-agent") ?? undefined

    await logVerification(
      certificate.id,
      certificate.status,
      ipAddress,
      userAgent
    )

    const logs = await getVerificationLogs(certificate.id)

    return NextResponse.json({
      valid: true,
      certificate: {
        id: certificate.id,
        verificationId: certificate.verificationId,
        studentName: certificate.studentName,
        courseName: certificate.courseName,
        teacherName: certificate.teacherName,
        grade: certificate.grade,
        issuedAt: certificate.issuedAt,
        certificateUrl: certificate.certificateUrl,
        status: certificate.status,
        revokedAt: certificate.revokedAt,
        revokedReason: certificate.revokedReason,
        expiresAt: certificate.expiresAt,
      },
      verificationHistory: logs.map((l) => ({
        id: l.id,
        verifiedAt: l.verifiedAt,
        ipAddress: l.ipAddress,
        userAgent: l.userAgent,
        status: l.status,
      })),
    })
  } catch (error) {
    return NextResponse.json(
      { valid: false, error: "Verification failed" },
      { status: 500 }
    )
  }
}
