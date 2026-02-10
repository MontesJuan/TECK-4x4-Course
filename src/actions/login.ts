"use server"

import * as z from "zod"
import { signIn } from "@/auth"
import { LoginSchema } from "@/schemas"
import { AuthError } from "next-auth"

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
            redirectTo: "/dashboard", // Middleware might override this or we handle redirection in client
        })
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
