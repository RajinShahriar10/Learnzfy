"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DiscussionList } from "@/components/discussions/discussion-list"
import { AskQuestionForm } from "@/components/discussions/ask-question-form"

export default function CourseDiscussionsPage() {
  const params = useParams()
  const courseId = params.courseId as string

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2 gap-1">
            <Link href={`/student/courses/${courseId}`}>
              <ArrowLeft className="h-4 w-4" />
              Back to Course
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Discussions</h1>
          <p className="text-sm text-muted-foreground">
            Ask questions and discuss course content with fellow students
          </p>
        </div>
        <AskQuestionForm courseId={courseId} />
      </div>

      <DiscussionList
        courseId={courseId}
        basePath={`/student/courses/${courseId}/discussions`}
      />
    </div>
  )
}
