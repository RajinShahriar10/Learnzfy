"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Save } from "lucide-react"

interface SettingField {
  key: string
  label: string
  type: string
  default: string
}

interface SettingsGroup {
  id: string
  label: string
  keys: SettingField[]
}

interface WebsiteSettingsFormProps {
  groups: SettingsGroup[]
  initialSettings: Record<string, string>
}

export function WebsiteSettingsForm({
  groups,
  initialSettings,
}: WebsiteSettingsFormProps) {
  const [settings, setSettings] = useState<Record<string, string>>(initialSettings)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSaved(false)

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      })
      if (!res.ok) throw new Error()
      setSaved(true)
      router.refresh()
    } catch {
      alert("Failed to save settings")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {groups.map((group) => (
        <div
          key={group.id}
          className="space-y-4 rounded-lg border p-6"
        >
          <h2 className="text-lg font-semibold">{group.label}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {group.keys.map((field) => (
              <div key={field.key} className="space-y-1.5">
                <label className="text-sm font-medium text-muted-foreground">
                  {field.label}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    value={settings[field.key] ?? field.default}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
                    placeholder={field.default}
                  />
                ) : (
                  <Input
                    type={field.type}
                    value={settings[field.key] ?? field.default}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder={field.default}
                    className="h-9"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={loading} className="gap-2">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {loading ? "Saving..." : "Save All Settings"}
        </Button>
        {saved && (
          <span className="text-sm text-emerald-600 font-medium">
            All settings saved successfully!
          </span>
        )}
      </div>
    </form>
  )
}
