import { teacherCourses } from "./teacher-data"

export interface LessonAttachment {
  name: string
  url: string
  size: string
  type: string
}

export interface LessonResource {
  title: string
  url: string
  type: "link" | "file" | "download"
}

export interface CodeExample {
  language: string
  code: string
  title: string
}

export interface LessonContent {
  id: string
  moduleId: string
  courseId: string
  title: string
  description: string
  contentType: "video" | "article" | "quiz" | "code"
  duration: string
  isFree: boolean
  order: number

  youtubeUrl?: string
  attachments?: LessonAttachment[]
  resources?: LessonResource[]
  codeExamples?: CodeExample[]
  articleContent?: string
}

export interface LessonProgress {
  completed: boolean
  watchProgress: number
  lastWatchedAt: string | null
  completedAt: string | null
  notes: LessonNote[]
}

export interface LessonNote {
  id: string
  content: string
  timestamp: number
  createdAt: string
}

export const lessonContents: Record<string, LessonContent> = {
  l1: {
    id: "l1",
    moduleId: "m1",
    courseId: "tc1",
    title: "Introduction to HTML",
    description: "Learn the fundamental building blocks of the web. In this lesson, we explore what HTML is, how it structures web pages, and write our first HTML document.",
    contentType: "video",
    duration: "15 min",
    isFree: true,
    order: 1,
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    attachments: [
      { name: "HTML-Cheatsheet.pdf", url: "#", size: "245 KB", type: "pdf" },
      { name: "Project-Starter.zip", url: "#", size: "1.2 MB", type: "zip" },
    ],
    resources: [
      { title: "MDN HTML Documentation", url: "https://developer.mozilla.org/en-US/docs/Web/HTML", type: "link" },
      { title: "HTML5 Specification", url: "https://html.spec.whatwg.org/", type: "link" },
      { title: "Starter Template", url: "#", type: "download" },
    ],
    codeExamples: [
      {
        language: "html",
        title: "Basic HTML Structure",
        code: "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>My First Page</title>\n</head>\n<body>\n  <h1>Hello, World!</h1>\n  <p>This is my first web page.</p>\n</body>\n</html>",
      },
      {
        language: "html",
        title: "Common HTML Elements",
        code: "<h1>Heading 1</h1>\n<h2>Heading 2</h2>\n<p>Paragraph text</p>\n<a href=\"https://example.com\">Link</a>\n<img src=\"image.jpg\" alt=\"Description\">\n<ul>\n  <li>List item</li>\n  <li>List item</li>\n</ul>",
      },
    ],
  },
  l2: {
    id: "l2",
    moduleId: "m1",
    courseId: "tc1",
    title: "CSS Styling Basics",
    description: "Make your web pages beautiful with CSS. Learn about colors, typography, layouts, and responsive design principles.",
    contentType: "video",
    duration: "20 min",
    isFree: true,
    order: 2,
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    attachments: [
      { name: "CSS-Reference-Guide.pdf", url: "#", size: "312 KB", type: "pdf" },
    ],
    resources: [
      { title: "CSS Tricks Guide", url: "https://css-tricks.com/guides/", type: "link" },
      { title: "Flexbox Froggy Game", url: "https://flexboxfroggy.com/", type: "link" },
    ],
    codeExamples: [
      {
        language: "css",
        title: "Basic CSS Styles",
        code: "body {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 20px;\n  background-color: #f5f5f5;\n}\n\nh1 {\n  color: #333;\n  text-align: center;\n}\n\n.container {\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 20px;\n  background: white;\n  border-radius: 8px;\n  box-shadow: 0 2px 4px rgba(0,0,0,0.1);\n}",
      },
    ],
  },
  l3: {
    id: "l3",
    moduleId: "m1",
    courseId: "tc1",
    title: "Responsive Design",
    description: "Learn how to create websites that look great on all devices. We cover media queries, flexible grids, and mobile-first design.",
    contentType: "article",
    duration: "25 min",
    isFree: false,
    order: 3,
    articleContent: "# Responsive Design Principles\n\nResponsive design ensures your website looks great on all devices.\n\n## Viewport Meta Tag\n\n```html\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n```\n\n## Media Queries\n\n```css\n@media (max-width: 768px) {\n  .container {\n    flex-direction: column;\n  }\n}\n```\n\n## Mobile-First Approach\nStart with mobile styles, then add complexity for larger screens.",
  },
  l4: {
    id: "l4",
    moduleId: "m1",
    courseId: "tc1",
    title: "HTML & CSS Quiz",
    description: "Test your understanding of HTML and CSS fundamentals with this interactive quiz.",
    contentType: "quiz",
    duration: "10 min",
    isFree: true,
    order: 4,
  },
  l5: {
    id: "l5",
    moduleId: "m2",
    courseId: "tc1",
    title: "Variables & Data Types",
    description: "Understand JavaScript variables, data types, and how to store and manipulate data in your programs.",
    contentType: "video",
    duration: "18 min",
    isFree: true,
    order: 1,
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    resources: [
      { title: "MDN JavaScript Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide", type: "link" },
      { title: "JavaScript Info", url: "https://javascript.info/", type: "link" },
    ],
    codeExamples: [
      {
        language: "javascript",
        title: "Variables in JavaScript",
        code: "// String\nlet name = \"Alice\";\nconst greeting = `Hello, ${name}!`;\n\n// Number\nlet age = 25;\nlet price = 19.99;\n\n// Boolean\nlet isActive = true;\n\n// Array\nlet fruits = [\"apple\", \"banana\", \"orange\"];\n\n// Object\nlet person = {\n  name: \"Bob\",\n  age: 30,\n  isStudent: false\n};",
      },
    ],
  },
  l6: {
    id: "l6",
    moduleId: "m2",
    courseId: "tc1",
    title: "Functions & Scope",
    description: "Master JavaScript functions, scope, closures, and how to write reusable, modular code.",
    contentType: "video",
    duration: "22 min",
    isFree: false,
    order: 2,
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    attachments: [
      { name: "Functions-Cheatsheet.pdf", url: "#", size: "180 KB", type: "pdf" },
    ],
    resources: [
      { title: "Function Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions", type: "link" },
    ],
    codeExamples: [
      {
        language: "javascript",
        title: "Function Declarations",
        code: "// Function Declaration\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\n// Arrow Function\nconst add = (a, b) => a + b;\n\n// Function Expression\nconst multiply = function(a, b) {\n  return a * b;\n};\n\n// Scope Example\nlet global = \"I'm global\";\n\nfunction test() {\n  let local = \"I'm local\";\n  console.log(global); // accessible\n  console.log(local);  // accessible\n}\n\nconsole.log(local); // Error!",
      },
    ],
  },
  l7: {
    id: "l7",
    moduleId: "m2",
    courseId: "tc1",
    title: "DOM Manipulation",
    description: "Learn how to interact with web pages using JavaScript. Select elements, handle events, and dynamically update content.",
    contentType: "code",
    duration: "30 min",
    isFree: false,
    order: 3,
    codeExamples: [
      {
        language: "javascript",
        title: "DOM Manipulation Examples",
        code: "// Select elements\nconst heading = document.querySelector('h1');\nconst buttons = document.querySelectorAll('.btn');\n\n// Change content\nheading.textContent = 'New Title';\nheading.innerHTML = '<span>Styled</span>';\n\n// Add event listener\nbutton.addEventListener('click', () => {\n  alert('Button clicked!');\n});\n\n// Create elements\nconst div = document.createElement('div');\ndiv.className = 'card';\ndiv.textContent = 'New card';\ndocument.body.appendChild(div);\n\n// Toggle classes\nheading.classList.toggle('active');",
      },
    ],
  },
  l8: {
    id: "l8",
    moduleId: "m3",
    courseId: "tc1",
    title: "React Components",
    description: "Build reusable UI components with React. Learn about JSX, props, component composition, and lifecycle.",
    contentType: "video",
    duration: "20 min",
    isFree: false,
    order: 1,
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    attachments: [
      { name: "React-Component-Patterns.pdf", url: "#", size: "420 KB", type: "pdf" },
    ],
    resources: [
      { title: "React Official Docs", url: "https://react.dev/", type: "link" },
      { title: "React Component Patterns", url: "#", type: "download" },
    ],
    codeExamples: [
      {
        language: "jsx",
        title: "React Component Example",
        code: "import React from 'react';\n\n// Functional Component\nfunction Welcome({ name, age }) {\n  return (\n    <div className=\"welcome-card\">\n      <h2>Welcome, {name}!</h2>\n      {age >= 18 && <p>You are an adult</p>}\n    </div>\n  );\n}\n\n// Usage\nfunction App() {\n  return (\n    <div>\n      <Welcome name=\"Alice\" age={25} />\n      <Welcome name=\"Bob\" age={17} />\n    </div>\n  );\n}\n\nexport default App;",
      },
    ],
  },
  l9: {
    id: "l9",
    moduleId: "m3",
    courseId: "tc1",
    title: "State & Props",
    description: "Understand state management and props in React. Learn useState, useEffect, and data flow patterns.",
    contentType: "video",
    duration: "25 min",
    isFree: false,
    order: 2,
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    resources: [
      { title: "useState Hook Docs", url: "https://react.dev/reference/react/useState", type: "link" },
      { title: "useEffect Hook Docs", url: "https://react.dev/reference/react/useEffect", type: "link" },
    ],
    codeExamples: [
      {
        language: "jsx",
        title: "State Management Example",
        code: "import React, { useState, useEffect } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  const [isEven, setIsEven] = useState(true);\n\n  useEffect(() => {\n    setIsEven(count % 2 === 0);\n  }, [count]);\n\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <p>{isEven ? 'Even' : 'Odd'}</p>\n      <button onClick={() => setCount(c => c + 1)}>+</button>\n      <button onClick={() => setCount(c => c - 1)}>-</button>\n    </div>\n  );\n}",
      },
    ],
  },
  l10: {
    id: "l10",
    moduleId: "m4",
    courseId: "tc2",
    title: "Custom Hooks",
    description: "Learn how to create custom React hooks to extract and reuse stateful logic across components.",
    contentType: "video",
    duration: "20 min",
    isFree: true,
    order: 1,
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    attachments: [
      { name: "Custom-Hooks-Patterns.pdf", url: "#", size: "280 KB", type: "pdf" },
    ],
    resources: [
      { title: "Reusing Logic with Custom Hooks", url: "https://react.dev/learn/reusing-logic-with-custom-hooks", type: "link" },
    ],
    codeExamples: [
      {
        language: "javascript",
        title: "Custom Hook Example",
        code: "import { useState, useEffect } from 'react';\n\nfunction useWindowSize() {\n  const [size, setSize] = useState({\n    width: window.innerWidth,\n    height: window.innerHeight,\n  });\n\n  useEffect(() => {\n    const handleResize = () => {\n      setSize({\n        width: window.innerWidth,\n        height: window.innerHeight,\n      });\n    };\n\n    window.addEventListener('resize', handleResize);\n    return () => window.removeEventListener('resize', handleResize);\n  }, []);\n\n  return size;\n}\n\n// Usage in component\nfunction MyComponent() {\n  const { width, height } = useWindowSize();\n  return <p>Window: {width}x{height}</p>;\n}",
      },
    ],
  },
  l11: {
    id: "l11",
    moduleId: "m4",
    courseId: "tc2",
    title: "Context API Deep Dive",
    description: "Master React Context API for state management without external libraries. Learn providers, consumers, and useContext.",
    contentType: "video",
    duration: "25 min",
    isFree: false,
    order: 2,
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    resources: [
      { title: "useContext Hook Docs", url: "https://react.dev/reference/react/useContext", type: "link" },
      { title: "Context API Guide", url: "#", type: "download" },
    ],
    codeExamples: [
      {
        language: "jsx",
        title: "Context API Example",
        code: "import React, { createContext, useContext, useState } from 'react';\n\n// Create context\nconst ThemeContext = createContext();\n\n// Provider component\nfunction ThemeProvider({ children }) {\n  const [theme, setTheme] = useState('light');\n\n  const toggleTheme = () => {\n    setTheme(t => t === 'light' ? 'dark' : 'light');\n  };\n\n  return (\n    <ThemeContext.Provider value={{ theme, toggleTheme }}>\n      {children}\n    </ThemeContext.Provider>\n  );\n}\n\n// Consumer component\nfunction ThemedButton() {\n  const { theme, toggleTheme } = useContext(ThemeContext);\n\n  return (\n    <button\n      onClick={toggleTheme}\n      style={{\n        background: theme === 'light' ? '#fff' : '#333',\n        color: theme === 'light' ? '#333' : '#fff',\n      }}\n    >\n      Current: {theme}\n    </button>\n  );\n}\n\n// App\nfunction App() {\n  return (\n    <ThemeProvider>\n      <ThemedButton />\n    </ThemeProvider>\n  );\n}",
      },
    ],
  },
}

export function getLessonContent(lessonId: string): LessonContent | undefined {
  return lessonContents[lessonId]
}

export function getCourseLessons(courseId: string): LessonContent[] {
  return Object.values(lessonContents).filter((l) => l.courseId === courseId)
}

export function getModuleLessons(moduleId: string): LessonContent[] {
  return Object.values(lessonContents)
    .filter((l) => l.moduleId === moduleId)
    .sort((a, b) => a.order - b.order)
}

export const defaultProgress: Record<string, LessonProgress> = {
  l1: { completed: true, watchProgress: 100, lastWatchedAt: "2026-06-10T14:30:00Z", completedAt: "2026-06-10T14:45:00Z", notes: [] },
  l2: { completed: false, watchProgress: 65, lastWatchedAt: "2026-06-10T15:00:00Z", completedAt: null, notes: [{ id: "n1", content: "Remember to check flexbox properties later", timestamp: 300, createdAt: "2026-06-10T15:10:00Z" }] },
  l3: { completed: false, watchProgress: 0, lastWatchedAt: null, completedAt: null, notes: [] },
  l4: { completed: false, watchProgress: 0, lastWatchedAt: null, completedAt: null, notes: [] },
  l5: { completed: false, watchProgress: 30, lastWatchedAt: "2026-06-09T10:00:00Z", completedAt: null, notes: [] },
  l6: { completed: false, watchProgress: 0, lastWatchedAt: null, completedAt: null, notes: [] },
  l7: { completed: false, watchProgress: 0, lastWatchedAt: null, completedAt: null, notes: [] },
  l8: { completed: false, watchProgress: 0, lastWatchedAt: null, completedAt: null, notes: [] },
  l9: { completed: false, watchProgress: 0, lastWatchedAt: null, completedAt: null, notes: [] },
  l10: { completed: true, watchProgress: 100, lastWatchedAt: "2026-06-08T09:30:00Z", completedAt: "2026-06-08T09:50:00Z", notes: [{ id: "n2", content: "Custom hooks pattern is powerful for API calls", timestamp: 600, createdAt: "2026-06-08T09:40:00Z" }] },
  l11: { completed: false, watchProgress: 0, lastWatchedAt: null, completedAt: null, notes: [] },
}

export function getLessonProgress(lessonId: string): LessonProgress {
  return defaultProgress[lessonId] || { completed: false, watchProgress: 0, lastWatchedAt: null, completedAt: null, notes: [] }
}

export function getCourseProgress(courseId: string): number {
  const lessons = getCourseLessons(courseId)
  if (lessons.length === 0) return 0
  const completed = lessons.filter((l) => defaultProgress[l.id]?.completed).length
  return Math.round((completed / lessons.length) * 100)
}
