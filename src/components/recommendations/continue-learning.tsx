"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, ChevronRight, Calendar } from "lucide-react"
import Link from "next/link"
import type { ContinueLearningCourse } from "@/lib/recommendations"

interface Props {
  courses: ContinueLearningCourse[]
}

export function ContinueLearning({ courses }: Props) {
  if (courses.length === 0) return null

  const getTimeAgo = (date: Date | null) => {
    if (!date) return "Recently"
    const diff = Date.now() - new Date(date).getTime()
    const days = Math.floor(diff / 86400000)
    if (days === 0) return "Today"
    if (days === 1) return "Yesterday"
    return `${days} days ago`
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Continue Learning
        </h2>
        <Link href="/student/courses">
          <Button variant="ghost" size="sm" className="gap-1">
            View All <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Link key={course.id} href={`/student/courses/${course.courseId}`}>
            <Card className="group transition-all hover:shadow-md h-full">
              <CardContent className="p-5 flex flex-col h-full">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {course.teacherName ?? "Instructor"}
                    </p>
                  </div>
                  <Badge variant="secondary" className="shrink-0 ml-2">
                    {course.progress}%
                  </Badge>
                </div>
                <Progress value={course.progress} className="h-2" />
                <div className="flex items-center justify-between mt-auto pt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {getTimeAgo(course.lastAccessedAt)}
                  </span>
                  <span className="flex items-center gap-1 group-hover:text-primary transition-colors">
                    Continue <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
