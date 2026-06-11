import type { MetadataRoute } from "next"
import { prisma } from "@/lib/prisma"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://learnzfy.com"

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/courses`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/teachers`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/register`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ]

  let coursePages: MetadataRoute.Sitemap = []
  let teacherPages: MetadataRoute.Sitemap = []

  try {
    const courses = await prisma.course.findMany({
      where: { isPublished: true },
      select: { id: true, updatedAt: true },
      take: 1000,
    })

    coursePages = courses.map((c) => ({
      url: `${baseUrl}/courses/${c.id}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))

    const teachers = await prisma.user.findMany({
      where: { role: "TEACHER", isActive: true },
      select: { id: true, updatedAt: true },
    })

    teacherPages = teachers.map((t) => ({
      url: `${baseUrl}/teachers/${t.id}`,
      lastModified: t.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }))
  } catch {
    // DB unavailable — serve static sitemap only
  }

  return [...staticPages, ...coursePages, ...teacherPages]
}
