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

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedCourses />
      <StatisticsSection />
      <TopTeachers />
      <AchievementsSection />
      <LeaderboardPreview />
      <TestimonialsSection />
      <SponsorsSection />
      <CTASection />
    </>
  )
}
