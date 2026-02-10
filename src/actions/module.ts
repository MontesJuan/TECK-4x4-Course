"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const ModuleSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    videoUrl: z.string().min(1),
    order: z.coerce.number().int().min(1)
})

export const createModule = async (values: z.infer<typeof ModuleSchema>) => {
    const session = await auth()
    if (session?.user.role !== "ADMIN") return { error: "Unauthorized" }

    const validated = ModuleSchema.safeParse(values)
    if (!validated.success) return { error: "Invalid fields" }

    await prisma.module.create({
        data: validated.data
    })

    revalidatePath("/admin/modules")
    return { success: "Módulo creado" }
}

export const updateModule = async (id: string, values: z.infer<typeof ModuleSchema>) => {
    const session = await auth()
    if (session?.user.role !== "ADMIN") return { error: "Unauthorized" }

    const validated = ModuleSchema.safeParse(values)
    if (!validated.success) return { error: "Invalid fields" }

    await prisma.module.update({
        where: { id },
        data: validated.data
    })

    revalidatePath("/admin/modules")
    return { success: "Módulo actualizado" }
}

// TODO: Materials and Questions CRUD
export const addMaterial = async (moduleId: string, title: string, fileUrl: string) => {
    const session = await auth()
    if (session?.user.role !== "ADMIN") return { error: "Unauthorized" }

    await prisma.material.create({
        data: {
            title,
            fileUrl,
            moduleId
        }
    })
    revalidatePath(`/admin/modules/${moduleId}`)
    return { success: "Material agregado" }
}

export const deleteMaterial = async (materialId: string) => {
    const session = await auth()
    if (session?.user.role !== "ADMIN") return { error: "Unauthorized" }

    await prisma.material.delete({ where: { id: materialId } })
    return { success: "Material eliminado" }
}
