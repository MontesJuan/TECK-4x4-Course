import NextAuth from "next-auth"
import { prisma } from "@/lib/prisma"
import Credentials from "next-auth/providers/credentials"
import authConfig from "@/auth.config"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
    session: { strategy: "jwt" },
    ...authConfig,
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                // Admin Login
                if (
                    credentials.username === "NIELSEN" &&
                    credentials.password === "NIELSEN26"
                ) {
                    return {
                        id: "admin",
                        name: "NIELSEN",
                        email: "capacitacion4x4@nielsenexpediciones.com.ar",
                        role: "ADMIN",
                    }
                }

                const email = credentials.username as string
                const password = credentials.password as string

                const user = await prisma.user.findUnique({
                    where: { email },
                })

                if (!user) {
                    return null
                }

                if (user.status !== "ACTIVE") {
                    throw new Error("User not active")
                }

                if (!user.password) {
                    return null
                }

                const passwordsMatch = await bcrypt.compare(password, user.password)

                if (!passwordsMatch) {
                    return null
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role as "ADMIN" | "USER",
                    createdAt: user.createdAt,
                }
            },
        }),
    ],
})
