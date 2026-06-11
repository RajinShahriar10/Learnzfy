import { BookOpen, GraduationCap, Trophy, Users } from "lucide-react"

const stats = [
  { icon: GraduationCap, value: "10,000+", label: "Active Students" },
  { icon: BookOpen, value: "500+", label: "Free Courses" },
  { icon: Users, value: "50+", label: "Expert Teachers" },
  { icon: Trophy, value: "95%", label: "Satisfaction Rate" },
]

export function StatisticsSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group relative overflow-hidden rounded-2xl border bg-card p-8 text-center transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
