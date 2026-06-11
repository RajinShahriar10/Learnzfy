import { NextResponse } from "next/server"
import { requireRole } from "@/lib/rbac"
import { restoreCertificate } from "@/lib/certificate-utils"
import { ok, serverError, validation } from "@/lib/api-helpers"

export async function POST(request: Request) {
  try {
    await requireRole("ADMIN")
    const { id } = await request.json()
    if (!id) return validation("id is required")
    const certificate = await restoreCertificate(id)
    return ok(certificate)
  } catch (error) {
    return serverError(error)
  }
}
