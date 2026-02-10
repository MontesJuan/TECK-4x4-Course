import NextAuth from "next-auth"
import authConfig from "@/auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const isAuthRoute = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register")
    const isApiAuthRoute = req.nextUrl.pathname.startsWith("/api/auth")
    const isPublicRoute = req.nextUrl.pathname === "/" || req.nextUrl.pathname.startsWith("/public")
    const isCertificateRoute = req.nextUrl.pathname.startsWith("/api/certificate")

    if (isApiAuthRoute || isCertificateRoute) return

    if (isAuthRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL("/dashboard", req.nextUrl))
        }
        return
    }

    if (!isLoggedIn && !isPublicRoute) {
        return Response.redirect(new URL("/login", req.nextUrl))
    }

    return
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|assets).*)"],
}
