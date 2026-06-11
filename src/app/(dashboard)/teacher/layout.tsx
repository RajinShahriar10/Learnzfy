import { requireRole } from "@/lib/rbac"
import { TeacherSidebar } from "@/components/layout/teacher-sidebar"
import { ApprovalBanner } from "@/components/teacher/approval-banner"

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireRole("TEACHER")

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <TeacherSidebar />
      <main className="flex-1 lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <ApprovalBanner />
          {children}
        </div>
      </main>
    </div>
  )
}
