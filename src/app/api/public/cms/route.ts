import { NextRequest } from "next/server"
import { ok, err } from "@/lib/api-helpers"
import { getSiteContent } from "@/lib/cms/content"

export async function GET(request: NextRequest) {
  try {
    const section = request.nextUrl.searchParams.get("section")
    const content = await getSiteContent()
    if (!section) return ok(content)
    const value = (content as unknown as Record<string, unknown>)[section]
    if (value === undefined) return err("Unknown section", 404)
    return ok(value)
  } catch {
    return err("Failed to load site content", 500)
  }
}