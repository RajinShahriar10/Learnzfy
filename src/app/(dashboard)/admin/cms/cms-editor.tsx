"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Loader2, Save, Plus, Trash2, ChevronUp, ChevronDown, RotateCcw } from "lucide-react"
import type { CmsFieldDef, CmsSectionDef } from "@/lib/cms/sections"
import type { SiteContent } from "@/lib/cms/types"

type Path = (string | number)[]

function getByPath(obj: unknown, path: Path): unknown {
  let current: unknown = obj
  for (const key of path) {
    if (current === null || current === undefined) return undefined
    current = (current as Record<string, unknown>)[key]
  }
  return current
}

function setByPath(obj: unknown, path: Path, value: unknown): unknown {
  if (path.length === 0) return value
  const [head, ...rest] = path
  if (Array.isArray(obj)) {
    const next = [...obj]
    next[head as number] = setByPath(obj[head as number], rest, value)
    return next
  }
  return {
    ...(obj as Record<string, unknown>),
    [head]: setByPath((obj as Record<string, unknown>)?.[head], rest, value),
  }
}

function defaultForFields(fields: CmsFieldDef[]): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const field of fields) {
    if (field.kind === "text") {
      result[field.path] = ""
    } else if (field.kind === "object") {
      result[field.path] = defaultForFields(field.fields)
    } else {
      result[field.path] = []
    }
  }
  return result
}

function defaultListItem(list: Extract<CmsFieldDef, { kind: "list" }>): unknown {
  const scalar = list.fields.length === 1 && list.fields[0].path === "$"
  if (scalar) return ""
  return defaultForFields(list.fields)
}

interface FieldProps {
  field: CmsFieldDef
  obj: unknown
  base: Path
  onPatch: (path: Path, value: unknown) => void
}

function TextField({
  field,
  value,
  onPatch,
}: {
  field: Extract<CmsFieldDef, { kind: "text" }>
  value: string
  onPatch: (value: unknown) => void
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-muted-foreground">{field.label}</Label>
      {field.multiline ? (
        <Textarea
          value={value}
          onChange={(e) => onPatch(e.target.value)}
          placeholder={field.placeholder}
        />
      ) : (
        <Input
          value={value}
          onChange={(e) => onPatch(e.target.value)}
          placeholder={field.placeholder}
        />
      )}
    </div>
  )
}

function Field({ field, obj, base, onPatch }: FieldProps) {
  if (field.kind === "text") {
    const isScalar = field.path === "$"
    const fullPath = isScalar ? base : [...base, field.path]
    const value = (isScalar
      ? typeof obj === "string"
        ? obj
        : ""
      : (getByPath(obj, [field.path]) ?? "")) as string

    return (
      <TextField
        field={field}
        value={value}
        onPatch={(v) => onPatch(fullPath, v)}
      />
    )
  }

  if (field.kind === "object") {
    const path = [...base, field.path]
    const child = getByPath(obj, [field.path])
    return (
      <div className="space-y-3 rounded-lg border border-dashed p-4">
        <p className="text-sm font-semibold">{field.label}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {field.fields.map((sub) => (
            <Field
              key={`${field.path}.${sub.path}`}
              field={sub}
              obj={child}
              base={path}
              onPatch={onPatch}
            />
          ))}
        </div>
      </div>
    )
  }

  const path = [...base, field.path]
  const arr = (getByPath(obj, [field.path]) as unknown[]) ?? []
  return (
    <div className="space-y-3 rounded-lg border border-dashed p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">{field.label}</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPatch(path, [...arr, defaultListItem(field)])}
        >
          <Plus className="h-4 w-4" />
          Add {field.itemLabel}
        </Button>
      </div>
      <div className="space-y-3">
        {arr.map((item, index) => (
          <div key={index} className="space-y-3 rounded-md bg-muted/40 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {field.itemLabel} {index + 1}
              </p>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  disabled={index === 0}
                  onClick={() => {
                    const next = [...arr]
                    ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
                    onPatch(path, next)
                  }}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  disabled={index === arr.length - 1}
                  onClick={() => {
                    const next = [...arr]
                    ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
                    onPatch(path, next)
                  }}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive"
                  onClick={() => onPatch(path, arr.filter((_, i) => i !== index))}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {field.fields.map((sub) => (
                <Field
                  key={`${field.path}.${index}.${sub.path}`}
                  field={sub}
                  obj={item}
                  base={[...path, index]}
                  onPatch={onPatch}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface EditorProps {
  sections: CmsSectionDef[]
  initialContent: SiteContent
}

export function CmsEditor({ sections, initialContent }: EditorProps) {
  const [draft, setDraft] = useState<SiteContent>(initialContent)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const patchSection = (sectionId: string, path: Path, value: unknown) => {
    setDraft((prev) => {
      const section = (prev as unknown as Record<string, unknown>)[sectionId]
      const next = setByPath(section, path, value)
      return { ...prev, [sectionId]: next } as SiteContent
    })
    setSaved(false)
    setError(null)
  }

  const save = async () => {
    setLoading(true)
    setSaved(false)
    setError(null)
    try {
      const res = await fetch("/api/admin/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error ?? "Failed to save")
      }
      const body = await res.json()
      setDraft(body.data as SiteContent)
      setSaved(true)
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save content")
    } finally {
      setLoading(false)
    }
  }

  const resetAll = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/cms", { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to load defaults")
      const body = await res.json()
      setDraft(body.data as SiteContent)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to reset content")
    } finally {
      setLoading(false)
    }
  }

  const tabList = useMemo(
    () => sections.map((section) => section.id),
    [sections]
  )

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Tabs defaultValue={tabList[0]}>
        <TabsList className="flex flex-wrap h-auto gap-1 bg-transparent p-0">
          {sections.map((section) => (
            <TabsTrigger key={section.id} value={section.id} className="border">
              {section.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {sections.map((section) => (
          <TabsContent key={section.id} value={section.id} className="mt-4">
            <div className="space-y-4 rounded-lg border p-6">
              <div>
                <h2 className="text-lg font-semibold">{section.label}</h2>
                <p className="text-sm text-muted-foreground">{section.description}</p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                {section.fields.map((field) => (
                  <Field
                    key={field.path}
                    field={field}
                    obj={(draft as unknown as Record<string, unknown>)[section.id]}
                    base={[]}
                    onPatch={(path, value) => patchSection(section.id, path, value)}
                  />
                ))}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="flex items-center gap-3">
        <Button type="button" disabled={loading} onClick={save} className="gap-2">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {loading ? "Saving..." : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={loading}
          onClick={resetAll}
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Reset to Defaults
        </Button>
        {saved && (
          <span className="text-sm font-medium text-emerald-600">
            Changes saved and live.
          </span>
        )}
      </div>
    </div>
  )
}