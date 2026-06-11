import { NextResponse } from "next/server"
import { requireRole } from "@/lib/rbac"
import { prisma } from "@/lib/prisma"
import { ok, serverError } from "@/lib/api-helpers"

export async function GET(request: Request) {
  try {
    await requireRole("ADMIN")
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") ?? ""
    const status = searchParams.get("status") ?? "ALL"

    const where: any = {}

    if (query) {
      where.OR = [
        { studentName: { contains: query, mode: "insensitive" } },
        { courseName: { contains: query, mode: "insensitive" } },
        { verificationId: { contains: query, mode: "insensitive" } },
      ]
    }

    if (status !== "ALL") {
      where.status = status
    }

    const [certificates, total] = await Promise.all([
      prisma.certificate.findMany({
        where,
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { issuedAt: "desc" },
        take: 100,
      }),
      prisma.certificate.count({ where }),
    ])

    return ok({ certificates, total })
  } catch (error) {
    return serverError(error)
  }
}
