"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export const UserAnswersTable = ({ answers }: { answers: any[] }) => {
    return (
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Pregunta</TableHead>
                        <TableHead>Respuesta Elegida</TableHead>
                        <TableHead>Resultado</TableHead>
                        <TableHead>Fecha</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {answers.map((answer) => (
                        <TableRow key={answer.id}>
                            <TableCell className="max-w-[300px] truncate" title={answer.question.text}>
                                {answer.question.text}
                            </TableCell>
                            <TableCell>{answer.option.text}</TableCell>
                            <TableCell>
                                <Badge variant={answer.isCorrect ? "default" : "destructive"}>
                                    {answer.isCorrect ? "Correcto" : "Incorrecto"}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                                {new Date(answer.createdAt).toLocaleDateString()}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
