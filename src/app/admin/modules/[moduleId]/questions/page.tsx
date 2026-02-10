import { prisma } from "@/lib/prisma"
import { QuestionsManager } from "@/components/admin/questions-manager"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function ModuleQuestionsPage({ params }: { params: Promise<{ moduleId: string }> }) {
    const { moduleId } = await params;
    const moduleData = await prisma.module.findUnique({
        where: { id: moduleId },
        include: {
            questions: {
                include: { options: true }
            }
        }
    })

    if (!moduleData) return <div>Módulo no encontrado</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" asChild>
                    <Link href={`/admin/modules/${moduleId}`}>
                        <ArrowLeft className="h-4 w-4 mr-2" /> Volver
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold">Preguntas: {moduleData.title}</h1>
            </div>

            <QuestionsManager moduleId={moduleData.id} questions={moduleData.questions} />
        </div>
    )
}
