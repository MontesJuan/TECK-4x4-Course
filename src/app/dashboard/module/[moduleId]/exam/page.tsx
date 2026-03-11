import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { ExamForm } from "@/components/exam/exam-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface ExamPageProps {
    params: Promise<{
        moduleId: string
    }>
}

export default async function ExamPage({ params }: ExamPageProps) {
    const { moduleId } = await params;
    const session = await auth()
    if (!session?.user) redirect("/login")

    const progress = await prisma.userProgress.findUnique({
        where: {
            userId_moduleId: {
                userId: session.user.id,
                moduleId: moduleId
            }
        }
    })

    if (progress && progress.attempts >= 1) {
        return (
            <div className="container py-8 max-w-2xl mx-auto mt-8 flex flex-col items-center justify-center gap-6 bg-zinc-900 border border-zinc-800 rounded-2xl p-10 shadow-2xl text-center">
                <AlertTriangle className="h-20 w-20 text-yellow-500" />
                <h1 className="text-3xl font-extrabold text-white">Examen ya rendido</h1>
                <p className="text-zinc-400 text-lg">
                    Ya has utilizado tu único intento para este módulo. Obtuviste una calificación de <span className="font-bold text-white text-xl">{progress.score?.toFixed(0) ?? 0}%</span>.
                </p>
                <div className="mt-4">
                    <Button asChild size="lg" className="bg-white text-zinc-950 hover:bg-zinc-200 font-bold px-10 rounded-full transition-transform hover:scale-105 shadow-xl">
                        <Link href={`/dashboard/module/${moduleId}`}>
                            Volver al módulo
                        </Link>
                    </Button>
                </div>
            </div>
        )
    }

    const moduleData = await prisma.module.findUnique({
        where: { id: moduleId },
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
