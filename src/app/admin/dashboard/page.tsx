import { prisma } from "@/lib/prisma"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ApproveUserButton, DeleteUserButton } from "@/components/admin/action-buttons"

export default async function AdminDashboardPage() {
    // Check auth in layout, but double check usually good or layout handles it.

    const users = await prisma.user.findMany({
        where: { role: "USER" },
        orderBy: { createdAt: "desc" },
        include: { progress: true }
    })

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Gestión de Alumnos</h1>

            <div className="bg-white rounded-md shadow border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Empresa</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Avance</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.surname}, {user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.company}</TableCell>
                                <TableCell>
                                    <Badge variant={user.status === "ACTIVE" ? "default" : "secondary"}>
                                        {user.status === "ACTIVE" ? "Activo" : "Pendiente"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {/* Calculated progress: completed modules / total modules (4) */}
                                    {/* Or just show last completed module */}
                                    {user.progress.filter(p => p.completed).length} / 4 Módulos
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    {user.status === "PENDING" && (
                                        <ApproveUserButton userId={user.id} />
                                    )}
                                    <DeleteUserButton userId={user.id} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
