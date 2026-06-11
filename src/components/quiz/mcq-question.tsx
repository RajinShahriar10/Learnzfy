"use client"

import { cn } from "@/lib/utils"

interface MCQQuestionProps {
  question: string
  options: string[]
  selectedAnswer: string | null
  onSelect: (answer: string) => void
  showResult?: boolean
  isCorrect?: boolean
  correctAnswer?: string
  explanation?: string
}

export function MCQQuestion({
  question,
  options,
  selectedAnswer,
  onSelect,
  showResult = false,
  isCorrect,
  correctAnswer,
  explanation,
}: MCQQuestionProps) {
  return (
    <div className="space-y-4">
      <p className="text-lg font-medium">{question}</p>

      <div className="space-y-2">
        {options.map((option) => {
          const isSelected = selectedAnswer === option
          const isRight = showResult && option === correctAnswer
          const isWrong = showResult && isSelected && option !== correctAnswer

          return (
            <button
              key={option}
              onClick={() => !showResult && onSelect(option)}
              disabled={showResult}
              className={cn(
                "w-full text-left rounded-lg border p-4 text-sm transition-all",
                !showResult && "hover:border-primary/50 hover:bg-primary/5 cursor-pointer",
                isSelected && !showResult && "border-primary bg-primary/10 ring-1 ring-primary",
                isRight && "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30",
                isWrong && "border-red-500 bg-red-50 dark:bg-red-950/30",
                showResult && "cursor-default"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 mt-0.5",
                  isSelected && !showResult && "border-primary",
                  isRight && "border-emerald-500 bg-emerald-500",
                  isWrong && "border-red-500 bg-red-500",
                  !isSelected && "border-muted-foreground/30"
                )}>
                  {isSelected && !showResult && (
                    <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                  )}
                  {(isRight || isWrong) && (
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="flex-1 leading-relaxed">{option}</span>
              </div>
            </button>
          )
        })}
      </div>

      {showResult && explanation && (
        <div className={cn(
          "rounded-lg border p-4 mt-4 text-sm",
          isCorrect
            ? "border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20"
            : "border-red-200 bg-red-50 dark:bg-red-950/20"
        )}>
          <p className="font-medium mb-1">
            {isCorrect ? "Correct!" : "Incorrect"}
          </p>
          <p className="text-muted-foreground">{explanation}</p>
        </div>
      )}
    </div>
  )
}
