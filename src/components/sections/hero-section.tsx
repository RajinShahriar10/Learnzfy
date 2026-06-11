import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, GraduationCap, Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5" />
      <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="container relative mx-auto px-4 py-24 md:py-36">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm text-muted-foreground mb-8">
            <Sparkles className="h-4 w-4 text-primary" />
            Free education for everyone. No paywalls. No limits.
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl leading-tight">
            Learn the skills
            <br />
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              you need to succeed
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Access world-class courses taught by expert educators. 
            Build real projects, earn certificates, and advance your career — 
            all completely free.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="h-12 px-8 text-base gap-2">
                Start Learning Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/courses">
              <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                Browse Courses
              </Button>
            </Link>
          </div>
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <span>10,000+ students</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <span>500+ courses</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <span>100% free</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
