"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { CheckCircle2, Circle, Lock, Play, FileText, HelpCircle, Code } from "lucide-react"
import type { TeacherModule, TeacherLesson } from "@/lib/teacher-data"
import type { LessonProgress } from "@/lib/lesson-data"

const contentTypeIcons: Record<string, typeof Play> = {
  video: Play,
  article: FileText,
  quiz: HelpCircle,
  code: Code,
}

interface CourseContentSidebarProps {
  courseId: string
  modules: TeacherModule[]
  progress: Record<string, LessonProgress>
}

export function CourseContentSidebar({ courseId, modules, progress }: CourseContentSidebarProps) {
  const pathname = usePathname()
  const currentLessonId = pathname.split("/lessons/")[1]

  return (
    <aside className="w-80 shrink-0 border-r bg-background overflow-y-auto max-h-[calc(100vh-4rem)]">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Course Content</h2>
        <p className="text-xs text-muted-foreground mt-1">
          {modules.reduce((sum, m) => sum + m.lessons.length, 0)} lessons
        </p>
      </div>

      <div className="divide-y">
        {modules.map((mod) => {
          const allComplete = mod.lessons.every((l) => progress[l.id]?.completed)
          const someComplete = mod.lessons.some((l) => progress[l.id]?.completed)

          return (
            <div key={mod.id}>
              <div className="flex items-center gap-3 px-4 py-3 bg-muted/30">
                <div className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                  allComplete
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                    : someComplete
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                )}>
                  {mod.order}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{mod.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {mod.lessons.filter((l) => progress[l.id]?.completed).length}/{mod.lessons.length} complete
                  </p>
                </div>
              </div>

              <div>
                {mod.lessons.map((lesson) => {
                  const Icon = contentTypeIcons[lesson.contentType] || Play
                  const isActive = currentLessonId === lesson.id
                  const isComplete = progress[lesson.id]?.completed
                  const isCurrent = isActive

                  return (
                    <Link
                      key={lesson.id}
                      href={`/student/courses/${courseId}/lessons/${lesson.id}`}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-muted/50",
                        isCurrent ? "bg-primary/5 border-l-2 border-primary" : "border-l-2 border-transparent",
                        lesson.isFree && "bg-amber-50/30 dark:bg-amber-950/10"
                      )}
                    >
                      {isComplete ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                      ) : (
                        <Circle className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                      )}
                      <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      <span className={cn(
                        "truncate flex-1",
                        isCurrent && "font-medium text-primary"
                      )}>
                        {lesson.title}
                      </span>
                      <span className="text-[10px] text-muted-foreground/60 shrink-0">
                        {lesson.duration}
                      </span>
                      {lesson.isFree && (
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium shrink-0">
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
