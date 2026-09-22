export interface AiConfig {
  provider: string
  baseUrl: string
  apiKey: string
  model: string
}

const PRESETS: Record<string, { baseUrl: string; model: string }> = {
  gemini: {
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
    model: "gemini-3.6-flash",
  },
  groq: {
    baseUrl: "https://api.groq.com/openai/v1",
    model: "llama-3.3-70b-versatile",
  },
  openrouter: {
    baseUrl: "https://openrouter.ai/api/v1",
    model: "meta-llama/llama-3.3-70b-instruct:free",
  },
  cerebras: {
    baseUrl: "https://api.cerebras.ai/v1",
    model: "llama-3.3-70b",
  },
}

export function getAiConfig(): AiConfig | null {
  const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase()
  const apiKey = process.env.AI_API_KEY || process.env.GEMINI_API_KEY || process.env.GROQ_API_KEY || ""
  if (!apiKey) return null

  const preset = PRESETS[provider] || PRESETS.gemini
  return {
    provider,
    baseUrl: process.env.AI_BASE_URL || preset.baseUrl,
    apiKey,
    model: process.env.AI_MODEL || preset.model,
  }
}

export function isAiConfigured(): boolean {
  return getAiConfig() !== null
}

export function aiModeLabel(): string {
  const config = getAiConfig()
  if (!config) return "Smart offline engine"
  return `${config.provider} · ${config.model}`
}