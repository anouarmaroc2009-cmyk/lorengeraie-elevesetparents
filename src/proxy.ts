import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth"

export async function proxy(request: NextRequest) {
  const session = await auth()
  const { pathname } = request.nextUrl

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register")
  const isPublic = pathname === "/" || pathname.startsWith("/api")

  if (!session && !isPublic && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (session && isAuthPage) {
    const role = session.user.role
    if (role === "admin") return NextResponse.redirect(new URL("/admin", request.url))
    if (role === "teacher") return NextResponse.redirect(new URL("/teacher", request.url))
    return NextResponse.redirect(new URL("/student", request.url))
  }

  if (session && pathname.startsWith("/teacher") && session.user.role !== "teacher") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  if (session && pathname.startsWith("/student") && session.user.role !== "student") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  if (session && pathname.startsWith("/admin") && session.user.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|manifest.json).*)"],
}
