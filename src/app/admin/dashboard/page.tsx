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
import { UserDetailDialog } from "@/components/admin/UserDetailDialog"

export default async function AdminDashboardPage() {
    const users = await prisma.user.findMany({
        where: { role: "USER" },
        orderBy: { createdAt: "desc" },
        include: {
            progress: {
                include: {
                    module: true
                }
            },
            answers: {
                include: {
                    question: true,
                    option: true
                }
            }
        }
    })

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Gestión de Alumnos</h1>

            <div className="bg-white text-black rounded-md shadow border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Empresa</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Inicio</TableHead>
                            <TableHead className="text-center">INTRO</TableHead>
                            <TableHead className="text-center">M1</TableHead>
                            <TableHead className="text-center">M2</TableHead>
                            <TableHead className="text-center">M3</TableHead>
                            <TableHead className="text-center">M4</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => {
                            const getScore = (title: string) => {
                                const prog = user.progress.find(p => p.module.title.includes(title));
                                return prog?.score !== null && prog?.score !== undefined ? `${prog.score}%` : "-";
                            };

                            return (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.surname}, {user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.company}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.status === "ACTIVE" ? "default" : "secondary"}>
                                            {user.status === "ACTIVE" ? "Activo" : "Pendiente"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {user.createdAt ? user.createdAt.toLocaleDateString() : "---"}
                                    </TableCell>
                                    <TableCell className="text-center">{getScore("INTRO")}</TableCell>
                                    <TableCell className="text-center">{getScore("Modulo 1")}</TableCell>
                                    <TableCell className="text-center">{getScore("Modulo 2")}</TableCell>
                                    <TableCell className="text-center">{getScore("Modulo 3")}</TableCell>
                                    <TableCell className="text-center">{getScore("Modulo 4")}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <UserDetailDialog user={user} />
                                        {user.status === "PENDING" && (
                                            <ApproveUserButton userId={user.id} />
                                        )}
                                        <DeleteUserButton userId={user.id} />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
