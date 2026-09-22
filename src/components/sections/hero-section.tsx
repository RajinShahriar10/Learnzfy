import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, GraduationCap, Sparkles } from "lucide-react"
import type { CmsHero } from "@/lib/cms/types"

export function HeroSection({ content }: { content: CmsHero }) {
  return (
    <section className="relative overflow-hidden border-b">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5" />
      <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="container relative mx-auto px-4 py-24 md:py-36">
        <div className="mx-auto max-w-4xl text-center">
          {content.badge && (
            <div className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm text-muted-foreground mb-8">
              <Sparkles className="h-4 w-4 text-primary" />
              {content.badge}
            </div>
          )}
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl leading-tight">
            {content.title}
            {content.highlight && (
              <>
                <br />
                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  {content.highlight}
                </span>
              </>
            )}
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {content.subtitle}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={content.primaryCta.href}>
              <Button size="lg" className="h-12 px-8 text-base gap-2">
                {content.primaryCta.label}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href={content.secondaryCta.href}>
              <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                {content.secondaryCta.label}
              </Button>
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            {content.stats.map((stat, index) => (
              <div key={index} className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                <span>
                  {stat.value} {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}