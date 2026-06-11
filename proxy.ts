import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import {
  PUBLIC_ROUTES,
  AUTH_ROUTES,
  API_AUTH_PREFIX,
  ROLE_DASHBOARD_ROUTES,
  ROLE_HIERARCHY,
} from "@/config/routes"
import type { Role } from "@/config/routes"

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isApiAuthRoute = pathname.startsWith(API_AUTH_PREFIX)
  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  )
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))

  if (isApiAuthRoute) {
    return NextResponse.next()
  }

  const session = await auth()
  const isLoggedIn = !!session?.user

  if (isAuthRoute) {
    if (isLoggedIn) {
      const role = session.user.role as Role
      const dashboardRoute = ROLE_DASHBOARD_ROUTES[role] || "/"
      return NextResponse.redirect(new URL(dashboardRoute, request.url))
    }
    return NextResponse.next()
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.png$).*)"],
}
