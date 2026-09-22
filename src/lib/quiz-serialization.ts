export function deserializeCorrectAnswer(type: string, value: string): string | string[] {
  if (type === "multiple-select") {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) {
        const strings = parsed.filter((s: unknown) => typeof s === "string")
        if (strings.length > 0) return strings
      }
    } catch {
      // not JSON, fall through to raw string
    }
  }
  return value
}