"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export const approveUser = async (userId: string) => {
    const session = await auth()
    if (session?.user.role !== "ADMIN") return { error: "Unauthorized" }

    await prisma.user.update({
        where: { id: userId },
        data: { status: "ACTIVE" }
    })

    // Send confirmation email
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (user && process.env.RESEND_API_KEY) {
        try {
            await resend.emails.send({
                from: "onboarding@resend.dev",
                to: user.email,
                subject: "Bienvenido a TEC 4x4 - Cuenta Aprobada",
                html: `<p>Hola ${user.name},</p><p>Tu cuenta ha sido aprobada. Ya puedes ingresar a la plataforma.</p>`,
            })
        } catch (e) {
            console.error("Failed to send email", e)
        }
    }

    revalidatePath("/admin/dashboard")
    return { success: "Usuario aprobado" }
}

export const deleteUser = async (userId: string) => {
    const session = await auth()
    if (session?.user.role !== "ADMIN") return { error: "Unauthorized" }

    await prisma.user.delete({
        where: { id: userId }
    })

    revalidatePath("/admin/dashboard")
    return { success: "Usuario eliminado" }
}
