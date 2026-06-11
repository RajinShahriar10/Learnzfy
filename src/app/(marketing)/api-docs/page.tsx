"use client"

import { useEffect, useRef } from "react"
import { openapiSpec } from "@/lib/openapi-spec"

export default function ApiDocsPage() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const script = document.createElement("script")
    script.src = "https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"
    script.onload = () => {
      const SwaggerUI = (window as any).SwaggerUIBundle
      if (SwaggerUI && containerRef.current) {
        SwaggerUI({
          spec: openapiSpec,
          dom_id: "#swagger-container",
          deepLinking: true,
          presets: [SwaggerUI.Presets.apis],
          layout: "BaseLayout",
          defaultModelsExpandDepth: -1,
          docExpansion: "list",
        })
      }
    }
    document.body.appendChild(script)

    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://unpkg.com/swagger-ui-dist@5/swagger-ui.css"
    document.head.appendChild(link)

    return () => {
      document.body.removeChild(script)
      document.head.removeChild(link)
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">API Documentation</h1>
          <p className="mt-2 text-muted-foreground">
            Learnzfy API v1 — Base URL: <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">/api/v1</code>
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <EndpointBadge method="GET" />
            <EndpointBadge method="POST" />
            <EndpointBadge method="PUT" />
            <EndpointBadge method="DELETE" />
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-yellow-400" />
              Auth required
            </span>
          </div>
        </div>
        <div
          id="swagger-container"
          ref={containerRef}
          className="[&_.swagger-ui]:bg-transparent [&_.swagger-ui_.info]:hidden [&_.swagger-ui_.scheme-container]:bg-muted/30 [&_.swagger-ui_.scheme-container]:rounded-lg [&_.swagger-ui_.opblock-tag]:text-foreground [&_.swagger-ui_.opblock-tag]:border-muted [&_.swagger-ui_.opblock-summary-description]:text-muted-foreground [&_.swagger-ui_.opblock]:border-muted [&_.swagger-ui_.opblock]:rounded-lg [&_.swagger-ui_.opblock-summary]:hover:bg-muted/20 [&_.swagger-ui_.opblock-summary]:!border-0 [&_.swagger-ui_.opblock-body]:bg-muted/10 [&_.swagger-ui_.opblock-body]:!border-0 [&_.swagger-ui_.opblock-description-wrapper]:text-sm [&_.swagger-ui_.opblock-description-wrapper_p]:text-muted-foreground [&_.swagger-ui_.parameters-col_description_input]:bg-background [&_.swagger-ui_.parameters-col_description_input]:border-input [&_.swagger-ui_.parameters-col_description_input]:rounded-md [&_.swagger-ui_.body-param__text]:bg-background [&_.swagger-ui_.body-param__text]:border-input [&_.swagger-ui_.btn]:!rounded-md [&_.swagger-ui_.btn.execute]:bg-primary [&_.swagger-ui_.btn.execute]:text-primary-foreground [&_.swagger-ui_.btn.execute]:hover:bg-primary/90 [&_.swagger-ui_.responses-inner]:bg-muted/20 [&_.swagger-ui_.response-col_status]:font-medium [&_.swagger-ui_.model-box]:bg-muted/20 [&_.swagger-ui_.model-box]:rounded-md [&_.swagger-ui_.model]:text-muted-foreground [&_.swagger-ui_.model-title]:text-foreground [&_.swagger-ui_]:text-foreground [&_.swagger-ui_.markdown_p]:text-muted-foreground [&_.swagger-ui_.parameter__name]:text-foreground [&_.swagger-ui_.parameter__type]:text-muted-foreground [&_.swagger-ui_.prop-name]:text-foreground [&_.swagger-ui_.prop-type]:text-muted-foreground [&_.swagger-ui_.info]:mb-0 [&_h2]:text-foreground [&_.swagger-ui_.opblock-summary-method]:!rounded-md [&_.swagger-ui_.opblock-summary-method.get]:!bg-blue-500 [&_.swagger-ui_.opblock-summary-method.post]:!bg-emerald-500 [&_.swagger-ui_.opblock-summary-method.put]:!bg-amber-500 [&_.swagger-ui_.opblock-summary-method.delete]:!bg-red-500"
        />
      </div>
    </div>
  )
}

function EndpointBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET: "bg-blue-500",
    POST: "bg-emerald-500",
    PUT: "bg-amber-500",
    DELETE: "bg-red-500",
  }
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-bold text-white ${colors[method] ?? "bg-muted-foreground"}`}>
      {method}
    </span>
  )
}
