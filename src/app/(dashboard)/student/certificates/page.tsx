import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CertificateStatusBadge } from "@/components/certificate/certificate-status-badge"
import { CertificateStatusIcon } from "@/components/certificate/certificate-status-badge"
import Link from "next/link"
import { Award, Download, ExternalLink } from "lucide-react"

export default async function CertificatesPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const certificates = await prisma.certificate.findMany({
    where: { userId: session.user.id },
    orderBy: { issuedAt: "desc" },
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">My Certificates</h1>
        <p className="text-sm text-muted-foreground">
          {certificates.length} certificate{certificates.length !== 1 ? "s" : ""} earned
        </p>
      </div>

      {certificates.length === 0 ? (
        <div className="py-20 text-center">
          <Award className="mx-auto h-12 w-12 text-muted-foreground/40" />
          <h3 className="mt-4 text-lg font-semibold">No certificates yet</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Complete a course to earn your first certificate
          </p>
          <Link href="/courses">
            <Button>Browse Courses</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {certificates.map((cert) => (
            <Card key={cert.id} className="group transition-all hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
                    <Award className="h-7 w-7 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold transition-colors group-hover:text-primary">
                        {cert.courseName}
                      </h3>
                      <CertificateStatusBadge status={cert.status} />
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      {cert.grade && (
                        <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                          Grade: {cert.grade}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {new Date(cert.issuedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <Link href={`/student/certificates/${cert.id}`}>
                        <Button size="sm" variant="outline" className="h-8 gap-1">
                          <ExternalLink className="h-3.5 w-3.5" />
                          View Certificate
                        </Button>
                      </Link>
                      <Link href={`/student/certificates/${cert.id}`} target="_blank">
                        <Button size="sm" variant="ghost" className="h-8 gap-1">
                          <Download className="h-3.5 w-3.5" />
                          Open in New Tab
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
