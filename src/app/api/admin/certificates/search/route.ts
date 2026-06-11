import { NextResponse } from "next/server"
import { requireRole } from "@/lib/rbac"
import { searchCertificatesAdmin } from "@/lib/certificate-utils"
import { ok, serverError } from "@/lib/api-helpers"

export async function GET(request: Request) {
  try {
    await requireRole("ADMIN")
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") ?? ""
    const status = searchParams.get("status") ?? undefined
    const result = await searchCertificatesAdmin(query, status)
    return ok(result)
  } catch (error) {
    return serverError(error)
  }
}
