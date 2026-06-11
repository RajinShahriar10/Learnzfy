export const ROLES = {
  STUDENT: "STUDENT",
  TEACHER: "TEACHER",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

export const ROLE_HIERARCHY: Record<Role, number> = {
  STUDENT: 1,
  TEACHER: 2,
  ADMIN: 3,
  SUPER_ADMIN: 4,
}

export const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/courses",
  "/teachers",
  "/api-docs",
  "/about",
  "/contact",
  "/verify",
  "/search",
  "/profile",
]

export const AUTH_ROUTES = ["/login", "/register"]

export const PROTECTED_ROUTES = [
  "/dashboard",
  "/student",
  "/teacher",
  "/admin",
  "/super-admin",
]

export const ROLE_DASHBOARD_ROUTES: Record<Role, string> = {
  STUDENT: "/student",
  TEACHER: "/teacher",
  ADMIN: "/admin",
  SUPER_ADMIN: "/super-admin",
}

export const API_AUTH_PREFIX = "/api/auth"
