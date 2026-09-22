export interface CmsLink {
  label: string
  href: string
}

export interface CmsSectionHeading {
  heading: string
  subtext: string
}

export interface CmsHero {
  badge: string
  title: string
  highlight: string
  subtitle: string
  primaryCta: CmsLink
  secondaryCta: CmsLink
  stats: { value: string; label: string }[]
}

export interface CmsStatLabels {
  students: string
  courses: string
  teachers: string
  satisfaction: string
}

export interface CmsAchievements {
  heading: string
  subtext: string
  items: { title: string; description: string }[]
}

export interface CmsBranding {
  siteName: string
  tagline: string
  metaTitle: string
  metaDescription: string
  metaKeywords: string
}

export interface CmsFooter {
  tagline: string
  copyright: string
  columns: { heading: string; links: CmsLink[] }[]
  socials: CmsLink[]
}

export interface CmsAbout {
  hero: {
    title: string
    subtitle: string
    paragraph: string
  }
  mission: {
    heading: string
    text: string
  }
  values: {
    heading: string
    subtext: string
    items: { title: string; description: string }[]
  }
  team: {
    heading: string
    subtext: string
    items: { name: string; role: string; bio: string }[]
  }
  cta: {
    heading: string
    text: string
    buttonLabel: string
    buttonHref: string
  }
}

export interface CmsContact {
  hero: {
    title: string
    subtext: string
  }
  form: {
    heading: string
    description: string
    buttonLabel: string
    successHeading: string
    successText: string
  }
  info: { heading: string; lines: string[] }[]
}

export interface SiteContent {
  branding: CmsBranding
  nav: { links: CmsLink[] }
  hero: CmsHero
  featured: CmsSectionHeading
  statistics: { labels: CmsStatLabels }
  topTeachers: CmsSectionHeading
  leaderboard: CmsSectionHeading
  achievements: CmsAchievements
  testimonials: CmsSectionHeading
  sponsors: { subtext: string }
  cta: {
    heading: string
    subtext: string
    primaryCta: CmsLink
    secondaryCta: CmsLink
  }
  about: CmsAbout
  contact: CmsContact
  footer: CmsFooter
}