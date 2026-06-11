"use client"

import { ShieldCheck, ShieldX, Clock, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

const STATUS_CONFIG = {
  VALID: {
    icon: ShieldCheck,
    label: "Valid",
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  },
  REVOKED: {
    icon: ShieldX,
    label: "Revoked",
    className: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 border-red-200 dark:border-red-800",
  },
  EXPIRED: {
    icon: Clock,
    label: "Expired",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  },
} as const

export function CertificateStatusBadge({ status, className }: { status: string; className?: string }) {
  const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.VALID
  const Icon = config.icon

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
        config.className,
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  )
}

export function CertificateStatusIcon({ status, className }: { status: string; className?: string }) {
  const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.VALID
  const Icon = config.icon

  return (
    <Icon
      className={cn(
        "h-4 w-4",
        status === "VALID" && "text-emerald-500",
        status === "REVOKED" && "text-red-500",
        status === "EXPIRED" && "text-amber-500",
        className
      )}
    />
  )
}
