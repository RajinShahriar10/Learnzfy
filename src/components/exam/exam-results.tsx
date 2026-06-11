"use client"

import { useState } from "react"
import { ExamQuestionRenderer } from "./exam-question"
import type { TeacherExam, ExamQuestion } from "@/lib/exam-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle2,
  XCircle,
  Clock,
  Target,
  Award,
  BarChart3,
  Trophy,
  TrendingUp,
  RotateCcw,
  ArrowLeft,
  History,
  Eye,
  Users,
} from "lucide-react"

interface ExamResultsProps {
  exam: TeacherExam
  questions: ExamQuestion[]
  answers: Record<string, string | string[]>
  result: {
    score: number
    totalMarks: number
    percentage: number
    correctAnswers: number
    totalQuestions: number
    results: { questionId: string; answer: string | string[]; isCorrect: boolean; marksAwarded: number; marksTotal: number }[]
  }
  rank: { rank: number; total: number }
  timeTaken: number
  timeUp: boolean
  passingScore: number
  onFinish: () => void
  onRetry: () => void
}

export function ExamResults({
  exam,
  questions,
  answers,
  result,
  rank,
  timeTaken,
  timeUp,
  passingScore,
  onFinish,
  onRetry,
}: ExamResultsProps) {
  const [view, setView] = useState<"summary" | "review" | "history">("summary")
  const [reviewIndex, setReviewIndex] = useState(0)

  const passed = result.percentage >= passingScore
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}m ${s}s`
  }

  const resultMap = new Map(result.results.map((r) => [r.questionId, r]))

  if (view === "review") {
    const q = questions[reviewIndex]
    const qr = resultMap.get(q.id)

    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" onClick={() => setView("summary")}>
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to Summary
          </Button>
          <span className="text-sm text-muted-foreground">
            Question {reviewIndex + 1} of {questions.length}
          </span>
        </div>

        <div className="space-y-6">
          {qr && (
            <ExamQuestionRenderer
              type={q.type}
              question={q.question}
              options={q.options}
              marks={q.marks}
              questionNumber={reviewIndex + 1}
              selectedAnswer={answers[q.id] || null}
              onAnswer={() => {}}
              showResult
              isCorrect={qr.isCorrect}
              correctAnswer={q.correctAnswer}
              explanation={q.explanation}
            />
          )}

          <div className="flex items-center justify-between pt-4 border-t">
            {reviewIndex > 0 && (
              <Button variant="outline" onClick={() => setReviewIndex((i) => i - 1)}>
                Previous
              </Button>
            )}
            {reviewIndex < questions.length - 1 && (
              <Button onClick={() => setReviewIndex((i) => i + 1)}>
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
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
          {timeUp ? "Time's Up!" : passed ? "Exam Passed!" : "Exam Failed"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {timeUp
            ? "Your exam was auto-submitted when time ran out"
            : passed
              ? `You scored ${result.percentage}% — above the ${passingScore}% passing threshold`
              : `You need ${passingScore}% to pass. You scored ${result.percentage}%.`}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{result.percentage}%</p>
            <p className="text-xs text-muted-foreground">Percentage</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="h-6 w-6 mx-auto mb-2 text-amber-500" />
            <p className="text-2xl font-bold">{result.score}/{result.totalMarks}</p>
            <p className="text-xs text-muted-foreground">Marks Scored</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
            <p className="text-2xl font-bold">
              #{rank.rank}
              <span className="text-sm text-muted-foreground font-normal">/{rank.total}</span>
            </p>
            <p className="text-xs text-muted-foreground">Class Rank</p>
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

      <Card className="mb-8">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Performance Breakdown</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Passing Score</span>
              <span className="font-medium">{passingScore}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Your Score</span>
              <span className={cn("font-medium", passed ? "text-emerald-600" : "text-red-600")}>
                {result.percentage}%
              </span>
            </div>
            <Progress value={result.percentage} className={cn("h-3", passed ? "bg-emerald-100" : "bg-red-100")} />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span className="font-medium">{passingScore}% (pass)</span>
              <span>100%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Question Breakdown</h3>
          <div className="space-y-2">
            {result.results.map((r, i) => (
              <div key={r.questionId} className="flex items-center gap-3 text-sm py-2 border-b last:border-0">
                <div className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                  r.isCorrect
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                    : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                )}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate">{questions[i]?.question}</p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {r.marksAwarded}/{r.marksTotal}
                </span>
                {r.isCorrect ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-center gap-3">
        <Button variant="outline" onClick={() => setView("review")}>
          <Eye className="mr-1.5 h-4 w-4" />
          Review Answers
        </Button>
        {exam.attemptsAllowed > 1 && (
          <Button variant="outline" onClick={onRetry}>
            <RotateCcw className="mr-1.5 h-4 w-4" />
            Retry Exam
          </Button>
        )}
        <Button onClick={onFinish}>
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Return to Course
        </Button>
      </div>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}
