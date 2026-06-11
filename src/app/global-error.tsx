"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
          <div className="mx-auto max-w-md text-center">
            <h1 className="mb-4 text-2xl font-bold">Critical Error</h1>
            <p className="mb-6 text-muted-foreground">
              A critical error occurred. Please try refreshing the page.
            </p>
            {process.env.NODE_ENV === "development" && (
              <pre className="mb-6 overflow-auto rounded-md bg-muted p-4 text-left text-xs">
                {error.stack ?? error.message}
              </pre>
            )}
            <button
              onClick={() => reset()}
              className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
