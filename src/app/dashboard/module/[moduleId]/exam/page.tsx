import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { ExamForm } from "@/components/exam/exam-form"

interface ExamPageProps {
    params: {
        moduleId: string
    }
}

export default async function ExamPage({ params }: ExamPageProps) {
    const session = await auth()
    if (!session?.user) redirect("/login")

    const moduleData = await prisma.module.findUnique({
        where: { id: params.moduleId },
        include: {
            questions: {
                include: {
                    options: true // Need options text but NOT isCorrect for client? 
                    // Actually we can send isCorrect if we want immediate feedback, but secure way is to strip it.
                    // For now, I'll send everything and handle logic on server.
                    // I will transform data to remove isCorrect to prevent inspecting element -> cheat.
                }
            }
        }
    })

    if (!moduleData) redirect("/dashboard")

    // Construct questions object without exposing correct answers
    const questionsForClient = moduleData.questions.map(q => ({
        id: q.id,
        text: q.text,
        options: q.options.map(o => ({
            id: o.id,
            text: o.text
        })) // isCorrect property matches removed
    }))

    // Shuffle questions/options if needed? User didn't ask explicitly but it's good practice.
    // I'll keep it simple (fixed order) for now as modules usually have structured questions.

    return (
        <div className="container py-8">
            <ExamForm moduleId={moduleData.id} questions={questionsForClient} />
        </div>
    )
}
