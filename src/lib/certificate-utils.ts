import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import type { Prisma } from "@prisma/client"

export interface CertificateData {
  id: string
  verificationId: string
  userId: string
  courseId: string
  examId: string | null
  studentName: string
  courseName: string
  teacherName: string
  grade: string | null
  certificateUrl: string
  status: string
  revokedAt: Date | null
  revokedReason: string | null
  expiresAt: Date | null
  issuedAt: Date
}

export interface VerificationLogData {
  id: string
  certificateId: string
  verifiedAt: Date
  ipAddress: string | null
  userAgent: string | null
  verifierName: string | null
  status: string
}

const certificateInclude = {
  user: { select: { id: true, name: true, email: true } },
  course: { select: { id: true, title: true, slug: true } },
} as const

function toCertificateData(c: any): CertificateData {
  return {
    id: c.id,
    verificationId: c.verificationId,
    userId: c.userId,
    courseId: c.courseId,
    examId: c.examId,
    studentName: c.studentName,
    courseName: c.courseName,
    teacherName: c.teacherName,
    grade: c.grade,
    certificateUrl: c.certificateUrl,
    status: c.status,
    revokedAt: c.revokedAt,
    revokedReason: c.revokedReason,
    expiresAt: c.expiresAt,
    issuedAt: c.issuedAt,
  }
}

export async function generateCertificate(
  userId: string,
  courseId: string,
  examId?: string,
  grade?: string
): Promise<CertificateData> {
  const existing = await prisma.certificate.findUnique({
    where: { userId_courseId: { userId, courseId } },
  })
  if (existing) {
    return toCertificateData(existing)
  }

  const [user, course] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.course.findUnique({
      where: { id: courseId },
      include: { teacher: true },
    }),
  ])
  if (!user || !course) throw new Error("User or course not found")

  const studentName = user.name ?? "Student"
  const teacherName = course.teacher.name ?? "Instructor"
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

  const certificate = await prisma.certificate.create({
    data: {
      userId,
      courseId,
      examId: examId ?? null,
      studentName,
      courseName: course.title,
      teacherName,
      grade: grade ?? null,
      status: "VALID",
      certificateUrl: `${baseUrl}/verify/`,
    },
  })

  const updated = await prisma.certificate.update({
    where: { id: certificate.id },
    data: { certificateUrl: `${baseUrl}/verify/${certificate.verificationId}` },
  })

  return toCertificateData(updated)
}

export async function getUserCertificates(): Promise<CertificateData[]> {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const certificates = await prisma.certificate.findMany({
    where: { userId: session.user.id },
    orderBy: { issuedAt: "desc" },
  })

  return certificates.map(toCertificateData)
}

export async function getCertificateById(id: string): Promise<CertificateData | null> {
  const certificate = await prisma.certificate.findUnique({ where: { id } })
  return certificate ? toCertificateData(certificate) : null
}

export async function getCertificateByVerificationId(
  verificationId: string
): Promise<CertificateData | null> {
  const certificate = await prisma.certificate.findUnique({
    where: { verificationId },
  })
  return certificate ? toCertificateData(certificate) : null
}

export async function revokeCertificate(id: string, reason: string): Promise<CertificateData> {
  const certificate = await prisma.certificate.update({
    where: { id },
    data: { status: "REVOKED", revokedAt: new Date(), revokedReason: reason },
  })
  return toCertificateData(certificate)
}

export async function restoreCertificate(id: string): Promise<CertificateData> {
  const certificate = await prisma.certificate.update({
    where: { id },
    data: { status: "VALID", revokedAt: null, revokedReason: null },
  })
  return toCertificateData(certificate)
}

export async function getVerificationLogs(certificateId: string): Promise<VerificationLogData[]> {
  const logs = await prisma.verificationLog.findMany({
    where: { certificateId },
    orderBy: { verifiedAt: "desc" },
    take: 50,
  })
  return logs.map((l) => ({
    id: l.id,
    certificateId: l.certificateId,
    verifiedAt: l.verifiedAt,
    ipAddress: l.ipAddress,
    userAgent: l.userAgent,
    verifierName: l.verifierName,
    status: l.status,
  }))
}

export async function logVerification(
  certificateId: string,
  status: string,
  ipAddress?: string,
  userAgent?: string,
  verifierName?: string
): Promise<void> {
  await prisma.verificationLog.create({
    data: {
      certificateId,
      status,
      ipAddress: ipAddress ?? null,
      userAgent: userAgent ?? null,
      verifierName: verifierName ?? null,
    },
  })
}

export async function searchCertificatesAdmin(query: string, status?: string) {
  const where: Prisma.CertificateWhereInput = {}

  if (query) {
    where.OR = [
      { studentName: { contains: query, mode: "insensitive" } },
      { courseName: { contains: query, mode: "insensitive" } },
      { teacherName: { contains: query, mode: "insensitive" } },
      { verificationId: { contains: query, mode: "insensitive" } },
    ]
  }

  if (status && status !== "ALL") {
    where.status = status
  }

  const [certificates, total] = await Promise.all([
    prisma.certificate.findMany({
      where,
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { issuedAt: "desc" },
      take: 100,
    }),
    prisma.certificate.count({ where }),
  ])

  return { certificates, total }
}
