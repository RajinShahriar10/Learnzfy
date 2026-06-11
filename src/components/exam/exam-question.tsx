"use client"

import { MCQQuestion } from "@/components/quiz/mcq-question"
import { TrueFalseQuestion } from "@/components/quiz/true-false-question"
import { MultipleSelectQuestion } from "@/components/quiz/multiple-select-question"

interface ExamQuestionRendererProps {
  type: "mcq" | "true-false" | "multiple-select"
  question: string
  options: string[]
  marks: number
  questionNumber: number
  selectedAnswer: string | string[] | null
  onAnswer: (answer: string | string[]) => void
  showResult?: boolean
  isCorrect?: boolean
  correctAnswer?: string | string[]
  explanation?: string
}

export function ExamQuestionRenderer({
  type,
  question,
  options,
  marks,
  questionNumber,
  selectedAnswer,
  onAnswer,
  showResult = false,
  isCorrect,
  correctAnswer,
  explanation,
}: ExamQuestionRendererProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-semibold text-primary">
            {questionNumber}
          </div>
          <span className="text-xs text-muted-foreground font-medium">{marks} marks</span>
        </div>
      </div>

      {type === "mcq" && (
        <MCQQuestion
          question={question}
          options={options}
          selectedAnswer={(selectedAnswer as string) || null}
          onSelect={onAnswer}
          showResult={showResult}
          isCorrect={isCorrect}
          correctAnswer={correctAnswer as string}
          explanation={explanation}
        />
      )}

      {type === "true-false" && (
        <TrueFalseQuestion
          question={question}
          selectedAnswer={(selectedAnswer as string) || null}
          onSelect={onAnswer}
          showResult={showResult}
          isCorrect={isCorrect}
          correctAnswer={correctAnswer as string}
          explanation={explanation}
        />
      )}

      {type === "multiple-select" && (
        <MultipleSelectQuestion
          question={question}
          options={options}
          selectedAnswers={(selectedAnswer as string[]) || []}
          onSelect={onAnswer}
          showResult={showResult}
          isCorrect={isCorrect}
          correctAnswer={correctAnswer as string[]}
          explanation={explanation}
        />
      )}
    </div>
  )
}
