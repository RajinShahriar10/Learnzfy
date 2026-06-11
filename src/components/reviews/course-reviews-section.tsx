"use client"

import { useSession } from "next-auth/react"
import { ReviewList } from "@/components/reviews/review-list"

interface CourseReviewsSectionProps {
  courseId: string
  enrolledProgress: number
}

export function CourseReviewsSection({
  courseId,
  enrolledProgress,
}: CourseReviewsSectionProps) {
  const { data: session } = useSession()
  const isStudent = session?.user?.role === "STUDENT"
  const canReview = isStudent && enrolledProgress >= 30
  const needsMoreProgress = isStudent && enrolledProgress > 0 && enrolledProgress < 30
  const notEnrolled = !isStudent || enrolledProgress === 0

  let eligibilityMessage: string | undefined
  if (notEnrolled) {
    eligibilityMessage = "Enroll in this course to leave a review"
  } else if (needsMoreProgress) {
    eligibilityMessage = `Complete at least 30% of the course to leave a review (currently ${enrolledProgress}%)`
  }

  return (
    <ReviewList
      entityType="course"
      entityId={courseId}
      currentUserId={session?.user?.id}
      canReview={canReview}
      eligibilityMessage={eligibilityMessage}
      isAdmin={["ADMIN", "SUPER_ADMIN"].includes(session?.user?.role ?? "")}
    />
  )
}
