interface GlossaryEntry {
  keywords: string[]
  category: string
  answer: string
}

const GLOSSARY: GlossaryEntry[] = [
  {
    keywords: ["html", "markup", "tag", "element", "doctype", "hyperlink", "anchor"],
    category: "Web Development",
    answer:
      "HTML (Hyper Text Markup Language) is the standard markup language for building web pages. It uses tags like <div>, <a>, <p> and <img> to structure content. A great way to master it is to think of a page as a tree of elements — the <html> tag is the root, followed by <head> and <body>. Practice by writing a small page with headings, lists, and a hyperlink using the anchor tag <a href=\"...\">.",
  },
  {
    keywords: ["css", "styling", "flexbox", "grid", "selector", "responsive", "margin", "padding", "display"],
    category: "Web Development",
    answer:
      "CSS controls how elements look. Selectors target elements, and properties like margin (space outside an element), padding (space inside) and display control layout. Flexbox handles one-dimensional layouts (a row OR a column) while Grid handles two-dimensional layouts (rows AND columns). Tip: start mobile-first and use containers with display: flex or display: grid to make layouts responsive.",
  },
  {
    keywords: ["javascript", "js", "variable", "function", "const", "let", "var", "dom", "array", "object"],
    category: "Programming",
    answer:
      "JavaScript makes pages interactive. Key ideas: variables (const for values that won't change, let for values that will), functions (reusable blocks of logic), arrays and objects for data, and the DOM (the in-browser tree JavaScript manipulates). A good mental model: the document object model represents the page, and JavaScript reads/updates it via methods like getElementById and addEventListener.",
  },
  {
    keywords: ["python", "django", "flask", "indentation", "module", "tuple", "list", "dictionary"],
    category: "Programming",
    answer:
      "Python is a readable, dynamically typed language where indentation defines blocks. Core data structures: list (ordered, mutable), tuple (ordered, immutable) and dictionary (key-value pairs). Modules group reusable code. Tip: practice with list comprehensions and inline f-strings for cleaner code.",
  },
  {
    keywords: ["database", "sql", "query", "primary key", "foreign key", "index", "normalization", "join", "table"],
    category: "Computer Science",
    answer:
      "Databases store related data in tables of rows and columns. A primary key uniquely identifies each row; a foreign key links rows across tables. SQL is the language you use to query: SELECT ... FROM ... WHERE .... Joins combine data from related tables, and indexes speed up lookups. Keep related data in separate tables (normalization) to avoid duplication.",
  },
  {
    keywords: ["algorithm", "complexity", "sort", "big o", "search", "recursion", "time complexity", "binary search"],
    category: "Computer Science",
    answer:
      "An algorithm is a step-by-step procedure. Complexity (Big O) tells you how runtime grows with input size: O(1) is constant, O(n) reads every item once, O(n log n) is typical for good sorts. Recursion solves a problem by calling itself on smaller sub-problems. Tip: for interviews, master binary search (O(log n)) and the trade-off between space and time.",
  },
  {
    keywords: ["math", "algebra", "equation", "quadratic", "derivative", "calculus", "integral", "percent", "ratio"],
    category: "Mathematics",
    answer:
      "Algebra uses variables to represent unknown values and solves equations by isolating the variable. A quadratic looks like ax² + bx + c = 0 and can be solved by factoring, completing the square, or the formula x = (-b ± √(b² - 4ac)) / 2a. Calculus studies rates of change (derivatives) and accumulation (integrals). Practice step-by-step and always check your answer by substituting back.",
  },
  {
    keywords: ["physics", "force", "motion", "newton", "velocity", "acceleration", "energy", "momentum", "gravity"],
    category: "Physics",
    answer:
      "Physics describes how the physical world behaves. Newton's laws connect force and motion: an object stays at rest or in uniform motion unless a net force acts on it (F = ma). Momentum is mass × velocity and is conserved in collisions. Try to always write the knowns, the unknowns, and the relevant equation before solving numericals.",
  },
  {
    keywords: ["chemistry", "atom", "molecule", "reaction", "bond", "element", "periodic", "acid", "base", "ph"],
    category: "Chemistry",
    answer:
      "Atoms of different elements bond to form molecules. Ionic bonds transfer electrons; covalent bonds share them. Chemical reactions rearrange atoms while conserving mass. Acidity is measured by pH — below 7 is acidic, above 7 is basic. Tip: practice balancing equations by ensuring the same number of each atom on both sides.",
  },
  {
    keywords: ["biology", "cell", "photosynthesis", "respiration", "dna", "mitochondria", "nucleus", "enzyme"],
    category: "Biology",
    answer:
      "The cell is the basic unit of life. The nucleus holds DNA (the genetic blueprint), and mitochondria generate energy through cellular respiration. Photosynthesis (in plants) captures sunlight into glucose, the opposite of respiration. Enzymes speed up reactions by lowering activation energy. Connect each organelle to one job — that makes biology much easier to remember.",
  },
  {
    keywords: ["grammar", "tense", "sentence", "preposition", "conjunction", "pronoun", "subject", "verb", "article"],
    category: "English",
    answer:
      "A sentence needs a subject and a verb. Tenses place action in time — past, present, future — with perfect and continuous aspects (e.g., has been studying = present perfect continuous). Prepositions (in, on, at) show relationships of place and time. Articles: a/an for non-specific, the for specific. Proofread by reading sentences aloud and checking subject-verb agreement.",
  },
  {
    keywords: ["network", "ip", "tcp", "http", "dns", "topology", "router", "switch", "osi", "packet"],
    category: "Computer Science",
    answer:
      "A network connects devices so they can exchange data. Data travels in packets. IP addresses identify devices, DNS maps domain names to IPs, and TCP guarantees reliable delivery while HTTP sits on top for web traffic. Remembering the OSI model from bottom to top (Physical → Data Link → Network → Transport → Session → Presentation → Application) gives you a strong framework.",
  },
  {
    keywords: ["operating system", "process", "thread", "memory", "scheduling", "kernel", "file system", "cpu"],
    category: "Computer Science",
    answer:
      "An OS manages hardware and software. The kernel sits between applications and hardware. A process is a running program; threads are lighter units inside a process. The scheduler decides which process gets CPU time, and virtual memory lets processes use more memory than physically available. Understand the trade-off between context switching and responsiveness.",
  },
  {
    keywords: ["cyber", "security", "encryption", "phishing", "password", "hashing", "firewall", "malware", "privacy"],
    category: "Cyber Security",
    answer:
      "Security protects data through confidentiality, integrity and availability. Encryption scrambles data with a key, while hashing (like bcrypt) creates one-way fingerprints — the same input always gives the same hash, but you can't reverse it. Phishing tricks you into revealing credentials, so always verify senders. Never reuse passwords; use a password manager and enable 2FA.",
  },
  {
    keywords: ["ai", "machine learning", "neural network", "model", "training", "dataset", "llm", "prompt", "token"],
    category: "AI & Machine Learning",
    answer:
      "AI systems learn patterns from data. Machine learning trains a model on a dataset until it generalizes to new examples. Neural networks stack layers of neurons that adjust weights during training. Large Language Models (LLMs) predict the next token in a sequence, which is why well-worded prompts produce better answers. The cycle to remember: data → training → evaluation → improvement.",
  },
  {
    keywords: ["accounting", "balance sheet", "journal", "ledger", "income", "profit", "debit", "credit", "asset"],
    category: "Business",
    answer:
      "Accounting records every transaction as a debit and a matching credit (double-entry). Transactions first enter the journal, then are posted to the ledger. The balance sheet shows assets = liabilities + equity, while the income statement shows revenues minus expenses = profit. Always ask: which accounts are affected, and is each increased or decreased?",
  },
  {
    keywords: ["english literature", "romanticism", "poetry", "novel", "iambic", "metaphor", "rhyme", "prose"],
    category: "English Literature",
    answer:
      "Literature is studied through form and meaning. Poetry uses rhythm (like iambic pentameter), rhyme, and figurative language (metaphor, simile, personification) to compress meaning. A novel tells a story through character, plot and setting. When analyzing, always connect technique to effect: what does the writer use, and what does it make the reader feel or think?",
  },
  {
    keywords: ["bangla", "bengali", "goru", "kobita", "prose", "uponnas", "kabya", "bangla grammar"],
    category: "Bangla",
    answer:
      "বাংলা সাহিত্যকে প্রাচীন থেকে আধুনিক কাল পর্যন্ত তিনটি যুগে ভাগ করা হয়। কবিতায় ছন্দ, মিল এবং প্রতীক গুরুত্বপূর্ণ; প্রবন্ধ বা উপন্যাসে চরিত্র, গল্প এবং বিন্যাস। ব্যাকরণে শব্দের শ্রেণি (বিশেষ্য, বিশেষণ, ক্রিয়া) বুঝতে পারলে বাক্য গঠন সহজ হয়। বিশ্লেষণে সবসময় প্রশ্ন করো — লেখক কী বলতে চেয়েছেন এবং কীভাবে প্রকাশ করেছেন।",
  },
]

export interface TutorContext {
  question: string
  lessonTitle?: string
  courseTitle?: string
  content?: string
  recentMessages?: { role: string; content: string }[]
}

export function fallbackTutorReply(ctx: TutorContext): string {
  const q = ctx.question.toLowerCase()
  const match = GLOSSARY.find((entry) =>
    entry.keywords.some((keyword) => q.includes(keyword))
  )

  if (match) {
    return formatTutorReply(
      `Here's a clear explanation (${match.category}):\n\n${match.answer}\n\n` +
        `This connects directly to "${ctx.lessonTitle || "this lesson"}". Quick practice tip: try the quiz for this lesson, then ask me to explain one specific step you got stuck on.`
    )
  }

  const words = q.split(/\s+/).slice(0, 5).join(", ")
  return formatTutorReply(
    `Let's break "${ctx.lessonTitle || "this topic"}" down step by step.\n\n` +
      `1. Start with the big idea: what problem does this concept solve?\n` +
      `2. Note the key terms you're seeing: tell me one of those terms and I'll explain it.\n` +
      `3. Relate it to something you already know: that connection makes it stick.\n\n` +
      `I noticed keywords like "${words || "the topic"}". Let's go deeper — ask me "explain X" where X is any single term from this lesson and I'll walk you through it.`
  )
}

export interface FallbackQuizInput {
  title?: string
  description?: string
  content?: string
  count?: number
  types?: ("mcq" | "true-false" | "multiple-select")[]
  lessonTitle?: string
  courseTitle?: string
  language?: "en" | "bn"
}

export interface GeneratedQuestion {
  id: string
  type: "mcq" | "true-false" | "multiple-select"
  question: string
  options: string[]
  correctAnswer: string | string[]
  explanation?: string
}

function hashString(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

function pickFrom<T>(arr: T[], seed: number): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = (seed + i * 7919) % (i + 1)
    const tmp = copy[i]
    copy[i] = copy[j]
    copy[j] = tmp
  }
  return copy
}

export function fallbackQuizQuestions(input: FallbackQuizInput): GeneratedQuestion[] {
  const count = Math.min(12, Math.max(3, input.count || 5))
  const allowTypes = input.types && input.types.length > 0 ? input.types : ["mcq", "true-false"]
  const text = `${input.title} ${input.description} ${input.lessonTitle} ${input.courseTitle} ${input.content || ""}`.toLowerCase()
  const base = hashString(text || "learnzfy")

  const topics = GLOSSARY.filter((entry) =>
    entry.keywords.some((keyword) => text.includes(keyword))
  )
  const pool = topics.length > 0 ? topics : GLOSSARY
  const seed = base
  const chosen = pickFrom(pool, seed).slice(0, count)

  const questions: GeneratedQuestion[] = []
  let qn = 1
  let idx = 0
  const cycle = allowTypes

  for (let i = 0; i < count && i < chosen.length; i++) {
    const entry = chosen[i]
    const type = cycle[idx % cycle.length]
    idx++

    if (type === "true-false") {
      questions.push({
        id: `aiq-${qn++}`,
        type: "true-false",
        question: `True or False: ${entry.category} concepts are covered in this lesson.`,
        options: ["True", "False"],
        correctAnswer: "True",
        explanation: entry.answer,
      })
      continue
    }

    const answer = entry.answer.split(". ")[0].slice(0, 140)
    const distractors = pickFrom(
      GLOSSARY.filter((e) => e.category !== entry.category).map((e) => e.category),
      seed + i
    ).slice(0, 3)

    if (type === "multiple-select") {
      const correct = [entry.category, ...pickFrom(distractors, seed + i + 1).slice(0, 1)].slice(0, 2)
      const options = pickFrom([...correct, ...distractors], seed + i + 2)
      questions.push({
        id: `aiq-${qn++}`,
        type: "multiple-select",
        question: `Which of the following relate to "${entry.category}" (select all that apply)?`,
        options,
        correctAnswer: correct,
        explanation: entry.answer,
      })
      continue
    }

    questions.push({
      id: `aiq-${qn++}`,
      type: "mcq",
      question: `Which topic best matches "${entry.keywords[0]}"?`,
      options: [entry.category, ...distractors.slice(0, 3)],
      correctAnswer: entry.category,
      explanation: answer,
    })
  }

  return questions
}

export interface FallbackPlanInput {
  goal: string
  topic?: string
  hoursPerWeek?: number
  weeks?: number
  language?: "en" | "bn"
}

export function fallbackStudyPlan(input: FallbackPlanInput) {
  const weeks = Math.min(12, Math.max(2, input.weeks || 4))
  const hoursPerWeek = Math.min(40, Math.max(1, input.hoursPerWeek || 5))
  const topic = input.topic || input.goal || "your course material"
  const topicMatch = GLOSSARY.find((entry) =>
    entry.keywords.some((keyword) => topic.toLowerCase().includes(keyword))
  )
  const focusAreas = topicMatch
    ? [topicMatch.category, ...GLOSSARY.filter((e) => e.category !== topicMatch.category).slice(0, 2).map((e) => e.category)]
    : ["Core concepts", "Practice problems", "Revision and testing"]

  const planWeeks = Array.from({ length: weeks }, (_, i) => {
    const w = i + 1
    const phase = w <= Math.ceil(weeks / 3) ? "Learn" : w <= Math.ceil((weeks * 2) / 3) ? "Practice" : "Revise & test"
    const focus = focusAreas[(w - 1) % focusAreas.length]
    const blockMinutes = Math.round((hoursPerWeek * 60) / 4)
    return {
      week: w,
      phase,
      focus: `${phase}: ${focus}`,
      hoursPerWeek,
      goals: [
        `Complete the ${focus} modules in your course`,
        `Attempt at least one quiz or 10 practice problems on ${focus}`,
        `Write a 3-sentence summary of what you learned this week`,
      ],
      studyBlocks: [
        { day: "Day 1", activity: `Study ${focus}`, minutesRecommended: blockMinutes },
        { day: "Day 2", activity: `Practice problems on ${focus}`, minutesRecommended: blockMinutes },
        { day: "Day 3", activity: `Review lesson notes and discussions`, minutesRecommended: blockMinutes },
        { day: "Rest", activity: "Light revision, flashcards, or teach someone", minutesRecommended: 30 },
      ],
    }
  })

  return {
    summary: `A ${weeks}-week plan for "${input.goal}". You'll spend ${hoursPerWeek} hours per week, mixing learning, practice, and revision so the material actually sticks.`,
    goal: input.goal,
    topic,
    weeks: planWeeks,
    tips: [
      "Finish the 10-minute gap between lessons with flashcards — small wins keep streaks alive.",
      "Use the AI Tutor after every module to clarify anything you couldn't explain yourself.",
      "Repetition beats cramming: review each week's notes exactly once on the following Sunday.",
    ],
  }
}

function formatTutorReply(text: string): string {
  return text
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .join("\n")
}