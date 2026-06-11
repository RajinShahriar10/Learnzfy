import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { CertificateDisplay } from "@/components/certificate/certificate-display"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function StudentCertificatePage({
  params,
}: {
  params: Promise<{ certificateId: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const { certificateId } = await params

  const certificate = await prisma.certificate.findUnique({
    where: { id: certificateId },
  })

  if (!certificate || certificate.userId !== session.user.id) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <Link
        href="/student/certificates"
        className="no-print inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Certificates
      </Link>

      <CertificateDisplay
        studentName={certificate.studentName}
        courseName={certificate.courseName}
        teacherName={certificate.teacherName}
        issuedAt={certificate.issuedAt}
        verificationId={certificate.verificationId}
        certificateUrl={certificate.certificateUrl}
        grade={certificate.grade}
        status={certificate.status}
      />
    </div>
  )
}
