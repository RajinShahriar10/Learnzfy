"use client"

import { useState, useCallback, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { getLessonContent, getLessonProgress, type LessonNote } from "@/lib/lesson-data"
import { getCourseById } from "@/lib/mock-data"
import { teacherCourses } from "@/lib/teacher-data"
import { getQuizByLessonId } from "@/lib/quiz-data"
import { QuizTaking } from "@/components/quiz/quiz-taking"
import { VideoPlayer } from "@/components/lesson/video-player"
import { ResourcesPanel } from "@/components/lesson/resources-panel"
import { NotesPanel } from "@/components/lesson/notes-panel"
import { DiscussionList } from "@/components/discussions/discussion-list"
import { AskQuestionForm } from "@/components/discussions/ask-question-form"
import { CourseContentSidebar } from "@/components/lesson/course-content-sidebar"
import { BookmarkButton } from "@/components/bookmarks/bookmark-button"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  ChevronLeft,
  FileText,
  HelpCircle,
  Code,
  BookOpen,
} from "lucide-react"

const contentTypeIcons: Record<string, typeof BookOpen> = {
  video: BookOpen,
  article: FileText,
  quiz: HelpCircle,
  code: Code,
}

const contentTypeLabels: Record<string, string> = {
  video: "Video Lesson",
  article: "Article",
  quiz: "Quiz",
  code: "Code Exercise",
}

export default function LessonViewerPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId as string
  const lessonId = params.lessonId as string

  const course = getCourseById(courseId)
  const teacherCourse = teacherCourses.find((tc) => tc.title === course?.title)
  const lesson = getLessonContent(lessonId)
  const quiz = getQuizByLessonId(lessonId)
  const [progress, setProgress] = useState(() => getLessonProgress(lessonId))
  const [notes, setNotes] = useState<LessonNote[]>(progress.notes || [])
  const [activeTab, setActiveTab] = useState("resources")
  const [watchProgress, setWatchProgress] = useState(progress.watchProgress || 0)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)

  const allLessons = useMemo(() => {
    if (!teacherCourse) return []
    return teacherCourse.modules.flatMap((m) => m.lessons)
  }, [teacherCourse])

  const currentIndex = allLessons.findIndex((l) => l.id === lessonId)
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

  const handleProgress = useCallback((pct: number) => {
    setWatchProgress(pct)
  }, [])

  const toggleComplete = () => {
    setProgress((prev) => ({
      ...prev,
      completed: !prev.completed,
      completedAt: !prev.completed ? new Date().toISOString() : null,
    }))
  }

  const handleAddNote = (content: string, timestamp: number) => {
    const newNote: LessonNote = {
      id: `note-${Date.now()}`,
      content,
      timestamp,
      createdAt: new Date().toISOString(),
    }
    setNotes((prev) => [...prev, newNote])
  }

  const handleDeleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId))
  }

  const handleQuizComplete = () => {
    setQuizStarted(false)
    setQuizCompleted(true)
    setProgress((prev) => ({
      ...prev,
      completed: true,
      completedAt: new Date().toISOString(),
    }))
  }

  if (quiz && (quizStarted || quizCompleted)) {
    return <QuizTaking quiz={quiz} onComplete={handleQuizComplete} />
  }

  if (!course || !lesson) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <BookOpen className="h-16 w-16 text-muted-foreground/30" />
        <h2 className="mt-4 text-2xl font-bold">Lesson not found</h2>
        <p className="mt-2 text-muted-foreground">
          The lesson you are looking for does not exist
        </p>
        <Button asChild className="mt-6">
          <Link href={`/student/courses/${courseId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Course
          </Link>
        </Button>
      </div>
    )
  }

  const Icon = contentTypeIcons[lesson.contentType]

  return (
    <div className="flex gap-0 -mx-4 sm:-mx-6 lg:-mx-8">
      <CourseContentSidebar
        courseId={courseId}
        modules={teacherCourse?.modules || []}
        progress={Object.fromEntries(
          allLessons.map((l) => [l.id, getLessonProgress(l.id)])
        )}
      />

      <div className="flex-1 min-w-0">
        <div className="sticky top-16 z-20 bg-background border-b">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
                <Link href={`/student/courses/${courseId}`}>
                  <ChevronLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div className="hidden sm:block">
                <div className="flex items-center gap-2 text-sm">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {contentTypeLabels[lesson.contentType]}
                  </span>
                  {lesson.isFree && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5">
                      Free
                    </Badge>
                  )}
                </div>
                <h1 className="text-sm font-medium truncate max-w-md">
                  {lesson.title}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <BookmarkButton lessonId={lessonId} variant="outline" size="icon" />
              {prevLesson && (
                <Button variant="outline" size="sm" asChild>
                  <Link
                    href={`/student/courses/${courseId}/lessons/${prevLesson.id}`}
                    className="gap-1"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    Previous
                  </Link>
                </Button>
              )}
              {nextLesson && (
                <Button variant="outline" size="sm" asChild>
                  <Link
                    href={`/student/courses/${courseId}/lessons/${nextLesson.id}`}
                    className="gap-1"
                  >
                    Next
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              )}
            </div>
          </div>

          <div className="px-4 sm:px-6 pb-3">
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
              <span>{lesson.duration}</span>
              <span>&middot;</span>
              <span>
                Lesson {currentIndex + 1} of {allLessons.length}
              </span>
            </div>
            <Progress value={watchProgress} className="h-1" />
          </div>
        </div>

        <div className="px-4 sm:px-6 py-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {lesson.contentType === "video" && lesson.youtubeUrl && (
                <VideoPlayer
                  youtubeUrl={lesson.youtubeUrl}
                  onProgress={handleProgress}
                  initialProgress={watchProgress}
                />
              )}

              {lesson.contentType === "article" && lesson.articleContent && (
                <CardMarkdown content={lesson.articleContent} />
              )}

              {lesson.contentType === "code" && lesson.codeExamples && (
                <div className="space-y-4">
                  <div className="rounded-lg border bg-card p-6">
                    <h2 className="font-semibold mb-2">Code Exercise</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                      {lesson.description}
                    </p>
                    <ResourcesPanel codeExamples={lesson.codeExamples} />
                  </div>
                </div>
              )}

              {lesson.contentType === "quiz" && quiz && (
                <div className="rounded-lg border bg-card p-6 text-center">
                  <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground/40" />
                  <h2 className="mt-4 text-lg font-semibold">{quiz.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground max-w-lg mx-auto">
                    {quiz.description}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
                    <span>{quiz.questions.length} questions</span>
                    <span>{quiz.timeLimit} min time limit</span>
                    <span>{quiz.passingScore}% to pass</span>
                    <span>{quiz.attemptsAllowed} attempts</span>
                  </div>
                  <Button className="mt-6" size="lg" onClick={() => setQuizStarted(true)}>
                    <HelpCircle className="mr-2 h-5 w-5" />
                    Start Quiz
                  </Button>
                </div>
              )}

              <div className="rounded-lg border bg-card p-6">
                <h2 className="font-semibold mb-2">About this lesson</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {lesson.description}
                </p>
              </div>

              <div className="flex items-center justify-between rounded-lg border bg-card p-4">
                <div className="flex items-center gap-3">
                  {progress.completed ? (
                    <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                  ) : (
                    <Circle className="h-6 w-6 text-muted-foreground/40" />
                  )}
                  <div>
                    <p className="text-sm font-medium">
                      {progress.completed
                        ? "Lesson completed"
                        : "Mark as complete"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {progress.completed
                        ? `Completed ${progress.completedAt ? new Date(progress.completedAt).toLocaleDateString() : ""}`
                        : "Track your progress through the course"}
                    </p>
                  </div>
                </div>
                <Button
                  variant={progress.completed ? "outline" : "default"}
                  size="sm"
                  onClick={toggleComplete}
                >
                  {progress.completed ? (
                    "Mark Incomplete"
                  ) : (
                    <>
                      <CheckCircle2 className="mr-1.5 h-4 w-4" />
                      Mark Complete
                    </>
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                {prevLesson ? (
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={`/student/courses/${courseId}/lessons/${prevLesson.id}`}
                      className="gap-1"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      {prevLesson.title}
                    </Link>
                  </Button>
                ) : (
                  <div />
                )}
                {nextLesson ? (
                  <Button size="sm" asChild>
                    <Link
                      href={`/student/courses/${courseId}/lessons/${nextLesson.id}`}
                      className="gap-1"
                    >
                      {nextLesson.title}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button variant="default" size="sm" asChild>
                    <Link href={`/student/courses/${courseId}`}>
                      Complete Course
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-64">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full">
                    <TabsTrigger value="resources" className="flex-1">
                      Resources
                    </TabsTrigger>
                    <TabsTrigger value="notes" className="flex-1">
                      Notes
                      {notes.length > 0 && (
                        <span className="ml-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                          {notes.length}
                        </span>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="discussions" className="flex-1">
                      Discuss
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="resources" className="mt-4">
                    <ResourcesPanel
                      attachments={lesson.attachments}
                      resources={lesson.resources}
                      codeExamples={lesson.codeExamples}
                      articleContent={lesson.articleContent}
                    />
                  </TabsContent>
                  <TabsContent value="notes" className="mt-4">
                    <NotesPanel
                      notes={notes}
                      onAddNote={handleAddNote}
                      onDeleteNote={handleDeleteNote}
                    />
                  </TabsContent>
                  <TabsContent value="discussions" className="mt-4">
                    <div className="space-y-3">
                      <AskQuestionForm courseId={courseId} lessonId={lessonId} />
                      <DiscussionList
                        courseId={courseId}
                        lessonId={lessonId}
                        basePath={`/student/courses/${courseId}/discussions`}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CardMarkdown({ content }: { content: string }) {
  const lines = content.split("\n")
  const elements: React.ReactNode[] = []
  let inCodeBlock = false
  let codeContent = ""
  let codeLanguage = ""

  lines.forEach((line, i) => {
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        elements.push(
          <pre key={i} className="rounded-lg bg-muted p-4 text-sm overflow-x-auto my-3">
            <code>{codeContent}</code>
          </pre>
        )
        codeContent = ""
        codeLanguage = ""
        inCodeBlock = false
      } else {
        inCodeBlock = true
        codeLanguage = line.slice(3).trim()
      }
      return
    }

    if (inCodeBlock) {
      codeContent += (codeContent ? "\n" : "") + line
      return
    }

    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={i} className="text-2xl font-bold mt-6 mb-3">
          {line.slice(2)}
        </h1>
      )
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-xl font-semibold mt-5 mb-2">
          {line.slice(3)}
        </h2>
      )
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-lg font-medium mt-4 mb-2">
          {line.slice(4)}
        </h3>
      )
    } else if (line.trim() === "") {
      elements.push(<div key={i} className="h-2" />)
    } else {
      elements.push(
        <p key={i} className="text-sm text-muted-foreground leading-relaxed mb-2">
          {line}
        </p>
      )
    }
  })

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="prose prose-sm max-w-none dark:prose-invert">
        {elements}
      </div>
    </div>
  )
}
