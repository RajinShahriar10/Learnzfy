import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/rbac"
import { DeleteButton } from "@/components/admin/delete-button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default async function AdminCoursesPage() {
  await requireRole("ADMIN")

  const courses = await prisma.course.findMany({
    include: { teacher: true, category: true, _count: { select: { enrollments: true, modules: true } } },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Courses</h1>
          <p className="text-sm text-muted-foreground">
            {courses.length} course{courses.length !== 1 ? "s" : ""} on the platform
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Title</th>
              <th className="px-4 py-3 text-left font-medium">Teacher</th>
              <th className="px-4 py-3 text-left font-medium">Category</th>
              <th className="px-4 py-3 text-center font-medium">Modules</th>
              <th className="px-4 py-3 text-center font-medium">Students</th>
              <th className="px-4 py-3 text-center font-medium">Status</th>
              <th className="px-4 py-3 text-center font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">
                  <Link href={`/teacher/courses/${c.id}`} className="hover:text-primary transition-colors">
                    {c.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{c.teacher.name ?? "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.category?.name ?? "—"}</td>
                <td className="px-4 py-3 text-center">{c._count.modules}</td>
                <td className="px-4 py-3 text-center">{c._count.enrollments}</td>
                <td className="px-4 py-3 text-center">
                  <Badge variant={c.isPublished ? "default" : "secondary"} className="text-xs">
                    {c.isPublished ? "Published" : "Draft"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Link
                      href={`/teacher/courses/${c.id}`}
                      className="text-xs text-primary hover:underline"
                    >
                      Edit
                    </Link>
                    <DeleteButton entity="course" id={c.id} />
                  </div>
                </td>
              </tr>
            ))}
            {courses.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                  No courses created yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
