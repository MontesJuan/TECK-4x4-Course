import { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            role: "ADMIN" | "USER"
            id: string
        } & DefaultSession["user"]
    }

    interface User {
        role: "ADMIN" | "USER"
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role: "ADMIN" | "USER"
        id: string
    }
}
