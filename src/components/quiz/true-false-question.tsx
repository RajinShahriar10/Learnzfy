"use client"

import { cn } from "@/lib/utils"

interface TrueFalseQuestionProps {
  question: string
  selectedAnswer: string | null
  onSelect: (answer: string) => void
  showResult?: boolean
  isCorrect?: boolean
  correctAnswer?: string
  explanation?: string
}

export function TrueFalseQuestion({
  question,
  selectedAnswer,
  onSelect,
  showResult = false,
  isCorrect,
  correctAnswer,
  explanation,
}: TrueFalseQuestionProps) {
  const options = ["True", "False"]

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium">{question}</p>

      <div className="grid grid-cols-2 gap-3">
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
                "flex items-center justify-center gap-2 rounded-lg border p-6 text-base font-medium transition-all min-h-[80px]",
                !showResult && "hover:border-primary/50 hover:bg-primary/5 cursor-pointer",
                isSelected && !showResult && "border-primary bg-primary/10 ring-1 ring-primary",
                isRight && "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30",
                isWrong && "border-red-500 bg-red-50 dark:bg-red-950/30",
                showResult && "cursor-default"
              )}
            >
              {option === "True" ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              {option}
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
