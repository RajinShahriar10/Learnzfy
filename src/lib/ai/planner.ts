import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { aiCompleteJson } from "./client"
import { fallbackStudyPlan } from "./fallback"

export interface StudyPlanInput {
  goal: string
  topic?: string
  hoursPerWeek?: number
  weeks?: number
  language?: "en" | "bn"
}

export interface StudyPlanSummary {
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

function clampNumber(value: number | undefined, min: number, max: number, fallback: number): number {
  if (value === undefined || Number.isNaN(value)) return fallback
  return Math.min(max, Math.max(min, Math.round(value)))
}

function normalizePlan(raw: unknown, input: StudyPlanInput): StudyPlanSummary | null {
  if (!raw || typeof raw !== "object") return null
  const data = raw as Record<string, unknown>
  const weeks = Array.isArray(data.weeks) ? data.weeks.slice(0, clampNumber(input.weeks, 2, 12, 4)) : []
  if (weeks.length === 0) return null

  const normalizedWeeks = weeks.map((w, index) => {
    const week = (w as Record<string, unknown>)
    const blocksRaw = Array.isArray(week.studyBlocks) ? week.studyBlocks : []
    const blocks = blocksRaw.slice(0, 4).map((b) => {
      const blk = b as Record<string, unknown>
      return {
        day: String(blk.day || `Day ${index + 1}`),
        activity: String(blk.activity || "Study session"),
        minutesRecommended: clampNumber(Number(blk.minutesRecommended), 10, 600, 60),
      }
    })
    return {
      week: index + 1,
      phase: String(week.phase || "Learn"),
      focus: String(week.focus || "Core concepts"),
      hoursPerWeek: clampNumber(Number(week.hoursPerWeek), 1, 40, input.hoursPerWeek || 5),
      goals: Array.isArray(week.goals)
        ? week.goals.map((g) => String(g)).filter(Boolean).slice(0, 3)
        : ["Master this week's lessons", "Complete one practice quiz"],
      studyBlocks: blocks.length > 0
        ? blocks
        : [{ day: "Every day", activity: String(week.focus || "Study"), minutesRecommended: 60 }],
    }
  })

  return {
    summary: String(data.summary || `A personalized plan to reach "${input.goal}".`),
    goal: input.goal,
    topic: input.topic || String(data.topic || input.goal),
    weeks: normalizedWeeks,
    tips: Array.isArray(data.tips)
      ? data.tips.map((t) => String(t)).filter(Boolean).slice(0, 5)
      : ["Revise each week on the final day.", "Use the AI Tutor to clear doubts.", "Practice beats re-reading."],
  }
}

export async function generateStudyPlan(userId: string, input: StudyPlanInput) {
  const weeks = clampNumber(input.weeks, 2, 12, 4)
  const hoursPerWeek = clampNumber(input.hoursPerWeek, 1, 40, 5)

  const fallback = () => fallbackStudyPlan({ ...input, hoursPerWeek, weeks }) as unknown as StudyPlanSummary

  const aiGenerate = async (): Promise<StudyPlanSummary | null> => {
    const system = [
      "You are Learnzfy's study planner — a free education platform helping students reclaim their time.",
      `Build a ${weeks}-week, ${hoursPerWeek}-hours-per-week roadmap for the student's goal.`,
      "Return ONLY a JSON object with shape:",
      '{"summary":string, "topic":string, "weeks":[{"phase":string,"focus":string,"hoursPerWeek":number,"goals":[string],"studyBlocks":[{"day":string,"activity":string,"minutesRecommended":number}]}], "tips":[string]}',
      "Rules:",
      "- weeks array must have exactly one object per week; each with 3-4 studyBlocks summing near the weekly hours.",
      "- Alternate learn / practice / revise phases so the plan is sustainable.",
      "- If the goal mentions exams (SSC, HSC, admission), tailor phases to revision and mock tests in the final third.",
      input.language === "bn" ? "- Write all text in Bangla." : "- Write all text in clear, simple English.",
    ].join("\n")

    const raw = await aiCompleteJson<StudyPlanSummary | null>(
      {
        system,
        messages: [
          {
            role: "user",
            content: `My goal: ${input.goal}\n${input.topic ? `Topic: ${input.topic}` : ""}\nHours per week: ${hoursPerWeek}\nWeeks: ${weeks}`,
          },
        ],
        temperature: 0.6,
        maxTokens: 2500,
      },
      null
    )

    return normalizePlan(raw, { ...input, hoursPerWeek, weeks })
  }

  const aiPlan = await aiGenerate()
  const content = (aiPlan && aiPlan.weeks.length > 0 ? aiPlan : fallback()) as StudyPlanSummary

  const plan = await prisma.studyPlan.create({
    data: {
      userId,
      title: input.goal.slice(0, 120),
      goal: input.goal,
      topic: input.topic || null,
      hoursPerWeek,
      weeks,
      content: content as unknown as Prisma.InputJsonValue,
    },
  })

  return { plan, content }
}

export async function listStudyPlans(userId: string) {
  return prisma.studyPlan.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 20,
  })
}