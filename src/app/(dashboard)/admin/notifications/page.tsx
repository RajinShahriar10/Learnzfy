import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/rbac"
import { DeleteButton } from "@/components/admin/delete-button"
import { SendNotificationForm } from "./send-form"

export default async function AdminNotificationsPage() {
  await requireRole("ADMIN")

  const notifications = await prisma.notification.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
        <p className="text-sm text-muted-foreground">
          Send and manage platform notifications
        </p>
      </div>

      <SendNotificationForm />

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">User</th>
              <th className="px-4 py-3 text-left font-medium">Title</th>
              <th className="px-4 py-3 text-left font-medium">Message</th>
              <th className="px-4 py-3 text-center font-medium">Type</th>
              <th className="px-4 py-3 text-center font-medium">Read</th>
              <th className="px-4 py-3 text-left font-medium">Sent</th>
              <th className="px-4 py-3 text-center font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((n) => (
              <tr key={n.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 text-muted-foreground">
                  {n.user.name ?? n.user.email}
                </td>
                <td className="px-4 py-3 font-medium">{n.title}</td>
                <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">
                  {n.message}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="inline-block rounded-full bg-muted px-2 py-0.5 text-xs capitalize">
                    {n.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {n.isRead ? (
                    <span className="text-emerald-600 text-xs">Read</span>
                  ) : (
                    <span className="text-amber-600 text-xs">Unread</span>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(n.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-center">
                  <DeleteButton entity="notification" id={n.id} />
                </td>
              </tr>
            ))}
            {notifications.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                  No notifications sent yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
