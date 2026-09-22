import { getAiConfig } from "./providers"
import { logger } from "@/lib/logger"

export interface AiMessage {
  role: "system" | "user" | "assistant"
  content: string
}

export interface AiCompleteOptions {
  system?: string
  messages: AiMessage[]
  json?: boolean
  temperature?: number
  maxTokens?: number
}

export class AiNotConfiguredError extends Error {
  constructor() {
    super("AI provider is not configured")
    this.name = "AiNotConfiguredError"
  }
}

export async function aiComplete(opts: AiCompleteOptions): Promise<string> {
  const config = getAiConfig()
  if (!config) throw new AiNotConfiguredError()

  const payload: Record<string, unknown> = {
    model: config.model,
    messages: [
      ...(opts.system ? [{ role: "system" as const, content: opts.system }] : []),
      ...opts.messages,
    ],
    temperature: opts.temperature ?? 0.4,
    max_tokens: opts.maxTokens ?? 1024,
  }
  if (opts.json) payload.response_format = { type: "json_object" }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 60000)

  try {
    const res = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })

    if (!res.ok) {
      const body = await res.text().catch(() => "")
      logger.error("AI provider error", { status: res.status, body: body.slice(0, 500) })
      throw new Error(`AI provider returned ${res.status}`)
    }

    const data = await res.json()
    const content = data?.choices?.[0]?.message?.content
    if (!content) throw new Error("AI provider returned an empty response")
    return typeof content === "string" ? content : JSON.stringify(content)
  } finally {
    clearTimeout(timeout)
  }
}

export async function aiCompleteJson<T>(
  opts: AiCompleteOptions,
  fallback: T
): Promise<T> {
  try {
    const raw = await aiComplete({ ...opts, json: true, messages: opts.messages })
    const parsed = JSON.parse(raw) as T
    return parsed && typeof parsed === "object" ? parsed : fallback
  } catch (error) {
    if (!(error instanceof AiNotConfiguredError)) {
      logger.warn("AI JSON generation failed, using fallback", { error: (error as Error).message })
    }
    return fallback
  }
}

export function safeAiCall<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  return fn().catch((error: unknown) => {
    if (!(error instanceof AiNotConfiguredError)) {
      logger.warn("AI call failed, using fallback", { error: (error as Error)?.message })
    }
    return fallback
  })
}