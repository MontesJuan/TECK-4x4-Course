"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { addMaterial, deleteMaterial } from "@/actions/module"
import { toast } from "sonner"
import { Trash, Plus } from "lucide-react"

interface Material {
    id: string
    title: string
    fileUrl: string
}

export const MaterialsManager = ({ moduleId, materials }: { moduleId: string, materials: Material[] }) => {
    const [isPending, startTransition] = useTransition()
    const [title, setTitle] = useState("")
    const [url, setUrl] = useState("")

    const handleAdd = () => {
        if (!title || !url) return
        startTransition(() => {
            addMaterial(moduleId, title, url).then(data => {
                if (data.success) {
                    toast.success("Material agregado")
                    setTitle("")
                    setUrl("")
                }
            })
        })
    }

    const handleDelete = (id: string) => {
        startTransition(() => {
            deleteMaterial(id).then(data => {
                if (data.success) toast.success("Material eliminado")
            })
        })
    }

    return (
        <div className="space-y-4 bg-white text-zinc-950 p-6 rounded shadow max-w-2xl mt-6">
            <h3 className="text-lg font-semibold">Materiales de Estudio</h3>

            <div className="space-y-2">
                {materials.map(m => (
                    <div key={m.id} className="flex items-center justify-between p-2 border rounded">
                        <div>
                            <p className="font-medium">{m.title}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[300px]">{m.fileUrl}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(m.id)} disabled={isPending}>
                            <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                    </div>
                ))}
            </div>

            <div className="flex gap-2 items-end border-t pt-4">
                <div className="flex-1">
                    <p className="text-sm mb-1">Título</p>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej. Guía PDF" />
                </div>
                <div className="flex-1">
                    <p className="text-sm mb-1">URL (Drive/Archivo)</p>
                    <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
                </div>
                <Button onClick={handleAdd} disabled={isPending || !title || !url}>
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
