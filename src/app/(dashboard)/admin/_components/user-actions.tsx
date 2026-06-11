"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useState } from "react"

interface UserActionsProps {
  userId: string
  isActive: boolean
}

export function UserActions({ userId, isActive }: UserActionsProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const toggleActive = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/action", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entity: "user", id: userId, data: { isActive: !isActive } }),
      })
      if (!res.ok) throw new Error()
      router.refresh()
    } catch {
      alert("Failed to update user")
      setLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleActive}
      disabled={loading}
      className="h-8 text-xs"
    >
      {loading ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : isActive ? (
        "Deactivate"
      ) : (
        "Activate"
      )}
    </Button>
  )
}
