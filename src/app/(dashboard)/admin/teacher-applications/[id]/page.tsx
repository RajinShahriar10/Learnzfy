"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect, useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Loader2, CheckCircle2, XCircle, AlertTriangle, MessageSquare,
  ArrowLeft, Clock, User, Mail, Calendar, BookOpen, Briefcase,
  Link as LinkIcon, Globe, FileText, GraduationCap, Send
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const STATUS_CONFIG: Record<string, { label: string; className: string; icon: any }> = {
  SUBMITTED: { label: "Submitted", className: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 border-blue-200 dark:border-blue-800", icon: Clock },
  UNDER_REVIEW: { label: "Under Review", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800", icon: AlertTriangle },
  APPROVED: { label: "Approved", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800", icon: CheckCircle2 },
  REJECTED: { label: "Rejected", className: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 border-red-200 dark:border-red-800", icon: XCircle },
  CHANGES_REQUESTED: { label: "Changes", className: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400 border-orange-200 dark:border-orange-800", icon: AlertTriangle },
}

export default function ReviewApplicationPage() {
  const { data: session, status: authStatus } = useSession()
  const params = useParams()
  const router = useRouter()
  const [application, setApplication] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [noteContent, setNoteContent] = useState("")
  const [sendingNote, setSendingNote] = useState(false)
  const [actionReason, setActionReason] = useState("")
  const [showReasonInput, setShowReasonInput] = useState<string | null>(null)

  if (authStatus === "unauthenticated") redirect("/login")

  useEffect(() => {
    if (!params?.id) return
    fetch(`/api/admin/teacher-applications/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setApplication(data.data)
      })
      .finally(() => setLoading(false))
  }, [params?.id])

  const handleReview = async (action: string) => {
    setActionLoading(action)
    try {
      const res = await fetch(`/api/admin/teacher-applications/${params.id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reason: actionReason || undefined }),
      })
      const data = await res.json()
      if (data.success) {
        setApplication(data.data)
        setShowReasonInput(null)
        setActionReason("")
      }
    } finally {
      setActionLoading(null)
    }
  }

  const handleAddNote = async () => {
    if (!noteContent.trim()) return
    setSendingNote(true)
    try {
      const res = await fetch(`/api/admin/teacher-applications/${params.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: noteContent }),
      })
      const data = await res.json()
      if (data.success) {
        setApplication(data.data)
        setNoteContent("")
      }
    } finally {
      setSendingNote(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!application) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-lg font-semibold">Application not found</h2>
        <Link href="/admin/teacher-applications">
          <Button variant="outline" className="mt-4">Back to Applications</Button>
        </Link>
      </div>
    )
  }

  const StatusIcon = STATUS_CONFIG[application.status]?.icon ?? Clock

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/teacher-applications">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{application.fullName}</h1>
          <p className="text-sm text-muted-foreground">Review Teacher Application</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Full Name</p>
                  <p className="mt-0.5">{application.fullName}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</p>
                  <p className="mt-0.5">{application.user?.email}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Joined</p>
                  <p className="mt-0.5">{new Date(application.user?.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Current Role</p>
                  <p className="mt-0.5">{application.user?.role}</p>
                </div>
              </div>
              {application.bio && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Bio</p>
                  <p className="mt-0.5 text-sm whitespace-pre-wrap">{application.bio}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Qualifications & Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {application.expertiseArea && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Expertise</p>
                  <p className="mt-0.5">{application.expertiseArea}</p>
                </div>
              )}
              {application.qualifications && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Qualifications</p>
                  <p className="mt-0.5 text-sm whitespace-pre-wrap">{application.qualifications}</p>
                </div>
              )}
              {application.experience && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Experience</p>
                  <p className="mt-0.5 text-sm whitespace-pre-wrap">{application.experience}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                Links & Portfolio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {application.linkedIn && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="rounded bg-blue-100 p-1 dark:bg-blue-950">
                    <LinkIcon className="h-3 w-3 text-blue-600" />
                  </div>
                  <a href={application.linkedIn} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {application.linkedIn}
                  </a>
                </div>
              )}
              {application.portfolioWebsite && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="rounded bg-emerald-100 p-1 dark:bg-emerald-950">
                    <Globe className="h-3 w-3 text-emerald-600" />
                  </div>
                  <a href={application.portfolioWebsite} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {application.portfolioWebsite}
                  </a>
                </div>
              )}
              {application.socialLinks && typeof application.socialLinks === "object" && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Social Links</p>
                  {Object.entries(application.socialLinks as Record<string, string>).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2 text-sm">
                      <span className="text-xs font-medium text-muted-foreground w-16">{key}:</span>
                      <a href={value} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                        {value}
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Sample Course Proposal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{application.sampleCourseProposal ?? "No proposal submitted."}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Admin Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {application.adminNotes && application.adminNotes.length > 0 ? (
                <div className="space-y-3">
                  {application.adminNotes.map((note: any, i: number) => (
                    <div key={note.id ?? i} className="rounded-lg border bg-muted/30 p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{note.author}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(note.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{note.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No notes yet.</p>
              )}
              <div className="flex gap-2">
                <Textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Add a note..."
                  className="min-h-[60px] text-sm"
                />
                <Button
                  onClick={handleAddNote}
                  disabled={sendingNote || !noteContent.trim()}
                  className="shrink-0"
                >
                  {sendingNote ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <StatusIcon className={cn("h-5 w-5", STATUS_CONFIG[application.status]?.className?.split(" ").slice(2, 4).join(" "))} />
                <span className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-semibold",
                  STATUS_CONFIG[application.status]?.className
                )}>
                  {STATUS_CONFIG[application.status]?.label}
                </span>
              </div>
              {application.reviewedAt && (
                <p className="text-xs text-muted-foreground">
                  Reviewed by {application.reviewer?.name ?? "Unknown"} on {new Date(application.reviewedAt).toLocaleDateString()}
                </p>
              )}
              {application.rejectionReason && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:bg-red-950 dark:border-red-800">
                  <p className="text-xs font-medium text-red-700 dark:text-red-400">Rejection Reason</p>
                  <p className="text-sm text-red-600 dark:text-red-300">{application.rejectionReason}</p>
                </div>
              )}
              {application.changesRequested && (
                <div className="rounded-lg border border-orange-200 bg-orange-50 p-3 dark:bg-orange-950 dark:border-orange-800">
                  <p className="text-xs font-medium text-orange-700 dark:text-orange-400">Changes Requested</p>
                  <p className="text-sm text-orange-600 dark:text-orange-300">{application.changesRequested}</p>
                </div>
              )}

              <div className="space-y-2 pt-4 border-t">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</p>

                {application.status !== "APPROVED" && (
                  <Button
                    className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => handleReview("approve")}
                    disabled={actionLoading !== null}
                  >
                    {actionLoading === "approve" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                    Approve
                  </Button>
                )}

                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => setShowReasonInput(showReasonInput === "request_changes" ? null : "request_changes")}
                >
                  <AlertTriangle className="h-4 w-4" />
                  Request Changes
                </Button>

                <Button
                  variant="destructive"
                  className="w-full gap-2"
                  onClick={() => setShowReasonInput(showReasonInput === "reject" ? null : "reject")}
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </Button>

                {showReasonInput && (
                  <div className="space-y-2 pt-2">
                    <Textarea
                      value={actionReason}
                      onChange={(e) => setActionReason(e.target.value)}
                      placeholder={showReasonInput === "reject" ? "Reason for rejection..." : "Describe what changes are needed..."}
                      className="min-h-[80px] text-sm"
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => { setShowReasonInput(null); setActionReason("") }}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        variant={showReasonInput === "reject" ? "destructive" : "default"}
                        onClick={() => handleReview(showReasonInput)}
                        disabled={actionLoading !== null || !actionReason.trim()}
                      >
                        {actionLoading === showReasonInput ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : showReasonInput === "reject" ? (
                          "Reject"
                        ) : (
                          "Request Changes"
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <GraduationCap className="h-4 w-4" />
                Teacher Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Courses</span>
                <span className="font-medium">{application.user?._count?.createdCourses ?? 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Quizzes</span>
                <span className="font-medium">{application.user?._count?.createdQuizzes ?? 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Exams</span>
                <span className="font-medium">{application.user?._count?.createdExams ?? 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
