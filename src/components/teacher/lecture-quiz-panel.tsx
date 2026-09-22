"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  Loader2,
  Sparkles,
  X,
} from "lucide-react"

export interface PresentedQuizQuestion {
  id: string
  type: "mcq" | "true-false" | "multiple-select"
  question: string
  options: string[]
  correctAnswer: string | string[]
  explanation?: string
}

export interface PresentedQuiz {
  id: string
  lessonId: string
  courseId: string
  title: string
  description: string
  timeLimit: number
  passingScore: number
  questions: PresentedQuizQuestion[]
}

interface LectureQuizPanelProps {
  courseId: string
  lessonId: string
  lessonTitle: string
  lessonDescription?: string
  initialQuiz: PresentedQuiz | null
  onSaved: () => void
  onDeleted: () => void
  onCancel: () => void
}

type QuestionType = PresentedQuizQuestion["type"]

function serializeAnswer(q: PresentedQuizQuestion): string | string[] {
  if (q.type === "multiple-select") {
    return Array.isArray(q.correctAnswer) ? q.correctAnswer : []
  }
  return q.correctAnswer as string
}

export function LectureQuizPanel({
  courseId,
  lessonId,
  lessonTitle,
  lessonDescription,
  initialQuiz,
  onSaved,
  onDeleted,
  onCancel,
}: LectureQuizPanelProps) {
  const [title, setTitle] = useState(initialQuiz?.title || "")
  const [description, setDescription] = useState(initialQuiz?.description || "")
  const [timeLimit, setTimeLimit] = useState(initialQuiz?.timeLimit || 15)
  const [passingScore, setPassingScore] = useState(initialQuiz?.passingScore || 70)
  const [questions, setQuestions] = useState<PresentedQuizQuestion[]>(initialQuiz?.questions || [])
  const [editingQuestion, setEditingQuestion] = useState<number | null>(null)
  const [busy, setBusy] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addQuestion = (type: QuestionType) => {
    const newQ: PresentedQuizQuestion = {
      id: `q-${Date.now()}`,
      type,
      question: "",
      options: type === "true-false" ? ["True", "False"] : ["", ""],
      correctAnswer: type === "multiple-select" ? [] : "",
      explanation: "",
    }
    setQuestions((prev) => [...prev, newQ])
    setEditingQuestion(questions.length)
  }

  const updateQuestion = (index: number, updates: Partial<PresentedQuizQuestion>) => {
    setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, ...updates } : q)))
  }

  const removeQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index))
    setEditingQuestion(null)
  }

  const generateWithAi = async () => {
    if (generating) return
    setGenerating(true)
    setError(null)
    try {
      const res = await fetch("/api/ai/quiz-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          courseId,
          title: title || lessonTitle || undefined,
          description: description || lessonDescription || undefined,
          count: 5,
        }),
      })
      const json = await res.json()
      if (!json.success) {
        setError(json.error || "Could not generate questions")
        return
      }
      const generated: PresentedQuizQuestion[] = json.data.questions.map(
        (q: PresentedQuizQuestion, i: number) => ({ ...q, id: `aiq-${Date.now()}-${i}` })
      )
      setQuestions((prev) => [...prev, ...generated])
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setGenerating(false)
    }
  }

  const validate = (): string | null => {
    if (!title.trim()) return "Give the quiz a title"
    if (questions.length === 0) return "Add at least one question"
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      if (!q.question.trim()) return `Question ${i + 1} is missing the question text`
      const answers = serializeAnswer(q)
      if (q.type === "multiple-select") {
        if (!Array.isArray(answers) || answers.length === 0) {
          return `Select at least one correct answer for question ${i + 1}`
        }
      } else if (!answers) {
        return `Select the correct answer for question ${i + 1}`
      }
    }
    return null
  }

  const save = async () => {
    const problem = validate()
    if (problem) {
      setError(problem)
      return
    }
    setBusy(true)
    setError(null)
    try {
      const payload = {
        lessonId,
        courseId,
        title,
        description,
        timeLimit,
        passingScore,
        questions,
      }
      const url = initialQuiz
        ? `/api/teacher/quizzes/${initialQuiz.id}`
        : "/api/teacher/quizzes"
      const res = await fetch(url, {
        method: initialQuiz ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        setError(json.error || "Could not save quiz")
        return
      }
      onSaved()
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setBusy(false)
    }
  }

  const remove = async () => {
    if (!initialQuiz) return
    if (!confirm("Delete this quiz?")) return
    setBusy(true)
    setError(null)
    try {
      const res = await fetch(`/api/teacher/quizzes/${initialQuiz.id}`, { method: "DELETE" })
      const json = await res.json()
      if (!res.ok || !json.success) {
        setError(json.error || "Could not delete quiz")
        return
      }
      onDeleted()
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setBusy(false)
    }
  }

  const inputClass =
    "mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"

  return (
    <div className="space-y-4 rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-primary" />
          <h4 className="text-sm font-semibold">
            {initialQuiz ? "Edit quiz for this lecture" : "Add quiz for this lecture"}
          </h4>
        </div>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground -mt-2">
        Students will take this quiz after watching “{lessonTitle}”.
      </p>

      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label>Quiz Title</Label>
          <input
            className={inputClass}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={`${lessonTitle} — Quiz`}
          />
        </div>
        <div>
          <Label>Description (optional)</Label>
          <input
            className={inputClass}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What this quiz covers"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Time Limit (min)</Label>
          <input
            type="number"
            className={inputClass}
            value={timeLimit}
            onChange={(e) => setTimeLimit(Number(e.target.value))}
            min={1}
          />
        </div>
        <div>
          <Label>Passing Score (%)</Label>
          <input
            type="number"
            className={inputClass}
            value={passingScore}
            onChange={(e) => setPassingScore(Number(e.target.value))}
            min={0}
            max={100}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">
            Questions <span className="text-muted-foreground">({questions.length})</span>
          </p>
          <div className="flex items-center gap-1.5">
            {questions.length > 0 && (
              <Button variant="default" size="sm" onClick={generateWithAi} disabled={generating} className="bg-primary h-7">
                {generating ? (
                  <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
                ) : (
                  <Sparkles className="mr-1.5 h-3 w-3" />
                )}
                {generating ? "Generating..." : "AI Generate"}
              </Button>
            )}
            <Button variant="outline" size="sm" className="h-7" onClick={() => addQuestion("mcq")}>
              <Plus className="mr-1 h-3 w-3" />
              MCQ
            </Button>
            <Button variant="outline" size="sm" className="h-7" onClick={() => addQuestion("true-false")}>
              <Plus className="mr-1 h-3 w-3" />
              T/F
            </Button>
            <Button variant="outline" size="sm" className="h-7" onClick={() => addQuestion("multiple-select")}>
              <Plus className="mr-1 h-3 w-3" />
              Multi
            </Button>
          </div>
        </div>

        {questions.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed p-6 text-center text-sm text-muted-foreground">
            {generating ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                AI is writing questions for this lecture…
              </span>
            ) : (
              "No questions yet. Add them manually or press AI Generate — it writes questions based on this lecture."
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {questions.map((q, idx) => (
              <div key={q.id} className="rounded-lg border">
                <div
                  className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => setEditingQuestion(editingQuestion === idx ? null : idx)}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-semibold text-primary">
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{q.question || "New question"}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {q.type === "mcq" ? "Multiple Choice" : q.type === "true-false" ? "True/False" : "Multiple Select"}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeQuestion(idx)
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                  {editingQuestion === idx ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>

                {editingQuestion === idx && (
                  <div className="border-t px-4 py-3 space-y-3 bg-muted/20">
                    <div>
                      <Label>Question</Label>
                      <input
                        className={inputClass}
                        value={q.question}
                        onChange={(e) => updateQuestion(idx, { question: e.target.value })}
                        placeholder="Enter your question..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Options</Label>
                      {q.type === "true-false" ? (
                        <div className="grid grid-cols-2 gap-2">
                          <div className="rounded-lg border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 p-3 text-sm text-center font-medium text-emerald-700 dark:text-emerald-400">
                            True
                          </div>
                          <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 p-3 text-sm text-center font-medium text-red-700 dark:text-red-400">
                            False
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          {q.options.map((opt, oi) => (
                            <div key={oi} className="flex items-center gap-2">
                              <input
                                className="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                value={opt}
                                onChange={(e) => {
                                  const next = [...q.options]
                                  next[oi] = e.target.value
                                  updateQuestion(idx, { options: next })
                                }}
                                placeholder={`Option ${oi + 1}`}
                              />
                              {q.options.length > 2 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 text-destructive"
                                  onClick={() => {
                                    const next = q.options.filter((_, i) => i !== oi)
                                    updateQuestion(idx, { options: next })
                                  }}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          ))}
                          {(
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full mt-0.5"
                              onClick={() => updateQuestion(idx, { options: [...q.options, ""] })}
                            >
                              <Plus className="mr-1.5 h-3.5 w-3.5" />
                              Add Option
                            </Button>
                          )}
                        </div>
                      )}
                    </div>

                    <QuestionAnswerPicker
                      type={q.type}
                      options={q.options}
                      correctAnswer={q.correctAnswer}
                      onChange={(answer) => updateQuestion(idx, { correctAnswer: answer })}
                      inputClass={inputClass}
                    />

                    <div>
                      <Label>Explanation (optional)</Label>
                      <input
                        className={inputClass}
                        value={q.explanation || ""}
                        onChange={(e) => updateQuestion(idx, { explanation: e.target.value })}
                        placeholder="Shown after answering"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t pt-3">
        <div className="flex gap-2">
          <Button size="sm" onClick={save} disabled={busy}>
            {busy && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
            Save Quiz
          </Button>
          <Button size="sm" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
        {initialQuiz && (
          <Button size="sm" variant="ghost" className="text-destructive" onClick={remove} disabled={busy}>
            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
            Delete Quiz
          </Button>
        )}
      </div>
    </div>
  )
}

export function QuestionBadge({ count }: { count: number }) {
  if (count <= 0) {
    return (
      <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 text-muted-foreground">
        No quiz yet
      </Badge>
    )
  }
  return (
    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5">
      {count} question{count !== 1 ? "s" : ""}
    </Badge>
  )
}

function QuestionAnswerPicker({
  type,
  options,
  correctAnswer,
  onChange,
  inputClass,
}: {
  type: QuestionType
  options: string[]
  correctAnswer: string | string[]
  onChange: (answer: string | string[]) => void
  inputClass: string
}) {
  if (type === "mcq" || type === "true-false") {
    const selected = correctAnswer as string
    return (
      <div>
        <Label>Correct Answer</Label>
        <select
          value={selected}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        >
          <option value="">Select correct answer</option>
          {options.map((opt, idx) => (
            <option key={idx} value={opt}>
              {opt || `Option ${idx + 1}`}
            </option>
          ))}
        </select>
      </div>
    )
  }

  const selected = Array.isArray(correctAnswer) ? correctAnswer : []
  const toggle = (opt: string) => {
    onChange(selected.includes(opt) ? selected.filter((o) => o !== opt) : [...selected, opt])
  }
  return (
    <div>
      <Label>Correct Answers (select all)</Label>
      <div className="mt-1.5 space-y-1.5">
        {options.map((opt, idx) => {
          const isSelected = selected.includes(opt)
          return (
            <button
              key={idx}
              type="button"
              onClick={() => opt && toggle(opt)}
              className={`flex w-full items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors ${
                isSelected
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-input hover:bg-muted/50"
              }`}
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                  isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"
                }`}
              >
                {isSelected && <span className="text-[10px] leading-none">✓</span>}
              </span>
              <span className="truncate text-left">{opt || `Option ${idx + 1}`}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}