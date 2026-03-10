"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createModule, updateModule } from "@/actions/module"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { CardWrapper } from "@/components/auth/card-wrapper" // Not really wrapper, just card

const ModuleSchema = z.object({
    title: z.string().min(1, "Título requerido"),
    description: z.string().min(1, "Descripción requerida"),
    videoUrl: z.string().min(1, "URL de video requerida"),
    order: z.coerce.number().int().min(1, "Orden requerido")
})

interface AdminModuleFormProps {
    moduleId?: string
    initialData?: {
        title: string
        description: string | null
        videoUrl: string | null
        order: number
    }
}

export const AdminModuleForm = ({ moduleId, initialData }: AdminModuleFormProps) => {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof ModuleSchema>>({
        resolver: zodResolver(ModuleSchema) as any,
        defaultValues: {
            title: initialData?.title || "",
            description: initialData?.description || "",
            videoUrl: initialData?.videoUrl || "",
            order: initialData?.order || 1
        }
    })

    const onSubmit = (values: z.infer<typeof ModuleSchema>) => {
        startTransition(() => {
            if (moduleId) {
                updateModule(moduleId, values).then(data => {
                    if (data.error) toast.error(data.error)
                    if (data.success) toast.success(data.success)
                })
            } else {
                createModule(values).then(data => {
                    if (data.error) toast.error(data.error)
                    if (data.success) {
                        toast.success(data.success)
                        router.push("/admin/modules")
                    }
                })
            }
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 bg-white text-black p-6 rounded shadow max-w-2xl">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Título</FormLabel>
                            <FormControl><Input disabled={isPending} {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Descripción</FormLabel>
                            <FormControl><Textarea disabled={isPending} {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="videoUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Video URL</FormLabel>
                            <FormControl><Input disabled={isPending} {...field} placeholder="https://drive.google.com/..." /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="order"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Orden</FormLabel>
                            <FormControl><Input type="number" disabled={isPending} {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
                    <Button type="submit" disabled={isPending}>{moduleId ? "Guardar Cambios" : "Crear Módulo"}</Button>
                </div>
            </form>
        </Form>
    )
}
