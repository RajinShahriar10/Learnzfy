"use client"

import { useParams } from "next/navigation"
import { DiscussionThread } from "@/components/discussions/discussion-thread"

export default function DiscussionThreadPage() {
  const params = useParams()
  const courseId = params.courseId as string
  const discussionId = params.discussionId as string

  return (
    <DiscussionThread
      discussionId={discussionId}
      backUrl={`/student/courses/${courseId}/discussions`}
    />
  )
}
