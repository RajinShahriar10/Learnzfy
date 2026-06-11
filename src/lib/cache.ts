import { logger } from "./logger"

interface CacheEntry<T> {
  data: T
  expiresAt: number
}

const store = new Map<string, CacheEntry<unknown>>()
const DEFAULT_TTL = 60_000 // 1 minute
const MAX_SIZE = 500

function isExpired(entry: CacheEntry<unknown>): boolean {
  return entry.expiresAt < Date.now()
}

export function getCache<T>(key: string): T | null {
  const entry = store.get(key) as CacheEntry<T> | undefined
  if (!entry) return null
  if (isExpired(entry)) {
    store.delete(key)
    return null
  }
  return entry.data
}

export function setCache<T>(key: string, data: T, ttl = DEFAULT_TTL): void {
  if (store.size >= MAX_SIZE) {
    const firstKey = store.keys().next().value
    if (firstKey) store.delete(firstKey)
  }
  store.set(key, { data, expiresAt: Date.now() + ttl })
}

export function delCache(key: string): void {
  store.delete(key)
}

export function clearCache(): void {
  store.clear()
}

export function getCacheStats() {
  const now = Date.now()
  let valid = 0
  let expired = 0
  for (const entry of store.values()) {
    if (entry.expiresAt < now) expired++
    else valid++
  }
  return { total: store.size, valid, expired }
}

export async function cached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl = DEFAULT_TTL,
): Promise<T> {
  const cached = getCache<T>(key)
  if (cached !== null) {
    logger.debug(`Cache hit: ${key}`)
    return cached
  }
  logger.debug(`Cache miss: ${key}`)
  const data = await fetcher()
  setCache(key, data, ttl)
  return data
}

export function cacheKey(...parts: (string | number | undefined)[]): string {
  return parts.filter(Boolean).join(":")
}
