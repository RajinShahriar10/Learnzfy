import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { hasRole } from "@/lib/rbac"
import { prisma } from "@/lib/prisma"

const ALLOWED_ENTITIES = [
  "user", "category", "course", "badge", "sponsor",
  "notification", "quiz", "exam", "certificate", "leaderboard", "reward",
] as const

type Entity = (typeof ALLOWED_ENTITIES)[number]

const FIELD_WHITELIST: Record<string, string[]> = {
  user: ["name", "email", "role", "isActive", "passwordHash"],
  category: ["name", "slug", "description"],
  course: ["title", "slug", "description", "shortDescription", "thumbnailUrl", "price", "isPublished", "categoryId", "teacherId", "difficulty", "duration"],
  badge: ["name", "slug", "description", "iconUrl", "criteria"],
  sponsor: ["name", "logoUrl", "websiteUrl", "description", "isActive"],
  notification: ["userId", "title", "message", "type", "isRead", "link"],
  quiz: ["title", "description", "lessonId", "courseId", "teacherId", "timeLimit", "passingScore"],
  exam: ["title", "description", "courseId", "teacherId", "timeLimit", "passingScore", "maxAttempts", "isPublished"],
  certificate: ["userId", "courseId", "examId", "studentName", "courseName", "teacherName", "grade"],
  leaderboard: ["userId", "points", "rank", "period"],
  reward: ["title", "description", "pointsCost", "type", "value", "imageUrl", "isActive", "stock", "sponsorId"],
}

async function checkAdmin() {
  const session = await auth()
  if (!session?.user) return false
  return hasRole(session.user.role, "ADMIN")
}

export async function POST(request: Request) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { entity, data } = await request.json()
    if (!ALLOWED_ENTITIES.includes(entity)) {
      return NextResponse.json({ error: "Invalid entity" }, { status: 400 })
    }

    const allowedFields = FIELD_WHITELIST[entity] ?? []
    const filteredData: Record<string, unknown> = {}
    for (const key of allowedFields) {
      if (data[key] !== undefined) filteredData[key] = data[key]
    }

    const result = await (prisma as any)[entity].create({ data: filteredData })
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { entity, id, data } = await request.json()
    if (!ALLOWED_ENTITIES.includes(entity) || !id) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    const allowedFields = FIELD_WHITELIST[entity] ?? []
    const filteredData: Record<string, unknown> = {}
    for (const key of allowedFields) {
      if (data[key] !== undefined) filteredData[key] = data[key]
    }

    const result = await (prisma as any)[entity].update({
      where: { id },
      data: filteredData,
    })
    return NextResponse.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { entity, id } = await request.json()
    if (!ALLOWED_ENTITIES.includes(entity) || !id) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    await (prisma as any)[entity].delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
