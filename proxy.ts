import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register")
    const isAdminPage = req.nextUrl.pathname.startsWith("/admin")
    const isDashboardPage = req.nextUrl.pathname.startsWith("/dashboard")

    if (isAuthPage) {
      if (isAuth) {
        // Redirect authenticated users away from auth pages
        const redirectPath = token.role === "ADMIN" ? "/admin" : "/dashboard"
        return NextResponse.redirect(new URL(redirectPath, req.url))
      }
      return NextResponse.next()
    }

    if (!isAuth) {
      // Redirect unauthenticated users to login
      const from = req.nextUrl.pathname
      return NextResponse.redirect(new URL(`/login?from=${encodeURIComponent(from)}`, req.url))
    }

    if (isAdminPage && token.role !== "ADMIN") {
      // Non-admin users trying to access admin pages
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    if (isDashboardPage && token.role === "ADMIN") {
      // Redirect admins to admin panel
      return NextResponse.redirect(new URL("/admin", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: () => true, // We handle authorization in the middleware function
    },
  },
)

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register"],
}
