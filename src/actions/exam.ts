"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

interface SubmitExamPayload {
    moduleId: string
    answers: Record<string, string> // questionId -> optionId
}

export const submitExam = async ({ moduleId, answers }: SubmitExamPayload) => {
    const session = await auth()
    if (!session?.user) return { error: "No autorizado" }

    // Fetch module questions and correct options
    const moduleData = await prisma.module.findUnique({
        where: { id: moduleId },
        include: {
            questions: {
                include: { options: true }
            }
        }
    })

    if (!moduleData) return { error: "Módulo no encontrado" }

    let correctCount = 0
    const totalQuestions = moduleData.questions.length

    if (totalQuestions === 0) return { error: "Este módulo no tiene preguntas configuradas." }

    // Calculate Score
    moduleData.questions.forEach(q => {
        const selectedOptionId = answers[q.id]
        const correctOption = q.options.find(o => o.isCorrect)

        if (selectedOptionId && correctOption && selectedOptionId === correctOption.id) {
            correctCount++
        }
    })

    const scorePercentage = (correctCount / totalQuestions) * 100
    const passed = scorePercentage >= 80

    // Update Progress
    // We increment attempts.
    // If passed, we set completed = true.
    // We update score (keep highest? or latest? usually highest or latest. Let's keep latest for now, or ensure we don't regress complete status)

    // First fetch existing progress to check if already completed
    const existingProgress = await prisma.userProgress.findUnique({
        where: {
            userId_moduleId: {
                userId: session.user.id,
                moduleId: moduleId
            }
        }
    })

    const isAlreadyCompleted = existingProgress?.completed || false
    const newCompleted = isAlreadyCompleted || passed

    await prisma.userProgress.upsert({
        where: {
            userId_moduleId: {
                userId: session.user.id,
                moduleId: moduleId
            }
        },
        update: {
            completed: newCompleted,
            score: scorePercentage, // Update with latest score
            attempts: { increment: 1 }
        },
        create: {
            userId: session.user.id,
            moduleId: moduleId,
            completed: passed,
            score: scorePercentage,
            attempts: 1
        }
    })

    // Verify total progress for Google Sheets sync
    // Sync to Google Sheets
    // We need user email.
    if (session.user.email) {
        try {
            const { updateUserProgress } = await import("@/lib/google-sheets")

            // Fetch ALL modules to ensure correct order
            const allModules = await prisma.module.findMany({
                orderBy: { order: 'asc' }
            })

            // Fetch fresh progress for ALL modules
            const allProgress = await prisma.userProgress.findMany({
                where: { userId: session.user.id }
            })

            const progressMap: Record<string, string | number> = {}
            let sumScores = 0

            allModules.forEach((mod, index) => {
                const prog = allProgress.find(p => p.moduleId === mod.id)
                if (prog && prog.score !== null) {
                    progressMap[`MODULO${index + 1}`] = prog.score.toFixed(2) + '%'
                    sumScores += prog.score
                }
            })

            const totalModulesCount = allModules.length
            const totalAverage = totalModulesCount > 0 ? sumScores / totalModulesCount : 0

            await updateUserProgress(session.user.email, progressMap, totalAverage)

        } catch (e) {
            console.error("Failed to sync exam result to sheet:", e)
        }
    }

    revalidatePath("/dashboard")
    revalidatePath(`/dashboard/module/${moduleId}`)
    revalidatePath("/admin/dashboard") // Ensure admin panel is updated

    return {
        success: true,
        passed,
        score: scorePercentage,
        correctCount,
        totalQuestions
    }
}
