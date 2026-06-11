import { teacherCourses } from "./teacher-data"

export type QuestionType = "mcq" | "true-false" | "multiple-select"

export interface QuizQuestion {
  id: string
  type: QuestionType
  question: string
  options: string[]
  correctAnswer: string | string[]
  explanation?: string
}

export interface TeacherQuiz {
  id: string
  courseId: string
  moduleId: string
  lessonId: string
  title: string
  description: string
  timeLimit: number
  passingScore: number
  attemptsAllowed: number
  randomQuestions: boolean
  questions: QuizQuestion[]
}

export interface QuizAttempt {
  id: string
  quizId: string
  score: number
  totalQuestions: number
  correctAnswers: number
  timeTaken: number
  completedAt: string
  passed: boolean
  answers: QuizAnswer[]
}

export interface QuizAnswer {
  questionId: string
  answer: string | string[]
  isCorrect: boolean
}

export const teacherQuizzes: TeacherQuiz[] = [
  {
    id: "qz1",
    courseId: "tc1",
    moduleId: "m1",
    lessonId: "l4",
    title: "HTML & CSS Fundamentals Quiz",
    description: "Test your understanding of HTML structure, CSS styling, and responsive design principles.",
    timeLimit: 15,
    passingScore: 70,
    attemptsAllowed: 3,
    randomQuestions: false,
    questions: [
      {
        id: "q1",
        type: "mcq",
        question: "What does HTML stand for?",
        options: [
          "Hyper Text Markup Language",
          "High Tech Modern Language",
          "Hyper Transfer Markup Language",
          "Home Tool Markup Language",
        ],
        correctAnswer: "Hyper Text Markup Language",
        explanation: "HTML stands for Hyper Text Markup Language. It is the standard markup language for creating web pages.",
      },
      {
        id: "q2",
        type: "true-false",
        question: "The <head> element contains the visible content of a web page.",
        options: ["True", "False"],
        correctAnswer: "False",
        explanation: "The <head> element contains meta-information about the document. The <body> element contains the visible content.",
      },
      {
        id: "q3",
        type: "mcq",
        question: "Which CSS property is used to change the text color of an element?",
        options: ["font-color", "text-color", "color", "foreground-color"],
        correctAnswer: "color",
        explanation: "The 'color' property in CSS is used to set the text color of an element.",
      },
      {
        id: "q4",
        type: "multiple-select",
        question: "Which of the following are valid HTML5 semantic elements?",
        options: ["<header>", "<section>", "<div>", "<article>", "<span>"],
        correctAnswer: ["<header>", "<section>", "<article>"],
        explanation: "<header>, <section>, and <article> are semantic HTML5 elements. <div> and <span> are generic container elements.",
      },
      {
        id: "q5",
        type: "true-false",
        question: "CSS Flexbox is designed for one-dimensional layouts, while CSS Grid is for two-dimensional layouts.",
        options: ["True", "False"],
        correctAnswer: "True",
        explanation: "Flexbox is best for one-dimensional layouts (rows OR columns), while Grid handles two-dimensional layouts (rows AND columns).",
      },
      {
        id: "q6",
        type: "mcq",
        question: "What is the correct HTML for creating a hyperlink?",
        options: [
          '<a href="url">link</a>',
          '<link url="url">link</link>',
          '<a url="url">link</a>',
          '<href url="url">link</href>',
        ],
        correctAnswer: '<a href="url">link</a>',
        explanation: 'The anchor tag <a> with the href attribute is used to create hyperlinks in HTML.',
      },
      {
        id: "q7",
        type: "multiple-select",
        question: "Which of the following are valid CSS units?",
        options: ["px", "em", "pt", "cm", "pc", "all of the above"],
        correctAnswer: ["all of the above"],
        explanation: "px (pixels), em (relative to font-size), pt (points), cm (centimeters), and pc (picas) are all valid CSS units.",
      },
      {
        id: "q8",
        type: "mcq",
        question: "What does the CSS property 'display: flex' do?",
        options: [
          "Makes an element invisible",
          "Creates a flexible container for layout",
          "Changes font to monospace",
          "Adds a border to the element",
        ],
        correctAnswer: "Creates a flexible container for layout",
        explanation: "display: flex creates a flex container, enabling a flex context for all its direct children.",
      },
      {
        id: "q9",
        type: "true-false",
        question: "The 'alt' attribute in an <img> tag is required for the image to display.",
        options: ["True", "False"],
        correctAnswer: "False",
        explanation: "The 'alt' attribute provides alternative text if the image cannot be displayed, but it is not required for the image to show.",
      },
      {
        id: "q10",
        type: "mcq",
        question: "Which HTML tag is used to define a table row?",
        options: ["<td>", "<th>", "<tr>", "<table>"],
        correctAnswer: "<tr>",
        explanation: "<tr> defines a table row. <td> defines a table cell, <th> defines a header cell, and <table> defines the table itself.",
      },
    ],
  },
  {
    id: "qz2",
    courseId: "tc1",
    moduleId: "m2",
    lessonId: "quiz-js",
    title: "JavaScript Basics Quiz",
    description: "Test your knowledge of JavaScript variables, functions, and DOM manipulation.",
    timeLimit: 20,
    passingScore: 60,
    attemptsAllowed: 2,
    randomQuestions: true,
    questions: [
      {
        id: "q11",
        type: "mcq",
        question: "Which keyword is used to declare a constant variable in JavaScript?",
        options: ["var", "let", "const", "static"],
        correctAnswer: "const",
        explanation: "The 'const' keyword declares a constant that cannot be reassigned.",
      },
      {
        id: "q12",
        type: "true-false",
        question: "JavaScript is a statically typed language.",
        options: ["True", "False"],
        correctAnswer: "False",
        explanation: "JavaScript is dynamically typed — variable types are determined at runtime.",
      },
      {
        id: "q13",
        type: "multiple-select",
        question: "Which of the following are JavaScript primitive data types?",
        options: ["string", "number", "boolean", "array", "object"],
        correctAnswer: ["string", "number", "boolean"],
        explanation: "string, number, and boolean are primitive types. array and object are reference types.",
      },
    ],
  },
]

export function getQuizByLessonId(lessonId: string): TeacherQuiz | undefined {
  return teacherQuizzes.find((q) => q.lessonId === lessonId)
}

export function getQuizById(quizId: string): TeacherQuiz | undefined {
  return teacherQuizzes.find((q) => q.id === quizId)
}

export function getCourseQuizzes(courseId: string): TeacherQuiz[] {
  return teacherQuizzes.filter((q) => q.courseId === courseId)
}

export function getModuleQuizzes(moduleId: string): TeacherQuiz[] {
  return teacherQuizzes.filter((q) => q.moduleId === moduleId)
}

export const mockAttempts: QuizAttempt[] = [
  {
    id: "att1",
    quizId: "qz1",
    score: 80,
    totalQuestions: 10,
    correctAnswers: 8,
    timeTaken: 420,
    completedAt: "2026-06-10T15:30:00Z",
    passed: true,
    answers: [
      { questionId: "q1", answer: "Hyper Text Markup Language", isCorrect: true },
      { questionId: "q2", answer: "False", isCorrect: true },
      { questionId: "q3", answer: "color", isCorrect: true },
      { questionId: "q4", answer: ["<header>", "<section>", "<article>"], isCorrect: true },
      { questionId: "q5", answer: "True", isCorrect: true },
      { questionId: "q6", answer: '<a href="url">link</a>', isCorrect: true },
      { questionId: "q7", answer: ["all of the above"], isCorrect: true },
      { questionId: "q8", answer: "Creates a flexible container for layout", isCorrect: true },
      { questionId: "q9", answer: "True", isCorrect: false },
      { questionId: "q10", answer: "<tr>", isCorrect: true },
    ],
  },
]

export function getQuizAttempts(quizId: string): QuizAttempt[] {
  return mockAttempts.filter((a) => a.quizId === quizId)
}

export function getBestAttempt(quizId: string): QuizAttempt | undefined {
  const attempts = getQuizAttempts(quizId)
  if (attempts.length === 0) return undefined
  return attempts.reduce((best, curr) =>
    curr.score > best.score ? curr : best
  )
}

export function calculateScore(
  questions: QuizQuestion[],
  answers: { questionId: string; answer: string | string[] }[]
): { score: number; correctAnswers: number; totalQuestions: number; results: { questionId: string; isCorrect: boolean }[] } {
  let correctAnswers = 0
  const results = questions.map((q) => {
    const userAnswer = answers.find((a) => a.questionId === q.id)
    if (!userAnswer) return { questionId: q.id, isCorrect: false }

    let isCorrect = false
    if (q.type === "multiple-select") {
      const correct = (q.correctAnswer as string[]).sort().join(",")
      const user = (userAnswer.answer as string[]).sort().join(",")
      isCorrect = correct === user
    } else {
      isCorrect = userAnswer.answer === q.correctAnswer
    }

    if (isCorrect) correctAnswers++
    return { questionId: q.id, isCorrect }
  })

  return {
    score: Math.round((correctAnswers / questions.length) * 100),
    correctAnswers,
    totalQuestions: questions.length,
    results,
  }
}
