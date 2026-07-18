import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { BookOpen, Star, Users } from "lucide-react"

export interface CourseData {
  id: string
  title: string
  slug: string
  description: string
  thumbnailUrl?: string | null
  difficulty: string
  duration?: number | null
  teacher: { id: string; name: string | null; image?: string | null }
  category?: { id: string; name: string; slug: string } | null
  studentCount: number
  avgRating: number
  [key: string]: unknown
}

const difficultyVariant = {
  beginner: "beginner" as const,
  intermediate: "intermediate" as const,
  advanced: "advanced" as const,
}

export function CourseCard({ course }: { course: CourseData }) {
  const teacherName = course.teacher.name || "Unknown"
  const initials = teacherName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)

  return (
    <Link href={`/courses/${course.slug}`}>
      <Card className="group h-full overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
        <div className="aspect-video bg-gradient-to-br from-primary/20 via-primary/10 to-secondary flex items-center justify-center">
          <BookOpen className="h-12 w-12 text-primary/40" />
        </div>
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant={difficultyVariant[course.difficulty as keyof typeof difficultyVariant] || "beginner"}>
              {course.difficulty}
            </Badge>
            {course.category && (
              <Badge variant="secondary">{course.category.name}</Badge>
            )}
          </div>
          <h3 className="font-semibold text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {course.description}
          </p>
          <div className="flex items-center gap-2 mb-3">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              {teacherName}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {course.studentCount.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              {course.avgRating || "N/A"}
            </span>
          </div>
        </CardContent>
        <CardFooter className="px-5 pb-4 pt-0">
          <div className="text-xs text-muted-foreground">
            {course.duration ? `${course.duration} hours` : "Self-paced"}
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
