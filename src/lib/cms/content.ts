import "server-only"
import { prisma } from "@/lib/prisma"
import { getCache, setCache, delCache } from "@/lib/cache"
import { DEFAULT_SITE_CONTENT } from "./defaults"
import type { SiteContent } from "./types"

export const CMS_STORE_KEY = "cms_site_content"

const CACHE_KEY = "cms:site-content"
const CACHE_TTL = 60_000

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

export function deepMerge<T>(base: T, override: unknown): T {
  if (isPlainObject(base) && isPlainObject(override)) {
    const result: Record<string, unknown> = { ...base }
    for (const key of Object.keys(override)) {
      result[key] = deepMerge(base[key], override[key])
    }
    return result as T
  }
  if (override === undefined) return base
  return override as T
}

export function sanitizeContent(value: unknown): SiteContent {
  return deepMerge(DEFAULT_SITE_CONTENT, isPlainObject(value) ? value : {})
}

export async function getSiteContent(): Promise<SiteContent> {
  const cached = getCache<SiteContent>(CACHE_KEY)
  if (cached) return cached

  try {
    const setting = await prisma.setting.findUnique({
      where: { key: CMS_STORE_KEY },
    })
    let stored: unknown = {}
    if (setting?.value) {
      try {
        stored = JSON.parse(setting.value)
      } catch {
        stored = {}
      }
    }
    const content = sanitizeContent(stored)
    setCache(CACHE_KEY, content, CACHE_TTL)
    return content
  } catch {
    return DEFAULT_SITE_CONTENT
  }
}

export async function saveSiteContent(content: SiteContent): Promise<SiteContent> {
  const sanitized = sanitizeContent(content)
  await prisma.setting.upsert({
    where: { key: CMS_STORE_KEY },
    create: { key: CMS_STORE_KEY, value: JSON.stringify(sanitized) },
    update: { value: JSON.stringify(sanitized) },
  })
  const merged = sanitizeContent(sanitized)
  setCache(CACHE_KEY, merged, CACHE_TTL)
  return merged
}

export async function saveSiteSection(sectionId: string, value: unknown): Promise<SiteContent> {
  const current = await getSiteContent()
  const next = { ...current, [sectionId]: deepMerge((current as unknown as Record<string, unknown>)[sectionId], value) }
  return saveSiteContent(next as SiteContent)
}

export function invalidateSiteContent(): void {
  delCache(CACHE_KEY)
}