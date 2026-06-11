import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CourseCard } from "@/components/shared/course-card"
import { courses } from "@/lib/mock-data"
import { ArrowRight } from "lucide-react"

export function FeaturedCourses() {
  const featured = courses.slice(0, 6)

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured Courses</h2>
            <p className="mt-2 text-muted-foreground">
              Start learning from our most popular courses
            </p>
          </div>
          <Link href="/courses">
            <Button variant="ghost" className="gap-2 hidden sm:flex">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Link href="/courses">
            <Button variant="outline" className="gap-2">
              View All Courses <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
