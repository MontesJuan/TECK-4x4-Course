import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { ModuleCard } from "@/components/dashboard/module-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Download, Award } from "lucide-react"

export default async function DashboardPage() {
    const session = await auth()

    if (!session?.user) {
        redirect("/login")
    }

    const modules = await prisma.module.findMany({
        orderBy: { order: "asc" },
        include: {
            progress: {
                where: { userId: session.user.id },
            },
        }
    })

    // Calculate status for each module
    let previousModuleCompleted = true // First module is always unlocked
    let allModulesCompleted = true

    const modulesWithStatus = modules.map((module) => {
        const userProgress = module.progress[0]
        const isCompleted = userProgress?.completed || false
        const isUnlocked = previousModuleCompleted

        if (!isCompleted) {
            previousModuleCompleted = false
            allModulesCompleted = false
        }

        let type: "LOCKED" | "UNLOCKED" | "COMPLETED" = "LOCKED"
        if (isCompleted) type = "COMPLETED"
        else if (isUnlocked) type = "UNLOCKED"

        return { ...module, type, score: userProgress?.score ?? 0 }
    })

    const totalCalculatedScore = modulesWithStatus.reduce((acc, mod) => acc + mod.score, 0);
    const averageScore = modulesWithStatus.length > 0 ? totalCalculatedScore / modulesWithStatus.length : 0;
    const isApproved = allModulesCompleted && averageScore >= 80;

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2 relative">
                <h1 className="text-3xl font-bold tracking-tight">Mis Cursos</h1>
                <p className="text-muted-foreground">Completa los módulos y aprueba los exámenes para obtener tu certificación. Promedio necesario: 80%.</p>

                {isApproved && (
                    <div className="absolute right-0 top-0">
                        <Button className="gap-2 bg-yellow-600 hover:bg-yellow-700 text-white" asChild>
                            <a href="/api/certificate" target="_blank">
                                <Award className="h-4 w-4" /> Descargar Certificado
                            </a>
                        </Button>
                    </div>
                )}
            </div>

            {isApproved && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-4 text-green-800">
                    <Award className="h-8 w-8" />
                    <div>
                        <h3 className="font-semibold">¡Felicitaciones! Has completado y aprobado el curso.</h3>
                        <p className="text-sm">Tu certificado está listo para descargar con un promedio de {averageScore.toFixed(1)}%</p>
                    </div>
                </div>
            )}

            {allModulesCompleted && !isApproved && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-4 text-red-800">
                    <div>
                        <h3 className="font-semibold">Curso completado, pero no aprobado.</h3>
                        <p className="text-sm">Tu promedio final es {averageScore.toFixed(1)}%, necesitas al menos 80% para obtener tu certificado. Puedes reintentar los exámenes para mejorar tu nota.</p>
                    </div>
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {modulesWithStatus.map((module) => (
                    <ModuleCard
                        key={module.id}
                        id={module.id}
                        title={module.title}
                        description={module.description || ""}
                        order={module.order}
                        type={module.type as any}
                    />
                ))}
            </div>
        </div>
    )
}
