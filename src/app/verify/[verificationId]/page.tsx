import { getCertificateByVerificationId, getVerificationLogs } from "@/lib/certificate-utils"
import { notFound } from "next/navigation"
import { CertificateDisplay } from "@/components/certificate/certificate-display"
import { CertificateStatusBadge } from "@/components/certificate/certificate-status-badge"
import { ShieldCheck, AlertCircle, History, Globe, Monitor, ChevronRight } from "lucide-react"

export default async function VerifyCertificatePage({
  params,
}: {
  params: Promise<{ verificationId: string }>
}) {
  const { verificationId } = await params

  let certificate
  try {
    certificate = await getCertificateByVerificationId(verificationId)
  } catch {
    notFound()
  }

  if (!certificate) {
    notFound()
  }

  const logs = await getVerificationLogs(certificate.id)

  const isRevoked = certificate.status === "REVOKED"
  const isExpired = certificate.status === "EXPIRED"

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50/50 to-white py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {isRevoked ? (
          <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-5 w-5 text-red-700" />
              </div>
              <div>
                <h2 className="font-semibold text-red-800">Revoked Certificate</h2>
                <p className="text-sm text-red-600">
                  This certificate has been revoked and is no longer valid.
                  {certificate.revokedReason && (
                    <span className="block mt-1">Reason: {certificate.revokedReason}</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        ) : isExpired ? (
          <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                <AlertCircle className="h-5 w-5 text-amber-700" />
              </div>
              <div>
                <h2 className="font-semibold text-amber-800">Expired Certificate</h2>
                <p className="text-sm text-amber-600">
                  This certificate has expired.
                  {certificate.expiresAt && (
                    <span className="block mt-1">
                      Expired on {new Date(certificate.expiresAt).toLocaleDateString()}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-8 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                <ShieldCheck className="h-5 w-5 text-emerald-700" />
              </div>
              <div>
                <h2 className="font-semibold text-emerald-800">
                  Verified Certificate
                </h2>
                <p className="text-sm text-emerald-600">
                  This certificate is valid and issued by Learnzfy.
                </p>
              </div>
            </div>
          </div>
        )}

        <CertificateDisplay
          studentName={certificate.studentName}
          courseName={certificate.courseName}
          teacherName={certificate.teacherName}
          issuedAt={certificate.issuedAt}
          verificationId={certificate.verificationId}
          certificateUrl={certificate.certificateUrl}
          grade={certificate.grade}
          status={certificate.status}
          showActions={false}
        />

        {logs.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <History className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Verification History ({logs.length})
              </h3>
            </div>
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-3 py-2 text-left font-medium">Date</th>
                    <th className="px-3 py-2 text-left font-medium">IP Address</th>
                    <th className="px-3 py-2 text-left font-medium">Device</th>
                    <th className="px-3 py-2 text-center font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-3 py-2 text-muted-foreground">
                        {new Date(log.verifiedAt).toLocaleString()}
                      </td>
                      <td className="px-3 py-2 font-mono text-muted-foreground">
                        {log.ipAddress ?? "—"}
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">
                        {log.userAgent ? (
                          <span className="flex items-center gap-1" title={log.userAgent}>
                            <Monitor className="h-3 w-3 shrink-0" />
                            <span className="truncate max-w-[200px]">{log.userAgent}</span>
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <CertificateStatusBadge status={log.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            This certificate was issued by Learnzfy. The authenticity of this certificate
            can be verified at any time through this page.
          </p>
        </div>
      </div>
    </div>
  )
}
