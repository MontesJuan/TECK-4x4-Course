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
import { ApproveUserButton, DeleteUserButton, UnblockUserButton } from "@/components/admin/action-buttons"
import { SyncUserButton } from "@/components/admin/sync-user-button"

export default async function AdminDashboardPage() {
    // Check auth in layout, but double check usually good or layout handles it.

    const modules = await prisma.module.findMany({
        orderBy: { order: "asc" }
    })

    const users = await prisma.user.findMany({
        where: { role: "USER" },
        orderBy: { createdAt: "desc" },
        include: {
            progress: {
                include: { module: true }
            }
        }
    })

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Gestión de Alumnos</h1>

            <div className="bg-card rounded-md shadow border overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Empresa</TableHead>
                            <TableHead>Estado</TableHead>
                            {modules.map(module => (
                                <TableHead key={module.id} className="text-center text-xs w-24">
                                    {module.title}
                                </TableHead>
                            ))}
                            <TableHead className="text-center text-xs font-bold">Total</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => {
                            // Calculate scores
                            const scores = modules.map(m => {
                                const prog = user.progress.find(p => p.moduleId === m.id)
                                return prog && prog.score ? prog.score : 0
                            })

                            const totalScore = scores.reduce((a, b) => a + b, 0)
                            const totalAverage = modules.length > 0 ? (totalScore / modules.length).toFixed(1) : "0"

                            return (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium whitespace-nowrap">{user.surname}, {user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.company}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.status === "ACTIVE" ? (user.evaluationValidUntil && new Date() > user.evaluationValidUntil ? "destructive" : "default") : "secondary"}>
                                            {user.status === "ACTIVE" ? (user.evaluationValidUntil && new Date() > user.evaluationValidUntil ? "Pausado (Tiempo)" : "Activo") : "Pendiente"}
                                        </Badge>
                                    </TableCell>

                                    {/* Module Scores */}
                                    {modules.map(module => {
                                        const prog = user.progress.find(p => p.moduleId === module.id)
                                        const hasScore = prog && prog.score !== null
                                        return (
                                            <TableCell key={module.id} className="text-center text-xs">
                                                {hasScore ? (
                                                    <span className={prog.score! >= 80 ? "text-green-500 font-bold" : "text-red-500"}>
                                                        {prog.score!.toFixed(0)}%
                                                    </span>
                                                ) : (
                                                    <span className="text-muted-foreground">-</span>
                                                )}
                                            </TableCell>
                                        )
                                    })}

                                    {/* Total Average */}
                                    <TableCell className="text-center font-bold text-sm">
                                        {totalAverage}%
                                    </TableCell>

                                    <TableCell className="text-right space-x-2 whitespace-nowrap">
                                        <SyncUserButton userId={user.id} />
                                        {user.status === "PENDING" && (
                                            <ApproveUserButton userId={user.id} />
                                        )}
                                        {user.status === "ACTIVE" && user.evaluationValidUntil && new Date() > user.evaluationValidUntil && (
                                            <UnblockUserButton userId={user.id} />
                                        )}
                                        <DeleteUserButton userId={user.id} />
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
