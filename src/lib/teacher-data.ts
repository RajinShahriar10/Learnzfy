import { courses as mockCourses, categories } from "./mock-data"

export interface TeacherCourse {
  id: string
  title: string
  slug: string
  description: string
  shortDescription: string
  thumbnail: string
  category: string
  difficulty: "beginner" | "intermediate" | "advanced"
  duration: string
  isPublished: boolean
  studentCount: number
  completionRate: number
  averageScore: number
  rating: number
  createdAt: string
  updatedAt: string
  modules: TeacherModule[]
}

export interface TeacherModule {
  id: string
  title: string
  description: string
  order: number
  lessons: TeacherLesson[]
}

export interface TeacherLesson {
  id: string
  title: string
  description: string
  contentType: "video" | "article" | "quiz" | "code"
  duration: string
  isFree: boolean
  order: number
}

export interface TeacherStudent {
  id: string
  name: string
  email: string
  avatar: string
  enrolledAt: string
  progress: number
  lastActive: string
  completedModules: number
  totalModules: number
}

export const teacherInfo = {
  name: "John Teacher",
  email: "teacher@learnzfy.com",
  bio: "Passionate educator with 8+ years of teaching experience. Specializing in web development and data science.",
  avatar: "/avatars/teacher-default.svg",
  totalStudents: 3420,
  totalCourses: 4,
  avgRating: 4.7,
  totalRevenue: 0,
}

export const teacherCourses: TeacherCourse[] = [
  {
    id: "tc1",
    title: "Complete Web Development Bootcamp",
    slug: "web-dev-bootcamp",
    description: "Learn HTML, CSS, JavaScript, React, and Node.js from scratch. This comprehensive bootcamp takes you from absolute beginner to full-stack developer with real-world projects.",
    shortDescription: "From zero to full-stack developer",
    thumbnail: "/courses/web-dev.svg",
    category: "Web Development",
    difficulty: "beginner",
    duration: "12 weeks",
    isPublished: true,
    studentCount: 2340,
    completionRate: 68,
    averageScore: 82,
    rating: 4.8,
    createdAt: "2026-01-10T08:00:00Z",
    updatedAt: "2026-06-01T10:00:00Z",
    modules: [
      {
        id: "m1",
        title: "HTML & CSS Fundamentals",
        description: "Learn the building blocks of the web",
        order: 1,
        lessons: [
          { id: "l1", title: "Introduction to HTML", description: "Understanding HTML structure", contentType: "video", duration: "15 min", isFree: true, order: 1 },
          { id: "l2", title: "CSS Styling Basics", description: "Colors, fonts, layouts", contentType: "video", duration: "20 min", isFree: true, order: 2 },
          { id: "l3", title: "Responsive Design", description: "Making sites look great on all devices", contentType: "article", duration: "25 min", isFree: false, order: 3 },
          { id: "l4", title: "HTML & CSS Quiz", description: "Test your knowledge", contentType: "quiz", duration: "10 min", isFree: true, order: 4 },
        ],
      },
      {
        id: "m2",
        title: "JavaScript Essentials",
        description: "Master the language of the web",
        order: 2,
        lessons: [
          { id: "l5", title: "Variables & Data Types", description: "Understanding JS basics", contentType: "video", duration: "18 min", isFree: true, order: 1 },
          { id: "l6", title: "Functions & Scope", description: "Writing reusable code", contentType: "video", duration: "22 min", isFree: false, order: 2 },
          { id: "l7", title: "DOM Manipulation", description: "Interacting with web pages", contentType: "code", duration: "30 min", isFree: false, order: 3 },
        ],
      },
      {
        id: "m3",
        title: "React Framework",
        description: "Build modern user interfaces",
        order: 3,
        lessons: [
          { id: "l8", title: "React Components", description: "Building reusable UI pieces", contentType: "video", duration: "20 min", isFree: false, order: 1 },
          { id: "l9", title: "State & Props", description: "Managing data in React", contentType: "video", duration: "25 min", isFree: false, order: 2 },
        ],
      },
    ],
  },
  {
    id: "tc2",
    title: "Advanced React & Next.js",
    slug: "advanced-react",
    description: "Deep dive into React patterns, Next.js, and full-stack development with modern best practices.",
    shortDescription: "Master modern React frameworks",
    thumbnail: "/courses/react.svg",
    category: "Web Development",
    difficulty: "advanced",
    duration: "14 weeks",
    isPublished: true,
    studentCount: 1120,
    completionRate: 72,
    averageScore: 85,
    rating: 4.6,
    createdAt: "2026-02-15T09:00:00Z",
    updatedAt: "2026-05-28T14:00:00Z",
    modules: [
      {
        id: "m4",
        title: "Advanced React Patterns",
        description: "Learn production-ready React patterns",
        order: 1,
        lessons: [
          { id: "l10", title: "Custom Hooks", description: "Building reusable logic", contentType: "video", duration: "20 min", isFree: true, order: 1 },
          { id: "l11", title: "Context API Deep Dive", description: "State management without Redux", contentType: "video", duration: "25 min", isFree: false, order: 2 },
        ],
      },
    ],
  },
  {
    id: "tc3",
    title: "Mobile App Development with Flutter",
    slug: "flutter-mobile",
    description: "Build beautiful cross-platform mobile apps with Flutter and Dart.",
    shortDescription: "Cross-platform mobile development",
    thumbnail: "/courses/mobile.svg",
    category: "Mobile Development",
    difficulty: "intermediate",
    duration: "10 weeks",
    isPublished: false,
    studentCount: 980,
    completionRate: 65,
    averageScore: 78,
    rating: 4.5,
    createdAt: "2026-03-01T11:00:00Z",
    updatedAt: "2026-06-10T09:00:00Z",
    modules: [],
  },
  {
    id: "tc4",
    title: "DevOps & Cloud Computing",
    slug: "devops-cloud",
    description: "Master Docker, Kubernetes, AWS, and CI/CD pipelines for modern deployment workflows.",
    shortDescription: "Cloud infrastructure mastery",
    thumbnail: "/courses/devops.svg",
    category: "Web Development",
    difficulty: "advanced",
    duration: "12 weeks",
    isPublished: false,
    studentCount: 640,
    completionRate: 58,
    averageScore: 75,
    rating: 4.3,
    createdAt: "2026-04-10T13:00:00Z",
    updatedAt: "2026-06-08T16:00:00Z",
    modules: [],
  },
]

export const teacherStudents: TeacherStudent[] = [
  { id: "s1", name: "Alex Thompson", email: "alex@example.com", avatar: "/avatars/student-1.svg", enrolledAt: "2026-01-20", progress: 75, lastActive: "2026-06-10", completedModules: 9, totalModules: 12 },
  { id: "s2", name: "Maria Garcia", email: "maria@example.com", avatar: "/avatars/student-2.svg", enrolledAt: "2026-02-05", progress: 100, lastActive: "2026-06-09", completedModules: 10, totalModules: 10 },
  { id: "s3", name: "Priya Patel", email: "priya@example.com", avatar: "/avatars/student-3.svg", enrolledAt: "2026-01-25", progress: 30, lastActive: "2026-06-08", completedModules: 4, totalModules: 14 },
  { id: "s4", name: "James Chen", email: "james@example.com", avatar: "/avatars/student-4.svg", enrolledAt: "2026-03-10", progress: 45, lastActive: "2026-06-07", completedModules: 7, totalModules: 16 },
  { id: "s5", name: "Emma Wilson", email: "emma@example.com", avatar: "/avatars/student-5.svg", enrolledAt: "2026-02-20", progress: 100, lastActive: "2026-06-05", completedModules: 8, totalModules: 8 },
]

export function getTeacherCourseById(id: string) {
  return teacherCourses.find((c) => c.id === id)
}

export function getPublishedCourses() {
  return teacherCourses.filter((c) => c.isPublished)
}

export function getDraftCourses() {
  return teacherCourses.filter((c) => !c.isPublished)
}

export const teacherAnalytics = {
  totalStudents: teacherCourses.reduce((sum, c) => sum + c.studentCount, 0),
  totalCourses: teacherCourses.length,
  publishedCourses: teacherCourses.filter((c) => c.isPublished).length,
  avgCompletionRate: Math.round(teacherCourses.reduce((sum, c) => sum + c.completionRate, 0) / teacherCourses.length),
  avgScore: Math.round(teacherCourses.reduce((sum, c) => sum + c.averageScore, 0) / teacherCourses.length),
  avgRating: teacherCourses.reduce((sum, c) => sum + c.rating, 0) / teacherCourses.length,
  totalModules: teacherCourses.reduce((sum, c) => sum + c.modules.length, 0),
  totalLessons: teacherCourses.reduce((sum, c) => sum + c.modules.reduce((ms, m) => ms + m.lessons.length, 0), 0),
}
