"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, Loader2, X } from "lucide-react"

interface SponsorData {
  id: string
  name: string
  websiteUrl: string | null
  contactEmail: string | null
  tier: string
  description: string | null
  isActive: boolean
}

export function EditSponsorForm({ sponsor }: { sponsor: SponsorData }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(sponsor.name)
  const [websiteUrl, setWebsiteUrl] = useState(sponsor.websiteUrl ?? "")
  const [contactEmail, setContactEmail] = useState(sponsor.contactEmail ?? "")
  const [tier, setTier] = useState(sponsor.tier)
  const [description, setDescription] = useState(sponsor.description ?? "")
  const [isActive, setIsActive] = useState(sponsor.isActive)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)

    try {
      const res = await fetch("/api/admin/action", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity: "sponsor",
          id: sponsor.id,
          data: { name: name.trim(), websiteUrl, contactEmail, tier, description, isActive },
        }),
      })
      if (!res.ok) throw new Error()
      setOpen(false)
      router.refresh()
    } catch {
      alert("Failed to update sponsor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setOpen(true)}>
        <Pencil className="h-4 w-4" />
      </Button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setOpen(false)}>
          <div className="w-full max-w-lg rounded-lg border bg-background p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Edit Sponsor</h3>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Name</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} className="h-9" required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Website</label>
                  <Input value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} className="h-9" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Contact Email</label>
                  <Input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="h-9" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Tier</label>
                  <select value={tier} onChange={(e) => setTier(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
                    <option value="basic">Basic</option>
                    <option value="silver">Silver</option>
                    <option value="gold">Gold</option>
                    <option value="platinum">Platinum</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Description</label>
                <Input value={description} onChange={(e) => setDescription(e.target.value)} className="h-9" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isActive" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 rounded border-gray-300" />
                <label htmlFor="isActive" className="text-sm">Active</label>
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit" size="sm" disabled={loading}>
                  {loading && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                  Save
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
