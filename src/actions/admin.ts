"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export const approveUser = async (userId: string) => {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") return { error: "Unauthorized" }

    await prisma.user.update({
        where: { id: userId },
        data: {
            status: "ACTIVE",
            evaluationValidUntil: new Date(Date.now() + 48 * 60 * 60 * 1000)
        }
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

export const unblockUser = async (userId: string) => {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") return { error: "Unauthorized" }

    await prisma.user.update({
        where: { id: userId },
        data: { evaluationValidUntil: new Date(Date.now() + 48 * 60 * 60 * 1000) }
    })

    revalidatePath("/admin/dashboard")
    return { success: "Usuario desbloqueado por 48hs" }
}

export const deleteUser = async (userId: string) => {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") return { error: "Unauthorized" }

    await prisma.user.delete({
        where: { id: userId }
    })

    revalidatePath("/admin/dashboard")
    return { success: "Usuario eliminado" }
}

export const syncUserToSheet = async (userId: string) => {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
        return { error: "No autorizado" }
    }

    try {
        const { syncFullUserData } = await import("@/lib/google-sheets")

        // Fetch User and Progress
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                progress: {
                    include: { module: true }
                }
            }
        })

        if (!user) {
            return { error: "Usuario no encontrado" }
        }


        const allModules = await prisma.module.findMany({
            orderBy: { order: 'asc' }
        })

        const totalModulesCount = allModules.length

        const progressMap: Record<string, string | number> = {}

        // Map progress to MODULO1, MODULO2, etc. based on Module order
        allModules.forEach((mod, index) => {
            const userModProgress = user.progress.find(p => p.moduleId === mod.id)
            if (userModProgress && userModProgress.score !== null) {
                progressMap[`MODULO${index + 1}`] = userModProgress.score.toFixed(2) + '%'
            }
        })

        const sumScores = user.progress.reduce((acc, curr) => acc + (curr.score || 0), 0)
        // Calculating average based on modules TAKEN or ALL modules? 
        // Previous logic was ALL modules. Let's stick to that for "Global".
        // But usually average is sum / count. If count is 0, 0.
        const totalAverage = totalModulesCount > 0 ? sumScores / totalModulesCount : 0

        await syncFullUserData(user, progressMap, totalAverage)

        revalidatePath("/admin/dashboard")
        return { success: "Datos sincronizados con Google Sheets" }

    } catch (error) {
        console.error("Manual sync error:", error)
        return { error: "Error al sincronizar" }
    }
}
