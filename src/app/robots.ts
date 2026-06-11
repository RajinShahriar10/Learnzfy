import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://learnzfy.com"

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/student/", "/teacher/", "/admin/", "/super-admin/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
