"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CertificateStatusBadge } from "@/components/certificate/certificate-status-badge"
import {
  Search, RefreshCw, ShieldX, ShieldCheck, History, X, Loader2,
  ChevronDown, ChevronRight, ExternalLink, RotateCcw
} from "lucide-react"
import Link from "next/link"

const STATUS_OPTIONS = ["ALL", "VALID", "REVOKED", "EXPIRED"]

export default function AdminCertificatesPage() {
  const { data: session, status: authStatus } = useSession()
  const [certificates, setCertificates] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [loading, setLoading] = useState(true)
  const [logsLoading, setLogsLoading] = useState<string | null>(null)
  const [logs, setLogs] = useState<Record<string, any[]>>({})
  const [expandedCert, setExpandedCert] = useState<string | null>(null)
  const [revokeModal, setRevokeModal] = useState<{ id: string; name: string } | null>(null)
  const [revokeReason, setRevokeReason] = useState("")
  const [revoking, setRevoking] = useState(false)
  const [restoring, setRestoring] = useState<string | null>(null)

  if (authStatus === "unauthenticated") redirect("/login")

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(timer)
  }, [query])

  const fetchCertificates = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (debouncedQuery) params.set("q", debouncedQuery)
      if (statusFilter !== "ALL") params.set("status", statusFilter)
      const res = await fetch(`/api/admin/certificates?${params}`)
      const data = await res.json()
      if (data.success) {
        setCertificates(data.data.certificates)
        setTotal(data.data.total)
      }
    } finally {
      setLoading(false)
    }
  }, [debouncedQuery, statusFilter])

  useEffect(() => {
    fetchCertificates()
  }, [fetchCertificates])

  const handleRevoke = async () => {
    if (!revokeModal || !revokeReason.trim()) return
    setRevoking(true)
    try {
      const res = await fetch("/api/admin/certificates/revoke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: revokeModal.id, reason: revokeReason }),
      })
      const data = await res.json()
      if (data.success) {
        setRevokeModal(null)
        setRevokeReason("")
        fetchCertificates()
      }
    } finally {
      setRevoking(false)
    }
  }

  const handleRestore = async (id: string) => {
    setRestoring(id)
    try {
      const res = await fetch("/api/admin/certificates/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      const data = await res.json()
      if (data.success) {
        fetchCertificates()
      }
    } finally {
      setRestoring(null)
    }
  }

  const toggleLogs = async (certId: string) => {
    if (expandedCert === certId) {
      setExpandedCert(null)
      return
    }
    setExpandedCert(certId)
    if (!logs[certId]) {
      setLogsLoading(certId)
      try {
        const res = await fetch(`/api/admin/certificates/logs?certificateId=${certId}`)
        const data = await res.json()
        if (data.success) {
          setLogs((prev) => ({ ...prev, [certId]: data.data }))
        }
      } finally {
        setLogsLoading(null)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Certificate Management</h1>
        <p className="text-sm text-muted-foreground">
          {total} certificate{total !== 1 ? "s" : ""}
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by student name, course, teacher, or verification ID..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <Button
                  key={opt}
                  variant={statusFilter === opt ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(opt)}
                  className="text-xs"
                >
                  {opt === "ALL" ? "All" : opt.charAt(0) + opt.slice(1).toLowerCase()}
                </Button>
              ))}
              <div className="ml-auto">
                <Button variant="ghost" size="sm" onClick={fetchCertificates}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium w-8"></th>
              <th className="px-4 py-3 text-left font-medium">Student</th>
              <th className="px-4 py-3 text-left font-medium">Course</th>
              <th className="px-4 py-3 text-center font-medium">Grade</th>
              <th className="px-4 py-3 text-center font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Issued</th>
              <th className="px-4 py-3 text-center font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                </td>
              </tr>
            ) : certificates.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                  No certificates found.
                </td>
              </tr>
            ) : (
              certificates.map((c: any) => (
                <>
                  <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleLogs(c.id)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {logsLoading === c.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : expandedCert === c.id ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 font-medium">{c.studentName}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.courseName}</td>
                    <td className="px-4 py-3 text-center">{c.grade ?? "—"}</td>
                    <td className="px-4 py-3 text-center">
                      <CertificateStatusBadge status={c.status} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {new Date(c.issuedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Link
                          href={`/verify/${c.verificationId}`}
                          target="_blank"
                        >
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>
                        {c.status === "VALID" || c.status === "EXPIRED" ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                            onClick={() => setRevokeModal({ id: c.id, name: c.studentName })}
                            title="Revoke"
                          >
                            <ShieldX className="h-4 w-4" />
                          </Button>
                        ) : c.status === "REVOKED" ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-emerald-500 hover:text-emerald-700"
                            onClick={() => handleRestore(c.id)}
                            disabled={restoring === c.id}
                            title="Restore"
                          >
                            {restoring === c.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <RotateCcw className="h-4 w-4" />
                            )}
                          </Button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                  {expandedCert === c.id && (
                    <tr key={`${c.id}-logs`}>
                      <td colSpan={7} className="bg-muted/20 p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <History className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Verification Logs
                          </span>
                        </div>
                        {logs[c.id] && logs[c.id].length > 0 ? (
                          <div className="overflow-x-auto rounded border">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="border-b bg-muted/30">
                                  <th className="px-3 py-2 text-left font-medium">Date</th>
                                  <th className="px-3 py-2 text-left font-medium">IP</th>
                                  <th className="px-3 py-2 text-left font-medium">User Agent</th>
                                  <th className="px-3 py-2 text-center font-medium">Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {logs[c.id].map((log: any) => (
                                  <tr key={log.id} className="border-b last:border-0">
                                    <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">
                                      {new Date(log.verifiedAt).toLocaleString()}
                                    </td>
                                    <td className="px-3 py-2 font-mono text-muted-foreground">
                                      {log.ipAddress ?? "—"}
                                    </td>
                                    <td className="px-3 py-2 text-muted-foreground max-w-[200px] truncate">
                                      {log.userAgent ?? "—"}
                                    </td>
                                    <td className="px-3 py-2 text-center">
                                      <CertificateStatusBadge status={log.status} />
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground">No verification logs found.</p>
                        )}
                      </td>
                    </tr>
                  )}
                </>
              ))
            )}
          </tbody>
        </table>
      </div>

      {revokeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl border bg-background p-6 shadow-lg">
            <h2 className="text-lg font-bold">Revoke Certificate</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Revoke certificate for <strong>{revokeModal.name}</strong>.
            </p>
            <textarea
              placeholder="Enter reason for revocation..."
              value={revokeReason}
              onChange={(e) => setRevokeReason(e.target.value)}
              className="mt-4 w-full rounded-lg border bg-background px-3 py-2 text-sm min-h-[80px] resize-y"
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setRevokeModal(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleRevoke}
                disabled={revoking || !revokeReason.trim()}
              >
                {revoking ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Revoke Certificate
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
