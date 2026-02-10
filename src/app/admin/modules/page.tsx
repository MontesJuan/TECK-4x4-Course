import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Edit, Eye } from "lucide-react"

export default async function AdminModulesPage() {
    const modules = await prisma.module.findMany({
        orderBy: { order: "asc" },
        include: { _count: { select: { materials: true, questions: true } } }
    })

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Gestión de Módulos</h1>
                {/* Provide ability to Add Module if needed, or just edit existing ones as per seed? */
                 /* Prompt: "agregar, eliminar, editar, etc el contenido". So yes, Add. */}
                <Button asChild>
                    <Link href="/admin/modules/new">Nuevo Módulo</Link>
                </Button>
            </div>

            <div className="bg-card rounded-md shadow border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Orden</TableHead>
                            <TableHead>Título</TableHead>
                            <TableHead>Video</TableHead>
                            <TableHead>Materiales</TableHead>
                            <TableHead>Preguntas</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {modules.map((module) => (
                            <TableRow key={module.id}>
                                <TableCell>{module.order}</TableCell>
                                <TableCell className="font-medium">{module.title}</TableCell>
                                <TableCell className="max-w-[200px] truncate">{module.videoUrl}</TableCell>
                                <TableCell>{module._count.materials}</TableCell>
                                <TableCell>{module._count.questions}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href={`/admin/modules/${module.id}`}>
                                            <Edit className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
