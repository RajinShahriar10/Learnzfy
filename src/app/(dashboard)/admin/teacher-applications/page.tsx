"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { redirect, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Search, RefreshCw, Loader2, ChevronRight, Clock,
  CheckCircle2, XCircle, AlertTriangle, Eye, MessageSquare,
  Users, FileCheck, TrendingUp, GraduationCap
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const STATUS_OPTIONS = ["ALL", "SUBMITTED", "UNDER_REVIEW", "APPROVED", "REJECTED", "CHANGES_REQUESTED"]

const STATUS_CONFIG: Record<string, { label: string; className: string; icon: any }> = {
  SUBMITTED: { label: "Submitted", className: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 border-blue-200 dark:border-blue-800", icon: Clock },
  UNDER_REVIEW: { label: "Under Review", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800", icon: AlertTriangle },
  APPROVED: { label: "Approved", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800", icon: CheckCircle2 },
  REJECTED: { label: "Rejected", className: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 border-red-200 dark:border-red-800", icon: XCircle },
  CHANGES_REQUESTED: { label: "Changes", className: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400 border-orange-200 dark:border-orange-800", icon: AlertTriangle },
}

export default function AdminTeacherApplicationsPage() {
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()
  const [applications, setApplications] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState<any>(null)

  if (authStatus === "unauthenticated") redirect("/login")

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(timer)
  }, [query])

  const fetchApplications = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (debouncedQuery) params.set("search", debouncedQuery)
      if (statusFilter !== "ALL") params.set("status", statusFilter)
      const [appRes, metricsRes] = await Promise.all([
        fetch(`/api/admin/teacher-applications?${params}`),
        fetch("/api/admin/teacher-applications/metrics"),
      ])
      const appData = await appRes.json()
      const metricsData = await metricsRes.json()
      if (appData.success) {
        setApplications(appData.data.applications)
        setTotal(appData.data.total)
      }
      if (metricsData.success) setMetrics(metricsData.data)
    } finally {
      setLoading(false)
    }
  }, [debouncedQuery, statusFilter])

  useEffect(() => { fetchApplications() }, [fetchApplications])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Teacher Applications</h1>
        <p className="text-sm text-muted-foreground">{total} application{total !== 1 ? "s" : ""}</p>
      </div>

      {metrics && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-lg bg-blue-100 p-2.5 dark:bg-blue-950">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{metrics.totalApplications}</p>
                <p className="text-xs text-muted-foreground">Total Applications</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-lg bg-yellow-100 p-2.5 dark:bg-yellow-950">
                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{metrics.byStatus.SUBMITTED + metrics.byStatus.UNDER_REVIEW}</p>
                <p className="text-xs text-muted-foreground">Pending Review</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-lg bg-emerald-100 p-2.5 dark:bg-emerald-950">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{metrics.byStatus.APPROVED}</p>
                <p className="text-xs text-muted-foreground">Approved</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-lg bg-emerald-100 p-2.5 dark:bg-emerald-950">
                <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{metrics.approvalRate}%</p>
                <p className="text-xs text-muted-foreground">Approval Rate</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or expertise..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
              />
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
                  {opt === "ALL" ? "All" : STATUS_CONFIG[opt]?.label ?? opt}
                </Button>
              ))}
              <div className="ml-auto">
                <Button variant="ghost" size="sm" onClick={fetchApplications}>
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
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Expertise</th>
              <th className="px-4 py-3 text-left font-medium">Email</th>
              <th className="px-4 py-3 text-center font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Submitted</th>
              <th className="px-4 py-3 text-center font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                </td>
              </tr>
            ) : applications.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                  No applications found.
                </td>
              </tr>
            ) : (
              applications.map((app: any) => {
                const StatusIcon = STATUS_CONFIG[app.status]?.icon ?? Clock
                return (
                  <tr key={app.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{app.fullName}</td>
                    <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate">
                      {app.expertiseArea ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{app.user?.email ?? "—"}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={cn(
                        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                        STATUS_CONFIG[app.status]?.className
                      )}>
                        <StatusIcon className="h-3 w-3" />
                        {STATUS_CONFIG[app.status]?.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1"
                        onClick={() => router.push(`/admin/teacher-applications/${app.id}`)}
                      >
                        Review <ChevronRight className="h-3 w-3" />
                      </Button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
