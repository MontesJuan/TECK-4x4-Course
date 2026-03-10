"use server"

import * as z from "zod"
import { signIn } from "@/auth"
import { LoginSchema } from "@/schemas"
import { AuthError } from "next-auth"
import { prisma } from "@/lib/prisma"

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: "Campos inválidos!" }
    }

    const { email, password } = validatedFields.data

    try {
        await signIn("credentials", {
            username: email,
            password,
            redirectTo: "/dashboard",
        })

        // Update startedAt if it's the first time
        const user = await prisma.user.findUnique({ where: { email } })
        if (user && !user.startedAt) {
            await prisma.user.update({
                where: { id: user.id },
                data: { startedAt: new Date() }
            })
        }
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Credenciales inválidas!" }
                default:
                    return { error: "Algo salió mal!" }
            }
        }

        throw error
    }
}
