"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { CheckCircle2, Circle, Lock, Play, FileText, HelpCircle, Code } from "lucide-react"

const contentTypeIcons: Record<string, typeof Play> = {
  video: Play,
  article: FileText,
  quiz: HelpCircle,
  code: Code,
}

interface SidebarLesson {
  id: string
  title: string
  order: number
  isFree?: boolean
  contentType?: string
}

interface SidebarModule {
  id: string
  title: string
  order: number
  lessons: SidebarLesson[]
}

interface LessonProgressEntry {
  completed: boolean
  watchProgress?: number
}

interface CourseContentSidebarProps {
  courseId: string
  modules: SidebarModule[]
  progress: Record<string, LessonProgressEntry>
}

export function CourseContentSidebar({ courseId, modules, progress }: CourseContentSidebarProps) {
  const pathname = usePathname()
  const currentLessonId = pathname.split("/lessons/")[1]

  return (
    <aside className="w-80 shrink-0 border-r bg-background overflow-y-auto max-h-[calc(100vh-4rem)]">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Course Content</h2>
      </div>
      <div className="divide-y">
        {modules.map((mod) => {
          const completedCount = mod.lessons.filter(
            (l) => progress[l.id]?.completed
          ).length

          return (
            <div key={mod.id}>
              <div className="px-4 py-3 bg-muted/30">
                <p className="text-xs text-muted-foreground">
                  Module {mod.order}
                </p>
                <p className="text-sm font-medium">{mod.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {completedCount}/{mod.lessons.length} completed
                </p>
              </div>
              <div className="divide-y">
                {mod.lessons.map((lesson) => {
                  const p = progress[lesson.id]
                  const isActive = currentLessonId === lesson.id
                  const isCompleted = p?.completed
                  const Icon = contentTypeIcons[lesson.contentType || "video"] || Play

                  return (
                    <Link
                      key={lesson.id}
                      href={`/student/courses/${courseId}/lessons/${lesson.id}`}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                        isActive
                          ? "bg-primary/5 text-primary font-medium"
                          : "hover:bg-muted/30"
                      )}
                    >
                      <div className="shrink-0">
                        {isCompleted ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground/40" />
                        )}
                      </div>
                      <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
                      <span className="truncate">{lesson.title}</span>
                      {lesson.isFree && (
                        <span className="ml-auto text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                          Free
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </aside>
  )
}
