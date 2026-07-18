"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  Save,
  Eye,
  Plus,
  GripVertical,
  Pencil,
  Trash2,
  Video,
  FileText,
  HelpCircle,
  Code,
  ChevronDown,
  ChevronRight,
  Play,
  FileCheck,
  Layers,
} from "lucide-react"

type QuestionType = "mcq" | "true-false" | "multiple-select"

interface QuizQuestion {
  id: string
  type: QuestionType
  question: string
  options: string[]
  correctAnswer: string | string[]
  explanation?: string
}

interface TeacherQuiz {
  id: string
  courseId: string
  moduleId: string
  lessonId: string
  title: string
  description: string
  timeLimit: number
  passingScore: number
  attemptsAllowed: number
  randomQuestions: boolean
  questions: QuizQuestion[]
}

interface TeacherModule {
  id: string
  title: string
  description: string
  order: number
  lessons: TeacherLesson[]
}

interface TeacherLesson {
  id: string
  title: string
  description: string
  contentType: "video" | "article" | "quiz" | "code"
  duration: string
  isFree: boolean
  order: number
}

interface ExamQuestionType {
  id: string
  type: QuestionType
  question: string
  options: string[]
  correctAnswer: string | string[]
  marks: number
}

interface QuestionPool {
  id: string
  title: string
  questionsToSelect: number
  questions: ExamQuestionType[]
}

interface TeacherExam {
  id: string
  title: string
  description: string
  courseId: string
  timeLimit: number
  passingScore: number
  maxAttempts: number
  isPublished: boolean
  questions: ExamQuestionType[]
  questionPools: QuestionPool[]
  placementModuleId?: string
  randomizeQuestions?: boolean
  attemptsAllowed?: number
}

interface CourseData {
  id: string
  title: string
  slug: string
  description: string
  shortDescription: string
  thumbnail: string
  category: string
  difficulty: "beginner" | "intermediate" | "advanced"
  duration: string
  isPublished: boolean
  studentCount: number
  completionRate?: number
  averageScore?: number
  rating?: number
  createdAt: string
  updatedAt: string
  modules: TeacherModule[]
  quizzes: TeacherQuiz[]
  exams: (TeacherExam & { questionPools: QuestionPool[] })[]
}

const difficultyColors: Record<string, string> = {
  beginner: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
  intermediate: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400",
  advanced: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
}

const contentTypeIcons: Record<string, typeof Video> = {
  video: Video,
  article: FileText,
  quiz: HelpCircle,
  code: Code,
}

const contentTypeLabels: Record<string, string> = {
  video: "Video",
  article: "Article",
  quiz: "Quiz",
  code: "Code Exercise",
}

export default function EditCoursePage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId as string
  const [course, setCourse] = useState<CourseData | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())
  const [editingQuiz, setEditingQuiz] = useState<TeacherQuiz | null>(null)
  const [showNewQuiz, setShowNewQuiz] = useState(false)
  const [editingExam, setEditingExam] = useState<TeacherExam | null>(null)
  const [showNewExam, setShowNewExam] = useState(false)

  useEffect(() => {
    fetch(`/api/teacher/courses/${courseId}`)
      .then((r) => {
        if (!r.ok) throw new Error("not found")
        return r.json()
      })
      .then((json) => {
        const data = json.data as CourseData
        data.exams = data.exams.map((e) => ({
          ...e,
          questionPools: e.questionPools || [],
          attemptsAllowed: e.attemptsAllowed || e.maxAttempts,
          randomizeQuestions: e.randomizeQuestions ?? true,
        }))
        setCourse(data)
        setExpandedModules(new Set(data.modules.map((m) => m.id)))
      })
      .catch(() => setCourse(null))
      .finally(() => setLoading(false))
  }, [courseId])

  const courseQuizzes = course?.quizzes || []
  const courseExams = course?.exams || []

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-2xl font-bold">Loading course...</h2>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-2xl font-bold">Course not found</h2>
        <p className="mt-2 text-muted-foreground">
          The course you are looking for does not exist
        </p>
        <Button asChild className="mt-6">
          <Link href="/teacher/courses">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Link>
        </Button>
      </div>
    )
  }

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link href="/teacher/courses">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Courses
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <Badge className={cn("font-normal", difficultyColors[course.difficulty])}>
              {course.difficulty}
            </Badge>
            <Badge variant="outline">{course.category}</Badge>
            {course.isPublished ? (
              <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                Published
              </Badge>
            ) : (
              <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                Draft
              </Badge>
            )}
            <span className="text-sm text-muted-foreground">{course.duration}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Eye className="mr-1.5 h-4 w-4" />
            Preview
          </Button>
          <Button size="sm">
            <Save className="mr-1.5 h-4 w-4" />
            Save
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Course Content</h2>
                <Button size="sm">
                  <Plus className="mr-1.5 h-4 w-4" />
                  Add Module
                </Button>
              </div>

              {course.modules.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center rounded-lg border-2 border-dashed">
                  <Plus className="h-10 w-10 text-muted-foreground/50" />
                  <h3 className="mt-4 font-semibold">No modules yet</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Start building your course by adding modules and lessons
                  </p>
                  <Button size="sm" className="mt-4">
                    <Plus className="mr-1.5 h-4 w-4" />
                    Create First Module
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {course.modules.map((mod, idx) => (
                    <ModuleCard
                      key={mod.id}
                      module={mod}
                      index={idx}
                      isExpanded={expandedModules.has(mod.id)}
                      onToggle={() => toggleModule(mod.id)}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {editingQuiz || showNewQuiz ? (
          <QuizEditorPanel
            quiz={editingQuiz}
            courseId={course.id}
            onSave={() => { setEditingQuiz(null); setShowNewQuiz(false) }}
            onCancel={() => { setEditingQuiz(null); setShowNewQuiz(false) }}
          />
        ) : (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">Quizzes</h2>
                    <p className="text-sm text-muted-foreground">
                      {courseQuizzes.length} quiz{courseQuizzes.length !== 1 ? "zes" : ""} in this course
                    </p>
                  </div>
                  <Button size="sm" onClick={() => setShowNewQuiz(true)}>
                    <Plus className="mr-1.5 h-4 w-4" />
                    Add Quiz
                  </Button>
                </div>

                {courseQuizzes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center rounded-lg border-2 border-dashed">
                    <HelpCircle className="h-8 w-8 text-muted-foreground/50" />
                    <h3 className="mt-3 font-medium text-sm">No quizzes yet</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Create quizzes to assess student understanding
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {courseQuizzes.map((qz) => (
                      <div
                        key={qz.id}
                        className="flex items-center gap-3 rounded-lg border bg-background p-3 text-sm"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-amber-100 dark:bg-amber-950">
                          <HelpCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{qz.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {qz.questions.length} questions &middot; {qz.timeLimit} min &middot; {qz.passingScore}% pass
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setEditingQuiz(qz)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {editingExam || showNewExam ? (
          <ExamEditorPanel
            exam={editingExam}
            courseId={course.id}
            modules={course.modules}
            onSave={() => { setEditingExam(null); setShowNewExam(false) }}
            onCancel={() => { setEditingExam(null); setShowNewExam(false) }}
          />
        ) : (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">Exams</h2>
                    <p className="text-sm text-muted-foreground">
                      {courseExams.length} exam{courseExams.length !== 1 ? "s" : ""} in this course
                    </p>
                  </div>
                  <Button size="sm" onClick={() => setShowNewExam(true)}>
                    <Plus className="mr-1.5 h-4 w-4" />
                    Add Exam
                  </Button>
                </div>

                {courseExams.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center rounded-lg border-2 border-dashed">
                    <FileCheck className="h-8 w-8 text-muted-foreground/50" />
                    <h3 className="mt-3 font-medium text-sm">No exams yet</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Create comprehensive exams with question pools
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {courseExams.map((ex) => (
                      <div
                        key={ex.id}
                        className="flex items-center gap-3 rounded-lg border bg-background p-3 text-sm"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-red-100 dark:bg-red-950">
                          <FileCheck className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{ex.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {ex.questionPools.reduce((s, p) => s + p.questions.length, 0)} questions in {ex.questionPools.length} pools &middot; {ex.timeLimit} min &middot; {ex.passingScore}% pass
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setEditingExam(ex)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Course Info</h2>
              <div className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <input
                    type="text"
                    defaultValue={course.title}
                    className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <Label>Short Description</Label>
                  <input
                    type="text"
                    defaultValue={course.shortDescription}
                    className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <textarea
                    defaultValue={course.description}
                    rows={4}
                    className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-y"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Category</Label>
                    <select
                      defaultValue={course.category}
                      className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {["Web Development", "Mobile Development", "Data Science", "Design", "Business", "Marketing"].map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Difficulty</Label>
                    <select
                      defaultValue={course.difficulty}
                      className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {["beginner", "intermediate", "advanced"].map((d) => (
                        <option key={d} className="capitalize">
                          {d.charAt(0).toUpperCase() + d.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <Label>Duration</Label>
                  <input
                    type="text"
                    defaultValue={course.duration}
                    className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Statistics</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Students</span>
                  <span className="font-medium">{course.studentCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Completion Rate</span>
                  <span className="font-medium">{course.completionRate}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Avg Score</span>
                  <span className="font-medium">{course.averageScore}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Rating</span>
                  <span className="font-medium">{course.rating}/5</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function ModuleCard({
  module,
  index,
  isExpanded,
  onToggle,
}: {
  module: TeacherModule
  index: number
  isExpanded: boolean
  onToggle: () => void
}) {
  return (
    <Card className="overflow-hidden">
      <div
        className="flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={onToggle}
      >
        <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/40" />
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-sm font-semibold text-primary">
          {index + 1}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium">{module.title}</p>
          <p className="text-xs text-muted-foreground">
            {module.lessons.length} lesson{module.lessons.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-destructive"
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="border-t px-4 py-3 space-y-2">
          {module.lessons.map((lesson, idx) => {
            const Icon = contentTypeIcons[lesson.contentType]
            return (
              <div
                key={lesson.id}
                className="flex items-center gap-3 rounded-lg border bg-background p-3 text-sm"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
                  <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{lesson.title}</span>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">
                      {contentTypeLabels[lesson.contentType]}
                    </Badge>
                    {lesson.isFree && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5">
                        Free
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{lesson.duration}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )
          })}
          <Button variant="outline" size="sm" className="w-full mt-2">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Add Lesson
          </Button>
        </div>
      )}
    </Card>
  )
}

function QuizEditorPanel({
  quiz,
  courseId,
  onSave,
  onCancel,
}: {
  quiz: TeacherQuiz | null
  courseId: string
  onSave: () => void
  onCancel: () => void
}) {
  const [title, setTitle] = useState(quiz?.title || "")
  const [description, setDescription] = useState(quiz?.description || "")
  const [timeLimit, setTimeLimit] = useState(quiz?.timeLimit || 15)
  const [passingScore, setPassingScore] = useState(quiz?.passingScore || 70)
  const [attemptsAllowed, setAttemptsAllowed] = useState(quiz?.attemptsAllowed || 3)
  const [randomQuestions, setRandomQuestions] = useState(quiz?.randomQuestions || false)
  const [questions, setQuestions] = useState<QuizQuestion[]>(quiz?.questions || [])
  const [editingQuestion, setEditingQuestion] = useState<number | null>(null)

  const addQuestion = (type: QuestionType) => {
    const newQ: QuizQuestion = {
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

  const updateQuestion = (index: number, updates: Partial<QuizQuestion>) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, ...updates } : q))
    )
  }

  const removeQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index))
    setEditingQuestion(null)
  }

  return (
    <div className="lg:col-span-2 space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold">
                {quiz ? "Edit Quiz" : "Create Quiz"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {quiz ? "Modify quiz settings and questions" : "Add a new quiz to your course"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onCancel}>
                Cancel
              </Button>
              <Button size="sm" onClick={onSave}>
                <Save className="mr-1.5 h-4 w-4" />
                Save Quiz
              </Button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 mb-6">
            <div className="space-y-3">
              <div>
                <Label>Quiz Title</Label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., HTML & CSS Fundamentals Quiz"
                  className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <Label>Description</Label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what this quiz covers..."
                  rows={3}
                  className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-y"
                />
              </div>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Time Limit (min)</Label>
                  <input
                    type="number"
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(Number(e.target.value))}
                    min={1}
                    className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <Label>Passing Score (%)</Label>
                  <input
                    type="number"
                    value={passingScore}
                    onChange={(e) => setPassingScore(Number(e.target.value))}
                    min={0}
                    max={100}
                    className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Attempts Allowed</Label>
                  <input
                    type="number"
                    value={attemptsAllowed}
                    onChange={(e) => setAttemptsAllowed(Number(e.target.value))}
                    min={1}
                    className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={randomQuestions}
                      onChange={(e) => setRandomQuestions(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    Randomize questions
                  </label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Questions</h3>
              <p className="text-sm text-muted-foreground">
                {questions.length} question{questions.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => addQuestion("mcq")}>
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                MCQ
              </Button>
              <Button variant="outline" size="sm" onClick={() => addQuestion("true-false")}>
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                True/False
              </Button>
              <Button variant="outline" size="sm" onClick={() => addQuestion("multiple-select")}>
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Multi-Select
              </Button>
            </div>
          </div>

          {questions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center rounded-lg border-2 border-dashed">
              <HelpCircle className="h-10 w-10 text-muted-foreground/50" />
              <h3 className="mt-3 font-medium">No questions yet</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Add MCQ, True/False, or Multiple Select questions
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {questions.map((q, idx) => (
                <div key={q.id} className="rounded-lg border overflow-hidden">
                  <div
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => setEditingQuestion(editingQuestion === idx ? null : idx)}
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-semibold text-primary">
                      {idx + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {q.question || "New question"}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {q.type === "mcq" ? "Multiple Choice" : q.type === "true-false" ? "True/False" : "Multiple Select"}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-destructive"
                      onClick={(e) => { e.stopPropagation(); removeQuestion(idx) }}
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
                    <QuestionEditor
                      question={q}
                      onUpdate={(updates) => updateQuestion(idx, updates)}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function QuestionEditor({
  question,
  onUpdate,
}: {
  question: QuizQuestion
  onUpdate: (updates: Partial<QuizQuestion>) => void
}) {
  const updateOption = (optIndex: number, value: string) => {
    const newOptions = [...question.options]
    newOptions[optIndex] = value
    onUpdate({ options: newOptions })
  }

  const addOption = () => {
    onUpdate({ options: [...question.options, ""] })
  }

  const removeOption = (optIndex: number) => {
    if (question.options.length <= 2) return
    const newOptions = question.options.filter((_, i) => i !== optIndex)
    onUpdate({ options: newOptions })
  }

  return (
    <div className="border-t px-4 py-4 space-y-4 bg-muted/20">
      <div>
        <Label>Question</Label>
        <input
          type="text"
          value={question.question}
          onChange={(e) => onUpdate({ question: e.target.value })}
          placeholder="Enter your question..."
          className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="space-y-2">
        <Label>Options</Label>
        {question.type === "true-false" ? (
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 p-3 text-sm text-center font-medium text-emerald-700 dark:text-emerald-400">
              True
            </div>
            <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 p-3 text-sm text-center font-medium text-red-700 dark:text-red-400">
              False
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {question.options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                {question.type === "mcq" ? (
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-muted-foreground/30">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                  </div>
                ) : (
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 border-muted-foreground/30">
                    <svg className="h-3 w-3 text-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => updateOption(idx, e.target.value)}
                  placeholder={`Option ${idx + 1}`}
                  className="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
                {question.options.length > 2 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-destructive"
                    onClick={() => removeOption(idx)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            ))}
            {(
              <Button variant="outline" size="sm" onClick={addOption} className="w-full mt-1">
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Add Option
              </Button>
            )}
          </div>
        )}
      </div>

      <div>
        <Label>Correct Answer</Label>
        {question.type === "mcq" || question.type === "true-false" ? (
          <select
            value={question.correctAnswer as string}
            onChange={(e) => onUpdate({ correctAnswer: e.target.value })}
            className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Select correct answer</option>
            {question.options.map((opt, idx) => (
              <option key={idx} value={opt}>
                {opt || `Option ${idx + 1}`}
              </option>
            ))}
          </select>
        ) : (
          <div className="mt-1.5 space-y-1">
            {question.options.map((opt, idx) => {
              const isSelected = (question.correctAnswer as string[]).includes(opt)
              return (
                <label key={idx} className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded hover:bg-muted/50">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {
                      const current = question.correctAnswer as string[]
                      const updated = isSelected
                        ? current.filter((a) => a !== opt)
                        : [...current, opt]
                      onUpdate({ correctAnswer: updated })
                    }}
                    className="rounded border-gray-300"
                  />
                  {opt || `Option ${idx + 1}`}
                </label>
              )
            })}
          </div>
        )}
      </div>

      <div>
        <Label>Explanation (shown after quiz)</Label>
        <textarea
          value={question.explanation || ""}
          onChange={(e) => onUpdate({ explanation: e.target.value })}
          placeholder="Explain why this answer is correct..."
          rows={2}
          className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-y"
        />
      </div>
    </div>
  )
}

function ExamEditorPanel({
  exam,
  courseId,
  modules,
  onSave,
  onCancel,
}: {
  exam: TeacherExam | null
  courseId: string
  modules: TeacherModule[]
  onSave: () => void
  onCancel: () => void
}) {
  const [title, setTitle] = useState(exam?.title || "")
  const [description, setDescription] = useState(exam?.description || "")
  const [timeLimit, setTimeLimit] = useState(exam?.timeLimit || 60)
  const [passingScore, setPassingScore] = useState(exam?.passingScore || 60)
  const [attemptsAllowed, setAttemptsAllowed] = useState(exam?.attemptsAllowed || 2)
  const [randomizeQuestions, setRandomizeQuestions] = useState(exam?.randomizeQuestions ?? true)
  const [placementModuleId, setPlacementModuleId] = useState(exam?.placementModuleId || "")
  const [pools, setPools] = useState<QuestionPool[]>(exam?.questionPools || [])
  const [editingPool, setEditingPool] = useState<number | null>(null)

  const addPool = () => {
    const newPool: QuestionPool = {
      id: `pool-${Date.now()}`,
      title: "",
      questionsToSelect: 1,
      questions: [],
    }
    setPools((prev) => [...prev, newPool])
    setEditingPool(pools.length)
  }

  const updatePool = (poolIndex: number, updates: Partial<QuestionPool>) => {
    setPools((prev) => prev.map((p, i) => (i === poolIndex ? { ...p, ...updates } : p)))
  }

  const removePool = (poolIndex: number) => {
    setPools((prev) => prev.filter((_, i) => i !== poolIndex))
    setEditingPool(null)
  }

  const addPoolQuestion = (poolIndex: number, type: QuestionType) => {
    const newQ: ExamQuestionType = {
      id: `exq-${Date.now()}`,
      type,
      question: "",
      options: type === "true-false" ? ["True", "False"] : ["", ""],
      correctAnswer: type === "multiple-select" ? [] : "",
      marks: 5,
    }
    setPools((prev) =>
      prev.map((p, i) =>
        i === poolIndex ? { ...p, questions: [...p.questions, newQ] } : p
      )
    )
  }

  const updatePoolQuestion = (
    poolIndex: number,
    questionIndex: number,
    updates: Partial<ExamQuestionType>
  ) => {
    setPools((prev) =>
      prev.map((p, i) =>
        i === poolIndex
          ? {
              ...p,
              questions: p.questions.map((q, j) =>
                j === questionIndex ? { ...q, ...updates } : q
              ),
            }
          : p
      )
    )
  }

  const removePoolQuestion = (poolIndex: number, questionIndex: number) => {
    setPools((prev) =>
      prev.map((p, i) =>
        i === poolIndex
          ? { ...p, questions: p.questions.filter((_, j) => j !== questionIndex) }
          : p
      )
    )
  }

  const totalQuestions = pools.reduce((s, p) => s + p.questions.length, 0)
  const totalMarks = pools.reduce((s, p) => s + p.questions.reduce((ms, q) => ms + q.marks, 0), 0)

  return (
    <div className="lg:col-span-2 space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold">
                {exam ? "Edit Exam" : "Create Exam"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {exam ? "Modify exam settings and question pools" : "Add a comprehensive exam with question pools"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
              <Button size="sm" onClick={onSave}>
                <Save className="mr-1.5 h-4 w-4" />
                Save Exam
              </Button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 mb-6">
            <div className="space-y-3">
              <div>
                <Label>Exam Title</Label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Web Development Fundamentals Exam"
                  className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <Label>Description</Label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what this exam covers..."
                  rows={3}
                  className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-y"
                />
              </div>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Time Limit (min)</Label>
                  <input
                    type="number"
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(Number(e.target.value))}
                    min={1}
                    className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <Label>Passing Score (%)</Label>
                  <input
                    type="number"
                    value={passingScore}
                    onChange={(e) => setPassingScore(Number(e.target.value))}
                    min={0} max={100}
                    className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Attempts Allowed</Label>
                  <input
                    type="number"
                    value={attemptsAllowed}
                    onChange={(e) => setAttemptsAllowed(Number(e.target.value))}
                    min={1}
                    className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <Label>Placement</Label>
                  <select
                    value={placementModuleId}
                    onChange={(e) => setPlacementModuleId(e.target.value)}
                    className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">End of course</option>
                    {modules.map((m) => (
                      <option key={m.id} value={m.id}>
                        After: {m.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={randomizeQuestions}
                  onChange={(e) => setRandomizeQuestions(e.target.checked)}
                  className="rounded border-gray-300"
                />
                Randomize questions from pools
              </label>
            </div>
          </div>

          <div className="border-t pt-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>{totalQuestions} total questions in {pools.length} pools</span>
            <span>{totalMarks} total marks</span>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {pools.map((pool, poolIdx) => (
          <Card key={pool.id} className="overflow-hidden">
            <div className="bg-muted/30 px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Layers className="h-4 w-4 text-muted-foreground" />
                <div>
                  <input
                    type="text"
                    value={pool.title}
                    onChange={(e) => updatePool(poolIdx, { title: e.target.value })}
                    placeholder="Pool title (e.g., HTML & CSS)"
                    className="bg-transparent font-medium text-sm outline-none border-b border-transparent focus:border-primary"
                  />
                  <p className="text-xs text-muted-foreground">
                    {pool.questions.length} questions &middot; Select {pool.questionsToSelect}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-muted-foreground">Select:</span>
                  <input
                    type="number"
                    value={pool.questionsToSelect}
                    onChange={(e) => updatePool(poolIdx, { questionsToSelect: Math.max(1, Math.min(Number(e.target.value), pool.questions.length)) })}
                    min={1}
                    max={pool.questions.length}
                    className="w-12 rounded border bg-background px-1.5 py-0.5 text-xs text-center outline-none"
                  />
                  <span className="text-muted-foreground">/ {pool.questions.length}</span>
                </div>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setEditingPool(editingPool === poolIdx ? null : poolIdx)}>
                  {editingPool === poolIdx ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                </Button>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive" onClick={() => removePool(poolIdx)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {editingPool === poolIdx && (
              <div className="border-t px-5 py-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => addPoolQuestion(poolIdx, "mcq")}>
                    <Plus className="mr-1.5 h-3.5 w-3.5" />
                    MCQ
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => addPoolQuestion(poolIdx, "true-false")}>
                    <Plus className="mr-1.5 h-3.5 w-3.5" />
                    True/False
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => addPoolQuestion(poolIdx, "multiple-select")}>
                    <Plus className="mr-1.5 h-3.5 w-3.5" />
                    Multi-Select
                  </Button>
                </div>

                {pool.questions.length === 0 ? (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    No questions in this pool. Add questions above.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {pool.questions.map((q, qIdx) => (
                      <div key={q.id} className="rounded-lg border bg-background p-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-muted-foreground shrink-0">Q{qIdx + 1}</span>
                          <div className="flex items-center gap-1 text-[10px]">
                            <Badge variant="outline" className="px-1 py-0 h-4 text-[10px]">
                              {q.type === "mcq" ? "MCQ" : q.type === "true-false" ? "T/F" : "Multi"}
                            </Badge>
                            <Badge variant="outline" className="px-1 py-0 h-4 text-[10px]">
                              {q.marks} marks
                            </Badge>
                          </div>
                          <input
                            type="text"
                            value={q.question}
                            onChange={(e) => updatePoolQuestion(poolIdx, qIdx, { question: e.target.value })}
                            placeholder="Enter question..."
                            className="flex-1 bg-transparent text-sm outline-none border-b border-transparent focus:border-primary"
                          />
                          <input
                            type="number"
                            value={q.marks}
                            onChange={(e) => updatePoolQuestion(poolIdx, qIdx, { marks: Number(e.target.value) })}
                            min={1}
                            className="w-14 rounded border bg-background px-2 py-0.5 text-xs text-center outline-none"
                            title="Marks"
                          />
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-destructive" onClick={() => removePoolQuestion(poolIdx, qIdx)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {q.options.map((opt, oIdx) => (
                            <span key={oIdx} className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                              {opt || `Option ${oIdx + 1}`}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Card>
        ))}

        {pools.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center rounded-lg border-2 border-dashed">
            <Layers className="h-10 w-10 text-muted-foreground/50" />
            <h3 className="mt-3 font-medium">No question pools</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Create question pools to organize exam questions. Each pool lets you select a subset of questions randomly.
            </p>
            <Button size="sm" className="mt-4" onClick={addPool}>
              <Plus className="mr-1.5 h-4 w-4" />
              Add Question Pool
            </Button>
          </div>
        )}

        {pools.length > 0 && (
          <Button variant="outline" size="sm" onClick={addPool} className="w-full">
            <Plus className="mr-1.5 h-4 w-4" />
            Add Another Pool
          </Button>
        )}
      </div>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}
