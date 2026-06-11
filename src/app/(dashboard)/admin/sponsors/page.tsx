import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/rbac"
import { DeleteButton } from "@/components/admin/delete-button"
import { Badge } from "@/components/ui/badge"
import { AddSponsorForm } from "./add-form"
import { EditSponsorForm } from "./edit-form"

export default async function AdminSponsorsPage() {
  await requireRole("ADMIN")

  const sponsors = await prisma.sponsor.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { rewards: true } } },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sponsors</h1>
          <p className="text-sm text-muted-foreground">
            {sponsors.length} sponsor{sponsors.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <AddSponsorForm />

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Website</th>
              <th className="px-4 py-3 text-left font-medium">Contact</th>
              <th className="px-4 py-3 text-center font-medium">Tier</th>
              <th className="px-4 py-3 text-center font-medium">Rewards</th>
              <th className="px-4 py-3 text-center font-medium">Status</th>
              <th className="px-4 py-3 text-center font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sponsors.map((s) => (
              <tr key={s.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3">
                  <div className="font-medium">{s.name}</div>
                  {s.description && (
                    <div className="text-xs text-muted-foreground truncate max-w-[200px]">{s.description}</div>
                  )}
                </td>
                <td className="px-4 py-3">
                  {s.websiteUrl ? (
                    <a href={s.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs">
                      {new URL(s.websiteUrl).hostname}
                    </a>
                  ) : <span className="text-muted-foreground">—</span>}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{s.contactEmail ?? "—"}</td>
                <td className="px-4 py-3 text-center">
                  <Badge variant="outline" className="text-[10px] uppercase">
                    {s.tier}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-center text-sm">{s._count.rewards}</td>
                <td className="px-4 py-3 text-center">
                  <Badge variant={s.isActive ? "default" : "secondary"} className="text-xs">
                    {s.isActive ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1">
                    <EditSponsorForm sponsor={s} />
                    <DeleteButton entity="sponsor" id={s.id} />
                  </div>
                </td>
              </tr>
            ))}
            {sponsors.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                  No sponsors added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
