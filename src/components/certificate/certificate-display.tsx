"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Printer, Download, ShieldCheck, QrCode } from "lucide-react"
import { CertificateStatusBadge } from "./certificate-status-badge"
import { QRCodeDisplay } from "./qr-code"

interface CertificateDisplayProps {
  studentName: string
  courseName: string
  teacherName: string
  issuedAt: Date | string
  verificationId: string
  certificateUrl: string
  grade?: string | null
  status?: string
  showActions?: boolean
}

export function CertificateDisplay({
  studentName,
  courseName,
  teacherName,
  issuedAt,
  verificationId,
  certificateUrl,
  grade,
  status,
  showActions = true,
}: CertificateDisplayProps) {
  const certRef = useRef<HTMLDivElement>(null)

  const dateStr = new Date(issuedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const handlePrint = () => window.print()

  return (
    <div>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #certificate-print-area, #certificate-print-area * { visibility: visible; }
          #certificate-print-area { position: absolute; left: 0; top: 0; width: 100%; }
          @page { margin: 0.3in; size: landscape; }
          .no-print { display: none !important; }
        }
      `}</style>

      {showActions && (
        <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold">Certificate of Completion</h2>
            {status && <CertificateStatusBadge status={status} />}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint} className="gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
            <Button onClick={handlePrint} className="gap-2">
              <Printer className="h-4 w-4" />
              Print
            </Button>
          </div>
        </div>
      )}

      <div
        id="certificate-print-area"
        ref={certRef}
        className="relative overflow-hidden rounded-2xl border-8 border-double border-yellow-600/60 bg-white p-8 shadow-xl sm:p-12 md:p-16"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, rgba(234,179,8,0.03) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(234,179,8,0.03) 0%, transparent 50%)",
        }}
      >
        <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600" />
        <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600" />

        <div className="absolute left-4 top-1/2 h-3/4 w-px bg-gradient-to-b from-transparent via-yellow-600/30 to-transparent" />
        <div className="absolute right-4 top-1/2 h-3/4 w-px bg-gradient-to-b from-transparent via-yellow-600/30 to-transparent" />

        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-2">
            <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-50">
              <ShieldCheck className="h-8 w-8 text-yellow-700" />
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-wide text-gray-900 sm:text-4xl">
              Learnzfy
            </h1>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-yellow-700">
              Education is your right, not a product for sale.
            </p>
          </div>

          <div className="my-6 border-t border-yellow-300/50" />

          <p className="text-sm font-medium uppercase tracking-widest text-gray-500">
            Certificate of Completion
          </p>

          <h2 className="mt-2 font-serif text-3xl font-bold text-gray-900 sm:text-4xl">
            {studentName}
          </h2>

          <p className="mt-6 text-sm text-gray-600">
            Has successfully completed the course
          </p>

          <h3 className="mt-2 font-serif text-2xl font-semibold text-yellow-800 sm:text-3xl">
            {courseName}
          </h3>

          {grade && (
            <p className="mt-3 text-sm text-gray-600">
              with a grade of{" "}
              <span className="font-bold text-yellow-700">{grade}</span>
            </p>
          )}

          <div className="my-8 border-t border-yellow-300/50" />

          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-12">
            <div className="text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Course Instructor
              </p>
              <p className="mt-1 font-semibold text-gray-700">{teacherName}</p>
            </div>
            <div className="hidden h-10 w-px bg-gray-300 sm:block" />
            <div className="text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Date Completed
              </p>
              <p className="mt-1 font-semibold text-gray-700">{dateStr}</p>
            </div>
          </div>

          <div className="mt-10 border-t border-yellow-300/50 pt-6">
            <div className="mx-auto max-w-md rounded-lg bg-yellow-50/50 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Verification ID
              </p>
              <p className="mt-0.5 font-mono text-xs text-gray-600 break-all">
                {verificationId}
              </p>
              <p className="mt-2 text-[10px] text-gray-400">
                Verify at{" "}
                <span className="underline underline-offset-2">
                  {certificateUrl}
                </span>
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center gap-2">
            <div className="no-print">
              <QRCodeDisplay url={certificateUrl} />
            </div>
            <div className="flex items-center gap-2 text-[10px] text-gray-400">
              <ShieldCheck className="h-3 w-3" />
              <span>Digitally issued by Learnzfy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
