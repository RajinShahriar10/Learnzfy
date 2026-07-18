import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ok, notFound, unauthorized } from "@/lib/api-helpers"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return unauthorized()

  const { courseId } = await params

  const course = await prisma.course.findUnique({
    where: { id: courseId, teacherId: session.user.id },
    include: {
      category: { select: { name: true } },
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: { orderBy: { order: "asc" } },
        },
      },
      _count: { select: { enrollments: true } },
    },
  })

  if (!course) return notFound("Course")

  const quizzes = await prisma.quiz.findMany({
    where: { courseId },
    include: {
      questions: { orderBy: { order: "asc" } },
    },
  })

  const exams = await prisma.exam.findMany({
    where: { courseId },
  })

  return ok({
    id: course.id,
    title: course.title,
    slug: course.slug,
    description: course.description || "",
    shortDescription: course.shortDescription || "",
    thumbnail: course.thumbnailUrl || "",
    category: course.category?.name || "",
    difficulty: course.difficulty || "beginner",
    duration: course.duration || "",
    isPublished: course.isPublished,
    studentCount: course._count.enrollments,
    createdAt: course.createdAt.toISOString(),
    updatedAt: course.updatedAt.toISOString(),
    modules: course.modules.map((m) => ({
      id: m.id,
      title: m.title,
      description: m.description || "",
      order: m.order,
      lessons: m.lessons.map((l) => ({
        id: l.id,
        title: l.title,
        description: l.description || l.content || "",
        contentType: l.videoUrl ? "video" : "article",
        duration: l.duration ? `${l.duration} min` : "",
        isFree: l.isFree,
        order: l.order,
      })),
    })),
    quizzes: quizzes.map((q) => ({
      id: q.id,
      courseId: q.courseId || "",
      moduleId: "",
      lessonId: q.lessonId || "",
      title: q.title,
      description: q.description || "",
      timeLimit: q.timeLimit || 15,
      passingScore: q.passingScore,
      attemptsAllowed: 3,
      randomQuestions: false,
      questions: q.questions.map((question) => ({
        id: question.id,
        type: question.type,
        question: question.text,
        options: (question.options as string[]) || [],
        correctAnswer: question.correctAnswer,
        explanation: "",
      })),
    })),
    exams: exams.map((e) => ({
      id: e.id,
      title: e.title,
      description: e.description || "",
      courseId: e.courseId || "",
      timeLimit: e.timeLimit || 60,
      passingScore: e.passingScore,
      maxAttempts: e.maxAttempts,
      isPublished: e.isPublished,
      questions: [],
      questionPools: [],
    })),
  })
}
