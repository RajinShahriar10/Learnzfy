import { NextRequest } from "next/server"
import { ok, err, requireRole, serverError, withRateLimit } from "@/lib/api-helpers"
import { getSiteContent, saveSiteSection, saveSiteContent, sanitizeContent } from "@/lib/cms/content"
import type { SiteContent } from "@/lib/cms/types"

export async function GET() {
  const { error } = await requireRole("ADMIN")
  if (error) return error
  try {
    const content = await getSiteContent()
    return ok(content)
  } catch (e) {
    return serverError(e)
  }
}

export async function PUT(request: NextRequest) {
  const { error } = await requireRole("ADMIN")
  if (error) return error
  const rate = withRateLimit(request, { max: 30, windowMs: 60_000 })
  if (rate) return rate

  try {
    const body = await request.json()
    if (!body || typeof body !== "object") {
      return err("Request body must be a JSON object")
    }

    if (typeof body.sectionId === "string" && !body.full) {
      if (!body.value || typeof body.value !== "object") {
        return err("Missing section value")
      }
      const content = await saveSiteSection(body.sectionId, body.value)
      return ok(content)
    }

    const content = saveSiteContent(body as SiteContent)
    return ok(content)
  } catch (e) {
    return serverError(e)
  }
}

export async function DELETE() {
  const { error } = await requireRole("ADMIN")
  if (error) return error
  try {
    return ok(sanitizeContent({}))
  } catch (e) {
    return serverError(e)
  }
}