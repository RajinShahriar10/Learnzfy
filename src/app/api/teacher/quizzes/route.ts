import { NextRequest } from "next/server"
import { Prisma } from "@prisma/client"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ok, err, unauthorized } from "@/lib/api-helpers"

export interface TeacherQuestionInput {
  type?: string
  question?: string
  options?: unknown
  correctAnswer?: unknown
  explanation?: string
}

function serializeAnswer(type: string, correctAnswer: unknown): string {
  if (Array.isArray(correctAnswer)) return JSON.stringify(correctAnswer)
  if (type === "multiple-select") return String(correctAnswer ?? "")
  return String(correctAnswer ?? "")
}

function sanitizeQuestions(raw: unknown): TeacherQuestionInput[] | null {
  if (!Array.isArray(raw)) return null
  const validTypes = ["mcq", "true-false", "multiple-select"]
  const out: TeacherQuestionInput[] = []
  for (const item of raw) {
    if (!item || typeof item !== "object") continue
    const q = item as Record<string, unknown>
    const type = validTypes.includes(String(q.type)) ? String(q.type) : "mcq"
    const question = String(q.question || "").trim()
    const options = Array.isArray(q.options)
      ? q.options.map((o) => String(o).trim()).filter(Boolean)
      : []
    const correctAnswer = q.correctAnswer
    if (!question || options.length < 2) continue
    out.push({ type, question, options, correctAnswer, explanation: String(q.explanation || "").trim() || undefined })
  }
  return out
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return unauthorized()

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })
  const canManage =
    user?.role === "TEACHER" || user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"
  if (!canManage) return err("Only teachers and admins can manage quizzes", 403)

  const body = await req.json()
  const { lessonId, courseId, title, description, timeLimit, passingScore, questions } = body

  if (!title || !String(title).trim()) {
    return err("Quiz title is required")
  }

  const cleaned = sanitizeQuestions(questions)
  if (!cleaned || cleaned.length === 0) {
    return err("Add at least one question to this quiz", 422)
  }

  let targetCourseId = courseId || null
  let isOwner = false
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"

  if (lessonId) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: { select: { course: { select: { id: true, teacherId: true } } } } },
    })
    if (!lesson) return err("Lesson not found", 404)
    targetCourseId = lesson.module.course.id
    isOwner = lesson.module.course.teacherId === session.user.id
  } else if (targetCourseId) {
    const course = await prisma.course.findUnique({
      where: { id: targetCourseId },
      select: { teacherId: true },
    })
    if (!course) return err("Course not found", 404)
    isOwner = course.teacherId === session.user.id
  }

  if (!isOwner && !isAdmin) {
    return err("You can only create quizzes for your own courses", 403)
  }

  const quiz = await prisma.quiz.create({
    data: {
      title: String(title),
      description: description || null,
      lessonId: lessonId || null,
      courseId: targetCourseId,
      teacherId: session.user.id,
      timeLimit: timeLimit ? Math.max(1, parseInt(String(timeLimit), 10)) : null,
      passingScore: passingScore ? Math.min(100, Math.max(0, Number(passingScore))) : 70,
      questions: {
        create: cleaned.map((q, i) => ({
          text: q.question as string,
          type: q.type as string,
          options: q.options as Prisma.InputJsonValue,
          correctAnswer: serializeAnswer(q.type as string, q.correctAnswer),
          points: 1,
          order: i + 1,
        })),
      },
    },
    include: { questions: { orderBy: { order: "asc" } } },
  })

  return ok(quiz)
}