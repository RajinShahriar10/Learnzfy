import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/rbac"
import { DeleteButton } from "@/components/admin/delete-button"
import { AddBadgeForm } from "./add-form"

export default async function AdminBadgesPage() {
  await requireRole("ADMIN")

  const badges = await prisma.badge.findMany({
    include: { _count: { select: { users: true } } },
    orderBy: { name: "asc" },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Badges</h1>
          <p className="text-sm text-muted-foreground">
            {badges.length} badge{badges.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <AddBadgeForm />

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Slug</th>
              <th className="px-4 py-3 text-left font-medium">Criteria</th>
              <th className="px-4 py-3 text-center font-medium">Awarded</th>
              <th className="px-4 py-3 text-center font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {badges.map((b) => (
              <tr key={b.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{b.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{b.slug}</td>
                <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">
                  {b.criteria ?? "—"}
                </td>
                <td className="px-4 py-3 text-center">{b._count.users}</td>
                <td className="px-4 py-3 text-center">
                  <DeleteButton entity="badge" id={b.id} />
                </td>
              </tr>
            ))}
            {badges.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                  No badges created yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
