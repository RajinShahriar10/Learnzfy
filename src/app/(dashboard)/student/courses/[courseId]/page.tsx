import { getCourseById } from "@/lib/mock-data"
import { teacherCourses } from "@/lib/teacher-data"
import { getCourseLessons, getLessonProgress, getCourseProgress } from "@/lib/lesson-data"
import { getEnrolledCourseById } from "@/lib/student-data"
import { getCourseExams } from "@/lib/exam-data"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Play, Clock, BookOpen, Users, BarChart3, FileCheck, Award, MessageSquare, Star } from "lucide-react"
import { CourseContentSidebar } from "@/components/lesson/course-content-sidebar"
import { GenerateCertificateButton } from "@/components/certificate/generate-certificate-button"
import { CourseReviewsSection } from "@/components/reviews/course-reviews-section"
import { BookmarkButton } from "@/components/bookmarks/bookmark-button"

const difficultyColors: Record<string, string> = {
  beginner: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
  intermediate: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400",
  advanced: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
}

export default async function StudentCourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = await params
  const course = getCourseById(courseId)

  if (!course) notFound()

  const teacherCourse = teacherCourses.find(
    (tc) => tc.title === course.title
  )

  const modules = teacherCourse?.modules || []
  const courseProgress = getCourseProgress(teacherCourse?.id || "")
  const enrolled = getEnrolledCourseById(courseId)
  const progressPercent = enrolled?.progress || courseProgress

  if (modules.length === 0) {
    return (
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/student/courses">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Courses
          </Link>
        </Button>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Badge className={difficultyColors[course.difficulty]}>
              {course.difficulty}
            </Badge>
            <Badge variant="outline">{course.category}</Badge>
          </div>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            {course.description}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {course.duration}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              {course.studentCount} students
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              {course.teacher.name}
            </span>
          </div>
        </div>

        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/40" />
            <h3 className="mt-4 text-lg font-semibold">No course content yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Course content is being prepared
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const allLessons = modules.flatMap((m) => m.lessons)
  const completedCount = allLessons.filter((l) => {
    const p = getLessonProgress(l.id)
    return p.completed
  }).length

  return (
    <div className="flex gap-0 -mx-4 sm:-mx-6 lg:-mx-8">
      <div className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/student/courses">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to My Courses
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <BookmarkButton courseId={courseId} variant="outline" />
            <Button variant="outline" size="sm" asChild>
              <Link href={`/student/courses/${courseId}/discussions`} className="gap-1.5">
                <MessageSquare className="h-4 w-4" />
                Discussions
              </Link>
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Badge className={difficultyColors[course.difficulty]}>
              {course.difficulty}
            </Badge>
            <Badge variant="outline">{course.category}</Badge>
          </div>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="mt-2 text-muted-foreground">{course.description}</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{progressPercent}%</p>
                  <p className="text-xs text-muted-foreground">Course Progress</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-amber-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {completedCount}/{allLessons.length}
                  </p>
                  <p className="text-xs text-muted-foreground">Lessons Done</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Clock className="h-8 w-8 text-emerald-500" />
                <div>
                  <p className="text-2xl font-bold">{course.duration}</p>
                  <p className="text-xs text-muted-foreground">Duration</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Progress value={progressPercent} className="h-2 mt-6" />
        </div>

        <div className="space-y-3">
          {modules.map((mod) => {
            const modCompleted = mod.lessons.filter((l) => {
              const p = getLessonProgress(l.id)
              return p.completed
            }).length

            return (
              <Card key={mod.id} className="overflow-hidden">
                <div className="bg-muted/30 px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {mod.order}
                    </div>
                    <div>
                      <h3 className="font-semibold">{mod.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {mod.description}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {modCompleted}/{mod.lessons.length}
                  </span>
                </div>
                <div className="divide-y">
                  {mod.lessons.map((lesson) => {
                    const progress = getLessonProgress(lesson.id)

                    return (
                      <Link
                        key={lesson.id}
                        href={`/student/courses/${courseId}/lessons/${lesson.id}`}
                        className="flex items-center gap-3 px-5 py-3 text-sm hover:bg-muted/30 transition-colors"
                      >
                        <div className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                          progress.completed
                            ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
                            : "bg-muted text-muted-foreground"
                        )}>
                          {progress.completed ? (
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <span className="text-[10px] font-medium">
                              {lesson.order}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={cn(
                            "truncate",
                            progress.completed && "text-muted-foreground"
                          )}>
                            {lesson.title}
                          </p>
                          <p className="text-xs text-muted-foreground/60">
                            {lesson.contentType} &middot; {lesson.duration}
                          </p>
                        </div>
                        {lesson.isFree && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5">
                            Free
                          </Badge>
                        )}
                        {progress.watchProgress > 0 && !progress.completed && (
                          <span className="text-xs text-muted-foreground/60">
                            {progress.watchProgress}%
                          </span>
                        )}
                        <Play className="h-3.5 w-3.5 text-muted-foreground/40" />
                      </Link>
                    )
                  })}
                </div>
              </Card>
            )
          })}
        </div>

        {teacherCourse && (
          <ExamsSection courseId={courseId} teacherCourseId={teacherCourse.id} />
        )}

        {progressPercent === 100 && (
          <div className="mt-8 rounded-xl border-2 border-emerald-200 bg-emerald-50/50 p-6 text-center dark:border-emerald-800 dark:bg-emerald-950/20">
            <Award className="mx-auto h-10 w-10 text-emerald-600" />
            <h3 className="mt-3 text-lg font-semibold text-emerald-800 dark:text-emerald-300">
              Course Completed!
            </h3>
            <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-400">
              Congratulations on completing this course. Claim your certificate.
            </p>
            <div className="mt-4 flex justify-center">
              <GenerateCertificateButton courseId={courseId} />
            </div>
          </div>
        )}

        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Reviews
          </h2>
          <CourseReviewsSection
            courseId={courseId}
            enrolledProgress={progressPercent}
          />
        </div>
      </div>

      <CourseContentSidebar
        courseId={courseId}
        modules={modules}
        progress={Object.fromEntries(
          allLessons.map((l) => [l.id, getLessonProgress(l.id)])
        )}
      />
    </div>
  )
}

function ExamsSection({ courseId, teacherCourseId }: { courseId: string; teacherCourseId: string }) {
  const exams = getCourseExams(teacherCourseId)

  if (exams.length === 0) return null

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <FileCheck className="h-5 w-5 text-primary" />
        Exams
      </h2>
      <div className="space-y-3">
        {exams.map((exam) => (
          <Link
            key={exam.id}
            href={`/student/courses/${courseId}/exams/${exam.id}`}
            className="block"
          >
            <Card className="overflow-hidden transition-all hover:shadow-md group">
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <FileCheck className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {exam.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {exam.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span>{exam.totalQuestions} questions</span>
                      <span>{exam.timeLimit} min</span>
                      <span>{exam.passingScore}% pass</span>
                      <span>{exam.totalMarks} marks</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    {exam.attemptsAllowed} attempt{exam.attemptsAllowed !== 1 ? "s" : ""}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}
