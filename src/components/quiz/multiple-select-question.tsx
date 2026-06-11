"use client"

import { cn } from "@/lib/utils"

interface MultipleSelectQuestionProps {
  question: string
  options: string[]
  selectedAnswers: string[]
  onSelect: (answers: string[]) => void
  showResult?: boolean
  isCorrect?: boolean
  correctAnswer?: string[]
  explanation?: string
}

export function MultipleSelectQuestion({
  question,
  options,
  selectedAnswers,
  onSelect,
  showResult = false,
  isCorrect,
  correctAnswer,
  explanation,
}: MultipleSelectQuestionProps) {
  const toggleOption = (option: string) => {
    if (showResult) return
    const newAnswers = selectedAnswers.includes(option)
      ? selectedAnswers.filter((a) => a !== option)
      : [...selectedAnswers, option]
    onSelect(newAnswers)
  }

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium">{question}</p>
      <p className="text-sm text-muted-foreground">
        Select all that apply
      </p>

      <div className="space-y-2">
        {options.map((option) => {
          const isSelected = selectedAnswers.includes(option)
          const isRight = showResult && correctAnswer?.includes(option)
          const isWrong = showResult && isSelected && !correctAnswer?.includes(option)
          const isMissing = showResult && !isSelected && correctAnswer?.includes(option)

          return (
            <button
              key={option}
              onClick={() => toggleOption(option)}
              disabled={showResult}
              className={cn(
                "w-full text-left rounded-lg border p-4 text-sm transition-all",
                !showResult && "hover:border-primary/50 hover:bg-primary/5 cursor-pointer",
                isSelected && !showResult && "border-primary bg-primary/10 ring-1 ring-primary",
                isRight && "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30",
                (isWrong || isMissing) && "border-red-500 bg-red-50 dark:bg-red-950/30",
                isMissing && "border-amber-500 bg-amber-50 dark:bg-amber-950/30",
                showResult && "cursor-default"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 mt-0.5 transition-colors",
                  isSelected && !showResult && "border-primary bg-primary text-primary-foreground",
                  isRight && "border-emerald-500 bg-emerald-500 text-white",
                  isWrong && "border-red-500 bg-red-500 text-white",
                  isMissing && "border-amber-500 bg-amber-500 text-white",
                  !isSelected && !showResult && "border-muted-foreground/30"
                )}>
                  {isSelected && (
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {isMissing && (
                    <span className="text-[10px] font-bold">+</span>
                  )}
                </div>
                <span className="flex-1 leading-relaxed">{option}</span>
                {isMissing && (
                  <span className="text-[10px] text-amber-600 font-medium shrink-0">Missing</span>
                )}
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
