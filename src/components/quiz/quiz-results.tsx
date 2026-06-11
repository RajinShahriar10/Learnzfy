"use client"

import { useState } from "react"
import { MCQQuestion } from "./mcq-question"
import { TrueFalseQuestion } from "./true-false-question"
import { MultipleSelectQuestion } from "./multiple-select-question"
import { QuestionNavigator } from "./question-navigator"
import type { TeacherQuiz, QuizQuestion } from "@/lib/quiz-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, XCircle, Clock, Target, Award, BarChart3, ArrowLeft, Eye, RotateCcw } from "lucide-react"

interface QuizResultsProps {
  quiz: TeacherQuiz
  questions: QuizQuestion[]
  results: { score: number; correctAnswers: number; totalQuestions: number; results: { questionId: string; isCorrect: boolean }[] }
  answers: Record<string, string | string[]>
  timeTaken: number
  onFinish: () => void
}

export function QuizResults({ quiz, questions, results, answers, timeTaken, onFinish }: QuizResultsProps) {
  const [reviewMode, setReviewMode] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const passed = results.score >= quiz.passingScore

  const answeredIds = new Set(questions.map((_, i) => String(i)))
  const resultMap = new Map(results.results.map((r) => [r.questionId, r.isCorrect]))

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}m ${s}s`
  }

  if (reviewMode) {
    const question = questions[currentQuestion]
    const isCorrect = resultMap.get(question.id)

    return (
      <div className="flex gap-0 -mx-4 sm:-mx-6 lg:-mx-8">
        <div className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReviewMode(false)}
            >
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Back to Summary
            </Button>
            <span className="text-sm text-muted-foreground">
              Reviewing: Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>

          <div className="space-y-6">
            {question.type === "mcq" && (
              <MCQQuestion
                question={question.question}
                options={question.options}
                selectedAnswer={(answers[question.id] as string) || null}
                onSelect={() => {}}
                showResult
                isCorrect={isCorrect}
                correctAnswer={question.correctAnswer as string}
                explanation={question.explanation}
              />
            )}

            {question.type === "true-false" && (
              <TrueFalseQuestion
                question={question.question}
                selectedAnswer={(answers[question.id] as string) || null}
                onSelect={() => {}}
                showResult
                isCorrect={isCorrect}
                correctAnswer={question.correctAnswer as string}
                explanation={question.explanation}
              />
            )}

            {question.type === "multiple-select" && (
              <MultipleSelectQuestion
                question={question.question}
                options={question.options}
                selectedAnswers={(answers[question.id] as string[]) || []}
                onSelect={() => {}}
                showResult
                isCorrect={isCorrect}
                correctAnswer={question.correctAnswer as string[]}
                explanation={question.explanation}
              />
            )}

            <div className="flex items-center justify-between pt-4 border-t">
              {currentQuestion > 0 && (
                <Button variant="outline" size="sm" onClick={() => setCurrentQuestion((i) => i - 1)}>
                  Previous
                </Button>
              )}
              {currentQuestion < questions.length - 1 && (
                <Button size="sm" onClick={() => setCurrentQuestion((i) => i + 1)}>
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="hidden lg:block w-64 shrink-0 border-l p-6">
          <QuestionNavigator
            totalQuestions={questions.length}
            currentIndex={currentQuestion}
            answeredQuestions={answeredIds}
            onNavigate={(i) => setCurrentQuestion(i)}
            showResults
          />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="text-center mb-8">
        <div className={cn(
          "inline-flex items-center justify-center h-20 w-20 rounded-full mb-4",
          passed ? "bg-emerald-100 dark:bg-emerald-950" : "bg-red-100 dark:bg-red-950"
        )}>
          {passed ? (
            <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
          )}
        </div>
        <h1 className="text-2xl font-bold">
          {passed ? "Congratulations!" : "Keep Trying!"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {passed
            ? "You passed the quiz"
            : `You need ${quiz.passingScore}% to pass. Review your answers and try again.`}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{results.score}%</p>
            <p className="text-xs text-muted-foreground">Your Score</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="h-6 w-6 mx-auto mb-2 text-amber-500" />
            <p className="text-2xl font-bold">{results.correctAnswers}/{results.totalQuestions}</p>
            <p className="text-xs text-muted-foreground">Correct Answers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">{formatTime(timeTaken)}</p>
            <p className="text-xs text-muted-foreground">Time Taken</p>
          </CardContent>
        </Card>
      </div>

      <div className="border rounded-lg p-6 mb-8">
        <h3 className="font-semibold mb-4">Detailed Breakdown</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Passing Score</span>
            <span className="font-medium">{quiz.passingScore}%</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Your Score</span>
            <span className={cn("font-medium", passed ? "text-emerald-600" : "text-red-600")}>
              {results.score}%
            </span>
          </div>
          <div className="pt-2">
            <Progress
              value={results.score}
              className={cn("h-2.5", passed ? "bg-emerald-100" : "bg-red-100")}
            />
          </div>
          <div className="flex items-center justify-between text-sm pt-1">
            <span className="text-muted-foreground">0%</span>
            <span className="text-muted-foreground">100%</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3">
        <Button variant="outline" onClick={() => setReviewMode(true)}>
          <Eye className="mr-1.5 h-4 w-4" />
          Review Answers
        </Button>
        <Button onClick={onFinish}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Return to Course
        </Button>
      </div>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}
