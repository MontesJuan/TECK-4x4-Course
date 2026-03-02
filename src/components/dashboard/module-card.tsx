import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Lock, PlayCircle, CheckCircle } from "lucide-react"

interface ModuleCardProps {
    id: string
    title: string
    description: string
    order: number
    type: "LOCKED" | "UNLOCKED" | "COMPLETED" | "LOCKED_TIME"
}

export const ModuleCard = ({ id, title, description, order, type }: ModuleCardProps) => {
    const isLockedTime = type === "LOCKED_TIME"
    const isLocked = type === "LOCKED" || isLockedTime
    const isCompleted = type === "COMPLETED"

    return (
        <Card className={`w-full ${isLocked ? "opacity-50 grayscale bg-muted/20 border-white/5" : "hover:border-primary/50 hover:shadow-lg transition-all duration-300 bg-card"}`}>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <Badge variant={isCompleted ? "default" : (isLockedTime ? "destructive" : (isLocked ? "secondary" : "outline"))}>
                        {isCompleted ? "Completado" : (isLockedTime ? "Pausado por Tiempo" : (isLocked ? "Bloqueado" : "Disponible"))}
                    </Badge>
                    <span className="text-sm text-muted-foreground font-mono">Módulo {order}</span>
                </div>
                <CardTitle className="mt-2 text-xl">{title}</CardTitle>
                <CardDescription className="line-clamp-2">{description}</CardDescription>
            </CardHeader>
            <CardFooter>
                {isLocked ? (
                    <Button disabled className="w-full" variant={isLockedTime ? "destructive" : "default"}>
                        <Lock className="mr-2 h-4 w-4" /> {isLockedTime ? "Tiempo Expirado" : "Bloqueado"}
                    </Button>
                ) : (
                    <Button asChild className="w-full" variant={isCompleted ? "outline" : "default"}>
                        <Link href={`/dashboard/module/${id}`}>
                            {isCompleted ? (
                                <>
                                    <CheckCircle className="mr-2 h-4 w-4" /> Repasar
                                </>
                            ) : (
                                <>
                                    <PlayCircle className="mr-2 h-4 w-4" /> Iniciar
                                </>
                            )}
                        </Link>
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}
