import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export type ApplicationStatusValue = "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "CHANGES_REQUESTED"

export interface TeacherApplicationData {
  id: string
  userId: string
  fullName: string
  profilePhoto: string | null
  bio: string | null
  qualifications: string | null
  experience: string | null
  linkedIn: string | null
  portfolioWebsite: string | null
  socialLinks: Record<string, string> | null
  expertiseArea: string | null
  sampleCourseProposal: string | null
  status: ApplicationStatusValue
  adminNotes: AdminNote[] | null
  reviewedBy: string | null
  reviewedAt: Date | null
  rejectionReason: string | null
  changesRequested: string | null
  createdAt: Date
  updatedAt: Date
}

export interface AdminNote {
  id: string
  author: string
  content: string
  createdAt: string
}

export interface ApplicationInput {
  fullName: string
  profilePhoto?: string
  bio?: string
  qualifications?: string
  experience?: string
  linkedIn?: string
  portfolioWebsite?: string
  socialLinks?: Record<string, string>
  expertiseArea?: string
  sampleCourseProposal?: string
}

function toData(a: any): TeacherApplicationData {
  return {
    id: a.id,
    userId: a.userId,
    fullName: a.fullName,
    profilePhoto: a.profilePhoto,
    bio: a.bio,
    qualifications: a.qualifications,
    experience: a.experience,
    linkedIn: a.linkedIn,
    portfolioWebsite: a.portfolioWebsite,
    socialLinks: a.socialLinks as unknown as Record<string, string> | null,
    expertiseArea: a.expertiseArea,
    sampleCourseProposal: a.sampleCourseProposal,
    status: a.status as ApplicationStatusValue,
    adminNotes: a.adminNotes as unknown as AdminNote[] | null,
    reviewedBy: a.reviewedBy,
    reviewedAt: a.reviewedAt,
    rejectionReason: a.rejectionReason,
    changesRequested: a.changesRequested,
    createdAt: a.createdAt,
    updatedAt: a.updatedAt,
  }
}

export async function submitApplication(input: ApplicationInput): Promise<TeacherApplicationData> {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const existing = await prisma.teacherApplication.findUnique({
    where: { userId: session.user.id },
  })
  if (existing && existing.status !== "REJECTED") {
    throw new Error("You already have a pending application")
  }

  const application = existing
    ? await prisma.teacherApplication.update({
        where: { userId: session.user.id },
        data: {
          fullName: input.fullName,
          profilePhoto: input.profilePhoto ?? null,
          bio: input.bio ?? null,
          qualifications: input.qualifications ?? null,
          experience: input.experience ?? null,
          linkedIn: input.linkedIn ?? null,
          portfolioWebsite: input.portfolioWebsite ?? null,
          socialLinks: (input.socialLinks ?? null) as any,
          expertiseArea: input.expertiseArea ?? null,
          sampleCourseProposal: input.sampleCourseProposal ?? null,
          status: "SUBMITTED",
          reviewedBy: null,
          reviewedAt: null,
          rejectionReason: null,
          changesRequested: null,
        },
      })
    : await prisma.teacherApplication.create({
        data: {
          userId: session.user.id,
          fullName: input.fullName,
          profilePhoto: input.profilePhoto ?? null,
          bio: input.bio ?? null,
          qualifications: input.qualifications ?? null,
          experience: input.experience ?? null,
          linkedIn: input.linkedIn ?? null,
          portfolioWebsite: input.portfolioWebsite ?? null,
          socialLinks: (input.socialLinks ?? null) as any,
          expertiseArea: input.expertiseArea ?? null,
          sampleCourseProposal: input.sampleCourseProposal ?? null,
        },
      })

  return toData(application)
}

export async function getOwnApplication(): Promise<TeacherApplicationData | null> {
  const session = await auth()
  if (!session?.user?.id) return null
  const application = await prisma.teacherApplication.findUnique({
    where: { userId: session.user.id },
  })
  return application ? toData(application) : null
}

export async function updateApplication(input: Partial<ApplicationInput>): Promise<TeacherApplicationData> {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const existing = await prisma.teacherApplication.findUnique({
    where: { userId: session.user.id },
  })
  if (!existing) throw new Error("No application found")
  if (existing.status === "APPROVED") throw new Error("Application already approved")
  if (existing.status === "UNDER_REVIEW") throw new Error("Application is under review")

  const updateData: Record<string, unknown> = { ...input }
  if (updateData.socialLinks) updateData.socialLinks = updateData.socialLinks as any

  const updated = await prisma.teacherApplication.update({
    where: { userId: session.user.id },
    data: { ...updateData, status: existing.status === "REJECTED" ? "SUBMITTED" : existing.status } as any,
  })

  return toData(updated)
}

export async function listApplications(status?: string, search?: string) {
  const where: Record<string, unknown> = {}
  if (status && status !== "ALL") where.status = status
  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: "insensitive" } },
      { expertiseArea: { contains: search, mode: "insensitive" } },
    ]
  }

  const [applications, total] = await Promise.all([
    prisma.teacherApplication.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, image: true, role: true, createdAt: true } },
        reviewer: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.teacherApplication.count({ where }),
  ])

  return { applications, total }
}

export async function getApplicationDetail(id: string) {
  const application = await prisma.teacherApplication.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true, image: true, role: true, createdAt: true, _count: { select: { createdCourses: true, createdQuizzes: true, createdExams: true } } } },
      reviewer: { select: { id: true, name: true } },
    },
  })
  return application
}

export async function reviewApplication(
  id: string,
  action: "approve" | "reject" | "request_changes",
  reviewerId: string,
  reason?: string
): Promise<TeacherApplicationData> {
  const application = await prisma.teacherApplication.findUnique({ where: { id } })
  if (!application) throw new Error("Application not found")
  if (application.status === "APPROVED") throw new Error("Application already approved")
  if (application.status === "REJECTED") throw new Error("Application already rejected")

  let status: ApplicationStatusValue
  let rejectionReason: string | null = null
  let changesRequested: string | null = null

  switch (action) {
    case "approve":
      status = "APPROVED"
      await prisma.user.update({
        where: { id: application.userId },
        data: { role: "TEACHER" },
      })
      break
    case "reject":
      status = "REJECTED"
      rejectionReason = reason ?? null
      break
    case "request_changes":
      status = "CHANGES_REQUESTED"
      changesRequested = reason ?? null
      break
  }

  const updated = await prisma.teacherApplication.update({
    where: { id },
    data: { status, reviewedBy: reviewerId, reviewedAt: new Date(), rejectionReason, changesRequested },
  })

  return toData(updated)
}

export async function addAdminNote(id: string, content: string, author: string) {
  const application = await prisma.teacherApplication.findUnique({ where: { id } })
  if (!application) throw new Error("Application not found")

  const note: AdminNote = {
    id: crypto.randomUUID(),
    author,
    content,
    createdAt: new Date().toISOString(),
  }

  const existingNotes = ((application.adminNotes ?? []) as unknown as AdminNote[])
  const updated = await prisma.teacherApplication.update({
    where: { id },
    data: { adminNotes: [...existingNotes, note] as any },
  })

  return toData(updated)
}

export async function getTeacherMetrics() {
  const [totalApplications, byStatus, reviewedCount, approvalRate, recentReviews] = await Promise.all([
    prisma.teacherApplication.count(),
    Promise.all(
      ["SUBMITTED", "UNDER_REVIEW", "APPROVED", "REJECTED", "CHANGES_REQUESTED"].map((status) =>
        prisma.teacherApplication.count({ where: { status: status as any } })
      )
    ),
    prisma.teacherApplication.count({ where: { NOT: { status: "SUBMITTED" } } }),
    (async () => {
      const total = await prisma.teacherApplication.count({ where: { status: "APPROVED" } })
      const rejected = await prisma.teacherApplication.count({ where: { status: "REJECTED" } })
      return total + rejected > 0 ? Math.round((total / (total + rejected)) * 100) : 0
    })(),
    prisma.teacherApplication.findMany({
      where: { NOT: { status: "SUBMITTED" } },
      include: { reviewer: { select: { name: true } } },
      orderBy: { reviewedAt: "desc" },
      take: 20,
    }),
  ])

  return {
    totalApplications,
    byStatus: {
      SUBMITTED: byStatus[0],
      UNDER_REVIEW: byStatus[1],
      APPROVED: byStatus[2],
      REJECTED: byStatus[3],
      CHANGES_REQUESTED: byStatus[4],
    },
    reviewedCount,
    approvalRate,
    recentReviews: recentReviews.map((r) => ({
      id: r.id,
      fullName: r.fullName,
      status: r.status,
      reviewerName: r.reviewer?.name ?? null,
      reviewedAt: r.reviewedAt,
    })),
  }
}

export async function isTeacherApproved(userId: string): Promise<boolean> {
  const application = await prisma.teacherApplication.findUnique({
    where: { userId },
  })
  return application?.status === "APPROVED"
}

export async function requireApprovedTeacher() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")
  const approved = await isTeacherApproved(session.user.id)
  if (!approved) throw new Error("Teacher application not approved")
  return session.user
}
