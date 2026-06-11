import { PrismaClient, Role } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  const passwordHash = await bcrypt.hash("password123", 12)

  const roles: { email: string; name: string; role: Role }[] = [
    { email: "superadmin@learnzfy.com", name: "Super Admin", role: "SUPER_ADMIN" },
    { email: "admin@learnzfy.com", name: "Admin User", role: "ADMIN" },
    { email: "teacher@learnzfy.com", name: "John Teacher", role: "TEACHER" },
    { email: "student@learnzfy.com", name: "Jane Student", role: "STUDENT" },
  ]

  for (const userData of roles) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        name: userData.name,
        email: userData.email,
        passwordHash,
        role: userData.role,
        isActive: true,
        profile: {
          create: {
            bio: `${userData.role} at Learnzfy`,
          },
        },
      },
    })
    console.log(`Created user: ${user.email} (${user.role})`)
  }

  const categories = ["Web Development", "Data Science", "Mobile Development", "Design", "Business"]
  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: {
        name,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
        description: `Courses about ${name}`,
      },
    })
    console.log(`Created category: ${name}`)
  }

  const badges = [
    { name: "Quick Starter", slug: "quick-starter", description: "Complete your first lesson", criteria: "Complete 1 lesson" },
    { name: "Knowledge Seeker", slug: "knowledge-seeker", description: "Enroll in 5 courses", criteria: "Enroll in 5 courses" },
    { name: "Course Completer", slug: "course-completer", description: "Complete your first course", criteria: "Complete 1 course" },
  ]
  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { name: badge.name },
      update: {},
      create: badge,
    })
    console.log(`Created badge: ${badge.name}`)
  }

  const teacher = await prisma.user.findUnique({ where: { email: "teacher@learnzfy.com" } })
  const student = await prisma.user.findUnique({ where: { email: "student@learnzfy.com" } })
  const webDev = await prisma.category.findUnique({ where: { name: "Web Development" } })

  if (teacher && student) {
    const sampleCourses = [
      { title: "Introduction to Web Development", slug: "intro-web-dev", description: "Learn the fundamentals of web development including HTML, CSS, and JavaScript.", categoryId: webDev?.id, teacherId: teacher.id },
      { title: "Python for Data Science", slug: "python-data-science", description: "Master Python programming for data analysis, visualization, and machine learning.", categoryId: webDev?.id, teacherId: teacher.id },
    ]
    for (const courseData of sampleCourses) {
      const course = await prisma.course.upsert({
        where: { slug: courseData.slug },
        update: {},
        create: courseData,
      })
      console.log(`Created course: ${course.title}`)

      const cert = await prisma.certificate.upsert({
        where: { userId_courseId: { userId: student!.id, courseId: course.id } },
        update: {},
        create: {
          userId: student!.id,
          courseId: course.id,
          studentName: student!.name ?? "Jane Student",
          courseName: course.title,
          teacherName: teacher.name ?? "John Teacher",
          grade: "A",
          certificateUrl: "",
          issuedAt: new Date("2026-05-20"),
        },
      })
      await prisma.certificate.update({
        where: { id: cert.id },
        data: { certificateUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/verify/${cert.verificationId}` },
      })
      console.log(`Created certificate for: ${student!.name} - ${course.title}`)
    }
  }

  if (teacher && student) {
    const courses = await prisma.course.findMany()
    if (courses.length >= 1) {
      const discussion = await prisma.discussion.create({
        data: {
          title: "How do I get started with the first project?",
          content: "I just finished the HTML section and I'm wondering what tools I should set up before starting the first project. Any recommendations for code editors or browsers?",
          userId: student.id,
          courseId: courses[0].id,
          lessonId: null,
        },
      })
      console.log(`Created discussion: ${discussion.title}`)

      await prisma.reply.create({
        data: {
          content: "Great question! I recommend using VS Code with Live Server extension, and Chrome DevTools. That's the most common setup used in the industry.",
          userId: teacher.id,
          discussionId: discussion.id,
        },
      })

      await prisma.reply.create({
        data: {
          content: "Thanks John! I'll try that setup.",
          userId: student.id,
          discussionId: discussion.id,
          parentId: (await prisma.reply.findFirst({ where: { discussionId: discussion.id }, orderBy: { createdAt: "asc" } }))?.id,
        },
      })
      console.log("Created replies for discussion")
    }
  }

  if (teacher && student) {
    const existingRewards = await prisma.reward.count()
    if (existingRewards === 0) {
      const sampleRewards = [
        { title: "10% Off Any Course", description: "Get 10% off any course on Learnzfy", pointsCost: 500, type: "DISCOUNT" as const, value: "10", stock: 100 },
        { title: "Free E-Book Bundle", description: "Access to premium e-book collection", pointsCost: 800, type: "PROMO" as const, value: "EBOOK2026", stock: 50 },
        { title: "SAVE20 Coupon", description: "Save $20 on your next enrollment", pointsCost: 1200, type: "COUPON" as const, value: "SAVE20", stock: 30 },
        { title: "1-on-1 Mentoring Session", description: "30-minute session with an expert mentor", pointsCost: 2500, type: "PROMO" as const, value: "MENTOR30", stock: 10 },
        { title: "Premium Course Access", description: "Unlock any premium course for free", pointsCost: 5000, type: "COUPON" as const, value: "PREMIUM", stock: 5 },
      ]
      for (const reward of sampleRewards) {
        await prisma.reward.create({ data: reward })
        console.log(`Created reward: ${reward.title}`)
      }
    }

    const janeXp = await prisma.xP.findUnique({ where: { userId: student.id } })
    if (!janeXp) {
      await prisma.xP.create({
        data: { userId: student.id, points: 3200, level: 12 },
      })
      console.log("Created XP record for Jane Student (3200 points)")
    }
  }

  console.log("Seeding complete!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
