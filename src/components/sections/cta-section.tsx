import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import type { SiteContent } from "@/lib/cms/types"

export function CTASection({ content }: { content: SiteContent["cta"] }) {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-purple-600 p-8 md:p-16 text-center text-primary-foreground">
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{content.heading}</h2>
            <p className="text-lg text-primary-foreground/80 max-w-xl mx-auto mb-8">
              {content.subtext}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href={content.primaryCta.href}>
                <Button
                  size="lg"
                  variant="secondary"
                  className="h-12 px-8 text-base gap-2"
                >
                  {content.primaryCta.label}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href={content.secondaryCta.href}>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 text-base border-primary-foreground/20 text-primary-foreground hover:text-primary-foreground hover:bg-primary-foreground/10"
                >
                  {content.secondaryCta.label}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}