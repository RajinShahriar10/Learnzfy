"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Loader2 } from "lucide-react"

export function AddSponsorForm() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)

    try {
      const res = await fetch("/api/admin/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity: "sponsor",
          data: { name, websiteUrl, description, isActive: true },
        }),
      })
      if (!res.ok) throw new Error()
      setName("")
      setWebsiteUrl("")
      setDescription("")
      setOpen(false)
      router.refresh()
    } catch {
      alert("Failed to create sponsor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {!open ? (
        <Button onClick={() => setOpen(true)} size="sm" className="gap-1">
          <Plus className="h-4 w-4" />
          Add Sponsor
        </Button>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3 rounded-lg border p-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Sponsor name"
              className="h-9"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Website</label>
            <Input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://example.com"
              className="h-9"
            />
          </div>
          <div className="space-y-1 flex-1 min-w-[200px]">
            <label className="text-xs font-medium text-muted-foreground">Description</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="About the sponsor"
              className="h-9"
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading} size="sm" className="h-9">
              {loading && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
              Create
            </Button>
            <Button type="button" variant="outline" size="sm" className="h-9" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
