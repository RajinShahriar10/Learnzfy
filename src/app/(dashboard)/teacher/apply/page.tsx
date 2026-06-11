"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Loader2, CheckCircle2, XCircle, Clock, AlertTriangle,
  ArrowLeft, ArrowRight, Send, Save, User, BookOpen,
  Briefcase, Link as LinkIcon, Globe, FileText, Eye
} from "lucide-react"
import Link from "next/link"

const STEPS = [
  { id: "personal", label: "Personal Info", icon: User },
  { id: "qualifications", label: "Qualifications", icon: BookOpen },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "links", label: "Links & Portfolio", icon: LinkIcon },
  { id: "proposal", label: "Course Proposal", icon: FileText },
  { id: "review", label: "Review & Submit", icon: Eye },
]

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  SUBMITTED: { label: "Submitted", color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400", icon: Clock },
  UNDER_REVIEW: { label: "Under Review", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400", icon: AlertTriangle },
  APPROVED: { label: "Approved", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400", icon: CheckCircle2 },
  REJECTED: { label: "Rejected", color: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400", icon: XCircle },
  CHANGES_REQUESTED: { label: "Changes Requested", color: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400", icon: AlertTriangle },
}

export default function TeacherApplyPage() {
  const { data: session, status: authStatus } = useSession()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [application, setApplication] = useState<any>(null)

  const [form, setForm] = useState({
    fullName: "",
    bio: "",
    qualifications: "",
    experience: "",
    linkedIn: "",
    portfolioWebsite: "",
    socialLinks: "",
    expertiseArea: "",
    sampleCourseProposal: "",
  })

  useEffect(() => {
    if (authStatus === "unauthenticated") redirect("/login")
    if (authStatus !== "authenticated") return

    fetch("/api/teacher/apply")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data) {
          setApplication(data.data)
          setForm({
            fullName: data.data.fullName ?? "",
            bio: data.data.bio ?? "",
            qualifications: data.data.qualifications ?? "",
            experience: data.data.experience ?? "",
            linkedIn: data.data.linkedIn ?? "",
            portfolioWebsite: data.data.portfolioWebsite ?? "",
            socialLinks: data.data.socialLinks ? JSON.stringify(data.data.socialLinks) : "",
            expertiseArea: data.data.expertiseArea ?? "",
            sampleCourseProposal: data.data.sampleCourseProposal ?? "",
          })
          if (data.data.status !== "REJECTED" && data.data.status !== "CHANGES_REQUESTED") {
            setStep(STEPS.length - 1)
          }
        }
      })
      .finally(() => setLoading(false))
  }, [authStatus])

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const canProceed = () => {
    if (step === 0) return form.fullName.trim().length > 0
    return true
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const socialLinksObj = form.socialLinks.trim()
        ? Object.fromEntries(form.socialLinks.split("\n").filter(Boolean).map((l) => {
            const [k, ...v] = l.split(":")
            return [k.trim(), v.join(":").trim()]
          }))
        : undefined

      const res = await fetch("/api/teacher/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          bio: form.bio || undefined,
          qualifications: form.qualifications || undefined,
          experience: form.experience || undefined,
          linkedIn: form.linkedIn || undefined,
          portfolioWebsite: form.portfolioWebsite || undefined,
          socialLinks: socialLinksObj,
          expertiseArea: form.expertiseArea || undefined,
          sampleCourseProposal: form.sampleCourseProposal || undefined,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setApplication(data.data)
        setStep(STEPS.length - 1)
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (application && application.status === "APPROVED") {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold">Application Approved!</h2>
            <p className="mt-2 text-muted-foreground">
              You are now an approved teacher. You can create and publish courses, quizzes, and exams.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/teacher/courses/new">
                <Button>Create Course</Button>
              </Link>
              <Link href="/teacher">
                <Button variant="outline">Go to Dashboard</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (application && application.status === "SUBMITTED" && step === STEPS.length - 1) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950">
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold">Application Submitted</h2>
            <p className="mt-2 text-muted-foreground">
              Your application is being reviewed. You will be notified when there is an update.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">
          {application ? "Update Application" : "Apply to Become a Teacher"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Share your expertise and start teaching on Learnzfy
        </p>
      </div>

      {application && application.status !== "SUBMITTED" && (
        <div className={`rounded-lg border p-4 ${STATUS_CONFIG[application.status]?.color ?? ""}`}>
          <div className="flex items-center gap-2">
            {application.status === "CHANGES_REQUESTED" && (
              <>
                <AlertTriangle className="h-5 w-5" />
                <div>
                  <p className="font-medium">Changes Requested</p>
                  <p className="text-sm">{application.changesRequested}</p>
                </div>
              </>
            )}
            {application.status === "REJECTED" && (
              <>
                <XCircle className="h-5 w-5" />
                <div>
                  <p className="font-medium">Application Rejected</p>
                  <p className="text-sm">{application.rejectionReason}</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {application?.adminNotes && application.adminNotes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Admin Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {application.adminNotes.map((note: any, i: number) => (
              <div key={note.id ?? i} className="rounded-lg border bg-muted/30 p-3 text-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{note.author}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-muted-foreground">{note.content}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="flex gap-2 overflow-x-auto pb-2">
        {STEPS.map((s, i) => {
          const Icon = s.icon
          return (
            <button
              key={s.id}
              onClick={() => i <= step && setStep(i)}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                i === step
                  ? "bg-primary text-primary-foreground"
                  : i < step
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          )
        })}
      </div>

      <Card>
        <CardContent className="p-6">
          {step === 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <div>
                <label className="text-sm font-medium">Full Name *</label>
                <Input
                  value={form.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  placeholder="Your full name"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Bio</label>
                <Textarea
                  value={form.bio}
                  onChange={(e) => updateField("bio", e.target.value)}
                  placeholder="Tell us about yourself..."
                  className="mt-1 min-h-[120px]"
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Qualifications</h3>
              <div>
                <label className="text-sm font-medium">Education & Certifications</label>
                <Textarea
                  value={form.qualifications}
                  onChange={(e) => updateField("qualifications", e.target.value)}
                  placeholder="Degrees, certifications, courses completed..."
                  className="mt-1 min-h-[150px]"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Area of Expertise</label>
                <Input
                  value={form.expertiseArea}
                  onChange={(e) => updateField("expertiseArea", e.target.value)}
                  placeholder="e.g., Web Development, Data Science, Mobile Apps"
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Experience</h3>
              <div>
                <label className="text-sm font-medium">Teaching & Professional Experience</label>
                <Textarea
                  value={form.experience}
                  onChange={(e) => updateField("experience", e.target.value)}
                  placeholder="Years of experience, previous teaching roles, industry experience..."
                  className="mt-1 min-h-[200px]"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Links & Portfolio</h3>
              <div>
                <label className="text-sm font-medium">LinkedIn Profile</label>
                <Input
                  value={form.linkedIn}
                  onChange={(e) => updateField("linkedIn", e.target.value)}
                  placeholder="https://linkedin.com/in/your-profile"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Portfolio Website</label>
                <Input
                  value={form.portfolioWebsite}
                  onChange={(e) => updateField("portfolioWebsite", e.target.value)}
                  placeholder="https://your-portfolio.com"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Social Links</label>
                <Textarea
                  value={form.socialLinks}
                  onChange={(e) => updateField("socialLinks", e.target.value)}
                  placeholder={'github: https://github.com/username\ntwitter: https://twitter.com/username'}
                  className="mt-1 min-h-[100px] font-mono text-xs"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  One per line as key: value
                </p>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Sample Course Proposal</h3>
              <div>
                <label className="text-sm font-medium">Course Idea</label>
                <Textarea
                  value={form.sampleCourseProposal}
                  onChange={(e) => updateField("sampleCourseProposal", e.target.value)}
                  placeholder={`Describe a course you'd like to teach on Learnzfy. Include:\n- Course title & target audience\n- Key learning objectives\n- Prerequisites\n- Module/topic outline\n- What makes your course unique`}
                  className="mt-1 min-h-[250px]"
                />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Review Your Application</h3>
              <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Full Name</p>
                    <p className="mt-0.5 text-sm">{form.fullName || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Expertise</p>
                    <p className="mt-0.5 text-sm">{form.expertiseArea || "—"}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Bio</p>
                    <p className="mt-0.5 text-sm whitespace-pre-wrap">{form.bio || "—"}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Qualifications</p>
                    <p className="mt-0.5 text-sm whitespace-pre-wrap">{form.qualifications || "—"}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Experience</p>
                    <p className="mt-0.5 text-sm whitespace-pre-wrap">{form.experience || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">LinkedIn</p>
                    <p className="mt-0.5 text-sm">{form.linkedIn || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Portfolio</p>
                    <p className="mt-0.5 text-sm">{form.portfolioWebsite || "—"}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Course Proposal</p>
                    <p className="mt-0.5 text-sm whitespace-pre-wrap">{form.sampleCourseProposal || "—"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between border-t pt-6">
            <Button
              variant="outline"
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" /> Previous
            </Button>
            {step < STEPS.length - 1 ? (
              <Button
                onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))}
                disabled={!canProceed()}
                className="gap-2"
              >
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={submitting} className="gap-2">
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {application ? "Update Application" : "Submit Application"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
