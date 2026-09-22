"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { CalendarRange, Loader2, Target, Sparkles, Clock, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StudyPlanSummary {
  summary: string
  goal: string
  topic: string
  weeks: {
    week: number
    phase: string
    focus: string
    hoursPerWeek: number
    goals: string[]
    studyBlocks: { day: string; activity: string; minutesRecommended: number }[]
  }[]
  tips: string[]
}

interface SavedPlan {
  id: string
  title: string
  goal: string
  hoursPerWeek: number
  weeks: number
  createdAt: string
  content: StudyPlanSummary
}

const PHASE_STYLES: Record<string, string> = {
  Learn: "bg-sky-500/10 text-sky-500",
  Practice: "bg-emerald-500/10 text-emerald-500",
  Revise: "bg-violet-500/10 text-violet-500",
}

export default function StudyPlannerPage() {
  const { status: authStatus } = useSession()
  const [goal, setGoal] = useState("")
  const [topic, setTopic] = useState("")
  const [hoursPerWeek, setHoursPerWeek] = useState(5)
  const [weeks, setWeeks] = useState(4)
  const [language, setLanguage] = useState<"en" | "bn">("en")
  const [generating, setGenerating] = useState(false)
  const [current, setCurrent] = useState<StudyPlanSummary | null>(null)
  const [saved, setSaved] = useState<SavedPlan[]>([])
  const [loadingSaved, setLoadingSaved] = useState(true)
  const [showSaved, setShowSaved] = useState(false)

  useEffect(() => {
    if (authStatus === "unauthenticated") redirect("/login")
    if (authStatus !== "authenticated") return
    fetch("/api/ai/planner")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setSaved(res.data)
      })
      .finally(() => setLoadingSaved(false))
  }, [authStatus])

  const generate = async () => {
    if (!goal.trim() || generating) return
    setGenerating(true)
    try {
      const res = await fetch("/api/ai/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: goal.trim(), topic: topic.trim() || undefined, hoursPerWeek, weeks, language }),
      })
      const json = await res.json()
      if (json.success) {
        setCurrent(json.data.content)
        setSaved((prev) => [json.data.plan, ...prev])
      }
    } finally {
      setGenerating(false)
    }
  }

  const loadSaved = () => {
    setShowSaved((v) => !v)
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <CalendarRange className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">AI Study Planner</h1>
            <p className="text-sm text-muted-foreground">
              Reclaim the hours lost to coaching. Turn them into a smart plan.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadSaved} className="gap-2">
            <Save className="h-4 w-4" />
            Saved Plans ({loadingSaved ? "…" : saved.length})
          </Button>
        </div>
      </div>

      {showSaved && (
        <Card>
          <CardContent className="p-6 space-y-3">
            <h3 className="font-semibold">Saved plans</h3>
            {loadingSaved ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : saved.length === 0 ? (
              <p className="text-sm text-muted-foreground">No saved plans yet.</p>
            ) : (
              saved.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setCurrent(p.content)}
                  className="w-full rounded-lg border p-4 text-left transition-colors hover:bg-muted/50"
                >
                  <p className="font-medium">{p.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {p.weeks} weeks · {p.hoursPerWeek}h/week ·{" "}
                    {new Date(p.createdAt).toLocaleDateString()}
                  </p>
                </button>
              ))
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-3 lg:col-span-2">
              <div>
                <Label>What do you want to achieve?</Label>
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g., Pass HSC Physics with A+ or learn Python in 6 weeks"
                  className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <Label>Topic (optional)</Label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Physics, Mathematics, Web Development"
                  className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Hours / week</Label>
                  <input
                    type="number"
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                    min={1}
                    max={40}
                    className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <Label>Weeks</Label>
                  <input
                    type="number"
                    value={weeks}
                    onChange={(e) => setWeeks(Number(e.target.value))}
                    min={2}
                    max={12}
                    className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    checked={language === "en"}
                    onChange={() => setLanguage("en")}
                    className="rounded-full"
                  />
                  English
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    checked={language === "bn"}
                    onChange={() => setLanguage("bn")}
                    className="rounded-full"
                  />
                  বাংলা
                </label>
              </div>
              <Button className="w-full" onClick={generate} disabled={generating || !goal.trim()}>
                {generating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                {generating ? "Planning..." : "Generate My Plan"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {current && (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Target className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold">{current.goal}</h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{current.summary}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {current.weeks.map((w) => (
              <Card key={w.week}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                        W{w.week}
                      </span>
                      <p className="font-medium">{w.focus}</p>
                    </div>
                    <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-medium", PHASE_STYLES[w.phase] || "bg-muted text-muted-foreground")}>
                      {w.phase}
                    </span>
                  </div>
                  <ul className="mt-3 space-y-1.5">
                    {w.goals.map((g, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-primary">•</span>
                        {g}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {w.hoursPerWeek} hours / week
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardContent className="p-6">
              <h4 className="font-semibold mb-3">Tips to stay on track</h4>
              <ul className="space-y-2">
                {current.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Sparkles className="mt-0.5 h-4 w-4 text-primary shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}