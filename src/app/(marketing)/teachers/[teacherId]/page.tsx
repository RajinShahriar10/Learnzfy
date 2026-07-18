"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ReviewList } from "@/components/reviews/review-list"
import { BookOpen, Users, Star, ArrowLeft, GraduationCap } from "lucide-react"

interface TeacherProfile {
  id: string
  name: string | null
  image: string | null
  bio: string | null
  specialties: string[]
  courseCount: number
  studentCount: number
  rating: number
  courses: Array<{
    id: string
    title: string
    slug: string
    description: string
    difficulty: string
    avgRating: number
    studentCount: number
    duration: number | null
    category: { name: string } | null
  }>
}

export default function TeacherProfilePage({
  params,
}: {
  params: Promise<{ teacherId: string }>
}) {
  const { teacherId } = use(params)
  const [teacher, setTeacher] = useState<TeacherProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/public/teachers/${teacherId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setTeacher(d.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [teacherId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

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

  const name = teacher.name || "Unknown"
  const initials = name
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
              <h1 className="text-3xl font-bold">{name}</h1>
              <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
                {teacher.bio || "Educator on Learnzfy"}
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
                {teacher.specialties.length > 0 && (
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="h-4 w-4" />
                    {teacher.specialties.join(", ")}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4" />
                  {teacher.courseCount} courses
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  {teacher.studentCount.toLocaleString()} students
                </span>
                {teacher.rating > 0 && (
                  <span className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {teacher.rating}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Courses by {name}
          </h2>
          {teacher.courses.length === 0 ? (
            <p className="text-muted-foreground">No published courses yet.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {teacher.courses.map((course) => (
                <Link key={course.id} href={`/courses/${course.slug}`}>
                  <Card className="group h-full transition-all hover:shadow-md hover:-translate-y-0.5">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {course.category && (
                          <Badge variant="secondary" className="text-[10px]">
                            {course.category.name}
                          </Badge>
                        )}
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
                          {course.avgRating || "N/A"}
                        </span>
                        <span>{course.duration ? `${course.duration}h` : "Self-paced"}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
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
