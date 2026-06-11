import { NextResponse } from "next/server"
import { requireRole } from "@/lib/rbac"
import { getVerificationLogs } from "@/lib/certificate-utils"
import { prisma } from "@/lib/prisma"
import { ok, serverError, validation } from "@/lib/api-helpers"

export async function POST(request: Request) {
  try {
    await requireRole("ADMIN")
    const { certificateId } = await request.json()
    if (!certificateId) return validation("certificateId is required")
    const logs = await getVerificationLogs(certificateId)
    return ok(logs)
  } catch (error) {
    return serverError(error)
  }
}

export async function GET(request: Request) {
  try {
    await requireRole("ADMIN")
    const { searchParams } = new URL(request.url)
    const certificateId = searchParams.get("certificateId")
    if (!certificateId) return validation("certificateId query param is required")
    const logs = await getVerificationLogs(certificateId)
    return ok(logs)
  } catch (error) {
    return serverError(error)
  }
}
