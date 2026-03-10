import NextAuth from "next-auth"
import authConfig from "@/auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const isAuthRoute = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register")
    const isApiAuthRoute = req.nextUrl.pathname.startsWith("/api/auth")
    const isPublicRoute = req.nextUrl.pathname === "/" || req.nextUrl.pathname.startsWith("/assets") || req.nextUrl.pathname.startsWith("/public")
    const isCertificateRoute = req.nextUrl.pathname.startsWith("/api/certificate")
    const isBlockedRoute = req.nextUrl.pathname.startsWith("/blocked")

    if (isApiAuthRoute || isCertificateRoute) return

    if (isLoggedIn) {
        const user = req.auth?.user as any;
        if (user && user.role !== "ADMIN" && user.createdAt) {
            const createdAt = new Date(user.createdAt);
            const now = new Date();
            const diffHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

            if (diffHours >= 48) {
                if (!isBlockedRoute) {
                    return Response.redirect(new URL("/blocked", req.nextUrl))
                }
                return
            }
        }
    }

    if (isBlockedRoute && (!isLoggedIn || (req.auth?.user as any)?.role === "ADMIN")) {
        return Response.redirect(new URL("/dashboard", req.nextUrl))
    }

    if (isAuthRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL("/dashboard", req.nextUrl))
        }
        return
    }

    if (!isLoggedIn && !isPublicRoute && !isBlockedRoute) {
        return Response.redirect(new URL("/login", req.nextUrl))
    }

    return
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|assets).*)"],
}
