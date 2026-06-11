import Link from "next/link"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/config"
import { Award, BookOpen, Heart, Globe, Target, Users } from "lucide-react"

const values = [
  {
    icon: Heart,
    title: "Free for Everyone",
    description:
      "We believe education is a fundamental right. Every course on Learnzfy is completely free, with no hidden fees or paywalls.",
  },
  {
    icon: Award,
    title: "Quality Content",
    description:
      "Our courses are crafted by industry experts and educators who are passionate about teaching and committed to your success.",
  },
  {
    icon: Globe,
    title: "Global Community",
    description:
      "Join learners from over 100 countries. Our platform supports multiple languages and connects you with a diverse global community.",
  },
  {
    icon: Target,
    title: "Practical Learning",
    description:
      "Learn by doing. Every course includes hands-on projects, real-world examples, and interactive exercises to reinforce your skills.",
  },
]

const team = [
  { name: "Sarah Johnson", role: "CEO & Co-Founder", bio: "Former educator passionate about accessible education." },
  { name: "Michael Chen", role: "CTO & Co-Founder", bio: "Full-stack engineer with 15 years of experience." },
  { name: "Emily Rodriguez", role: "Head of Content", bio: "Curriculum designer focused on learning outcomes." },
  { name: "David Kim", role: "Head of Engineering", bio: "Building scalable systems for millions of learners." },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <section className="border-b bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 py-20 md:py-28 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            About Learnzfy
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {siteConfig.tagline}
          </p>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            We&apos;re on a mission to make quality education accessible to
            everyone, everywhere, regardless of their economic background.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Our Mission
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Learnzfy was founded on a simple belief: that education should be
              a right, not a privilege. In a world where quality education is
              increasingly commodified, we&apos;re building a platform where
              anyone can learn anything, completely free.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {values.map((value) => (
              <div
                key={value.title}
                className="flex gap-4 rounded-xl border bg-card p-6"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <value.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Our Team</h2>
            <p className="mt-2 text-muted-foreground">
              Meet the people behind Learnzfy
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <div
                key={member.name}
                className="rounded-xl border bg-card p-6 text-center"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-primary mt-1">{member.role}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Ready to start learning?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of students already learning on Learnzfy.
          </p>
          <Link href="/register">
            <Button size="lg">Get Started Free</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
