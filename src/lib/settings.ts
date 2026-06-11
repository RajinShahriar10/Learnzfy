import { prisma } from "@/lib/prisma"

export async function getSetting(key: string): Promise<string | null> {
  try {
    const setting = await prisma.setting.findUnique({ where: { key } })
    return setting?.value ?? null
  } catch {
    return null
  }
}

export async function getSettings(keys: string[]): Promise<Record<string, string | null>> {
  try {
    const settings = await prisma.setting.findMany({
      where: { key: { in: keys } },
    })
    const map: Record<string, string | null> = {}
    for (const key of keys) {
      map[key] = settings.find((s) => s.key === key)?.value ?? null
    }
    return map
  } catch {
    const map: Record<string, string | null> = {}
    for (const key of keys) map[key] = null
    return map
  }
}

export async function setSetting(key: string, value: string): Promise<void> {
  await prisma.setting.upsert({
    where: { key },
    create: { key, value },
    update: { value },
  })
}

export async function setSettings(entries: Record<string, string>): Promise<void> {
  const ops = Object.entries(entries).map(([key, value]) =>
    prisma.setting.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    })
  )
  await prisma.$transaction(ops)
}

export const SETTING_KEYS = {
  SITE_NAME: "site_name",
  SITE_TAGLINE: "site_tagline",
  SITE_DESCRIPTION: "site_description",
  SITE_LOGO_URL: "site_logo_url",
  SITE_LOGO_TEXT: "site_logo_text",
  SITE_CONTACT_EMAIL: "site_contact_email",
  SITE_CONTACT_PHONE: "site_contact_phone",
  SITE_ADDRESS: "site_address",
  SITE_SOCIAL_TWITTER: "site_social_twitter",
  SITE_SOCIAL_FACEBOOK: "site_social_facebook",
  SITE_SOCIAL_INSTAGRAM: "site_social_instagram",
  SITE_SOCIAL_LINKEDIN: "site_social_linkedin",
  SITE_SOCIAL_GITHUB: "site_social_github",
  SITE_SEO_TITLE: "site_seo_title",
  SITE_SEO_DESCRIPTION: "site_seo_description",
  SITE_SEO_KEYWORDS: "site_seo_keywords",
  SITE_FOOTER_TEXT: "site_footer_text",
  SITE_FOOTER_COPYRIGHT: "site_footer_copyright",
  SITE_HOMEPAGE_HERO_TITLE: "site_homepage_hero_title",
  SITE_HOMEPAGE_HERO_SUBTITLE: "site_homepage_hero_subtitle",
  SITE_HOMEPAGE_HERO_CTA: "site_homepage_hero_cta",
  SITE_HOMEPAGE_FEATURED_TITLE: "site_homepage_featured_title",
  SITE_HOMEPAGE_ABOUT_TITLE: "site_homepage_about_title",
} as const

export const SETTING_GROUPS = [
  {
    id: "branding",
    label: "Branding",
    keys: [
      { key: SETTING_KEYS.SITE_NAME, label: "Site Name", type: "text", default: "Learnzfy" },
      { key: SETTING_KEYS.SITE_TAGLINE, label: "Tagline", type: "text", default: "Education is your right, not a product for sale." },
      { key: SETTING_KEYS.SITE_LOGO_TEXT, label: "Logo Text", type: "text", default: "Learnzfy" },
      { key: SETTING_KEYS.SITE_LOGO_URL, label: "Logo Image URL", type: "url", default: "" },
    ],
  },
  {
    id: "contact",
    label: "Contact Information",
    keys: [
      { key: SETTING_KEYS.SITE_CONTACT_EMAIL, label: "Email", type: "email", default: "hello@learnzfy.com" },
      { key: SETTING_KEYS.SITE_CONTACT_PHONE, label: "Phone", type: "text", default: "+1 (555) 123-4567" },
      { key: SETTING_KEYS.SITE_ADDRESS, label: "Address", type: "text", default: "" },
    ],
  },
  {
    id: "social",
    label: "Social Media Links",
    keys: [
      { key: SETTING_KEYS.SITE_SOCIAL_TWITTER, label: "Twitter URL", type: "url", default: "https://twitter.com/learnzfy" },
      { key: SETTING_KEYS.SITE_SOCIAL_FACEBOOK, label: "Facebook URL", type: "url", default: "" },
      { key: SETTING_KEYS.SITE_SOCIAL_INSTAGRAM, label: "Instagram URL", type: "url", default: "" },
      { key: SETTING_KEYS.SITE_SOCIAL_LINKEDIN, label: "LinkedIn URL", type: "url", default: "" },
      { key: SETTING_KEYS.SITE_SOCIAL_GITHUB, label: "GitHub URL", type: "url", default: "https://github.com/anomalyco/learnzfy" },
    ],
  },
  {
    id: "homepage",
    label: "Homepage Content",
    keys: [
      { key: SETTING_KEYS.SITE_HOMEPAGE_HERO_TITLE, label: "Hero Title", type: "text", default: "Learn Without Limits" },
      { key: SETTING_KEYS.SITE_HOMEPAGE_HERO_SUBTITLE, label: "Hero Subtitle", type: "textarea", default: "Access world-class education for free. Learn at your own pace with expert educators." },
      { key: SETTING_KEYS.SITE_HOMEPAGE_HERO_CTA, label: "Hero CTA Text", type: "text", default: "Get Started Free" },
      { key: SETTING_KEYS.SITE_HOMEPAGE_FEATURED_TITLE, label: "Featured Section Title", type: "text", default: "Featured Courses" },
    ],
  },
  {
    id: "seo",
    label: "SEO Settings",
    keys: [
      { key: SETTING_KEYS.SITE_SEO_TITLE, label: "SEO Title", type: "text", default: "Learnzfy - Education is your right" },
      { key: SETTING_KEYS.SITE_SEO_DESCRIPTION, label: "SEO Description", type: "textarea", default: "Learnzfy is a modern e-learning platform connecting students with expert educators." },
      { key: SETTING_KEYS.SITE_SEO_KEYWORDS, label: "SEO Keywords", type: "text", default: "e-learning, online courses, education" },
    ],
  },
  {
    id: "footer",
    label: "Footer",
    keys: [
      { key: SETTING_KEYS.SITE_FOOTER_TEXT, label: "Footer Description", type: "textarea", default: "Education is your right, not a product for sale." },
      { key: SETTING_KEYS.SITE_FOOTER_COPYRIGHT, label: "Copyright Text", type: "text", default: "Learnzfy. All rights reserved." },
    ],
  },
]
