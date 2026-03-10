"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { UserAnswersTable } from "./UserAnswersTable"

export const UserDetailDialog = ({ user }: { user: any }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                    <Eye className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Detalle de Evaluaciones: {user.surname}, {user.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Información de Inicio</h3>
                        <p className="text-sm text-muted-foreground">
                            Fecha de primer ingreso: <span className="font-medium text-foreground">{user.startedAt ? new Date(user.startedAt).toLocaleString() : "No ha ingresado aún"}</span>
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Respuestas de Evaluaciones Teoricas</h3>
                        {user.answers && user.answers.length > 0 ? (
                            <UserAnswersTable answers={user.answers} />
                        ) : (
                            <p className="text-sm text-muted-foreground italic">No hay evaluaciones registradas para este usuario.</p>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
