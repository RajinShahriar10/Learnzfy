import { auth } from "@/lib/auth"
import { ROLES, ROLE_HIERARCHY, ROLE_DASHBOARD_ROUTES } from "@/config/routes"
import type { Role } from "@/config/routes"
import { redirect } from "next/navigation"

export async function getCurrentUser() {
  const session = await auth()
  return session?.user ?? null
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }
  return user
}

export function hasRole(userRole: string, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole as Role] >= ROLE_HIERARCHY[requiredRole]
}

export function hasExactRole(userRole: string, requiredRole: Role): boolean {
  return userRole === requiredRole
}

export async function requireRole(requiredRole: Role) {
  const user = await requireAuth()
  if (!hasRole(user.role, requiredRole)) {
    redirect("/")
  }
  return user
}

export function getDashboardRoute(role: string): string {
  return ROLE_DASHBOARD_ROUTES[role as Role] || "/"
}

export function canAccessRoute(userRole: string, routeRole: Role): boolean {
  return hasRole(userRole, routeRole)
}
