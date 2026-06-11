import { NextResponse } from "next/server"

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

interface RateLimitConfig {
  max: number
  windowMs: number
  message?: string
}

const DEFAULTS: RateLimitConfig = {
  max: 60,
  windowMs: 60_000,
  message: "Too many requests, please try again later.",
}

export function rateLimit(
  identifier: string,
  config: Partial<RateLimitConfig> = {},
): { allowed: boolean; remaining: number; resetIn: number; response?: NextResponse } {
  const { max, windowMs, message } = { ...DEFAULTS, ...config }
  const now = Date.now()

  let entry = store.get(identifier)

  if (!entry || entry.resetAt < now) {
    entry = { count: 0, resetAt: now + windowMs }
    store.set(identifier, entry)
  }

  entry.count++
  const remaining = Math.max(0, max - entry.count)
  const resetIn = entry.resetAt - now

  if (entry.count > max) {
    return {
      allowed: false,
      remaining: 0,
      resetIn,
      response: NextResponse.json(
        { success: false, error: message },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil(resetIn / 1000)),
            "X-RateLimit-Limit": String(max),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(entry.resetAt),
          },
        },
      ),
    }
  }

  return { allowed: true, remaining, resetIn }
}

export function getRateLimitKey(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for")
  const ip = forwarded?.split(",")[0]?.trim() ?? "unknown"
  return `rl:${ip}`
}

export function getUserRateLimitKey(userId: string): string {
  return `rl:user:${userId}`
}

export function clearRateLimits(): void {
  store.clear()
}
