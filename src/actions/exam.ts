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

    const userAnswersToSave = []

    // Calculate Score and Prepare UserAnswers
    for (const q of moduleData.questions) {
        const selectedOptionId = answers[q.id]
        if (!selectedOptionId) continue

        const correctOption = q.options.find(o => o.isCorrect)
        const isCorrect = selectedOptionId === correctOption?.id

        if (isCorrect) {
            correctCount++
        }

        userAnswersToSave.push({
            userId: session.user.id,
            questionId: q.id,
            optionId: selectedOptionId,
            isCorrect: isCorrect
        })
    }

    const scorePercentage = (correctCount / totalQuestions) * 100
    const passed = scorePercentage >= 80

    // Update Progress
    // We increment attempts.
    // If passed, we set completed = true.
    // We update score (keep highest? or latest? usually highest or latest. Let's keep latest for now, or ensure we don't regress complete status)

    const existingProgress = await prisma.userProgress.findUnique({
        where: {
            userId_moduleId: {
                userId: session.user.id,
                moduleId: moduleId
            }
        }
    })

    // To prevent regressing a higher score, we take Math.max
    const finalScore = existingProgress?.score ? Math.max(existingProgress.score, scorePercentage) : scorePercentage;

    await prisma.userProgress.upsert({
        where: {
            userId_moduleId: {
                userId: session.user.id,
                moduleId: moduleId
            }
        },
        update: {
            completed: true, // Always completed just by attempting it
            score: finalScore, // Keep highest score
            attempts: { increment: 1 }
        },
        create: {
            userId: session.user.id,
            moduleId: moduleId,
            completed: true,
            score: scorePercentage,
            attempts: 1
        }
    })

    // Save detailed answers sequentially to avoid connection pool exhaustion
    for (const ua of userAnswersToSave) {
        await prisma.userAnswer.upsert({
            where: {
                userId_questionId: {
                    userId: ua.userId,
                    questionId: ua.questionId
                }
            },
            update: {
                optionId: ua.optionId,
                isCorrect: ua.isCorrect
            },
            create: ua
        })
    }

    revalidatePath("/dashboard")
    revalidatePath(`/dashboard/module/${moduleId}`)

    return {
        success: true,
        passed,
        score: scorePercentage,
        correctCount,
        totalQuestions
    }
}

export const syncExamToSheets = async () => {
    const session = await auth()
    if (!session?.user) return { error: "No autorizado" }

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { progress: { include: { module: true } } }
        });

        if (user) {
            const moduleScores: Record<string, number> = {};
            user.progress.forEach(p => {
                if (p.score !== null) {
                    moduleScores[p.module.title] = p.score;
                }
            });

            const { addToSheet } = await import("@/lib/google-sheets");
            await addToSheet({
                name: user.name,
                surname: user.surname,
                email: user.email,
                cuil: user.cuil,
                phone: user.phone,
                company: user.company,
                position: user.position,
                licenseType: user.licenseType,
                licenseExpiry: user.licenseExpiry,
                country: user.country,
                province: user.province,
                city: user.city,
                createdAt: user.createdAt,
                status: user.status,
                moduleScores
            })
        }
        return { success: true }
    } catch (sheetError) {
        console.error("Error syncing to Google Sheet after exam:", sheetError);
        return { error: "Sync error" }
    }
}
