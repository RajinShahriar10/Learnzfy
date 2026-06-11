import { NextResponse } from "next/server"
import { logger } from "@/lib/logger"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    logger.info("Web Vital", {
      name: body.name,
      value: body.value,
      rating: body.rating,
      url: body.url,
    })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false }, { status: 400 })
  }
}
