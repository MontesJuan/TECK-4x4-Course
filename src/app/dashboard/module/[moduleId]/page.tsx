import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertTriangle, FileText, CheckCircle, PlayCircle } from "lucide-react"

interface ModulePageProps {
    params: {
        moduleId: string
    }
}

export default async function ModulePage({ params }: ModulePageProps) {
    const session = await auth()
    if (!session?.user) redirect("/login")

    const moduleData = await prisma.module.findUnique({
        where: { id: params.moduleId },
        include: {
            materials: true,
            progress: {
                where: { userId: session.user.id }
            }
        }
    })

    if (!moduleData) redirect("/dashboard")

    // Check if locked
    // Logic: fetch all modules ordered, find index of current. check if previous is completed.
    const allModules = await prisma.module.findMany({
        orderBy: { order: "asc" },
        select: { id: true, order: true }
    })

    const currentIndex = allModules.findIndex(m => m.id === moduleData.id)
    let isLocked = false

    if (currentIndex > 0) {
        const previousModuleId = allModules[currentIndex - 1].id
        const previousProgress = await prisma.userProgress.findUnique({
            where: {
                userId_moduleId: {
                    userId: session.user.id,
                    moduleId: previousModuleId
                }
            }
        })
        if (!previousProgress?.completed) {
            isLocked = true
        }
    }

    if (isLocked) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
                <AlertTriangle className="h-12 w-12 text-yellow-500" />
                <h1 className="text-2xl font-bold">Módulo Bloqueado</h1>
                <p className="text-muted-foreground">Debes completar el módulo anterior para acceder a este contenido.</p>
                <Button asChild><Link href="/dashboard">Volver al Dashboard</Link></Button>
            </div>
        )
    }

    const usageProgress = moduleData.progress[0]
    const isCompleted = usageProgress?.completed || false

    // Transform drive link to preview/embed if needed.
    // The prompt provides links like https://drive.google.com/file/d/1Pj.../view?usp=drive_link
    // Or /preview
    // To embed, we usually need keys or specific embed URLs.
    // The prompt links are `.../view`. We should replace `/view...` with `/preview`.
    const videoUrl = moduleData.videoUrl?.replace(/\/view.*/, "/preview")

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">{moduleData.title}</h1>
                <Button asChild variant={isCompleted ? "outline" : "default"}>
                    <Link href={`/dashboard/module/${moduleData.id}/exam`}>
                        {isCompleted ? "Ver examen" : "Rendir Examen"}
                    </Link>
                </Button>
            </div>

            <div className="aspect-video w-full bg-black rounded-lg overflow-hidden shadow-lg">
                {videoUrl ? (
                    <iframe
                        src={videoUrl}
                        className="w-full h-full"
                        allow="autoplay"
                        allowFullScreen
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-white">Video no disponible</div>
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-4">
                    <h2 className="text-xl font-semibold">Descripción</h2>
                    <p className="text-muted-foreground">{moduleData.description}</p>
                </div>
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Material de Estudio</h2>
                    {moduleData.materials.length > 0 ? (
                        <ul className="space-y-2">
                            {moduleData.materials.map((material) => (
                                <li key={material.id}>
                                    <Button variant="outline" className="w-full justify-start" asChild>
                                        <a href={material.fileUrl} target="_blank" rel="noopener noreferrer">
                                            <FileText className="mr-2 h-4 w-4" />
                                            {material.title}
                                        </a>
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-muted-foreground">No hay material adjunto.</p>
                    )}
                </div>
            </div>
        </div>
    )
}
