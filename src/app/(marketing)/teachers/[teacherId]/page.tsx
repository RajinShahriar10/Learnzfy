"use client"

import { use, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { teachers, courses } from "@/lib/mock-data"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ReviewList } from "@/components/reviews/review-list"
import { BookOpen, Users, Star, ArrowLeft, GraduationCap } from "lucide-react"

export default function TeacherProfilePage({
  params,
}: {
  params: Promise<{ teacherId: string }>
}) {
  const { teacherId } = use(params)
  const teacher = useMemo(() => teachers.find((t) => t.id === teacherId), [teacherId])

  if (!teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Teacher not found</p>
          <Button variant="outline" size="sm" asChild className="mt-4">
            <Link href="/teachers">Back to Teachers</Link>
          </Button>
        </div>
      </div>
    )
  }

  const teacherCourses = courses.filter(
    (c) => c.teacher.name === teacher.name
  )

  const initials = teacher.name
    .split(" ")
    .map((n) => n[0])
    .join("")

  return (
    <div className="min-h-screen">
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/teachers">
              <ArrowLeft className="mr-2 h-4 w-4" />
              All Teachers
            </Link>
          </Button>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="h-24 w-24 ring-4 ring-primary/10">
              <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{teacher.name}</h1>
              <p className="text-muted-foreground mt-1">{teacher.role}</p>
              <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
                {teacher.bio}
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="h-4 w-4" />
                  {teacher.specialties.join(", ")}
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4" />
                  {teacher.courseCount} courses
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  {teacher.studentCount.toLocaleString()} students
                </span>
                <span className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {teacher.rating}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Courses by {teacher.name}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {teacherCourses.map((course) => (
              <Link key={course.id} href={`/courses/${course.slug}`}>
                <Card className="group h-full transition-all hover:shadow-md hover:-translate-y-0.5">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-[10px]">
                        {course.category}
                      </Badge>
                      <Badge
                        variant={
                          course.difficulty === "beginner"
                            ? "beginner"
                            : course.difficulty === "intermediate"
                              ? "intermediate"
                              : "advanced"
                        }
                        className="text-[10px]"
                      >
                        {course.difficulty}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {course.description}
                    </p>
                    <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {course.rating}
                      </span>
                      <span>{course.duration}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 border-t">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Teacher Reviews
          </h2>
          <ReviewList
            entityType="teacher"
            entityId={teacherId}
            canReview={false}
          />
        </div>
      </section>
    </div>
  )
}
