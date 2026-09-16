"use client"

import { useCallback, useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Plus,
  Pencil,
  Trash2,
  Video,
  FileText,
  X,
  ChevronDown,
  ChevronRight,
  Loader2,
  MonitorPlay,
} from "lucide-react"
import { toYouTubeEmbedUrl, isValidYouTubeUrl } from "@/lib/youtube"

interface BuilderLesson {
  id: string
  title: string
  description: string
  contentType: "video" | "article" | "quiz" | "code"
  youtubeUrl: string
  duration: string
  isFree: boolean
  order: number
}

interface BuilderModule {
  id: string
  title: string
  description: string
  order: number
  lessons: BuilderLesson[]
}

interface ModuleFormState {
  open: boolean
  editing: BuilderModule | null
  title: string
  description: string
}

interface LessonFormState {
  open: boolean
  moduleId: string
  editing: BuilderLesson | null
  title: string
  youtubeUrl: string
  content: string
  description: string
  duration: string
  isFree: boolean
}

interface CourseContentBuilderProps {
  courseId: string
  onChanged?: () => void
}

async function api(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Request failed")
  }
  return data.data
}

export function CourseContentBuilder({ courseId, onChanged }: CourseContentBuilderProps) {
  const [modules, setModules] = useState<BuilderModule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [moduleForm, setModuleForm] = useState<ModuleFormState>({
    open: false,
    editing: null,
    title: "",
    description: "",
  })
  const [lessonForm, setLessonForm] = useState<LessonFormState>({
    open: false,
    moduleId: "",
    editing: null,
    title: "",
    youtubeUrl: "",
    content: "",
    description: "",
    duration: "",
    isFree: false,
  })
  const [busy, setBusy] = useState(false)

  const loadCourse = useCallback(async () => {
    try {
      const data = await api(`/api/teacher/courses/${courseId}`)
      setModules(data.modules as BuilderModule[])
      setExpanded(Object.fromEntries((data.modules as BuilderModule[]).map((m) => [m.id, true])))
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load course content")
    } finally {
      setLoading(false)
    }
  }, [courseId])

  useEffect(() => {
    loadCourse()
  }, [loadCourse])

  const refresh = async () => {
    await loadCourse()
    onChanged?.()
  }

  const openNewModule = () => {
    setModuleForm({ open: true, editing: null, title: "", description: "" })
  }

  const openEditModule = (mod: BuilderModule) => {
    setModuleForm({ open: true, editing: mod, title: mod.title, description: mod.description })
  }

  const openNewLesson = (moduleId: string) => {
    setLessonForm({
      open: true,
      moduleId,
      editing: null,
      title: "",
      youtubeUrl: "",
      content: "",
      description: "",
      duration: "",
      isFree: false,
    })
  }

  const openEditLesson = (lesson: BuilderLesson, moduleId: string) => {
    setLessonForm({
      open: true,
      moduleId,
      editing: lesson,
      title: lesson.title,
      youtubeUrl: lesson.youtubeUrl,
      content: "",
      description: lesson.description,
      duration: lesson.duration.replace(/\D/g, ""),
      isFree: lesson.isFree,
    })
  }

  const saveModule = async () => {
    if (!moduleForm.title.trim()) return
    setBusy(true)
    try {
      if (moduleForm.editing) {
        await api(`/api/teacher/modules/${moduleForm.editing.id}`, {
          method: "PUT",
          body: JSON.stringify({
            title: moduleForm.title,
            description: moduleForm.description,
          }),
        })
      } else {
        await api("/api/teacher/modules", {
          method: "POST",
          body: JSON.stringify({
            courseId,
            title: moduleForm.title,
            description: moduleForm.description,
          }),
        })
      }
      setModuleForm({ open: false, editing: null, title: "", description: "" })
      await refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save module")
    } finally {
      setBusy(false)
    }
  }

  const deleteModule = async (mod: BuilderModule) => {
    if (!confirm(`Delete module "${mod.title}" and all its lessons?`)) return
    setBusy(true)
    try {
      await api(`/api/teacher/modules/${mod.id}`, { method: "DELETE" })
      await refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete module")
    } finally {
      setBusy(false)
    }
  }

  const saveLesson = async () => {
    if (!lessonForm.title.trim()) return
    setBusy(true)
    try {
      if (lessonForm.editing) {
        await api(`/api/teacher/lessons/${lessonForm.editing.id}`, {
          method: "PUT",
          body: JSON.stringify({
            title: lessonForm.title,
            youtubeUrl: lessonForm.youtubeUrl,
            content: lessonForm.content,
            description: lessonForm.description,
            duration: lessonForm.duration,
            isFree: lessonForm.isFree,
          }),
        })
      } else {
        await api("/api/teacher/lessons", {
          method: "POST",
          body: JSON.stringify({
            moduleId: lessonForm.moduleId,
            title: lessonForm.title,
            youtubeUrl: lessonForm.youtubeUrl,
            content: lessonForm.content,
            description: lessonForm.description,
            duration: lessonForm.duration,
            isFree: lessonForm.isFree,
          }),
        })
      }
      setLessonForm({ open: false, moduleId: "", editing: null, title: "", youtubeUrl: "", content: "", description: "", duration: "", isFree: false })
      await refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save lesson")
    } finally {
      setBusy(false)
    }
  }

  const deleteLesson = async (lesson: BuilderLesson) => {
    if (!confirm(`Delete lesson "${lesson.title}"?`)) return
    setBusy(true)
    try {
      await api(`/api/teacher/lessons/${lesson.id}`, { method: "DELETE" })
      await refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete lesson")
    } finally {
      setBusy(false)
    }
  }

  const embedPreview = lessonForm.youtubeUrl && isValidYouTubeUrl(lessonForm.youtubeUrl)
    ? toYouTubeEmbedUrl(lessonForm.youtubeUrl)
    : null

  const inputClass =
    "mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Course Content</h2>
          <p className="text-sm text-muted-foreground">
            Add modules and lectures with YouTube video links
          </p>
        </div>
        {!moduleForm.open && (
          <Button size="sm" onClick={openNewModule} disabled={busy}>
            <Plus className="mr-1.5 h-4 w-4" />
            Add Module
          </Button>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      {moduleForm.open && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">
                {moduleForm.editing ? "Edit Module" : "New Module"}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setModuleForm((f) => ({ ...f, open: false }))}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <Label>Module Name</Label>
              <input
                className={inputClass}
                value={moduleForm.title}
                onChange={(e) => setModuleForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g., Chapter 1: Algebra"
              />
            </div>
            <div>
              <Label>Description (optional)</Label>
              <input
                className={inputClass}
                value={moduleForm.description}
                onChange={(e) => setModuleForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Short summary of this module"
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={saveModule} disabled={busy || !moduleForm.title.trim()}>
                {busy && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                {moduleForm.editing ? "Save Module" : "Add Module"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setModuleForm((f) => ({ ...f, open: false }))}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : modules.length === 0 && !moduleForm.open ? (
        <div className="flex flex-col items-center justify-center py-12 text-center rounded-lg border-2 border-dashed">
          <MonitorPlay className="h-10 w-10 text-muted-foreground/50" />
          <h3 className="mt-4 font-semibold">No modules yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Create modules and add YouTube lectures to build your course
          </p>
          <Button size="sm" className="mt-4" onClick={openNewModule}>
            <Plus className="mr-1.5 h-4 w-4" />
            Create First Module
          </Button>
        </div>
      ) : (
        modules.map((mod) => (
          <Card key={mod.id} className="overflow-hidden">
            <div
              className="flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setExpanded((prev) => ({ ...prev, [mod.id]: !prev[mod.id] }))}
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium">{mod.title}</p>
                <p className="text-xs text-muted-foreground">
                  {mod.lessons.length} lecture{mod.lessons.length !== 1 ? "s" : ""}
                  {mod.description ? ` · ${mod.description}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    openEditModule(mod)
                  }}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-destructive"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteModule(mod)
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
                {expanded[mod.id] ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>

            {expanded[mod.id] && (
              <div className="border-t px-4 py-3 space-y-2">
                {mod.lessons.map((lesson) => {
                  const Icon = lesson.contentType === "video" ? Video : FileText
                  return (
                    <div
                      key={lesson.id}
                      className="flex items-center gap-3 rounded-lg border bg-background p-3 text-sm"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
                        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">{lesson.title}</span>
                          {lesson.contentType === "video" ? (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">
                              <MonitorPlay className="mr-0.5 h-2.5 w-2.5" />
                              Video
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">
                              Article
                            </Badge>
                          )}
                          {lesson.isFree && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5">
                              Free
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {lesson.duration || "—"}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => openEditLesson(lesson, mod.id)}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-destructive"
                          onClick={() => deleteLesson(lesson)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )
                })}

                {lessonForm.open && lessonForm.moduleId === mod.id ? (
                  <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold">
                        {lessonForm.editing ? "Edit Lecture" : "Add Lecture"}
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() =>
                          setLessonForm((f) => ({ ...f, open: false }))
                        }
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div>
                      <Label>Lecture Title</Label>
                      <input
                        className={inputClass}
                        value={lessonForm.title}
                        onChange={(e) => setLessonForm((f) => ({ ...f, title: e.target.value }))}
                        placeholder="e.g., Introduction to Algebra"
                      />
                    </div>
                    <div>
                      <Label>
                        YouTube Video Link
                        <span className="ml-1 text-[10px] text-muted-foreground">(from your YouTube upload)</span>
                      </Label>
                      <input
                        className={inputClass}
                        value={lessonForm.youtubeUrl}
                        onChange={(e) => setLessonForm((f) => ({ ...f, youtubeUrl: e.target.value }))}
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                      {lessonForm.youtubeUrl &&
                        (isValidYouTubeUrl(lessonForm.youtubeUrl) ? (
                          <iframe
                            src={`${toYouTubeEmbedUrl(lessonForm.youtubeUrl)}?rel=0`}
                            className="mt-2 aspect-video w-full rounded-md border"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <p className="mt-1 text-xs text-destructive">
                            Invalid YouTube link. Paste a watch, share (youtu.be), shorts, or live URL.
                          </p>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Duration (minutes)</Label>
                        <input
                          className={inputClass}
                          value={lessonForm.duration}
                          onChange={(e) => setLessonForm((f) => ({ ...f, duration: e.target.value }))}
                          placeholder="e.g., 15"
                        />
                      </div>
                      <div>
                        <Label>Notes</Label>
                        <input
                          className={inputClass}
                          value={lessonForm.description}
                          onChange={(e) => setLessonForm((f) => ({ ...f, description: e.target.value }))}
                          placeholder="Optional notes"
                        />
                      </div>
                    </div>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={lessonForm.isFree}
                        onChange={(e) => setLessonForm((f) => ({ ...f, isFree: e.target.checked }))}
                        className="rounded border-gray-300"
                      />
                      <span>Free preview lesson</span>
                    </label>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={saveLesson}
                        disabled={busy || !lessonForm.title.trim()}
                      >
                        {busy && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                        {lessonForm.editing ? "Save Lecture" : "Add Lecture"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setLessonForm((f) => ({ ...f, open: false }))}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => openNewLesson(mod.id)}
                  >
                    <Plus className="mr-1.5 h-3.5 w-3.5" />
                    Add Lecture
                  </Button>
                )}
              </div>
            )}
          </Card>
        ))
      )}
    </div>
  )
}
