export const siteConfig = {
  name: "Learnzfy",
  tagline: "Education is your right, not a product for sale.",
  description:
    "Learnzfy is a modern e-learning platform connecting students with expert educators.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "/og.png",
  links: {
    github: "https://github.com/anomalyco/learnzfy",
    twitter: "https://twitter.com/learnzfy",
  },
}

export type SiteConfig = typeof siteConfig
