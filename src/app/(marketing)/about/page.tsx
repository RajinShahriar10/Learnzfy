import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Award, BookOpen, Heart, Globe, Target, Users } from "lucide-react"
import { getSiteContent } from "@/lib/cms/content"

const valueIcons = [Heart, Award, Globe, Target, BookOpen]

export default async function AboutPage() {
  const content = await getSiteContent()
  const { about } = content

  return (
    <div className="min-h-screen">
      <section className="border-b bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 py-20 md:py-28 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            {about.hero.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {about.hero.subtitle}
          </p>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            {about.hero.paragraph}
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              {about.mission.heading}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {about.mission.text}
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {about.values.items.map((value, index) => {
              const Icon = valueIcons[index % valueIcons.length]
              return (
                <div
                  key={index}
                  className="flex gap-4 rounded-xl border bg-card p-6"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {value.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">{about.team.heading}</h2>
            <p className="mt-2 text-muted-foreground">{about.team.subtext}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {about.team.items.map((member, index) => (
              <div
                key={index}
                className="rounded-xl border bg-card p-6 text-center"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-primary mt-1">{member.role}</p>
                <p className="text-sm text-muted-foreground mt-2">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            {about.cta.heading}
          </h2>
          <p className="text-muted-foreground mb-8">{about.cta.text}</p>
          <Link href={about.cta.buttonHref}>
            <Button size="lg">{about.cta.buttonLabel}</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}