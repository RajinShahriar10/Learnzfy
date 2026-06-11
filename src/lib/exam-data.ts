export type ExamQuestionType = "mcq" | "true-false" | "multiple-select"

export interface ExamQuestion {
  id: string
  type: ExamQuestionType
  question: string
  options: string[]
  correctAnswer: string | string[]
  marks: number
  explanation?: string
}

export interface QuestionPool {
  id: string
  title: string
  questionsToSelect: number
  questions: ExamQuestion[]
}

export interface TeacherExam {
  id: string
  courseId: string
  title: string
  description: string
  timeLimit: number
  passingScore: number
  attemptsAllowed: number
  randomizeQuestions: boolean
  placementModuleId?: string
  placementTitle?: string
  questionPools: QuestionPool[]
  totalMarks: number
  totalQuestions: number
}

export interface ExamAnswer {
  questionId: string
  answer: string | string[]
  isCorrect: boolean
  marksAwarded: number
  marksTotal: number
}

export interface ExamAttempt {
  id: string
  examId: string
  score: number
  totalMarks: number
  percentage: number
  correctAnswers: number
  totalQuestions: number
  timeTaken: number
  completedAt: string
  passed: boolean
  rank: number
  totalParticipants: number
  answers: ExamAnswer[]
}

export const teacherExams: TeacherExam[] = [
  {
    id: "ex1",
    courseId: "tc1",
    title: "Web Development Fundamentals Exam",
    description: "Comprehensive exam covering HTML, CSS, JavaScript, and React fundamentals. This exam draws from multiple question pools to test your overall understanding.",
    timeLimit: 60,
    passingScore: 60,
    attemptsAllowed: 2,
    randomizeQuestions: true,
    placementModuleId: "m3",
    placementTitle: "After React Framework module",
    totalMarks: 0,
    totalQuestions: 0,
    questionPools: [
      {
        id: "pool1",
        title: "HTML & CSS",
        questionsToSelect: 4,
        questions: [
          {
            id: "exq1", type: "mcq", marks: 5,
            question: "What is the purpose of the DOCTYPE declaration in HTML?",
            options: [
              "To define the document type and version of HTML",
              "To load external stylesheets",
              "To create a hyperlink",
              "To define metadata",
            ],
            correctAnswer: "To define the document type and version of HTML",
            explanation: "The DOCTYPE declaration informs the browser about the HTML version being used, ensuring proper rendering.",
          },
          {
            id: "exq2", type: "mcq", marks: 5,
            question: "Which CSS property is used to create space between the element's border and its content?",
            options: ["margin", "padding", "spacing", "gap"],
            correctAnswer: "padding",
            explanation: "Padding creates space between the content and the border. Margin creates space outside the border.",
          },
          {
            id: "exq3", type: "true-false", marks: 3,
            question: "The CSS 'box-sizing: border-box' property includes padding and border in the element's total width.",
            options: ["True", "False"],
            correctAnswer: "True",
            explanation: "border-box includes padding and border in the width calculation, making layout sizing more intuitive.",
          },
          {
            id: "exq4", type: "multiple-select", marks: 6,
            question: "Which of the following are valid CSS positioning values?",
            options: ["relative", "absolute", "fixed", "sticky", "floating", "inline"],
            correctAnswer: ["relative", "absolute", "fixed", "sticky"],
            explanation: "relative, absolute, fixed, and sticky are the four CSS positioning schemes. floating and inline are not positioning values.",
          },
          {
            id: "exq5", type: "mcq", marks: 5,
            question: "What HTML attribute is used to specify alternative text for an image?",
            options: ["src", "href", "alt", "title"],
            correctAnswer: "alt",
            explanation: "The 'alt' attribute provides alternative text for screen readers and when images fail to load.",
          },
          {
            id: "exq6", type: "mcq", marks: 5,
            question: "Which CSS selector has the highest specificity?",
            options: ["#header .nav li a", ".nav a", "a", "#header a.nav-link"],
            correctAnswer: "#header a.nav-link",
            explanation: "ID selectors have higher specificity than class selectors. '#header a.nav-link' has one ID and one class.",
          },
        ],
      },
      {
        id: "pool2",
        title: "JavaScript",
        questionsToSelect: 3,
        questions: [
          {
            id: "exq7", type: "mcq", marks: 5,
            question: "What will 'typeof null' return in JavaScript?",
            options: ["null", "undefined", "object", "boolean"],
            correctAnswer: "object",
            explanation: "This is a well-known JavaScript bug/legacy behavior. typeof null returns 'object' due to historical reasons.",
          },
          {
            id: "exq8", type: "mcq", marks: 5,
            question: "Which method creates a new array with the results of calling a function on every element?",
            options: ["forEach()", "map()", "filter()", "reduce()"],
            correctAnswer: "map()",
            explanation: "map() creates a new array by applying a function to each element. forEach() executes a function but doesn't return a new array.",
          },
          {
            id: "exq9", type: "true-false", marks: 3,
            question: "JavaScript has block-level scope for variables declared with 'var'.",
            options: ["True", "False"],
            correctAnswer: "False",
            explanation: "var has function-level scope, not block-level scope. let and const have block-level scope.",
          },
          {
            id: "exq10", type: "multiple-select", marks: 6,
            question: "Which of the following are JavaScript falsy values?",
            options: ["0", '"" (empty string)', "null", "undefined", "NaN", "false", "[] (empty array)", "{} (empty object)"],
            correctAnswer: ["0", '"" (empty string)', "null", "undefined", "NaN", "false"],
            explanation: "0, empty string, null, undefined, NaN, and false are the six falsy values in JavaScript.",
          },
          {
            id: "exq11", type: "mcq", marks: 5,
            question: "What does the spread operator (...) do?",
            options: [
              "Creates a new function",
              "Expands iterables into individual elements",
              "Combines two objects into one",
              "Creates a copy of a function",
            ],
            correctAnswer: "Expands iterables into individual elements",
            explanation: "The spread operator expands arrays, objects, and other iterables into their individual elements.",
          },
        ],
      },
      {
        id: "pool3",
        title: "React",
        questionsToSelect: 3,
        questions: [
          {
            id: "exq12", type: "mcq", marks: 5,
            question: "What is the correct way to update state in a React class component?",
            options: [
              "this.state.count = 5",
              "this.setState({ count: 5 })",
              "setState({ count: 5 })",
              "this.state({ count: 5 })",
            ],
            correctAnswer: "this.setState({ count: 5 })",
            explanation: "setState() is the correct method to update state. Direct mutation won't trigger re-renders.",
          },
          {
            id: "exq13", type: "true-false", marks: 3,
            question: "React components must always return a single root element.",
            options: ["True", "False"],
            correctAnswer: "True",
            explanation: "React components must return a single root element. Use React Fragments (<>) to wrap multiple elements without adding extra DOM nodes.",
          },
          {
            id: "exq14", type: "mcq", marks: 5,
            question: "Which hook is used to perform side effects in a functional component?",
            options: ["useState", "useEffect", "useContext", "useReducer"],
            correctAnswer: "useEffect",
            explanation: "useEffect handles side effects like data fetching, subscriptions, and DOM manipulations in functional components.",
          },
          {
            id: "exq15", type: "multiple-select", marks: 6,
            question: "Which of the following are valid React Hooks?",
            options: ["useState", "useEffect", "useNavigate", "useMemo", "useDispatch", "useCallback"],
            correctAnswer: ["useState", "useEffect", "useMemo", "useCallback"],
            explanation: "useNavigate and useDispatch are from React Router and Redux respectively, not built-in React Hooks.",
          },
        ],
      },
    ],
  },
  {
    id: "ex2",
    courseId: "tc2",
    title: "Advanced React Certification Exam",
    description: "Final certification exam for the Advanced React & Next.js course. Tests advanced patterns, hooks, and performance optimization.",
    timeLimit: 90,
    passingScore: 75,
    attemptsAllowed: 1,
    randomizeQuestions: true,
    placementModuleId: "m4",
    placementTitle: "End of course",
    totalMarks: 0,
    totalQuestions: 0,
    questionPools: [
      {
        id: "pool4",
        title: "Advanced Hooks",
        questionsToSelect: 3,
        questions: [
          {
            id: "exq16", type: "mcq", marks: 5,
            question: "What is the primary purpose of useMemo?",
            options: [
              "To memoize functions",
              "To memoize computed values",
              "To memoize components",
              "To memoize state updates",
            ],
            correctAnswer: "To memoize computed values",
            explanation: "useMemo memoizes the result of expensive computations. useCallback memoizes functions.",
          },
          {
            id: "exq17", type: "true-false", marks: 3,
            question: "Custom hooks must start with the prefix 'use'.",
            options: ["True", "False"],
            correctAnswer: "True",
            explanation: "React relies on the 'use' prefix to detect hook violations and enforce the rules of hooks.",
          },
        ],
      },
    ],
  },
]

export const examAttempts: Record<string, ExamAttempt[]> = {
  ex1: [
    {
      id: "eatt1",
      examId: "ex1",
      score: 42,
      totalMarks: 50,
      percentage: 84,
      correctAnswers: 8,
      totalQuestions: 10,
      timeTaken: 2340,
      completedAt: "2026-06-10T16:00:00Z",
      passed: true,
      rank: 2,
      totalParticipants: 45,
      answers: [
        { questionId: "exq1", answer: "To define the document type and version of HTML", isCorrect: true, marksAwarded: 5, marksTotal: 5 },
        { questionId: "exq2", answer: "padding", isCorrect: true, marksAwarded: 5, marksTotal: 5 },
        { questionId: "exq3", answer: "True", isCorrect: true, marksAwarded: 3, marksTotal: 3 },
        { questionId: "exq4", answer: ["relative", "absolute", "fixed", "sticky"], isCorrect: true, marksAwarded: 6, marksTotal: 6 },
        { questionId: "exq5", answer: "alt", isCorrect: true, marksAwarded: 5, marksTotal: 5 },
        { questionId: "exq7", answer: "object", isCorrect: true, marksAwarded: 5, marksTotal: 5 },
        { questionId: "exq8", answer: "forEach()", isCorrect: false, marksAwarded: 0, marksTotal: 5 },
        { questionId: "exq9", answer: "False", isCorrect: true, marksAwarded: 3, marksTotal: 3 },
        { questionId: "exq12", answer: "this.setState({ count: 5 })", isCorrect: true, marksAwarded: 5, marksTotal: 5 },
        { questionId: "exq13", answer: "False", isCorrect: false, marksAwarded: 0, marksTotal: 3 },
      ],
    },
  ],
  ex2: [],
}

export function getExamById(id: string): TeacherExam | undefined {
  const exam = teacherExams.find((e) => e.id === id)
  if (!exam) return undefined
  const totalMarks = exam.questionPools.reduce(
    (sum, pool) => sum + pool.questions.reduce((ms, q) => ms + q.marks, 0),
    0
  )
  const totalQuestions = exam.questionPools.reduce(
    (sum, pool) => sum + pool.questions.length,
    0
  )
  return { ...exam, totalMarks, totalQuestions }
}

export function getCourseExams(courseId: string): TeacherExam[] {
  return teacherExams.filter((e) => e.courseId === courseId)
}

export function getExamAttempts(examId: string): ExamAttempt[] {
  return examAttempts[examId] || []
}

export function getBestExamAttempt(examId: string): ExamAttempt | undefined {
  const attempts = getExamAttempts(examId)
  if (attempts.length === 0) return undefined
  return attempts.reduce((best, curr) =>
    curr.percentage > best.percentage ? curr : best
  )
}

export function getStudentRank(examId: string, score: number): { rank: number; total: number } {
  const attempts = getExamAttempts(examId)
  const allScores = attempts.map((a) => a.score).concat(score)
  const sorted = [...allScores].sort((a, b) => b - a)
  const rank = sorted.indexOf(score) + 1
  return { rank, total: sorted.length }
}

export function calculateExamScore(
  questions: ExamQuestion[],
  answers: { questionId: string; answer: string | string[] }[]
): {
  score: number
  totalMarks: number
  percentage: number
  correctAnswers: number
  totalQuestions: number
  results: ExamAnswer[]
} {
  let score = 0
  let totalMarks = 0
  let correctAnswers = 0

  const results = questions.map((q) => {
    totalMarks += q.marks
    const userAnswer = answers.find((a) => a.questionId === q.id)
    if (!userAnswer) {
      return {
        questionId: q.id,
        answer: q.type === "multiple-select" ? [] : "",
        isCorrect: false,
        marksAwarded: 0,
        marksTotal: q.marks,
      }
    }

    let isCorrect = false
    if (q.type === "multiple-select") {
      const correct = (q.correctAnswer as string[]).sort().join(",")
      const user = (userAnswer.answer as string[]).sort().join(",")
      isCorrect = correct === user
    } else {
      isCorrect = userAnswer.answer === q.correctAnswer
    }

    if (isCorrect) {
      score += q.marks
      correctAnswers++
    }

    return {
      questionId: q.id,
      answer: userAnswer.answer,
      isCorrect,
      marksAwarded: isCorrect ? q.marks : 0,
      marksTotal: q.marks,
    }
  })

  return {
    score,
    totalMarks,
    percentage: Math.round((score / totalMarks) * 100),
    correctAnswers,
    totalQuestions: questions.length,
    results,
  }
}

export function selectQuestionsFromPools(
  pools: QuestionPool[],
  randomize: boolean
): ExamQuestion[] {
  const selected: ExamQuestion[] = []
  for (const pool of pools) {
    const poolQuestions = randomize
      ? [...pool.questions].sort(() => Math.random() - 0.5)
      : pool.questions
    selected.push(...poolQuestions.slice(0, pool.questionsToSelect))
  }
  return randomize
    ? selected.sort(() => Math.random() - 0.5)
    : selected
}
