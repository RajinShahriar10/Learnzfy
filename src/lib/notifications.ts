import { prisma } from "@/lib/prisma"

export type NotificationType =
  | "quiz_result"
  | "exam_result"
  | "rank_change"
  | "badge_earned"
  | "course_update"
  | "announcement"

export interface NotificationInput {
  userId: string
  title: string
  message: string
  type: NotificationType | string
  link?: string
}

export async function createNotification(input: NotificationInput) {
  return prisma.notification.create({
    data: {
      userId: input.userId,
      title: input.title,
      message: input.message,
      type: input.type,
      link: input.link ?? null,
      isRead: false,
    },
  })
}

export async function createNotifications(inputs: NotificationInput[]) {
  const data = inputs.map((input) => ({
    userId: input.userId,
    title: input.title,
    message: input.message,
    type: input.type,
    link: input.link ?? null,
    isRead: false,
  }))

  await prisma.notification.createMany({ data })
}

export async function markNotificationRead(notificationId: string, userId: string) {
  return prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { isRead: true },
  })
}

export async function markAllNotificationsRead(userId: string) {
  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  })
}

export async function getUnreadCount(userId: string): Promise<number> {
  return prisma.notification.count({
    where: { userId, isRead: false },
  })
}

export async function getUserNotifications(
  userId: string,
  options?: {
    type?: string
    limit?: number
    offset?: number
  }
) {
  const where: Record<string, unknown> = { userId }
  if (options?.type) where.type = options.type

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: options?.limit ?? 50,
      skip: options?.offset ?? 0,
    }),
    prisma.notification.count({ where }),
  ])

  return { notifications, total }
}

export async function triggerQuizResult(
  userId: string,
  quizTitle: string,
  score: number,
  total: number,
  percentage: number,
  courseId: string
) {
  const passed = percentage >= 70
  return createNotification({
    userId,
    title: passed ? "Quiz Passed! \u2705" : "Quiz Result",
    message: passed
      ? `You scored ${percentage}% on "${quizTitle}" (${score}/${total})`
      : `You scored ${percentage}% on "${quizTitle}". Keep practicing!`,
    type: "quiz_result",
    link: `/student/courses/${courseId}`,
  })
}

export async function triggerExamResult(
  userId: string,
  examTitle: string,
  percentage: number,
  marks: number,
  totalMarks: number,
  rank: number,
  courseId: string
) {
  const passed = percentage >= 70
  return createNotification({
    userId,
    title: passed ? "Exam Passed! \u2705" : "Exam Result",
    message: passed
      ? `You passed "${examTitle}" with ${percentage}% (Rank #${rank})`
      : `You scored ${percentage}% on "${examTitle}". You can retry.`,
    type: "exam_result",
    link: `/student/courses/${courseId}/exams/${examIdForTitle(examTitle, courseId)}`,
  })
}

export async function triggerRankChange(
  userId: string,
  newRank: number,
  period: string,
  points: number
) {
  const direction = newRank <= 3 ? "climbed" : "moved"
  return createNotification({
    userId,
    title: "Rank Update! \uD83D\uDCC8",
    message: `You ${direction} to #${newRank} on the ${period} leaderboard with ${points.toLocaleString()} XP!`,
    type: "rank_change",
    link: "/student/leaderboard",
  })
}

export async function triggerBadgeEarned(
  userId: string,
  badgeName: string,
  badgeSlug: string
) {
  return createNotification({
    userId,
    title: "Badge Unlocked! \uD83C\uDFC6",
    message: `Congratulations! You earned the "${badgeName}" badge.`,
    type: "badge_earned",
    link: "/student/achievements",
  })
}

export async function triggerCourseUpdate(
  userId: string,
  courseName: string,
  updateDescription: string,
  courseId: string
) {
  return createNotification({
    userId,
    title: "Course Update \uD83D\uDCDA",
    message: `"${courseName}": ${updateDescription}`,
    type: "course_update",
    link: `/student/courses/${courseId}`,
  })
}

export async function broadcastAnnouncement(
  title: string,
  message: string,
  link?: string
) {
  const users = await prisma.user.findMany({
    where: { isActive: true, role: "STUDENT" },
    select: { id: true },
  })

  await createNotifications(
    users.map((u) => ({
      userId: u.id,
      title,
      message,
      type: "announcement",
      link,
    }))
  )

  return users.length
}

function examIdForTitle(title: string, courseId: string): string {
  return ""
}
