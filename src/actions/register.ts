"use server"

import * as z from "zod"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { RegisterSchema } from "@/schemas"
import { Resend } from "resend"
import { addToSheet } from "@/lib/google-sheets"

const resend = new Resend(process.env.RESEN_API_KEY)

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: "Campos inválidos!" }
    }

    const { email, password, name, surname, cuil, phone, company, position, licenseType, licenseExpiry, country, province, city } = validatedFields.data
    const hashedPassword = await bcrypt.hash(password, 10)

    const existingUser = await prisma.user.findUnique({
        where: {
            email,
        },
    })

    if (existingUser) {
        return { error: "El email ya está en uso!" }
    }

    try {
        const user = await prisma.user.create({
            data: {
                name,
                surname,
                email,
                password: hashedPassword,
                cuil,
                phone,
                company,
                position,
                licenseType,
                licenseExpiry: new Date(licenseExpiry),
                country,
                province,
                city,
                status: "PENDING",
            },
        })

        // Add to Google Sheets (TODO: Implement syncing logic here or via webhook/queue)
        // Send verification email to admin
        try {
            if (process.env.RESEND_API_KEY) {
                await resend.emails.send({
                    from: "onboarding@resend.dev", // Update with verified domain
                    to: "capacitacion4x4@nielsenexpediciones.com.ar",
                    subject: "Nuevo Registro de Usuario - TEC 4x4",
                    html: `<p>Nuevo usuario registrado: ${name} ${surname} (${email})</p><p>Empresa: ${company}</p><p>Estado: PENDIENTE APROBACIÓN</p>`,
                })
            }
        } catch (emailError) {
            console.error("Error sending email:", emailError)
            // Continue even if email fails, but maybe log it properly
        }


        return { success: "Usuario registrado! Pendiente de aprobación." }
    } catch (error) {
        console.error(error)
        return { error: "Algo salió mal!" }
    }
}
