import { NextResponse } from "next/server"
import { requireRole } from "@/lib/rbac"
import { revokeCertificate } from "@/lib/certificate-utils"
import { ok, serverError, validation } from "@/lib/api-helpers"

export async function POST(request: Request) {
  try {
    await requireRole("ADMIN")
    const { id, reason } = await request.json()
    if (!id || !reason) return validation("id and reason are required")
    const certificate = await revokeCertificate(id, reason)
    return ok(certificate)
  } catch (error) {
    return serverError(error)
  }
}
