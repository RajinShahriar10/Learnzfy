export function extractYouTubeVideoId(input: string): string | null {
  if (!input) return null
  const value = input.trim()
  const patterns = [
    /(?:youtube\.com\/watch\?(?:.*&)?v=)([A-Za-z0-9_-]{11})/,
    /(?:youtu\.be\/)([A-Za-z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})/,
    /(?:youtube\.com\/live\/)([A-Za-z0-9_-]{11})/,
    /(?:youtube\.com\/v\/)([A-Za-z0-9_-]{11})/,
  ]
  for (const pattern of patterns) {
    const match = value.match(pattern)
    if (match) return match[1]
  }
  return null
}

export function toYouTubeEmbedUrl(input: string): string | null {
  const id = extractYouTubeVideoId(input)
  if (!id) return null
  return `https://www.youtube.com/embed/${id}`
}

export function isValidYouTubeUrl(input: string): boolean {
  return extractYouTubeVideoId(input) !== null
}

export function getYouTubeThumbnail(input: string): string | null {
  const id = extractYouTubeVideoId(input)
  if (!id) return null
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
}