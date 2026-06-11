"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { getExamById, getExamAttempts } from "@/lib/exam-data"
import { ExamTaking } from "@/components/exam/exam-taking"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GenerateCertificateButton } from "@/components/certificate/generate-certificate-button"
import {
  ArrowLeft,
  FileCheck,
  Clock,
  Target,
  Trophy,
  Users,
  RotateCcw,
  History,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
} from "lucide-react"

export default function StudentExamPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId as string
  const examId = params.examId as string

  const exam = getExamById(examId)
  const [started, setStarted] = useState(false)
  const [completedAttempt, setCompletedAttempt] = useState<{
    score: number
    totalMarks: number
    percentage: number
    correctAnswers: number
    totalQuestions: number
    timeTaken: number
    passed: boolean
    rank: number
    totalParticipants: number
  } | null>(null)

  const attempts = getExamAttempts(examId)
  const bestAttempt = attempts.length > 0
    ? attempts.reduce((b, a) => (a.percentage > b.percentage ? a : b))
    : null

  if (!exam) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <FileCheck className="h-16 w-16 text-muted-foreground/30" />
        <h2 className="mt-4 text-2xl font-bold">Exam not found</h2>
        <Button asChild className="mt-6">
          <Link href={`/student/courses/${courseId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Course
          </Link>
        </Button>
      </div>
    )
  }

  if (started) {
    return (
      <ExamTaking
        exam={exam}
        onComplete={(result) => {
          setCompletedAttempt(result)
          setStarted(false)
        }}
      />
    )
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href={`/student/courses/${courseId}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Course
        </Link>
      </Button>

      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <FileCheck className="h-4 w-4" />
          <span>Exam</span>
          {exam.placementTitle && (
            <>
              <span>&middot;</span>
              <span>{exam.placementTitle}</span>
            </>
          )}
        </div>
        <h1 className="text-3xl font-bold">{exam.title}</h1>
        <p className="mt-2 text-muted-foreground">{exam.description}</p>
      </div>

      {completedAttempt && (
        <Card className="mb-8 border-2 border-emerald-200 bg-emerald-50/70 dark:border-emerald-800 dark:bg-emerald-950/20">
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
                {completedAttempt.passed ? (
                  <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <XCircle className="h-8 w-8 text-red-500" />
                )}
              </div>
              <div className="text-center sm:text-left flex-1">
                <h3 className="text-lg font-semibold">
                  {completedAttempt.passed ? "Exam Passed!" : "Exam Not Passed"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Score: {completedAttempt.score}/{completedAttempt.totalMarks} &middot;{" "}
                  {completedAttempt.percentage}% &middot; Correct: {completedAttempt.correctAnswers}/{completedAttempt.totalQuestions} &middot;{" "}
                  Rank #{completedAttempt.rank} of {completedAttempt.totalParticipants}
                </p>
              </div>
              {completedAttempt.passed && (
                <GenerateCertificateButton
                  courseId={courseId}
                  examId={examId}
                  grade={
                    completedAttempt.percentage >= 90
                      ? "A+"
                      : completedAttempt.percentage >= 80
                      ? "A"
                      : completedAttempt.percentage >= 70
                      ? "B+"
                      : "B"
                  }
                />
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <FileCheck className="h-5 w-5 mx-auto mb-2 text-primary" />
            <p className="text-lg font-bold">{exam.totalQuestions}</p>
            <p className="text-xs text-muted-foreground">Questions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-5 w-5 mx-auto mb-2 text-blue-500" />
            <p className="text-lg font-bold">{exam.timeLimit} min</p>
            <p className="text-xs text-muted-foreground">Time Limit</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-5 w-5 mx-auto mb-2 text-amber-500" />
            <p className="text-lg font-bold">{exam.passingScore}%</p>
            <p className="text-xs text-muted-foreground">Passing Score</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="h-5 w-5 mx-auto mb-2 text-emerald-500" />
            <p className="text-lg font-bold">{exam.totalMarks}</p>
            <p className="text-xs text-muted-foreground">Total Marks</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-3">Exam Details</h3>
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Type:</span>
              <span>Comprehensive</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Attempts:</span>
              <span>{exam.attemptsAllowed} allowed</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Ranking:</span>
              <span>Compared with all students</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Auto-submit:</span>
              <span>When time expires</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {exam.questionPools.map((pool, i) => (
        <Card key={pool.id} className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{pool.title}</p>
                <p className="text-xs text-muted-foreground">
                  {pool.questionsToSelect} of {pool.questions.length} questions &middot; {pool.questions.reduce((s, q) => s + q.marks, 0)} marks available
                </p>
              </div>
              <Badge variant="outline" className="shrink-0">
                Select {pool.questionsToSelect}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}

      {bestAttempt && (
        <Card className="mb-8 border-emerald-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {bestAttempt.passed ? (
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              ) : (
                <XCircle className="h-8 w-8 text-red-500" />
              )}
              <div>
                <p className="font-medium">Best Attempt</p>
                <p className="text-sm text-muted-foreground">
                  {bestAttempt.percentage}% &middot; {bestAttempt.score}/{bestAttempt.totalMarks} marks &middot; Rank #{bestAttempt.rank}
                </p>
              </div>
            </div>
            {exam.attemptsAllowed > attempts.length && (
              <Button variant="outline" size="sm" onClick={() => setStarted(true)}>
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                Retry
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {attempts.length > 0 && exam.attemptsAllowed > attempts.length && (
        <div className="text-xs text-muted-foreground text-center mb-4">
          {attempts.length} of {exam.attemptsAllowed} attempts used
        </div>
      )}

      {exam.attemptsAllowed <= attempts.length && (
        <div className="text-center mb-4">
          <Badge variant="secondary" className="text-sm py-1.5 px-4">
            No attempts remaining
          </Badge>
        </div>
      )}

      <div className="text-center">
        {exam.attemptsAllowed > attempts.length && (
          <Button size="lg" onClick={() => setStarted(true)} className="px-8">
            <FileCheck className="mr-2 h-5 w-5" />
            {attempts.length === 0 ? "Start Exam" : "Retry Exam"}
          </Button>
        )}
      </div>
    </div>
  )
}


