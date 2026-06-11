"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trash2, Loader2 } from "lucide-react"

interface DeleteButtonProps {
  entity: string
  id: string
  label?: string
}

export function DeleteButton({ entity, id, label = "Delete" }: DeleteButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this item?")) return

    setLoading(true)
    try {
      const res = await fetch("/api/admin/action", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entity, id }),
      })
      if (!res.ok) throw new Error("Failed to delete")
      router.refresh()
    } catch {
      alert("Failed to delete")
      setLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={loading}
      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </Button>
  )
}
