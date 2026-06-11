import { requireRole } from "@/lib/rbac"
import { StudentSidebar } from "@/components/layout/student-sidebar"

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireRole("STUDENT")

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <StudentSidebar />
      <main className="flex-1 lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}
