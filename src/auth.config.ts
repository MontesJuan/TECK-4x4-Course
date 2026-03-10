import type { NextAuthConfig } from "next-auth"

export default {
    providers: [],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
            const isOnAdmin = nextUrl.pathname.startsWith('/admin')

            if (isOnDashboard || isOnAdmin) {
                if (isLoggedIn) return true
                return false // Redirect unauthenticated users to login page
            }
            return true
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role
                token.id = user.id
                token.createdAt = (user as any).createdAt
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user.role = token.role as "ADMIN" | "USER"
                session.user.id = token.id as string
                    ; (session.user as any).createdAt = token.createdAt
            }
            return session
        },
    },
} satisfies NextAuthConfig
