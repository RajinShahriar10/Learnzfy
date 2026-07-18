import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ok, unauthorized, err } from "@/lib/api-helpers"

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return unauthorized()

  const courses = await prisma.course.findMany({
    where: { teacherId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { name: true } },
      _count: { select: { enrollments: true, modules: true } },
    },
  })

  const result = courses.map((c) => ({
    id: c.id,
    title: c.title,
    slug: c.slug,
    description: c.description,
    category: c.category?.name ?? null,
    difficulty: c.difficulty,
    duration: c.duration,
    isPublished: c.isPublished,
    studentCount: c._count.enrollments,
    moduleCount: c._count.modules,
  }))

  return ok(result)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return unauthorized()

  const userId = session.user.id
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } })
  if (!user || (user.role !== "TEACHER" && user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    return err("Only teachers can create courses")
  }

  const body = await req.json()
  const { title, description, shortDescription, category, difficulty, duration } = body

  if (!title || !description) {
    return err("Title and description are required")
  }

  let slug = slugify(title)
  const existing = await prisma.course.findUnique({ where: { slug } })
  if (existing) {
    slug = `${slug}-${Date.now()}`
  }

  let categoryId: string | null = null
  if (category) {
    const cat = await prisma.category.findFirst({ where: { name: category } })
    if (cat) categoryId = cat.id
  }

  const durationInt = duration ? parseInt(String(duration).replace(/\D/g, ""), 10) : null

  const course = await prisma.course.create({
    data: {
      title,
      slug,
      description,
      shortDescription: shortDescription || null,
      categoryId,
      teacherId: userId,
      difficulty: difficulty || "beginner",
      duration: isNaN(durationInt as number) ? null : durationInt,
      isPublished: false,
      price: 0,
    },
  })

  return ok(course)
}
