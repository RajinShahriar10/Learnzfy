import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { hasRole } from "@/lib/rbac"
import { ok, created, paginated, err, unauthorized, forbidden, notFound, serverError, parsePagination, requireRole } from "@/lib/api-helpers"
import { calculateStreak, getActivityDaysForCalendar, getStreakMultiplier, getBaseXpForActivity, checkAndAwardMilestones, getAdminStreakStats, DEFAULT_STREAK_XP } from "@/lib/streak"
import { getRecommendations } from "@/lib/recommendations"
import type { Prisma } from "@prisma/client"

type Handler = (req: NextRequest, params: { slug: string[] }) => Promise<NextResponse>

const handlers: Record<string, Handler> = {
  // ── Auth ──────────────────────────────────────────────
  "auth/me": async () => {
    const session = await auth()
    if (!session?.user) return unauthorized()
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true, role: true, image: true, createdAt: true },
    })
    return ok(user)
  },

  // ── Courses ───────────────────────────────────────────
  "courses": async (req) => {
    const { searchParams } = new URL(req.url)
    const { page, limit, skip } = parsePagination(searchParams)
    const category = searchParams.get("category")
    const difficulty = searchParams.get("difficulty")
    const search = searchParams.get("search")

    const where: Prisma.CourseWhereInput = { isPublished: true }
    if (category) where.category = { slug: category }
    if (difficulty) where.difficulty = difficulty
    if (search) where.title = { contains: search, mode: "insensitive" }

    const courses = await prisma.course.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        teacher: { select: { id: true, name: true, image: true } },
        category: { select: { id: true, name: true, slug: true } },
        _count: { select: { enrollments: true, modules: true, reviews: true } },
        reviews: { select: { rating: true } },
      },
    })

    const total = await prisma.course.count({ where })

    const enriched = courses.map((c) => {
      const totalRatings = c.reviews.length
      const avgRating = totalRatings > 0
        ? Math.round((c.reviews.reduce((s, r) => s + r.rating, 0) / totalRatings) * 10) / 10
        : 0
      const { reviews, ...rest } = c
      return { ...rest, avgRating, totalRatings }
    })

    return paginated(enriched, total, page, limit)
  },

  "courses/detail": async (req) => {
    const id = new URL(req.url).searchParams.get("id")
    if (!id) return err("Course ID is required")
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        teacher: { select: { id: true, name: true, image: true } },
        category: true,
        modules: { orderBy: { order: "asc" }, include: { lessons: { orderBy: { order: "asc" } } } },
        _count: { select: { enrollments: true, reviews: true } },
        reviews: { select: { rating: true } },
      },
    })
    if (!course) return notFound("Course")
    const totalRatings = course.reviews.length
    const avgRating = totalRatings > 0
      ? Math.round((course.reviews.reduce((s, r) => s + r.rating, 0) / totalRatings) * 10) / 10
      : 0
    const { reviews, ...rest } = course
    return ok({ ...rest, avgRating, totalRatings })
  },

  // ── Enrollments ───────────────────────────────────────
  "enrollments": async (req) => {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    const { page, limit, skip } = parsePagination(new URL(req.url).searchParams)
    const [enrollments, total] = await Promise.all([
      prisma.enrollment.findMany({
        where: { userId: session.user.id },
        skip,
        take: limit,
        orderBy: { enrolledAt: "desc" },
        include: { course: { select: { id: true, title: true, slug: true, thumbnailUrl: true, difficulty: true } } },
      }),
      prisma.enrollment.count({ where: { userId: session.user.id } }),
    ])
    return paginated(enrollments, total, page, limit)
  },

  // ── Certificates ──────────────────────────────────────
  "certificates": async (req) => {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    const { page, limit, skip } = parsePagination(new URL(req.url).searchParams)
    const [certificates, total] = await Promise.all([
      prisma.certificate.findMany({
        where: { userId: session.user.id },
        skip,
        take: limit,
        orderBy: { issuedAt: "desc" },
      }),
      prisma.certificate.count({ where: { userId: session.user.id } }),
    ])
    return paginated(certificates, total, page, limit)
  },

  "certificates/verify": async (req) => {
    const verificationId = new URL(req.url).searchParams.get("verificationId")
    if (!verificationId) return err("verificationId is required")
    const cert = await prisma.certificate.findUnique({
      where: { verificationId },
      include: { course: { select: { title: true } } },
    })
    if (!cert) return notFound("Certificate")
    return ok(cert)
  },

  // ── Discussions ───────────────────────────────────────
  "discussions": async (req) => {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    const { searchParams } = new URL(req.url)
    const { page, limit, skip } = parsePagination(searchParams)
    const courseId = searchParams.get("courseId")
    const lessonId = searchParams.get("lessonId")
    const sort = searchParams.get("sort") || "recent"

    const where: Record<string, unknown> = {}
    if (courseId) where.courseId = courseId
    if (lessonId) where.lessonId = lessonId

    const orderBy: Prisma.DiscussionOrderByWithRelationInput[] =
      sort === "votes"
        ? [{ votes: { _count: "desc" } }, { createdAt: "desc" }]
        : [{ isPinned: "desc" }, { createdAt: "desc" }]

    const [discussions, total] = await Promise.all([
      prisma.discussion.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          user: { select: { id: true, name: true, image: true, role: true } },
          _count: { select: { replies: true, votes: true } },
          votes: { where: { userId: session.user.id }, select: { id: true } },
        },
      }),
      prisma.discussion.count({ where }),
    ])

    return paginated(
      discussions.map((d) => ({
        id: d.id,
        title: d.title,
        isPinned: d.isPinned,
        upvotes: d._count.votes,
        replyCount: d._count.replies,
        hasUpvoted: d.votes.length > 0,
        user: d.user,
        createdAt: d.createdAt.toISOString(),
      })),
      total,
      page,
      limit
    )
  },

  "discussions/create": async (req) => {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    const body = await req.json().catch(() => ({}))
    if (!body.title?.trim() || !body.content?.trim()) return err("title and content are required", 422)
    const discussion = await prisma.discussion.create({
      data: {
        title: body.title.trim(),
        content: body.content.trim(),
        userId: session.user.id,
        courseId: body.courseId || null,
        lessonId: body.lessonId || null,
      },
      include: { user: { select: { id: true, name: true, image: true, role: true } } },
    })
    return created(discussion)
  },

  // ── Replies ───────────────────────────────────────────
  "replies/create": async (req) => {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    const body = await req.json().catch(() => ({}))
    if (!body.content?.trim() || !body.discussionId) return err("content and discussionId are required", 422)
    const reply = await prisma.reply.create({
      data: {
        content: body.content.trim(),
        userId: session.user.id,
        discussionId: body.discussionId,
        parentId: body.parentId || null,
      },
      include: {
        user: { select: { id: true, name: true, image: true, role: true } },
        _count: { select: { votes: true } },
      },
    })
    return created(reply)
  },

  // ── Bookmarks ─────────────────────────────────────────
  "bookmarks": async (req) => {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type")
    const search = searchParams.get("search")

    const where: Record<string, unknown> = { userId: session.user.id }
    if (type === "course") where.lessonId = null
    if (type === "lesson") where.courseId = null

    let bookmarks = await prisma.bookmark.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        course: { select: { id: true, title: true, slug: true, thumbnailUrl: true, difficulty: true, teacher: { select: { name: true } } } },
        lesson: { select: { id: true, title: true, module: { select: { course: { select: { id: true, title: true, slug: true } } } } } },
      },
    })

    if (search) {
      const q = search.toLowerCase()
      bookmarks = bookmarks.filter((b) => (b.course?.title ?? b.lesson?.title ?? "").toLowerCase().includes(q))
    }

    return ok(bookmarks)
  },

  "bookmarks/toggle": async (req) => {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()

    const body = await req.json().catch(() => ({}))
    if (!body.courseId && !body.lessonId) return err("Provide courseId or lessonId", 422)

    const bmWhere = body.courseId
      ? { userId: session.user.id, courseId: body.courseId, lessonId: null }
      : { userId: session.user.id, lessonId: body.lessonId, courseId: null }

    const existing = await prisma.bookmark.findFirst({ where: bmWhere })

    if (existing) {
      await prisma.bookmark.delete({ where: { id: existing.id } })
      return ok({ bookmarked: false })
    }

    const bookmark = await prisma.bookmark.create({
      data: { userId: session.user.id, courseId: body.courseId ?? null, lessonId: body.lessonId ?? null },
    })

    return created({ bookmarked: true, bookmark })
  },

  "bookmarks/check": async (req) => {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    const { searchParams } = new URL(req.url)
    const courseId = searchParams.get("courseId")
    const lessonId = searchParams.get("lessonId")
    if (!courseId && !lessonId) return err("Provide courseId or lessonId", 400)

    const bmWhere2 = courseId
      ? { userId: session.user.id, courseId, lessonId: null }
      : { userId: session.user.id, lessonId, courseId: null }

    const bookmark = await prisma.bookmark.findFirst({ where: bmWhere2 })

    return ok({ bookmarked: !!bookmark })
  },

  // ── Rewards ───────────────────────────────────────────
  "rewards": async () => {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    const rewards = await prisma.reward.findMany({
      where: { isActive: true, stock: { gt: 0, not: null } },
      include: { sponsor: { select: { name: true, logoUrl: true } } },
      orderBy: { pointsCost: "asc" },
    })
    const xp = await prisma.xP.findUnique({ where: { userId: session.user.id } })
    return ok({ rewards, userPoints: xp?.points ?? 0 })
  },

  "rewards/history": async () => {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    const redemptions = await prisma.rewardRedemption.findMany({
      where: { userId: session.user.id },
      include: { reward: { select: { title: true, type: true, value: true, pointsCost: true } } },
      orderBy: { redeemedAt: "desc" },
    })
    return ok(redemptions)
  },

  "rewards/redeem": async (req) => {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    const body = await req.json().catch(() => ({}))
    if (!body.rewardId) return err("rewardId is required", 422)

    const reward = await prisma.reward.findUnique({ where: { id: body.rewardId } })
    if (!reward || !reward.isActive) return notFound("Reward")
    if (reward.stock !== null && reward.stock <= 0) return err("Reward is out of stock")

    const xp = await prisma.xP.findUnique({ where: { userId: session.user.id } })
    if ((xp?.points ?? 0) < reward.pointsCost) return err("Insufficient points")

    try {
      const redemption = await prisma.$transaction(async (tx) => {
        await tx.xP.update({ where: { userId: session.user.id }, data: { points: { decrement: reward.pointsCost } } })
        if (reward.stock !== null) {
          await tx.reward.update({ where: { id: body.rewardId }, data: { stock: { decrement: 1 } } })
        }
        const code = generateCode()
        return tx.rewardRedemption.create({
          data: { userId: session.user.id, rewardId: body.rewardId, pointsSpent: reward.pointsCost, code, status: "approved" },
          include: { reward: { select: { title: true, type: true, value: true } } },
        })
      })
      return created(redemption)
    } catch (e) {
      return serverError(e)
    }
  },

  // ── Analytics ─────────────────────────────────────────
  "analytics/student": async () => {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    return proxyAnalytics("student", session.user.id)
  },

  "analytics/teacher": async () => {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    return proxyAnalytics("teacher", session.user.id)
  },

  "analytics/admin": async () => {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    if (!hasRole(session.user.role, "ADMIN")) return forbidden()
    return proxyAnalytics("admin", session.user.id)
  },

  // ── Leaderboard ───────────────────────────────────────
  "leaderboard": async (req) => {
    const period = new URL(req.url).searchParams.get("period") || "all_time"
    const entries = await prisma.leaderboard.findMany({
      where: { period },
      orderBy: { points: "desc" },
      take: 50,
    })
    return ok(entries)
  },

  // ── Profile ───────────────────────────────────────────
  "profile": async () => {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      include: { user: { select: { id: true, name: true, email: true, role: true, image: true } } },
    })
    return ok(profile)
  },

  // ── XP / Gamification ────────────────────────────────
  "xp": async () => {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    const xp = await prisma.xP.findUnique({ where: { userId: session.user.id } })
    return ok(xp ?? { points: 0, level: 1 })
  },

  // ── Reviews ────────────────────────────────────────────
  "reviews/create": async (req) => {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    if (session.user.role !== "STUDENT") return err("Only students can review courses", 403)

    const body = await req.json().catch(() => ({}))
    if (!body.courseId || !body.rating) return err("courseId and rating are required", 422)
    if (body.rating < 1 || body.rating > 5) return err("Rating must be between 1 and 5", 422)

    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId: body.courseId } },
    })
    if (!enrollment) return err("You must be enrolled in this course to review it", 403)
    if (enrollment.progress < 30) return err("You must complete at least 30% of the course to leave a review", 403)

    const existing = await prisma.review.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId: body.courseId } },
    })
    if (existing) return err("You have already reviewed this course", 422)

    const review = await prisma.review.create({
      data: { userId: session.user.id, courseId: body.courseId, rating: body.rating, comment: body.comment || null },
      include: { user: { select: { id: true, name: true, image: true } } },
    })
    return created(review)
  },

  "reviews/course": async (req) => {
    const { searchParams } = new URL(req.url)
    const courseId = searchParams.get("courseId")
    if (!courseId) return err("courseId is required")
    const { page, limit, skip } = parsePagination(searchParams)
    const sort = searchParams.get("sort") || "recent"

    const allReviews = await prisma.review.findMany({
      where: { courseId, isHidden: false },
      include: { user: { select: { id: true, name: true, image: true } } },
    })

    const total = allReviews.length
    const sum = allReviews.reduce((s, r) => s + r.rating, 0)
    const average = total > 0 ? sum / total : 0
    const breakdown = [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      count: allReviews.filter((r) => r.rating === stars).length,
      percentage: total > 0 ? (allReviews.filter((r) => r.rating === stars).length / total) * 100 : 0,
    }))

    const sorted = [...allReviews].sort((a, b) => {
      if (sort === "highest") return b.rating - a.rating
      if (sort === "lowest") return a.rating - b.rating
      return b.createdAt.getTime() - a.createdAt.getTime()
    })

    const session = await auth()
    let userReview: unknown = null
    if (session?.user?.id) {
      const ur = allReviews.find((r) => r.userId === session.user.id)
      if (ur) userReview = ur
    }

    const paged = sorted.slice(skip, skip + limit).map((r) => ({
      id: r.id,
      userId: r.userId,
      userName: r.user.name ?? "Anonymous",
      userAvatar: r.user.image,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
      isEdited: r.isEdited,
      isHidden: r.isHidden,
      isReported: r.isReported,
    }))

    return ok({ data: paged, stats: { average, total, breakdown, userReview }, pagination: { total, page, limit, totalPages: Math.ceil(total / limit), hasMore: page * limit < total } })
  },

  "teacher-reviews/create": async (req) => {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    if (session.user.role !== "STUDENT") return err("Only students can review teachers", 403)

    const body = await req.json().catch(() => ({}))
    if (!body.teacherId || !body.rating) return err("teacherId and rating are required", 422)

    const existing = await prisma.teacherReview.findUnique({
      where: { userId_teacherId: { userId: session.user.id, teacherId: body.teacherId } },
    })
    if (existing) return err("You have already reviewed this teacher", 422)

    const review = await prisma.teacherReview.create({
      data: { userId: session.user.id, teacherId: body.teacherId, courseId: body.courseId || null, rating: body.rating, comment: body.comment || null },
      include: { user: { select: { id: true, name: true, image: true } } },
    })
    return created(review)
  },

  "teacher-reviews/teacher": async (req) => {
    const { searchParams } = new URL(req.url)
    const teacherId = searchParams.get("teacherId")
    if (!teacherId) return err("teacherId is required")
    const { page, limit, skip } = parsePagination(searchParams)
    const sort = searchParams.get("sort") || "recent"

    const allReviews = await prisma.teacherReview.findMany({
      where: { teacherId, isHidden: false },
      include: { user: { select: { id: true, name: true, image: true } } },
    })

    const total = allReviews.length
    const sum = allReviews.reduce((s, r) => s + r.rating, 0)
    const average = total > 0 ? sum / total : 0
    const breakdown = [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      count: allReviews.filter((r) => r.rating === stars).length,
      percentage: total > 0 ? (allReviews.filter((r) => r.rating === stars).length / total) * 100 : 0,
    }))

    const sorted = [...allReviews].sort((a, b) => {
      if (sort === "highest") return b.rating - a.rating
      if (sort === "lowest") return a.rating - b.rating
      return b.createdAt.getTime() - a.createdAt.getTime()
    })

    const paged = sorted.slice(skip, skip + limit).map((r) => ({
      id: r.id,
      userId: r.userId,
      userName: r.user.name ?? "Anonymous",
      userAvatar: r.user.image,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
      isEdited: r.isEdited,
      isHidden: r.isHidden,
      isReported: r.isReported,
    }))

    return ok({ data: paged, stats: { average, total, breakdown }, pagination: { total, page, limit, totalPages: Math.ceil(total / limit), hasMore: page * limit < total } })
  },

  // ── Notifications ─────────────────────────────────────
  "notifications": async (req) => {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    const { page, limit, skip } = parsePagination(new URL(req.url).searchParams)
    const type = new URL(req.url).searchParams.get("type")
    const where: Record<string, unknown> = { userId: session.user.id }
    if (type) where.type = type

    const [notifications, total, unread] = await Promise.all([
      prisma.notification.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { userId: session.user.id, isRead: false } }),
    ])
    return ok({ notifications, unread, pagination: { page, limit, total, totalPages: Math.ceil(total / limit), hasMore: page * limit < total } })
  },

  // ── Streak ───────────────────────────────────────────────
  "streak": async () => {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()

    const streak = await calculateStreak(session.user.id)
    const activityDays = await getActivityDaysForCalendar(session.user.id, 3)
    const milestones = await prisma.streakMilestone.findMany({
      where: { userId: session.user.id },
      orderBy: { days: "asc" },
    })
    const xp = await prisma.xP.findUnique({ where: { userId: session.user.id } })
    const multiplier = getStreakMultiplier(streak.current)
    const nextMilestoneDays = [1, 7, 14, 30, 60, 100, 365].find((m) => streak.current < m) ?? null

    return ok({
      current: streak.current,
      longest: streak.longest,
      thisWeek: streak.thisWeek,
      thisMonth: streak.thisMonth,
      multiplier,
      xp: xp?.points ?? 0,
      nextMilestone: nextMilestoneDays,
      activityDays: Object.fromEntries(activityDays),
      milestones: milestones.map((m) => ({ days: m.days, xpAwarded: m.xpAwarded, unlockedAt: m.unlockedAt.toISOString() })),
    })
  },

  "streak/log": async (req) => {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()

    const body = await req.json().catch(() => ({}))
    const validTypes = ["LESSON_WATCHED", "QUIZ_PASSED", "EXAM_TAKEN", "COURSE_COMPLETED"]
    if (!body.type || !validTypes.includes(body.type)) return err("Invalid activity type", 422)

    const baseXp = getBaseXpForActivity(body.type)
    const streak = await calculateStreak(session.user.id)
    const multiplier = getStreakMultiplier(streak.current)
    const xpEarned = Math.round(baseXp * multiplier)

    await prisma.activityLog.create({
      data: { userId: session.user.id, type: body.type, courseId: body.courseId ?? null, lessonId: body.lessonId ?? null, xpEarned },
    })

    await prisma.xP.upsert({
      where: { userId: session.user.id },
      create: { userId: session.user.id, points: xpEarned, level: 1 },
      update: { points: { increment: xpEarned } },
    })

    const newStreak = await calculateStreak(session.user.id)
    const newMultiplier = getStreakMultiplier(newStreak.current)
    const awarded = await checkAndAwardMilestones(session.user.id, newStreak.current)

    return created({ xpEarned, multiplier: newMultiplier, currentStreak: newStreak.current, longestStreak: newStreak.longest, milestonesAwarded: awarded })
  },

  "streak/config": async () => {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    if (!hasRole(session.user.role, "ADMIN")) return forbidden()

    const settings = await prisma.setting.findMany({ where: { key: { startsWith: "streak_" } } })
    const config: Record<string, number> = {}
    for (const [key, value] of Object.entries(DEFAULT_STREAK_XP)) {
      const setting = settings.find((s) => s.key === `streak_${key}`)
      config[key] = setting ? parseFloat(setting.value) : value
    }
    return ok(config)
  },

  "streak/stats": async () => {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    if (!hasRole(session.user.role, "ADMIN")) return forbidden()

    const stats = await getAdminStreakStats()
    return ok(stats)
  },

  // ── Admin Certificates ──────────────────────────────
  "admin/certificates": async (req) => {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    if (!hasRole(session.user.role, "ADMIN")) return forbidden()

    const { searchParams } = new URL(req.url)
    const query = searchParams.get("q") ?? ""
    const status = searchParams.get("status") ?? "ALL"

    const where: Record<string, unknown> = {}
    if (query) {
      where.OR = [
        { studentName: { contains: query, mode: "insensitive" } },
        { courseName: { contains: query, mode: "insensitive" } },
        { verificationId: { contains: query, mode: "insensitive" } },
      ]
    }
    if (status !== "ALL") where.status = status

    const [certificates, total] = await Promise.all([
      prisma.certificate.findMany({
        where,
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { issuedAt: "desc" },
        take: 100,
      }),
      prisma.certificate.count({ where }),
    ])

    return ok({ certificates, total })
  },

  "admin/certificates/revoke": async (req) => {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    if (!hasRole(session.user.role, "ADMIN")) return forbidden()

    const body = await req.json().catch(() => ({}))
    if (!body.id || !body.reason) return err("id and reason are required", 422)

    const { revokeCertificate } = await import("@/lib/certificate-utils")
    const cert = await revokeCertificate(body.id, body.reason)
    return ok(cert)
  },

  "admin/certificates/restore": async (req) => {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    if (!hasRole(session.user.role, "ADMIN")) return forbidden()

    const body = await req.json().catch(() => ({}))
    if (!body.id) return err("id is required", 422)

    const { restoreCertificate } = await import("@/lib/certificate-utils")
    const cert = await restoreCertificate(body.id)
    return ok(cert)
  },

  "admin/certificates/logs": async (req) => {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    if (!hasRole(session.user.role, "ADMIN")) return forbidden()

    const certificateId = new URL(req.url).searchParams.get("certificateId")
    if (!certificateId) return err("certificateId query param is required", 400)

    const { getVerificationLogs } = await import("@/lib/certificate-utils")
    const logs = await getVerificationLogs(certificateId)
    return ok(logs)
  },

  // ── Recommendations ─────────────────────────────────
  "recommendations": async () => {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()

    const data = await getRecommendations(session.user.id)
    return ok(data)
  },
}

async function proxyAnalytics(role: string, userId: string) {
  if (role === "student") {
    const [xp, enrollments, examAttempts, certificates] = await Promise.all([
      prisma.xP.findUnique({ where: { userId } }),
      prisma.enrollment.findMany({ where: { userId }, include: { course: { include: { modules: { include: { lessons: true } } } } } }),
      prisma.examAttempt.findMany({ where: { userId, status: "GRADED" }, include: { exam: true }, orderBy: { submittedAt: "asc" } }),
      prisma.certificate.findMany({ where: { userId } }),
    ])

    const progress = enrollments.length ? Math.round(enrollments.reduce((s, e) => s + e.progress, 0) / enrollments.length) : 0
    const totalLessons = enrollments.reduce((s, e) => s + e.course.modules.reduce((ms, m) => ms + m.lessons.length, 0), 0)

    return ok({
      xp: { points: xp?.points ?? 0, level: xp?.level ?? 1 },
      progress: { average: progress, totalCourses: enrollments.length, totalLessons },
      certificates: certificates.length,
      examAttempts: examAttempts.length,
      courseProgress: enrollments.map((e) => ({ label: e.course.title, value: Math.round(e.progress) })),
      examScores: examAttempts.map((a) => ({ label: a.exam.title, value: Math.round(a.score ?? 0) })),
    })
  }

  if (role === "teacher") {
    const courses = await prisma.course.findMany({
      where: { teacherId: userId },
      include: { _count: { select: { enrollments: true, modules: true } }, enrollments: { select: { status: true } }, reviews: { select: { rating: true } } },
    })
    const totalStudents = courses.reduce((s, c) => s + c._count.enrollments, 0)
    const totalCompletions = courses.reduce((s, c) => s + c.enrollments.filter((e) => e.status === "COMPLETED").length, 0)
    const totalReviews = courses.reduce((s, c) => s + c.reviews.length, 0)
    const avgRating = totalReviews ? courses.reduce((s, c) => s + c.reviews.reduce((rs, r) => rs + r.rating, 0), 0) / totalReviews : 0
    return ok({ totalStudents, totalCourses: courses.length, avgCompletionRate: totalStudents ? Math.round((totalCompletions / totalStudents) * 100) : 0, avgRating: Math.round(avgRating * 10) / 10, coursePerformance: courses.map((c) => ({ label: c.title, students: c._count.enrollments, modules: c._count.modules })) })
  }

  if (role === "admin") {
    const [totalUsers, totalTeachers, totalStudents, totalCourses, totalEnrollments, totalCertificates] = await Promise.all([
      prisma.user.count(), prisma.user.count({ where: { role: "TEACHER" } }), prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.course.count(), prisma.enrollment.count(), prisma.certificate.count(),
    ])
    return ok({ totalUsers, teachers: totalTeachers, students: totalStudents, courses: totalCourses, enrollments: totalEnrollments, certificates: totalCertificates })
  }

  return err("Invalid role")
}

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let code = ""
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) code += chars[Math.floor(Math.random() * chars.length)]
    if (i < 2) code += "-"
  }
  return code
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const path = slug.join("/")
  const handler = handlers[path]
  if (!handler) return notFound("API endpoint")
  try { return await handler(req, { slug }) }
  catch (e) { return serverError(e) }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const createEndpoints = ["discussions/create", "replies/create", "rewards/redeem", "reviews/create", "teacher-reviews/create", "bookmarks/toggle", "streak/log", "admin/certificates/revoke", "admin/certificates/restore"]
  const path = slug.join("/")
  if (!createEndpoints.includes(path)) return notFound("API endpoint")
  try { return await handlers[path](req, { slug }) }
  catch (e) { return serverError(e) }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const path = slug.join("/")
  if (path !== "streak/config") return notFound("API endpoint")
  try {
    const { session, error } = await requireRole("ADMIN")
    if (error) return error

    const body = await req.json()
    for (const [key, value] of Object.entries(body)) {
      if (key in DEFAULT_STREAK_XP && typeof value === "number") {
        await prisma.setting.upsert({
          where: { key: `streak_${key}` },
          create: { key: `streak_${key}`, value: String(value) },
          update: { value: String(value) },
        })
      }
    }
    return ok({ message: "Streak configuration updated" })
  } catch (e) { return serverError(e) }
}
