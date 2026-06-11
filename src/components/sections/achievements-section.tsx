import { Award, Briefcase, Heart, Target } from "lucide-react"

const achievements = [
  {
    icon: Briefcase,
    title: "Career Switchers",
    description: "72% of students successfully transitioned into tech careers within 6 months",
  },
  {
    icon: Award,
    title: "Certificates Earned",
    description: "Over 25,000 certificates issued to students worldwide",
  },
  {
    icon: Heart,
    title: "Community Driven",
    description: "Join a community of 50,000+ learners supporting each other",
  },
  {
    icon: Target,
    title: "Project Based",
    description: "Build real-world projects that showcase your skills to employers",
  },
]

export function AchievementsSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">
            Student Achievements
          </h2>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            Our students go on to do amazing things. Here&apos;s what the
            Learnzfy community has accomplished.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {achievements.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border bg-card p-6 transition-all hover:shadow-md"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
