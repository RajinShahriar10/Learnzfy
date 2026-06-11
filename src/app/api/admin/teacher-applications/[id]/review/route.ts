import { requireRole } from "@/lib/rbac"
import { reviewApplication } from "@/lib/teacher-application"
import { ok, serverError, err, validation } from "@/lib/api-helpers"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireRole("ADMIN")
    const { id } = await params
    const body = await request.json()

    if (!body.action || !["approve", "reject", "request_changes"].includes(body.action)) {
      return validation("action must be approve, reject, or request_changes")
    }
    if ((body.action === "reject" || body.action === "request_changes") && !body.reason?.trim()) {
      return validation("reason is required for this action")
    }

    const application = await reviewApplication(id, body.action, user.id, body.reason)

    await prisma.notification.create({
      data: {
        userId: application.userId,
        title: "Application Update",
        message:
          body.action === "approve"
            ? "Congratulations! Your teacher application has been approved. You can now create and publish courses."
            : body.action === "reject"
              ? `Your teacher application has been rejected. Reason: ${body.reason}`
              : `Changes requested for your teacher application: ${body.reason}`,
        type: "application_updated",
        link: "/teacher/apply",
      },
    })

    return ok(application)
  } catch (error: any) {
    if (error.message?.includes("already approved") || error.message?.includes("already rejected")) {
      return err(error.message, 409)
    }
    return serverError(error)
  }
}
