"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Users, ChevronRight, Sparkles } from "lucide-react"
import Link from "next/link"
import type { RecommendedCourse } from "@/lib/recommendations"

interface Props {
  courses: RecommendedCourse[]
  title?: string
  emptyMessage?: string
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  intermediate: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  advanced: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
}

export function RecommendedCourses({ courses, title = "Recommended for You", emptyMessage }: Props) {
  if (courses.length === 0 && !emptyMessage) return null

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          {title}
        </h2>
        <Link href="/courses">
          <Button variant="ghost" size="sm" className="gap-1">
            Browse All <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      {courses.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          {emptyMessage ?? "No recommendations yet. Start exploring courses!"}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map((course) => (
            <Link key={course.id} href={`/courses/${course.slug}`}>
              <Card className="group transition-all hover:shadow-md h-full overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary/20">
                    {course.title.charAt(0)}
                  </span>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start gap-1.5 mb-2">
                    <Badge
                      variant="secondary"
                      className={`text-[10px] px-1.5 py-0 ${DIFFICULTY_COLORS[course.difficulty] ?? ""}`}
                    >
                      {course.difficulty}
                    </Badge>
                    {course.category && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        {course.category.name}
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors mb-2">
                    {course.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-1">
                    {course.teacher.name ?? "Instructor"}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {course.studentCount}
                    </span>
                    {course.rating > 0 && (
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        {course.rating}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-[10px] text-primary/70 font-medium">
                    {course.matchReason}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
