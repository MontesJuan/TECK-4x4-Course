"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const QuestionSchema = z.object({
    text: z.string().min(1),
    options: z.array(z.object({
        text: z.string().min(1),
        isCorrect: z.boolean()
    })).min(2)
})

export const createQuestion = async (moduleId: string, values: z.infer<typeof QuestionSchema>) => {
    const session = await auth()
    if (session?.user.role !== "ADMIN") return { error: "Unauthorized" }

    const validated = QuestionSchema.safeParse(values)
    if (!validated.success) return { error: "Invalid fields" }

    const { text, options } = validated.data

    await prisma.question.create({
        data: {
            text,
            moduleId,
            options: {
                create: options
            }
        }
    })

    revalidatePath(`/admin/modules/${moduleId}/questions`)
    return { success: "Pregunta creada" }
}

export const deleteQuestion = async (questionId: string) => {
    const session = await auth()
    if (session?.user.role !== "ADMIN") return { error: "Unauthorized" }

    // Need moduleId to revalidate?
    const q = await prisma.question.findUnique({ where: { id: questionId } })
    if (!q) return { error: "Not found" }

    await prisma.question.delete({ where: { id: questionId } })

    revalidatePath(`/admin/modules/${q.moduleId}/questions`)
    return { success: "Pregunta eliminada" }
}
