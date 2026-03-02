import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { ModuleCard } from "@/components/dashboard/module-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Download, Award, AlertTriangle } from "lucide-react"

export default async function DashboardPage() {
    const session = await auth()

    if (!session?.user) {
        redirect("/login")
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { evaluationValidUntil: true }
    })

    const isPaused = user?.evaluationValidUntil && new Date() > user.evaluationValidUntil

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

        let type: "LOCKED" | "UNLOCKED" | "COMPLETED" | "LOCKED_TIME" = "LOCKED"
        if (isCompleted) type = "COMPLETED"
        else if (isPaused) type = "LOCKED_TIME"
        else if (isUnlocked) type = "UNLOCKED"

        return { ...module, type }
    })

    return (
        <div className="space-y-8">
            {isPaused && (
                <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-6 flex items-center gap-4 text-red-400">
                    <AlertTriangle className="h-8 w-8 flex-shrink-0" />
                    <div>
                        <h3 className="font-semibold text-lg">Tu tiempo de evaluación ha expirado</h3>
                        <p className="text-sm text-red-400/80">Han pasado más de 48 horas desde tu habilitación. Por favor, comunícate con la administración para que vuelvan a habilitar tu acceso.</p>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-2 relative">
                <h1 className="text-3xl font-bold tracking-tight">Mis Cursos</h1>
                <p className="text-muted-foreground">Completa los módulos y aprueba los exámenes para obtener tu certificación.</p>

                {allModulesCompleted && (
                    <div className="absolute right-0 top-0">
                        <Button className="gap-2 bg-yellow-600 hover:bg-yellow-700 text-white" asChild>
                            <a href="/api/certificate" target="_blank">
                                <Award className="h-4 w-4" /> Descargar Certificado
                            </a>
                        </Button>
                    </div>
                )}
            </div>

            {allModulesCompleted && (
                <div className="bg-green-900/20 border border-green-900/50 rounded-lg p-6 flex items-center gap-4 text-green-400">
                    <Award className="h-8 w-8" />
                    <div>
                        <h3 className="font-semibold text-lg">¡Felicitaciones! Has completado el curso.</h3>
                        <p className="text-sm text-green-400/80">Tu certificado está listo para descargar.</p>
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
