type LogLevel = "debug" | "info" | "warn" | "error"

const levels: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

const currentLevel: LogLevel =
  (process.env.NEXT_PUBLIC_LOG_LEVEL as LogLevel) ||
  (process.env.NODE_ENV === "production" ? "info" : "debug")

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  correlationId?: string
  [key: string]: unknown
}

function createEntry(level: LogLevel, message: string, meta?: Record<string, unknown>): LogEntry {
  return {
    level,
    message,
    timestamp: new Date().toISOString(),
    correlationId: meta?.correlationId as string | undefined,
    ...meta,
  }
}

function shouldLog(level: LogLevel): boolean {
  return levels[level] >= levels[currentLevel]
}

function stringify(entry: LogEntry): string {
  if (process.env.NODE_ENV === "production") {
    return JSON.stringify(entry)
  }
  const { level, message, timestamp, ...rest } = entry
  const extras = Object.keys(rest).length ? JSON.stringify(rest) : ""
  return `[${timestamp}] [${level.toUpperCase()}] ${message} ${extras}`.trim()
}

export const logger = {
  debug(message: string, meta?: Record<string, unknown>) {
    if (!shouldLog("debug")) return
    const entry = createEntry("debug", message, meta)
    console.debug(stringify(entry))
  },

  info(message: string, meta?: Record<string, unknown>) {
    if (!shouldLog("info")) return
    const entry = createEntry("info", message, meta)
    console.info(stringify(entry))
  },

  warn(message: string, meta?: Record<string, unknown>) {
    if (!shouldLog("warn")) return
    const entry = createEntry("warn", message, meta)
    console.warn(stringify(entry))
  },

  error(message: string, meta?: Record<string, unknown>) {
    if (!shouldLog("error")) return
    const entry = createEntry("error", message, meta)
    console.error(stringify(entry))
  },
}
