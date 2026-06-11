import { requireRole } from "@/lib/rbac"
import { SETTING_KEYS, SETTING_GROUPS } from "@/lib/settings"
import { prisma } from "@/lib/prisma"
import { WebsiteSettingsForm } from "./settings-form"

async function loadSettings(): Promise<Record<string, string>> {
  const keys = Object.values(SETTING_KEYS)
  const settings = await prisma.setting.findMany({
    where: { key: { in: keys } },
  })
  const map: Record<string, string> = {}
  for (const s of settings) map[s.key] = s.value
  for (const key of keys) if (!(key in map)) map[key] = ""
  return map
}

export default async function AdminWebsitePage() {
  await requireRole("ADMIN")

  const settings = await loadSettings()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Website Management</h1>
        <p className="text-sm text-muted-foreground">
          Customize your entire website without touching code.
        </p>
      </div>

      <WebsiteSettingsForm
        groups={SETTING_GROUPS}
        initialSettings={settings}
      />
    </div>
  )
}
