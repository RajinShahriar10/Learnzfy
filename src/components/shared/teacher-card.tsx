import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, Users, BookOpen } from "lucide-react"
import type { MockTeacher } from "@/lib/mock-data"

export function TeacherCard({ teacher }: { teacher: MockTeacher }) {
  const initials = teacher.name
    .split(" ")
    .map((n) => n[0])
    .join("")

  return (
    <Link href={`/teachers/${teacher.id}`}>
      <Card className="group h-full transition-all hover:shadow-lg hover:-translate-y-1">
        <CardContent className="p-6 text-center">
          <Avatar className="h-20 w-20 mx-auto mb-4 ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all">
            <AvatarFallback className="text-lg bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
            {teacher.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-3">{teacher.role}</p>
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {teacher.bio}
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {teacher.specialties.map((s) => (
              <Badge key={s} variant="secondary" className="text-xs">
                {s}
              </Badge>
            ))}
          </div>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              {teacher.courseCount} courses
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {teacher.studentCount.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              {teacher.rating}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
