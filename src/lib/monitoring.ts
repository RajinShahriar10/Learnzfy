import { logger } from "./logger"

interface ErrorReport {
  message: string
  stack?: string
  code?: string
  statusCode?: number
  userId?: string
  route?: string
  method?: string
  correlationId?: string
  metadata?: Record<string, unknown>
}

const errors: ErrorReport[] = []
const MAX_STORED = 100

function getCorrelationId(): string {
  return `corr_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

export function reportError(report: ErrorReport) {
  const entry = {
    ...report,
    correlationId: report.correlationId ?? getCorrelationId(),
  }

  logger.error(report.message, {
    code: report.code,
    statusCode: report.statusCode,
    userId: report.userId,
    route: report.route,
    correlationId: entry.correlationId,
    ...report.metadata,
  })

  if (errors.length >= MAX_STORED) errors.shift()
  errors.push(entry)
}

export function getRecentErrors(count = 10): ErrorReport[] {
  return errors.slice(-count)
}

export function createApiErrorHandler(
  route: string,
  method: string,
  userId?: string,
) {
  return (error: unknown, correlationId?: string) => {
    const message = error instanceof Error ? error.message : "Unknown error"
    const stack = error instanceof Error ? error.stack : undefined

    reportError({
      message,
      stack,
      route,
      method,
      userId,
      correlationId: correlationId ?? getCorrelationId(),
      metadata: {
        errorType: error instanceof Error ? error.constructor.name : typeof error,
      },
    })
  }
}

export { getCorrelationId }
