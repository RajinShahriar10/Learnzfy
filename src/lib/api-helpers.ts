import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { hasRole } from "@/lib/rbac"
import { logger } from "@/lib/logger"
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit"
import type { Role } from "@/config/routes"

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status })
}

export function created<T>(data: T) {
  return NextResponse.json({ success: true, data }, { status: 201 })
}

export function paginated<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
) {
  return NextResponse.json({
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  })
}

export function err(error: string, status = 400) {
  logger.warn("API error response", { error, status })
  return NextResponse.json({ success: false, error }, { status })
}

export function unauthorized() {
  return err("Authentication required", 401)
}

export function forbidden() {
  return err("You do not have permission to perform this action", 403)
}

export function notFound(entity = "Resource") {
  return err(`${entity} not found`, 404)
}

export function validation(message: string) {
  return err(message, 422)
}

export function serverError(error: unknown) {
  const message = error instanceof Error ? error.message : "Internal server error"
  logger.error("Internal server error", {
    message,
    stack: error instanceof Error ? error.stack : undefined,
  })
  return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
}

export async function requireAuth() {
  const session = await auth()
  if (!session?.user?.id) return { session: null, error: unauthorized() as NextResponse }
  return { session, error: null }
}

export async function requireRole(minRole: Role) {
  const { session, error } = await requireAuth()
  if (error) return { session: null, error }
  if (!hasRole(session!.user.role, minRole)) {
    return { session: null, error: forbidden() as NextResponse }
  }
  return { session, error: null }
}

export function parsePagination(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20")))
  return { page, limit, skip: (page - 1) * limit }
}

export function withRateLimit(req: Request, opts?: { max?: number; windowMs?: number }) {
  const key = getRateLimitKey(req)
  const result = rateLimit(key, opts)
  if (!result.allowed) {
    logger.warn("Rate limit exceeded", { key })
    return result.response!
  }
  return null
}
