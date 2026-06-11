export interface MockCourse {
  id: string
  title: string
  slug: string
  description: string
  thumbnail: string
  teacher: { name: string; avatar: string }
  category: string
  difficulty: "beginner" | "intermediate" | "advanced"
  studentCount: number
  xpReward: number
  duration: string
  rating: number
  isFree: boolean
}

export interface MockTeacher {
  id: string
  name: string
  avatar: string
  bio: string
  role: string
  courseCount: number
  studentCount: number
  rating: number
  specialties: string[]
}

export interface MockTestimonial {
  id: string
  name: string
  role: string
  avatar: string
  content: string
  rating: number
}

export interface MockLeaderboardEntry {
  rank: number
  name: string
  avatar: string
  xp: number
  level: number
  badge: string
}

export const courses: MockCourse[] = [
  {
    id: "1",
    title: "Complete Web Development Bootcamp",
    slug: "web-dev-bootcamp",
    description: "Learn HTML, CSS, JavaScript, React, and Node.js from scratch.",
    thumbnail: "/courses/web-dev.svg",
    teacher: { name: "Sarah Johnson", avatar: "/avatars/teacher-1.svg" },
    category: "Web Development",
    difficulty: "beginner",
    studentCount: 2340,
    xpReward: 5000,
    duration: "12 weeks",
    rating: 4.8,
    isFree: true,
  },
  {
    id: "2",
    title: "Python for Data Science",
    slug: "python-data-science",
    description: "Master Python, pandas, NumPy, and machine learning fundamentals.",
    thumbnail: "/courses/python.svg",
    teacher: { name: "Michael Chen", avatar: "/avatars/teacher-2.svg" },
    category: "Data Science",
    difficulty: "intermediate",
    studentCount: 1890,
    xpReward: 4500,
    duration: "10 weeks",
    rating: 4.7,
    isFree: true,
  },
  {
    id: "3",
    title: "UI/UX Design Fundamentals",
    slug: "ui-ux-design",
    description: "Learn design thinking, wireframing, prototyping, and user research.",
    thumbnail: "/courses/design.svg",
    teacher: { name: "Emily Rodriguez", avatar: "/avatars/teacher-3.svg" },
    category: "Design",
    difficulty: "beginner",
    studentCount: 1560,
    xpReward: 3500,
    duration: "8 weeks",
    rating: 4.9,
    isFree: true,
  },
  {
    id: "4",
    title: "Advanced React & Next.js",
    slug: "advanced-react",
    description: "Deep dive into React patterns, Next.js, and full-stack development.",
    thumbnail: "/courses/react.svg",
    teacher: { name: "David Kim", avatar: "/avatars/teacher-4.svg" },
    category: "Web Development",
    difficulty: "advanced",
    studentCount: 1120,
    xpReward: 6000,
    duration: "14 weeks",
    rating: 4.6,
    isFree: true,
  },
  {
    id: "5",
    title: "Mobile App Development with Flutter",
    slug: "flutter-mobile",
    description: "Build beautiful cross-platform mobile apps with Flutter and Dart.",
    thumbnail: "/courses/mobile.svg",
    teacher: { name: "Sarah Johnson", avatar: "/avatars/teacher-1.svg" },
    category: "Mobile Development",
    difficulty: "intermediate",
    studentCount: 980,
    xpReward: 4000,
    duration: "10 weeks",
    rating: 4.5,
    isFree: true,
  },
  {
    id: "6",
    title: "Business Strategy & Management",
    slug: "business-strategy",
    description: "Learn strategic thinking, team management, and business planning.",
    thumbnail: "/courses/business.svg",
    teacher: { name: "James Wilson", avatar: "/avatars/teacher-5.svg" },
    category: "Business",
    difficulty: "beginner",
    studentCount: 720,
    xpReward: 3000,
    duration: "6 weeks",
    rating: 4.4,
    isFree: true,
  },
  {
    id: "7",
    title: "Machine Learning A-Z",
    slug: "machine-learning",
    description: "From linear regression to neural networks. Hands-on projects included.",
    thumbnail: "/courses/ml.svg",
    teacher: { name: "Michael Chen", avatar: "/avatars/teacher-2.svg" },
    category: "Data Science",
    difficulty: "advanced",
    studentCount: 1450,
    xpReward: 5500,
    duration: "16 weeks",
    rating: 4.8,
    isFree: true,
  },
  {
    id: "8",
    title: "DevOps & Cloud Computing",
    slug: "devops-cloud",
    description: "Master Docker, Kubernetes, AWS, and CI/CD pipelines.",
    thumbnail: "/courses/devops.svg",
    teacher: { name: "David Kim", avatar: "/avatars/teacher-4.svg" },
    category: "Web Development",
    difficulty: "advanced",
    studentCount: 640,
    xpReward: 5000,
    duration: "12 weeks",
    rating: 4.3,
    isFree: true,
  },
  {
    id: "9",
    title: "Graphic Design for Beginners",
    slug: "graphic-design",
    description: "Learn Photoshop, Illustrator, and visual design principles.",
    thumbnail: "/courses/graphic.svg",
    teacher: { name: "Emily Rodriguez", avatar: "/avatars/teacher-3.svg" },
    category: "Design",
    difficulty: "beginner",
    studentCount: 2100,
    xpReward: 2500,
    duration: "6 weeks",
    rating: 4.7,
    isFree: true,
  },
]

export const teachers: MockTeacher[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "/avatars/teacher-1.svg",
    bio: "Full-stack developer with 10+ years of experience. Passionate about making web development accessible to everyone.",
    role: "Senior Web Developer",
    courseCount: 4,
    studentCount: 4500,
    rating: 4.8,
    specialties: ["React", "Node.js", "TypeScript"],
  },
  {
    id: "2",
    name: "Michael Chen",
    avatar: "/avatars/teacher-2.svg",
    bio: "Data scientist and ML engineer. PhD in Computer Science. Loves breaking down complex topics into simple lessons.",
    role: "Data Science Lead",
    courseCount: 3,
    studentCount: 3800,
    rating: 4.7,
    specialties: ["Python", "Machine Learning", "Statistics"],
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    avatar: "/avatars/teacher-3.svg",
    bio: "Award-winning UX designer. Worked with Fortune 500 companies. Believes great design starts with empathy.",
    role: "UX Design Director",
    courseCount: 3,
    studentCount: 4200,
    rating: 4.9,
    specialties: ["UI Design", "UX Research", "Figma"],
  },
  {
    id: "4",
    name: "David Kim",
    avatar: "/avatars/teacher-4.svg",
    bio: "Cloud architect and full-stack developer. Built scalable systems serving millions of users.",
    role: "Cloud Solutions Architect",
    courseCount: 2,
    studentCount: 2100,
    rating: 4.6,
    specialties: ["Next.js", "AWS", "DevOps"],
  },
  {
    id: "5",
    name: "James Wilson",
    avatar: "/avatars/teacher-5.svg",
    bio: "MBA graduate and serial entrepreneur. Taught business strategy at top universities.",
    role: "Business Strategy Consultant",
    courseCount: 2,
    studentCount: 1500,
    rating: 4.5,
    specialties: ["Strategy", "Leadership", "Entrepreneurship"],
  },
]

export const testimonials: MockTestimonial[] = [
  {
    id: "1",
    name: "Alex Thompson",
    role: "Software Engineer",
    avatar: "/avatars/student-1.svg",
    content:
      "Learnzfy completely changed my career. The web development course was structured perfectly and the projects were real-world applicable.",
    rating: 5,
  },
  {
    id: "2",
    name: "Maria Garcia",
    role: "Data Analyst",
    avatar: "/avatars/student-2.svg",
    content:
      "The Python for Data Science course was incredible. Michael explains complex concepts in such an intuitive way. Landed my dream job!",
    rating: 5,
  },
  {
    id: "3",
    name: "Priya Patel",
    role: "UX Designer",
    avatar: "/avatars/student-3.svg",
    content:
      "Emily's design course gave me the confidence to switch careers. The portfolio projects were exactly what employers wanted to see.",
    rating: 5,
  },
  {
    id: "4",
    name: "James Chen",
    role: "Full-Stack Developer",
    avatar: "/avatars/student-4.svg",
    content:
      "The best part of Learnzfy is that everything is free. Quality education shouldn't have a price tag. Truly life-changing platform.",
    rating: 5,
  },
]

export const leaderboard: MockLeaderboardEntry[] = [
  { rank: 1, name: "Alex Thompson", avatar: "/avatars/student-1.svg", xp: 15420, level: 42, badge: "Legend" },
  { rank: 2, name: "Maria Garcia", avatar: "/avatars/student-2.svg", xp: 12850, level: 38, badge: "Master" },
  { rank: 3, name: "Priya Patel", avatar: "/avatars/student-3.svg", xp: 11200, level: 35, badge: "Expert" },
  { rank: 4, name: "James Chen", avatar: "/avatars/student-4.svg", xp: 9800, level: 31, badge: "Scholar" },
  { rank: 5, name: "Emma Wilson", avatar: "/avatars/student-5.svg", xp: 8750, level: 28, badge: "Dedicated" },
]

export const categories = [
  "All",
  "Web Development",
  "Data Science",
  "Mobile Development",
  "Design",
  "Business",
]

export const sponsorNames = [
  "TechCorp",
  "DevHub",
  "CodeForge",
  "DataVista",
  "CloudNest",
  "PixelPerfect",
]

export function getCourseById(id: string) {
  return courses.find((c) => c.id === id)
}

export function getTeacherById(id: string) {
  return teachers.find((t) => t.id === id)
}

export function getCoursesByCategory(category: string) {
  if (category === "All") return courses
  return courses.filter((c) => c.category === category)
}

export function searchCourses(query: string) {
  const q = query.toLowerCase()
  return courses.filter(
    (c) =>
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
  )
}

export function getCoursesByDifficulty(
  difficulty: "beginner" | "intermediate" | "advanced" | "all"
) {
  if (difficulty === "all") return courses
  return courses.filter((c) => c.difficulty === difficulty)
}
