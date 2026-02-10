import { prisma } from "@/lib/prisma"
import { AdminModuleForm } from "@/components/admin/module-form"
import { MaterialsManager } from "@/components/admin/materials-manager"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function EditModulePage({ params }: { params: Promise<{ moduleId: string }> }) {
    const { moduleId } = await params;
    const moduleData = await prisma.module.findUnique({
        where: { id: moduleId },
        include: { materials: true }
    })

    if (!moduleData) return <div>Módulo no encontrado</div>

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Editar Módulo: {moduleData.title}</h1>
                <Button variant="outline" asChild>
                    <Link href={`/admin/modules/${moduleData.id}/questions`}>
                        Gestionar Preguntas
                    </Link>
                </Button>
            </div>

            <AdminModuleForm moduleId={moduleData.id} initialData={moduleData} />

            <MaterialsManager moduleId={moduleData.id} materials={moduleData.materials} />
        </div>
    )
}
