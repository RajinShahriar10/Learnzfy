import { Award, Briefcase, Heart, Target } from "lucide-react"
import type { CmsAchievements } from "@/lib/cms/types"

const icons = [Briefcase, Award, Heart, Target]

export function AchievementsSection({ content }: { content: CmsAchievements }) {
  if (!content.heading && content.items.length === 0) return null

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">{content.heading}</h2>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            {content.subtext}
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {content.items.map((item, index) => {
            const Icon = icons[index % icons.length]
            return (
              <div
                key={index}
                className="rounded-xl border bg-card p-6 transition-all hover:shadow-md"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}