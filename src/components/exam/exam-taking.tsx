"use client"

import { useState, useMemo, useCallback } from "react"
import { ExamQuestionRenderer } from "./exam-question"
import { ExamTimer } from "./exam-timer"
import { QuestionNavigator } from "@/components/quiz/question-navigator"
import type { TeacherExam, ExamQuestion, ExamAnswer } from "@/lib/exam-data"
import { selectQuestionsFromPools, calculateExamScore, getStudentRank } from "@/lib/exam-data"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, AlertTriangle, FileCheck } from "lucide-react"
import { ExamResults } from "./exam-results"

interface ExamTakingProps {
  exam: TeacherExam
  onComplete: (result: {
    score: number
    totalMarks: number
    percentage: number
    correctAnswers: number
    totalQuestions: number
    timeTaken: number
    passed: boolean
    rank: number
    totalParticipants: number
    answers: ExamAnswer[]
  }) => void
}

export function ExamTaking({ exam: rawExam, onComplete }: ExamTakingProps) {
  const exam = useMemo(() => {
    const pools = rawExam.questionPools.map((p) => ({
      ...p,
      questionsToSelect: Math.min(p.questionsToSelect, p.questions.length),
    }))
    return { ...rawExam, questionPools: pools }
  }, [rawExam])

  const questions = useMemo(
    () => selectQuestionsFromPools(exam.questionPools, exam.randomizeQuestions),
    [exam]
  )

  const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState<ReturnType<typeof calculateExamScore> | null>(null)
  const [rank, setRank] = useState({ rank: 0, total: 0 })
  const [timeTaken, setTimeTaken] = useState(0)
  const [showConfirm, setShowConfirm] = useState(false)
  const [timeUp, setTimeUp] = useState(false)

  const currentQuestion = questions[currentIndex]
  const answeredQuestions = new Set(Object.keys(answers))

  const handleAnswer = useCallback((answer: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answer }))
  }, [currentQuestion])

  const submitExam = useCallback(() => {
    const calculated = calculateExamScore(
      questions,
      Object.entries(answers).map(([questionId, answer]) => ({ questionId, answer }))
    )
    setResult(calculated)
    const studentRank = getStudentRank(exam.id, calculated.score)
    setRank(studentRank)
    setSubmitted(true)
  }, [questions, answers, exam.id])

  const handleTimeUp = useCallback(() => {
    setTimeUp(true)
    submitExam()
  }, [submitExam])

  const handleTimeTick = useCallback((seconds: number) => {
    setTimeTaken(exam.timeLimit * 60 - seconds)
  }, [exam.timeLimit])

  const handleFinish = useCallback(() => {
    if (!result) return
    onComplete({
      score: result.score,
      totalMarks: result.totalMarks,
      percentage: result.percentage,
      correctAnswers: result.correctAnswers,
      totalQuestions: result.totalQuestions,
      timeTaken,
      passed: result.percentage >= exam.passingScore,
      rank: rank.rank,
      totalParticipants: rank.total,
      answers: result.results,
    })
  }, [result, timeTaken, exam.passingScore, rank, onComplete])

  if (submitted && result) {
    return (
      <ExamResults
        exam={exam}
        questions={questions}
        answers={answers}
        result={result}
        rank={rank}
        timeTaken={timeTaken}
        timeUp={timeUp}
        passingScore={exam.passingScore}
        onFinish={handleFinish}
        onRetry={() => {
          setSubmitted(false)
          setResult(null)
          setAnswers({})
          setCurrentIndex(0)
          setTimeTaken(0)
          setTimeUp(false)
        }}
      />
    )
  }

  return (
    <div className="flex gap-0 -mx-4 sm:-mx-6 lg:-mx-8">
      <div className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6">
        <div className="sticky top-16 z-20 bg-background pb-4 mb-6 border-b">
          <div className="flex items-center justify-between mb-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <FileCheck className="h-4 w-4" />
                <span>Exam</span>
              </div>
              <h1 className="text-xl font-bold truncate">{exam.title}</h1>
              <p className="text-xs text-muted-foreground mt-1">
                Question {currentIndex + 1} of {questions.length} &middot; {totalMarks} total marks
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0 ml-4">
              <div className="text-xs text-muted-foreground text-right hidden sm:block">
                <div>Answered</div>
                <div className="font-medium">{answeredQuestions.size}/{questions.length}</div>
              </div>
              <ExamTimer timeLimit={exam.timeLimit} onTimeUp={handleTimeUp} onTick={handleTimeTick} />
            </div>
          </div>
          <Progress
            value={(answeredQuestions.size / questions.length) * 100}
            className="h-1.5"
          />
        </div>

        <div className="space-y-6">
          {questions.length > 0 && (
            <ExamQuestionRenderer
              type={currentQuestion.type}
              question={currentQuestion.question}
              options={currentQuestion.options}
              marks={currentQuestion.marks}
              questionNumber={currentIndex + 1}
              selectedAnswer={answers[currentQuestion.id] || null}
              onAnswer={handleAnswer}
            />
          )}

          {answeredQuestions.size < questions.length && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 p-3 text-sm text-amber-700 dark:text-amber-400">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>
                  {questions.length - answeredQuestions.size} question{questions.length - answeredQuestions.size !== 1 ? "s" : ""} unanswered
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              {currentIndex > 0 && (
                <Button variant="outline" size="sm" onClick={() => setCurrentIndex((i) => i - 1)}>
                  <ChevronLeft className="mr-1.5 h-4 w-4" />
                  Previous
                </Button>
              )}
            </div>

            {currentIndex < questions.length - 1 ? (
              <Button size="sm" onClick={() => setCurrentIndex((i) => i + 1)}>
                Next
                <ChevronRight className="ml-1.5 h-4 w-4" />
              </Button>
            ) : (
              <Button size="sm" onClick={() => setShowConfirm(true)}>
                Submit Exam
              </Button>
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
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="font-semibold">Submit Exam?</h3>
                <p className="text-sm text-muted-foreground">
                  {questions.length - answeredQuestions.size > 0
                    ? `${questions.length - answeredQuestions.size} question${questions.length - answeredQuestions.size !== 1 ? "s" : ""} unanswered`
                    : "All questions answered"}
                </p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground mb-4">
              <p>Time limit: {exam.timeLimit} minutes</p>
              <p>Passing score: {exam.passingScore}%</p>
              <p>This action cannot be undone.</p>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowConfirm(false)}>
                Continue Exam
              </Button>
              <Button onClick={() => { setShowConfirm(false); submitExam() }}>
                Submit & View Results
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
