export const dynamic = "force-dynamic"

import { HeroSection } from "@/components/sections/hero-section"
import { FeaturedCourses } from "@/components/sections/featured-courses"
import { StatisticsSection } from "@/components/sections/statistics-section"
import { TopTeachers } from "@/components/sections/top-teachers"
import { AchievementsSection } from "@/components/sections/achievements-section"
import { LeaderboardPreview } from "@/components/sections/leaderboard-preview"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { SponsorsSection } from "@/components/sections/sponsors-section"
import { CTASection } from "@/components/sections/cta-section"
import { getSiteContent } from "@/lib/cms/content"

export default async function HomePage() {
  const content = await getSiteContent()

  return (
    <>
      <HeroSection content={content.hero} />
      <FeaturedCourses content={content.featured} />
      <StatisticsSection labels={content.statistics.labels} />
      <TopTeachers content={content.topTeachers} />
      <AchievementsSection content={content.achievements} />
      <LeaderboardPreview content={content.leaderboard} />
      <TestimonialsSection content={content.testimonials} />
      <SponsorsSection subtext={content.sponsors.subtext} />
      <CTASection content={content.cta} />
    </>
  )
}