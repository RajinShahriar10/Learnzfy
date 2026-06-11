"use client"

import { useState } from "react"
import type { LessonAttachment, LessonResource, CodeExample } from "@/lib/lesson-data"
import { Button } from "@/components/ui/button"
import {
  FileText,
  Download,
  Link,
  ExternalLink,
  Copy,
  Check,
  FileIcon,
  Code,
} from "lucide-react"

const fileTypeIcons: Record<string, typeof FileText> = {
  pdf: FileText,
  zip: FileIcon,
  mp4: FileIcon,
  default: FileText,
}

interface ResourcesPanelProps {
  attachments?: LessonAttachment[]
  resources?: LessonResource[]
  codeExamples?: CodeExample[]
  articleContent?: string
}

export function ResourcesPanel({ attachments, resources, codeExamples }: ResourcesPanelProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-6">
      {resources && resources.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Resources</h3>
          <div className="space-y-2">
            {resources.map((r, i) => (
              <a
                key={i}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg border bg-background p-3 text-sm hover:bg-muted/50 transition-colors group"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
                  {r.type === "link" ? (
                    <Link className="h-4 w-4 text-primary" />
                  ) : (
                    <Download className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate group-hover:text-primary transition-colors">
                    {r.title}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">{r.type}</p>
                </div>
                {r.type === "link" && (
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                )}
              </a>
            ))}
          </div>
        </div>
      )}

      {attachments && attachments.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Attachments</h3>
          <div className="space-y-2">
            {attachments.map((a, i) => {
              const Icon = fileTypeIcons[a.type] || fileTypeIcons.default
              return (
                <a
                  key={i}
                  href={a.url}
                  className="flex items-center gap-3 rounded-lg border bg-background p-3 text-sm hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate group-hover:text-primary transition-colors">
                      {a.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{a.size}</p>
                  </div>
                  <Download className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                </a>
              )
            })}
          </div>
        </div>
      )}

      {codeExamples && codeExamples.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Code Examples</h3>
          <div className="space-y-3">
            {codeExamples.map((ex, i) => (
              <div key={i} className="rounded-lg border bg-background overflow-hidden">
                <div className="flex items-center justify-between bg-muted px-4 py-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <Code className="h-3.5 w-3.5" />
                    {ex.language.toUpperCase()}
                    <span className="text-muted-foreground/60">|</span>
                    {ex.title}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1 text-xs"
                    onClick={() => handleCopy(ex.code, `${i}`)}
                  >
                    {copiedId === `${i}` ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-500" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <pre className="p-4 text-sm overflow-x-auto">
                  <code>{ex.code}</code>
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {(!resources || resources.length === 0) &&
        (!attachments || attachments.length === 0) &&
        (!codeExamples || codeExamples.length === 0) && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-10 w-10 text-muted-foreground/50" />
            <p className="mt-3 text-sm text-muted-foreground">
              No resources available for this lesson
            </p>
          </div>
        )}
    </div>
  )
}
