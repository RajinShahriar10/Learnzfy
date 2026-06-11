"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const STATUS_MESSAGES: Record<string, { icon: any; title: string; description: string; color: string; action?: { label: string; href: string } }> = {
  SUBMITTED: {
    icon: Clock,
    title: "Application Submitted",
    description: "Your teacher application is being reviewed. You will be notified when there is an update.",
    color: "border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-400",
    action: { label: "View Status", href: "/teacher/apply" },
  },
  UNDER_REVIEW: {
    icon: AlertTriangle,
    title: "Application Under Review",
    description: "An admin is reviewing your application. We'll notify you once a decision is made.",
    color: "border-yellow-200 bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-400",
    action: { label: "View Status", href: "/teacher/apply" },
  },
  REJECTED: {
    icon: XCircle,
    title: "Application Rejected",
    description: "Your teacher application was not approved. Check the feedback and consider reapplying.",
    color: "border-red-200 bg-red-50 text-red-700 dark:bg-red-950 dark:border-red-800 dark:text-red-400",
    action: { label: "View Details", href: "/teacher/apply" },
  },
  CHANGES_REQUESTED: {
    icon: AlertTriangle,
    title: "Changes Requested",
    description: "The admin has requested changes to your application. Please update and resubmit.",
    color: "border-orange-200 bg-orange-50 text-orange-700 dark:bg-orange-950 dark:border-orange-800 dark:text-orange-400",
    action: { label: "Update Application", href: "/teacher/apply" },
  },
}

export function ApprovalBanner() {
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/teacher/apply")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data) setStatus(data.data.status)
        else setStatus("NO_APPLICATION")
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return null
  if (!status || status === "APPROVED" || status === "NO_APPLICATION") return null

  const config = STATUS_MESSAGES[status]
  if (!config) return null

  const Icon = config.icon

  return (
    <div className={`mb-6 rounded-lg border p-4 ${config.color}`}>
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-5 w-5 shrink-0" />
        <div className="flex-1">
          <p className="font-semibold">{config.title}</p>
          <p className="text-sm">{config.description}</p>
        </div>
        {config.action && (
          <Link href={config.action.href}>
            <Button variant="outline" size="sm" className="shrink-0">
              {config.action.label}
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
