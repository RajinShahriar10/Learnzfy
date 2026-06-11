"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Users, BookOpen, ChevronRight, GraduationCap } from "lucide-react"
import Link from "next/link"
import type { RecommendedTeacher } from "@/lib/recommendations"

interface Props {
  teachers: RecommendedTeacher[]
}

export function RecommendedTeachers({ teachers }: Props) {
  if (teachers.length === 0) return null

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-violet-500" />
          Recommended Teachers
        </h2>
        <Link href="/teachers">
          <Button variant="ghost" size="sm" className="gap-1">
            View All <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {teachers.map((teacher) => {
          const initials = teacher.name
            ?.split(" ")
            .map((n) => n[0])
            .join("") ?? "T"

          return (
            <Link key={teacher.id} href={`/teachers/${teacher.id}`}>
              <Card className="group transition-all hover:shadow-md h-full">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12 ring-2 ring-violet-500/20">
                      <AvatarImage src={teacher.image ?? undefined} />
                      <AvatarFallback className="bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                        {teacher.name ?? "Unknown"}
                      </h3>
                      {teacher.bio && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {teacher.bio}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      {teacher.courseCount} courses
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {teacher.studentCount} students
                    </span>
                    {teacher.rating > 0 && (
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        {teacher.rating}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-[10px] text-violet-500/70 font-medium">
                    {teacher.matchReason}
                  </p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
