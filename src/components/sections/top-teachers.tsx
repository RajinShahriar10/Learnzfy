import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TeacherCard } from "@/components/shared/teacher-card"
import { teachers } from "@/lib/mock-data"
import { ArrowRight } from "lucide-react"

export function TopTeachers() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Top Teachers</h2>
            <p className="mt-2 text-muted-foreground">
              Learn from industry experts
            </p>
          </div>
          <Link href="/teachers">
            <Button variant="ghost" className="gap-2 hidden sm:flex">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {teachers.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} />
          ))}
        </div>
      </div>
    </section>
  )
}
