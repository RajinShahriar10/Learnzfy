"use client"

import { cn } from "@/lib/utils"

interface QuestionNavigatorProps {
  totalQuestions: number
  currentIndex: number
  answeredQuestions: Set<string>
  onNavigate: (index: number) => void
  showResults?: boolean
}

export function QuestionNavigator({
  totalQuestions,
  currentIndex,
  answeredQuestions,
  onNavigate,
  showResults = false,
}: QuestionNavigatorProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <p className="text-sm font-medium">Questions</p>
        <p className="text-xs text-muted-foreground">
          {answeredQuestions.size} of {totalQuestions} answered
        </p>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: totalQuestions }, (_, i) => {
          const questionId = String(i)
          const isAnswered = answeredQuestions.has(questionId)
          const isCurrent = i === currentIndex

          return (
            <button
              key={i}
              onClick={() => onNavigate(i)}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-all",
                isCurrent && !showResults && "ring-2 ring-primary ring-offset-2",
                showResults
                  ? isAnswered
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                    : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                  : isAnswered
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {i + 1}
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2 border-t">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-sm bg-primary" />
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-sm bg-muted" />
          <span>Unanswered</span>
        </div>
      </div>
    </div>
  )
}
