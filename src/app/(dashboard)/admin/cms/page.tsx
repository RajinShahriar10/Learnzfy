import { requireRole } from "@/lib/rbac"
import { CMS_SECTIONS } from "@/lib/cms/sections"
import { getSiteContent } from "@/lib/cms/content"
import { CmsEditor } from "./cms-editor"

export default async function AdminCmsPage() {
  await requireRole("ADMIN")

  const content = await getSiteContent()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Site Content</h1>
        <p className="text-sm text-muted-foreground">
          Edit every visible part of the public website — branding, navigation, homepage
          sections, About, Contact, and footer.
        </p>
      </div>

      <CmsEditor sections={CMS_SECTIONS} initialContent={content} />
    </div>
  )
}