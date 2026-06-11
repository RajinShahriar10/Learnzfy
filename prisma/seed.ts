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
