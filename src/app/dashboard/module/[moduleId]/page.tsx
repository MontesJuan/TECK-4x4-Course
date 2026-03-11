import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertTriangle, FileText, CheckCircle, PlayCircle } from "lucide-react"

interface ModulePageProps {
    params: Promise<{
        moduleId: string
    }>
}

export default async function ModulePage({ params }: ModulePageProps) {
    const { moduleId } = await params;
    const session = await auth()
    if (!session?.user) redirect("/login")

    const moduleData = await prisma.module.findUnique({
        where: { id: moduleId },
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
    const attempts = usageProgress?.attempts || 0

    // Transform drive link to preview/embed if needed.
    // The prompt provides links like https://drive.google.com/file/d/1Pj.../view?usp=drive_link
    // Or /preview
    // To embed, we usually need keys or specific embed URLs.
    // The prompt links are `.../view`. We should replace `/view...` with `/preview`.
    const videoUrl = moduleData.videoUrl?.replace(/\/view.*/, "/preview")

    return (
        <div className="space-y-8 max-w-4xl mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-sm">{moduleData.title}</h1>
                {attempts >= 1 ? (
                    <Button
                        disabled
                        size="lg"
                        className="bg-zinc-800 text-zinc-400 font-bold cursor-not-allowed shadow-none"
                    >
                        Examen Rendido ({usageProgress?.score?.toFixed(0) ?? 0}%)
                    </Button>
                ) : (
                    <Button
                        asChild
                        size="lg"
                        className="bg-white text-zinc-950 hover:bg-zinc-200 font-bold shadow-lg hover:shadow-white/20"
                    >
                        <Link href={`/dashboard/module/${moduleData.id}/exam`}>
                            Rendir Examen
                        </Link>
                    </Button>
                )}
            </div>

            <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-zinc-800">
                {videoUrl ? (
                    <iframe
                        src={videoUrl}
                        className="w-full h-full"
                        allow="autoplay"
                        allowFullScreen
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-zinc-500 font-light tracking-wide">Video no disponible</div>
                )}
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2 space-y-4">
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-100 border-b border-zinc-800 pb-2">Descripción</h2>
                    <p className="text-zinc-400 leading-relaxed text-lg font-light">{moduleData.description}</p>
                </div>
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-100 border-b border-zinc-800 pb-2">Material de Estudio</h2>
                    {moduleData.materials.length > 0 ? (
                        <ul className="space-y-3">
                            {moduleData.materials.map((material) => (
                                <li key={material.id}>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 hover:border-zinc-500 transition-colors h-auto py-3 px-4"
                                        asChild
                                    >
                                        <a href={material.fileUrl} target="_blank" rel="noopener noreferrer">
                                            <FileText className="mr-3 h-5 w-5 text-zinc-400" />
                                            <span className="truncate">{material.title}</span>
                                        </a>
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-base text-zinc-500 italic">No hay material adjunto.</p>
                    )}
                </div>
            </div>
        </div>
    )
}
