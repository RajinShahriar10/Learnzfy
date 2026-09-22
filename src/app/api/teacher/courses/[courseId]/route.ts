import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ok, notFound, unauthorized, err } from "@/lib/api-helpers"
import { deserializeCorrectAnswer } from "@/lib/quiz-serialization"

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
        youtubeUrl: l.videoUrl || "",
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
        correctAnswer: deserializeCorrectAnswer(question.type, String(question.correctAnswer ?? "")),
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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return unauthorized()

  const { courseId } = await params

  const existing = await prisma.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      teacherId: true,
      title: true,
      description: true,
      difficulty: true,
      duration: true,
      thumbnailUrl: true,
    },
  })

  if (!existing) return notFound("Course")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  const isOwner = existing.teacherId === session.user.id
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"
  if (!isOwner && !isAdmin) {
    return err("You can only edit your own courses", 403)
  }

  const body = await req.json()
  const {
    title,
    description,
    shortDescription,
    category,
    difficulty,
    duration,
    thumbnailUrl,
    isPublished,
  } = body

  let categoryId: string | null = null
  if (category) {
    const cat = await prisma.category.findFirst({ where: { name: category } })
    if (cat) categoryId = cat.id
  }

  const durationInt = duration ? parseInt(String(duration).replace(/\D/g, ""), 10) : null

  const updated = await prisma.course.update({
    where: { id: courseId },
    data: {
      title: title ?? existing.title,
      description: description ?? existing.description,
      shortDescription:
        shortDescription !== undefined && shortDescription !== null
          ? shortDescription
          : undefined,
      thumbnailUrl:
        thumbnailUrl !== undefined && thumbnailUrl !== null
          ? thumbnailUrl
          : undefined,
      categoryId,
      difficulty: difficulty ?? existing.difficulty,
      duration: durationInt === null || isNaN(durationInt) ? undefined : durationInt,
      isPublished: typeof isPublished === "boolean" ? isPublished : undefined,
    },
  })

  return ok(updated)
}
