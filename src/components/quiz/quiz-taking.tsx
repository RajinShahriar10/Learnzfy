"use client"

import { useState, useMemo } from "react"
import { MCQQuestion } from "./mcq-question"
import { TrueFalseQuestion } from "./true-false-question"
import { MultipleSelectQuestion } from "./multiple-select-question"
import { QuestionNavigator } from "./question-navigator"
import { QuizTimer } from "./quiz-timer"
import type { TeacherQuiz, QuizQuestion } from "@/lib/quiz-data"
import { calculateScore } from "@/lib/quiz-data"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react"
import { QuizResults } from "./quiz-results"

interface QuizTakingProps {
  quiz: TeacherQuiz
  onComplete: (result: { score: number; correctAnswers: number; timeTaken: number }) => void
}

export function QuizTaking({ quiz, onComplete }: QuizTakingProps) {
  const questions = useMemo(() => {
    if (quiz.randomQuestions) {
      return [...quiz.questions].sort(() => Math.random() - 0.5)
    }
    return quiz.questions
  }, [quiz])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState<ReturnType<typeof calculateScore> | null>(null)
  const [timeTaken, setTimeTaken] = useState(0)
  const [showConfirm, setShowConfirm] = useState(false)

  const currentQuestion = questions[currentIndex]
  const answeredQuestions = new Set(Object.keys(answers))

  const handleAnswer = (answer: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answer }))
  }

  const handleTimeUp = () => {
    submitQuiz()
  }

  const submitQuiz = () => {
    const calculated = calculateScore(questions, Object.entries(answers).map(([questionId, answer]) => ({ questionId, answer })))
    setResults(calculated)
    setSubmitted(true)
  }

  const handleFinish = () => {
    if (!results) return
    onComplete({
      score: results.score,
      correctAnswers: results.correctAnswers,
      timeTaken,
    })
  }

  if (submitted && results) {
    return (
      <QuizResults
        quiz={quiz}
        questions={questions}
        results={results}
        answers={answers}
        timeTaken={timeTaken}
        onFinish={handleFinish}
      />
    )
  }

  return (
    <div className="flex gap-0 -mx-4 sm:-mx-6 lg:-mx-8">
      <div className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6">
        <div className="sticky top-16 z-20 bg-background pb-4 mb-6 border-b">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold">{quiz.title}</h1>
              <p className="text-sm text-muted-foreground">
                Question {currentIndex + 1} of {questions.length}
              </p>
            </div>
            <QuizTimer timeLimit={quiz.timeLimit} onTimeUp={handleTimeUp} />
          </div>
          <Progress
            value={((currentIndex + 1) / questions.length) * 100}
            className="h-1.5"
          />
        </div>

        <div className="space-y-6">
          {currentQuestion.type === "mcq" && (
            <MCQQuestion
              question={currentQuestion.question}
              options={currentQuestion.options}
              selectedAnswer={(answers[currentQuestion.id] as string) || null}
              onSelect={(answer) => handleAnswer(answer)}
            />
          )}

          {currentQuestion.type === "true-false" && (
            <TrueFalseQuestion
              question={currentQuestion.question}
              selectedAnswer={(answers[currentQuestion.id] as string) || null}
              onSelect={(answer) => handleAnswer(answer)}
            />
          )}

          {currentQuestion.type === "multiple-select" && (
            <MultipleSelectQuestion
              question={currentQuestion.question}
              options={currentQuestion.options}
              selectedAnswers={(answers[currentQuestion.id] as string[]) || []}
              onSelect={(answers) => handleAnswer(answers)}
            />
          )}

          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              {currentIndex > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentIndex((i) => i - 1)}
                >
                  <ChevronLeft className="mr-1.5 h-4 w-4" />
                  Previous
                </Button>
              )}
            </div>

            {currentIndex < questions.length - 1 ? (
              <Button
                size="sm"
                onClick={() => setCurrentIndex((i) => i + 1)}
              >
                Next
                <ChevronRight className="ml-1.5 h-4 w-4" />
              </Button>
            ) : (
              <div className="flex items-center gap-3">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setShowConfirm(true)}
                >
                  Submit Quiz
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="hidden lg:block w-64 shrink-0 border-l p-6">
        <QuestionNavigator
          totalQuestions={questions.length}
          currentIndex={currentIndex}
          answeredQuestions={answeredQuestions}
          onNavigate={(i) => setCurrentIndex(i)}
        />
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background rounded-lg shadow-lg p-6 max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold">Submit Quiz?</h3>
                <p className="text-sm text-muted-foreground">
                  {questions.length - answeredQuestions.size > 0
                    ? `${questions.length - answeredQuestions.size} questions unanswered`
                    : "You have answered all questions"}
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowConfirm(false)}>
                Continue Quiz
              </Button>
              <Button onClick={submitQuiz}>
                Submit & Review
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
