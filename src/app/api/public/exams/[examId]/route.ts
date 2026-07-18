import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ok, notFound, unauthorized } from "@/lib/api-helpers"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ examId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return unauthorized()

  const { examId } = await params

  const exam = await prisma.exam.findUnique({
    where: { id: examId },
  })

  if (!exam) return notFound("Exam")

  const attempts = await prisma.examAttempt.findMany({
    where: { examId, userId: session.user.id },
    orderBy: { createdAt: "desc" },
  })

  const totalParticipants = await prisma.examAttempt.groupBy({
    by: ["userId"],
    where: { examId },
  }).then((r) => r.length)

  const enrichedAttempts = attempts.map((a, idx) => {
    const percentage = a.score != null && exam.passingScore ? Math.round((a.score / (a.score || 1)) * 100) : 0
    return {
      id: a.id,
      examId: a.examId,
      score: a.score || 0,
      totalMarks: 100,
      percentage,
      correctAnswers: 0,
      totalQuestions: 0,
      timeTaken: a.submittedAt && a.startedAt
        ? Math.round((a.submittedAt.getTime() - a.startedAt.getTime()) / 1000)
        : 0,
      completedAt: a.submittedAt?.toISOString() || null,
      passed: a.score != null && a.score >= exam.passingScore,
      rank: idx + 1,
      totalParticipants,
    }
  })

  return ok({
    id: exam.id,
    courseId: exam.courseId,
    title: exam.title,
    description: exam.description || "",
    timeLimit: exam.timeLimit || 60,
    passingScore: exam.passingScore,
    attemptsAllowed: exam.maxAttempts,
    totalMarks: 100,
    totalQuestions: 0,
    questionPools: [],
    placementTitle: null,
    attempts: enrichedAttempts,
  })
}
