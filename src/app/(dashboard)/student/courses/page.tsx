import { getEnrolledCourseDetails } from "@/lib/student-data"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  BookOpen,
  ChevronRight,
  Clock,
  Play,
  Award,
  BarChart3,
} from "lucide-react"

export default function MyCoursesPage() {
  const enrolled = getEnrolledCourseDetails().filter((e) => e.course)

  const inProgress = enrolled.filter((e) => e.progress < 100 && e.progress > 0)
  const completed = enrolled.filter((e) => e.progress === 100)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">My Courses</h1>
        <p className="text-sm text-muted-foreground">
          {enrolled.length} courses enrolled &middot; {completed.length} completed
        </p>
      </div>

      {inProgress.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            In Progress
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {inProgress.map((enrolled) => (
              <Card key={enrolled.id} className="group transition-all hover:shadow-md">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold group-hover:text-primary transition-colors">
                          {enrolled.course?.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {enrolled.course?.teacher.name}
                        </p>
                      </div>
                    </div>
                    <Badge>{enrolled.progress}%</Badge>
                  </div>
                  <Progress value={enrolled.progress} className="h-2 mb-3" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {enrolled.completedModules}/{enrolled.totalModules} modules
                    </span>
                    <Link href={`/courses/${enrolled.course?.slug}`}>
                      <Button size="sm" className="gap-1 h-8">
                        <Play className="h-3.5 w-3.5" />
                        Continue
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {completed.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-green-500" />
            Completed
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {completed.map((enrolled) => (
              <Card key={enrolled.id}>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                      <Award className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold">{enrolled.course?.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {enrolled.course?.teacher.name}
                      </p>
                    </div>
                    <Badge variant="default" className="bg-green-100 text-green-700">
                      Done
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {enrolled.length === 0 && (
        <div className="text-center py-20">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/40" />
          <h3 className="mt-4 text-lg font-semibold">No courses yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Enroll in a course to get started
          </p>
          <Link href="/courses">
            <Button>Browse Courses</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
