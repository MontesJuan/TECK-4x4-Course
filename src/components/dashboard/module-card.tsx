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
    type: "LOCKED" | "UNLOCKED" | "COMPLETED"
}

export const ModuleCard = ({ id, title, description, order, type }: ModuleCardProps) => {
    const isLocked = type === "LOCKED"
    const isCompleted = type === "COMPLETED"

    return (
        <Card className={`w-full bg-zinc-900 border-zinc-800 text-zinc-100 overflow-hidden ${isLocked ? "opacity-60 grayscale-[50%]" : "hover:border-zinc-700 hover:shadow-2xl hover:shadow-black/50 transition-all duration-300"}`}>
            <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-2">
                    <Badge className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700" variant={isCompleted ? "default" : (isLocked ? "secondary" : "outline")}>
                        {isCompleted ? "Completado" : (isLocked ? "Bloqueado" : "Disponible")}
                    </Badge>
                    <span className="text-sm text-zinc-500 font-mono tracking-widest uppercase">Módulo {order}</span>
                </div>
                <CardTitle className="mt-2 text-2xl font-bold tracking-tight text-white">{title}</CardTitle>
                <CardDescription className="line-clamp-2 text-zinc-400 mt-2 text-base">{description}</CardDescription>
            </CardHeader>
            <CardFooter>
                {isLocked ? (
                    <Button disabled className="w-full">
                        <Lock className="mr-2 h-4 w-4" /> Bloqueado
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
