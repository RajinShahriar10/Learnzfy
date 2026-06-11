"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DeleteButton } from "@/components/admin/delete-button"
import {
  Plus,
  Loader2,
  Pencil,
  X,
  Gift,
  Coins,
  Percent,
  Tag,
} from "lucide-react"

const typeConfig: Record<string, { icon: typeof Gift; label: string; color: string }> = {
  COUPON: { icon: Tag, label: "Coupon", color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30" },
  DISCOUNT: { icon: Percent, label: "Discount", color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30" },
  PROMO: { icon: Gift, label: "Promo", color: "text-violet-600 bg-violet-100 dark:bg-violet-900/30" },
}

interface RewardItem {
  id: string
  title: string
  description: string | null
  pointsCost: number
  type: string
  value: string
  isActive: boolean
  stock: number | null
  sponsorId: string | null
  createdAt: string
  sponsor: { id: string; name: string } | null
  _count: { redemptions: number }
}

interface SponsorItem {
  id: string
  name: string
}

export function RewardsClient({
  rewards: initial,
  sponsors,
}: {
  rewards: RewardItem[]
  sponsors: SponsorItem[]
}) {
  const router = useRouter()
  const [rewards, setRewards] = useState(initial)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [pointsCost, setPointsCost] = useState("100")
  const [type, setType] = useState("COUPON")
  const [value, setValue] = useState("")
  const [stock, setStock] = useState("")
  const [sponsorId, setSponsorId] = useState("")

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setPointsCost("100")
    setType("COUPON")
    setValue("")
    setStock("")
    setSponsorId("")
    setEditing(null)
    setShowForm(false)
  }

  const startEdit = (r: RewardItem) => {
    setTitle(r.title)
    setDescription(r.description ?? "")
    setPointsCost(String(r.pointsCost))
    setType(r.type)
    setValue(r.value)
    setStock(r.stock !== null ? String(r.stock) : "")
    setSponsorId(r.sponsorId ?? "")
    setEditing(r.id)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)

    const data = {
      title: title.trim(),
      description: description.trim() || undefined,
      pointsCost: parseInt(pointsCost),
      type,
      value,
      stock: stock ? parseInt(stock) : undefined,
      sponsorId: sponsorId || undefined,
      isActive: true,
    }

    try {
      const res = await fetch("/api/admin/action", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity: "reward",
          ...(editing ? { id: editing } : {}),
          data,
        }),
      })
      if (!res.ok) throw new Error()
      resetForm()
      router.refresh()
    } catch {
      alert("Failed to save reward")
    } finally {
      setLoading(false)
    }
  }

  const addForm = showForm && (
    <form onSubmit={handleSubmit} className="rounded-lg border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">{editing ? "Edit Reward" : "Add Reward"}</h3>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={resetForm}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Title</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. 20% Off Course" className="h-9" required />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
            <option value="COUPON">Coupon</option>
            <option value="DISCOUNT">Discount</option>
            <option value="PROMO">Promo</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Points Cost</label>
          <Input type="number" value={pointsCost} onChange={(e) => setPointsCost(e.target.value)} className="h-9" min={1} required />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Value</label>
          <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 20, SAVE20" className="h-9" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Stock (leave empty = unlimited)</label>
          <Input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="h-9" min={0} />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Sponsor (optional)</label>
          <select value={sponsorId} onChange={(e) => setSponsorId(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
            <option value="">No sponsor</option>
            {sponsors.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">Description</label>
        <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the reward" className="h-9" />
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={loading}>
          {loading && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
          {editing ? "Update" : "Create"}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={resetForm}>Cancel</Button>
      </div>
    </form>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rewards</h1>
          <p className="text-sm text-muted-foreground">{rewards.length} rewards</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true) }} size="sm" className="gap-1" disabled={showForm}>
          <Plus className="h-4 w-4" /> Add Reward
        </Button>
      </div>

      {addForm}

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Title</th>
              <th className="px-4 py-3 text-left font-medium">Type</th>
              <th className="px-4 py-3 text-center font-medium">Cost</th>
              <th className="px-4 py-3 text-center font-medium">Stock</th>
              <th className="px-4 py-3 text-center font-medium">Redeemed</th>
              <th className="px-4 py-3 text-left font-medium">Sponsor</th>
              <th className="px-4 py-3 text-center font-medium">Status</th>
              <th className="px-4 py-3 text-center font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rewards.map((r) => {
              const tc = typeConfig[r.type] || typeConfig.COUPON
              const Icon = tc.icon
              return (
                <tr key={r.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="font-medium">{r.title}</div>
                    {r.description && <div className="text-xs text-muted-foreground truncate max-w-[180px]">{r.description}</div>}
                    {r.value && <div className="text-xs text-muted-foreground">Value: {r.value}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <div className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${tc.color}`}>
                      <Icon className="h-3 w-3" />
                      {tc.label}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center font-medium tabular-nums">{r.pointsCost.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center tabular-nums">{r.stock !== null ? r.stock : <span className="text-muted-foreground">&infin;</span>}</td>
                  <td className="px-4 py-3 text-center tabular-nums">{r._count.redemptions}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{r.sponsor?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={r.isActive ? "default" : "secondary"} className="text-xs">
                      {r.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => startEdit(r)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <DeleteButton entity="reward" id={r.id} />
                    </div>
                  </td>
                </tr>
              )
            })}
            {rewards.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">No rewards yet. Create your first reward to get started.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
