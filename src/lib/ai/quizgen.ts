import { prisma } from "@/lib/prisma"
import { aiCompleteJson } from "./client"
import { fallbackQuizQuestions, type GeneratedQuestion } from "./fallback"

export interface QuizGenerateInput {
  userId: string
  lessonId?: string
  courseId?: string
  title?: string
  description?: string
  count?: number
  types?: ("mcq" | "true-false" | "multiple-select")[]
  language?: "en" | "bn"
}

export interface QuizGenerateResult {
  questions: GeneratedQuestion[]
  mode: "ai" | "fallback"
  fromLesson: boolean
}

const TYPE_LABEL: Record<string, string> = {
  mcq: "multiple choice (4 options, one correct)",
  "true-false": "true or false (options exactly: \"True\", \"False\")",
  "multiple-select": "multiple select (5 options, 2-3 correct)",
}

interface RawQuestion {
  type?: unknown
  question?: unknown
  text?: unknown
  options?: unknown
  correctAnswer?: unknown
  explanation?: unknown
}

function normalizeQuestions(raw: unknown, count: number, types: string[]): GeneratedQuestion[] {
  if (!Array.isArray(raw)) return []

  const uniqueTypes = types.filter((t) => ["mcq", "true-false", "multiple-select"].includes(t)) as GeneratedQuestion["type"][]
  const byType = new Map<GeneratedQuestion["type"], GeneratedQuestion[]>()
  for (const q of raw) {
    if (!q || typeof q !== "object") continue
    const candidate = q as RawQuestion
    const type = ["mcq", "true-false", "multiple-select"].includes(String(candidate.type))
      ? (candidate.type as GeneratedQuestion["type"])
      : "mcq"
    const text = String(candidate.question || candidate.text || "").trim()
    const optionsRaw = Array.isArray(candidate.options)
      ? candidate.options.map((o) => String(o).trim()).filter(Boolean)
      : []
    const correctRaw = Array.isArray(candidate.correctAnswer)
      ? candidate.correctAnswer.map((o) => String(o).trim()).filter(Boolean)
      : null
    const correctStr = typeof candidate.correctAnswer === "string" ? candidate.correctAnswer.trim() : ""

    if (!text || optionsRaw.length < 2) continue

    let options = optionsRaw
    let correctAnswer: string | string[] | null = null

    if (type === "true-false") {
      options = ["True", "False"]
      correctAnswer = correctStr.toLowerCase() === "false" ? "False" : "True"
    } else if (type === "multiple-select") {
      if (!correctRaw || correctRaw.length < 2) continue
      const validCorrect = correctRaw.filter((o) => options.includes(o))
      if (validCorrect.length < 2) continue
      correctAnswer = validCorrect
    } else {
      correctAnswer = options.includes(correctStr) ? correctStr : options[0]
    }

    byType.set(type, [
      ...(byType.get(type) || []),
      {
        id: "",
        type,
        question: text,
        options: options as string[],
        correctAnswer: correctAnswer as string | string[],
        explanation: String(candidate.explanation || "").trim() || undefined,
      },
    ])
  }

  const assigned = new Map<string, number>()
  let cursor = 0
  const result: GeneratedQuestion[] = []

  for (let i = 0; i < count; i++) {
    const type = uniqueTypes[cursor % uniqueTypes.length]
    cursor++
    const bucket = byType.get(type) || []
    const slot = assigned.get(type) || 0
    const selected = bucket[slot]
    if (!selected) continue
    assigned.set(type, slot + 1)

    result.push({ ...selected, id: `aiq-${i + 1}` })
  }

  return result
}

export async function generateQuizQuestions(
  input: QuizGenerateInput
): Promise<QuizGenerateResult> {
  const count = Math.min(12, Math.max(3, input.count || 5))
  const types: ("mcq" | "true-false" | "multiple-select")[] =
    input.types && input.types.length > 0 ? input.types : ["mcq", "true-false"]
  let content = ""
  let lessonTitle = ""
  let courseTitle = ""
  let fromLesson = false

  if (input.lessonId) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: input.lessonId },
      select: { title: true, description: true, content: true, module: { select: { course: { select: { title: true } } } } },
    })
    if (lesson) {
      fromLesson = true
      lessonTitle = lesson.title
      content = `${lesson.content || ""}\n${lesson.description || ""}`
      courseTitle = lesson.module?.course?.title || ""
    }
  }

  if (input.courseId && !courseTitle) {
    const course = await prisma.course.findUnique({ where: { id: input.courseId } })
    courseTitle = course?.title || ""
  }

  const aiGenerate = async (): Promise<GeneratedQuestion[]> => {
    const typeInstructions = types
      .map((t) => `- ${TYPE_LABEL[t] || t}`)
      .join("\n")

    const system = [
      "You are Learnzfy's quiz generator for a free education platform.",
      "Create quiz questions from the lesson material provided.",
      `Return ONLY a JSON object: {"questions": [ { "type", "question", "options" (array of strings), "correctAnswer" (string or array of strings), "explanation" } ]}.`,
      "Rules:",
      `- Exactly ${count} questions, mixing these types:`,
      typeInstructions,
      "- correctAnswer must always reference one of the provided options.",
      "- Questions must be answerable from the content; no external trivia.",
      "- Explanations must be short (1-2 sentences).",
      input.language === "bn"
        ? "- Write all questions, options, and explanations in Bangla."
        : "- Write questions, options, and explanations in clear, simple English.",
    ].join("\n")

    const sourceParts = [
      input.title ? `Quiz title: ${input.title}` : "",
      input.description ? `Quiz description: ${input.description}` : "",
      courseTitle ? `Course: ${courseTitle}` : "",
      lessonTitle ? `Lesson: ${lessonTitle}` : "",
      content ? `Lesson content:\n${content.slice(0, 5000)}` : "",
    ]
      .filter(Boolean)
      .join("\n")

    const raw = await aiCompleteJson<{ questions: unknown[] }>(
      {
        system,
        messages: [
          {
            role: "user",
            content:
              sourceParts ||
              "No lesson content provided; generate questions about general study skills and self-learning.",
          },
        ],
        temperature: 0.6,
        maxTokens: 2500,
      },
      { questions: [] }
    )

    return normalizeQuestions(raw.questions, count, types)
  }

  const aiQuestions = await aiGenerate().catch(() => [] as GeneratedQuestion[])

  if (aiQuestions.length >= Math.min(3, count)) {
    return { questions: aiQuestions.slice(0, count), mode: "ai", fromLesson }
  }

  const fallback = fallbackQuizQuestions({
    title: input.title,
    description: input.description,
    content: content || lessonTitle || courseTitle,
    count,
    types,
    lessonTitle,
    courseTitle,
    language: input.language,
  })

  return { questions: fallback, mode: "fallback", fromLesson }
}