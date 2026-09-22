import type { SiteContent } from "./types"

export const DEFAULT_SITE_CONTENT: SiteContent = {
  branding: {
    siteName: "Learnzfy",
    tagline: "Education is your right, not a product for sale.",
    metaTitle: "Learnzfy",
    metaDescription:
      "Learnzfy is a modern e-learning platform connecting students with expert educators.",
    metaKeywords: "e-learning, online courses, education, programming, data science, web development",
  },
  nav: {
    links: [
      { label: "Courses", href: "/courses" },
      { label: "Teachers", href: "/teachers" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "API Docs", href: "/api-docs" },
    ],
  },
  hero: {
    badge: "Free education for everyone. No paywalls. No limits.",
    title: "Education is your right,",
    highlight: "not a product for sale",
    subtitle:
      "Access world-class courses taught by expert educators. Build real projects, earn certificates, and advance your career — all completely free.",
    primaryCta: { label: "Start Learning Free", href: "/register" },
    secondaryCta: { label: "Browse Courses", href: "/courses" },
    stats: [
      { value: "10,000+", label: "students" },
      { value: "500+", label: "courses" },
      { value: "100%", label: "free" },
    ],
  },
  featured: {
    heading: "Featured Courses",
    subtext: "Start learning from our most popular courses",
  },
  statistics: {
    labels: {
      students: "Active Students",
      courses: "Free Courses",
      teachers: "Expert Teachers",
      satisfaction: "Satisfaction Rate",
    },
  },
  topTeachers: {
    heading: "Top Teachers",
    subtext: "Learn from industry experts",
  },
  leaderboard: {
    heading: "Leaderboard",
    subtext: "Top learners this month. Earn XP to climb the ranks.",
  },
  achievements: {
    heading: "Student Achievements",
    subtext:
      "Our students go on to do amazing things. Here's what the Learnzfy community has accomplished.",
    items: [
      {
        title: "Career Switchers",
        description:
          "72% of students successfully transitioned into tech careers within 6 months",
      },
      {
        title: "Certificates Earned",
        description: "Over 25,000 certificates issued to students worldwide",
      },
      {
        title: "Community Driven",
        description: "Join a community of 50,000+ learners supporting each other",
      },
      {
        title: "Project Based",
        description: "Build real-world projects that showcase your skills to employers",
      },
    ],
  },
  testimonials: {
    heading: "What Our Students Say",
    subtext: "Hear from the Learnzfy community",
  },
  sponsors: {
    subtext: "Trusted by leading companies",
  },
  cta: {
    heading: "Start Learning Today",
    subtext:
      "Join thousands of students already learning for free. No credit card required. No hidden fees. Just pure knowledge.",
    primaryCta: { label: "Get Started Free", href: "/register" },
    secondaryCta: { label: "Browse Courses", href: "/courses" },
  },
  about: {
    hero: {
      title: "About Learnzfy",
      subtitle: "Education is your right, not a product for sale.",
      paragraph:
        "We're on a mission to make quality education accessible to everyone, everywhere, regardless of their economic background.",
    },
    mission: {
      heading: "Our Mission",
      text: "Learnzfy was founded on a simple belief: that education should be a right, not a privilege. In a world where quality education is increasingly commodified, we're building a platform where anyone can learn anything, completely free.",
    },
    values: {
      heading: "",
      subtext: "",
      items: [
        {
          title: "Free for Everyone",
          description:
            "We believe education is a fundamental right. Every course on Learnzfy is completely free, with no hidden fees or paywalls.",
        },
        {
          title: "Quality Content",
          description:
            "Our courses are crafted by industry experts and educators who are passionate about teaching and committed to your success.",
        },
        {
          title: "Global Community",
          description:
            "Join learners from over 100 countries. Our platform supports multiple languages and connects you with a diverse global community.",
        },
        {
          title: "Practical Learning",
          description:
            "Learn by doing. Every course includes hands-on projects, real-world examples, and interactive exercises to reinforce your skills.",
        },
      ],
    },
    team: {
      heading: "Our Team",
      subtext: "Meet the people behind Learnzfy",
      items: [
        {
          name: "Sarah Johnson",
          role: "CEO & Co-Founder",
          bio: "Former educator passionate about accessible education.",
        },
        {
          name: "Michael Chen",
          role: "CTO & Co-Founder",
          bio: "Full-stack engineer with 15 years of experience.",
        },
        {
          name: "Emily Rodriguez",
          role: "Head of Content",
          bio: "Curriculum designer focused on learning outcomes.",
        },
        {
          name: "David Kim",
          role: "Head of Engineering",
          bio: "Building scalable systems for millions of learners.",
        },
      ],
    },
    cta: {
      heading: "Ready to start learning?",
      text: "Join thousands of students already learning on Learnzfy.",
      buttonLabel: "Get Started Free",
      buttonHref: "/register",
    },
  },
  contact: {
    hero: {
      title: "Contact Us",
      subtext:
        "Have a question, suggestion, or just want to say hello? We'd love to hear from you.",
    },
    form: {
      heading: "Send us a message",
      description:
        "Fill out the form below and we'll get back to you as soon as possible.",
      buttonLabel: "Send Message",
      successHeading: "Message sent!",
      successText: "Thank you for reaching out. We'll respond within 24 hours.",
    },
    info: [
      {
        heading: "Email",
        lines: ["support@learnzfy.com", "hello@learnzfy.com"],
      },
      {
        heading: "Location",
        lines: ["Learnzfy HQ", "123 Education Street", "San Francisco, CA 94102"],
      },
    ],
  },
  footer: {
    tagline: "Education is your right, not a product for sale.",
    copyright: "Learnzfy. All rights reserved.",
    columns: [
      {
        heading: "Platform",
        links: [
          { label: "Courses", href: "/courses" },
          { label: "Teachers", href: "/teachers" },
          { label: "About", href: "/about" },
          { label: "Contact", href: "/contact" },
          { label: "API Docs", href: "/api-docs" },
        ],
      },
      {
        heading: "Support",
        links: [
          { label: "Help Center", href: "/help" },
          { label: "Privacy Policy", href: "/privacy" },
          { label: "Terms of Service", href: "/terms" },
        ],
      },
    ],
    socials: [
      { label: "GitHub", href: "https://github.com/anomalyco/learnzfy" },
      { label: "Twitter", href: "https://twitter.com/learnzfy" },
    ],
  },
}