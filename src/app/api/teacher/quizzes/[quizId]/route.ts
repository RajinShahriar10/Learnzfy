import { NextRequest } from "next/server"
import { Prisma } from "@prisma/client"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ok, err, notFound, unauthorized } from "@/lib/api-helpers"

function serializeAnswer(type: string, correctAnswer: unknown): string {
  if (Array.isArray(correctAnswer)) return JSON.stringify(correctAnswer)
  if (type === "multiple-select") return String(correctAnswer ?? "")
  return String(correctAnswer ?? "")
}

function sanitizeQuestions(raw: unknown): Array<{
  type: string
  question: string
  options: string[]
  correctAnswer: string
  explanation?: string
}> | null {
  if (!Array.isArray(raw)) return null
  const validTypes = ["mcq", "true-false", "multiple-select"]
  const out = []
  for (const item of raw) {
    if (!item || typeof item !== "object") continue
    const q = item as Record<string, unknown>
    const type = validTypes.includes(String(q.type)) ? String(q.type) : "mcq"
    const question = String(q.question || "").trim()
    const options = Array.isArray(q.options)
      ? q.options.map((o) => String(o).trim()).filter(Boolean)
      : []
    if (!question || options.length < 2) continue
    out.push({
      type,
      question,
      options,
      correctAnswer: serializeAnswer(type, q.correctAnswer),
      explanation: String(q.explanation || "").trim() || undefined,
    })
  }
  return out
}

async function getOwnedQuiz(quizId: string, userId: string) {
  const quiz = await prisma.quiz.findUnique({ where: { id: quizId } })
  if (!quiz) return { quiz: null, owner: false }

  let owner = userId === quiz.teacherId

  if (!owner && quiz.courseId) {
    const course = await prisma.course.findUnique({
      where: { id: quiz.courseId },
      select: { teacherId: true },
    })
    if (course) owner = course.teacherId === userId
  }
  if (!owner && quiz.lessonId) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: quiz.lessonId },
      include: { module: { select: { course: { select: { teacherId: true } } } } },
    })
    if (lesson) owner = lesson.module.course.teacherId === userId
  }

  return { quiz, owner }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return unauthorized()

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"

  const { quizId } = await params
  const { quiz, owner } = await getOwnedQuiz(quizId, session.user.id)
  if (!quiz) return notFound("Quiz")
  if (!owner && !isAdmin) return err("You can only edit your own quizzes", 403)

  const body = await req.json()
  const { title, description, timeLimit, passingScore, questions } = body

  const cleaned = sanitizeQuestions(questions)
  if (!cleaned) return err("questions must be an array", 422)
  if (!title || !String(title).trim()) return err("Quiz title is required")

  await prisma.$transaction([
    prisma.question.deleteMany({ where: { quizId } }),
    prisma.quiz.update({
      where: { id: quizId },
      data: {
        title: String(title),
        description: description || null,
        timeLimit: timeLimit ? Math.max(1, parseInt(String(timeLimit), 10)) : null,
        passingScore: passingScore ? Math.min(100, Math.max(0, Number(passingScore))) : 70,
        questions: {
          create: cleaned.map((q, i) => ({
            text: q.question,
            type: q.type,
            options: q.options as Prisma.InputJsonValue,
            correctAnswer: q.correctAnswer,
            points: 1,
            order: i + 1,
          })),
        },
      },
    }),
  ])

  const updated = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: { questions: { orderBy: { order: "asc" } } },
  })
  return ok(updated)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return unauthorized()

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"

  const { quizId } = await params
  const { quiz, owner } = await getOwnedQuiz(quizId, session.user.id)
  if (!quiz) return notFound("Quiz")
  if (!owner && !isAdmin) return err("You can only delete your own quizzes", 403)

  await prisma.quiz.delete({ where: { id: quizId } })
  return ok({ id: quizId })
}