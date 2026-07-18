import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { ok, notFound } from "@/lib/api-helpers"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  const { lessonId } = await params

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      module: {
        include: {
          course: {
            include: {
              modules: {
                orderBy: { order: "asc" },
                include: {
                  lessons: { orderBy: { order: "asc" } },
                },
              },
            },
          },
        },
      },
    },
  })

  if (!lesson) return notFound("Lesson")

  const quiz = await prisma.quiz.findFirst({
    where: { lessonId },
    include: {
      questions: { orderBy: { order: "asc" } },
    },
  })

  const course = lesson.module.course

  return ok({
    lesson: {
      id: lesson.id,
      title: lesson.title,
      description: lesson.description || lesson.content,
      contentType: lesson.videoUrl ? "video" : "article",
      duration: lesson.duration ? `${lesson.duration} min` : null,
      isFree: lesson.isFree,
      order: lesson.order,
      videoUrl: lesson.videoUrl,
      content: lesson.content,
    },
    course: {
      id: course.id,
      title: course.title,
      thumbnailUrl: course.thumbnailUrl,
    },
    modules: course.modules.map((m) => ({
      id: m.id,
      title: m.title,
      order: m.order,
      lessons: m.lessons.map((l) => ({
        id: l.id,
        title: l.title,
        order: l.order,
        isFree: l.isFree,
        contentType: l.videoUrl ? "video" : "article",
      })),
    })),
    quiz: quiz
      ? {
          id: quiz.id,
          title: quiz.title,
          description: quiz.description,
          timeLimit: quiz.timeLimit,
          passingScore: quiz.passingScore,
          questions: quiz.questions.map((q) => ({
            id: q.id,
            type: q.type,
            question: q.text,
            options: q.options,
            correctAnswer: q.correctAnswer,
            points: q.points,
          })),
        }
      : null,
  })
}
