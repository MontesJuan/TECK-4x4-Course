import * as z from "zod"

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Email is required",
    }),
    password: z.string().min(1, {
        message: "Password is required",
    }),
})

export const RegisterSchema = z.object({
    email: z.string().email({ message: "Email inválido" }),
    password: z.string().min(6, { message: "Mínimo 6 caracteres" }),
    name: z.string().min(1, { message: "Nombre es requerido" }),
    surname: z.string().min(1, { message: "Apellido es requerido" }),
    cuil: z.string().min(1, { message: "CUIL/RUT es requerido" }),
    phone: z.string().min(1, { message: "Teléfono es requerido" }),
    company: z.string().min(1, { message: "Empresa es requerida" }),
    position: z.string().min(1, { message: "Puesto es requerido" }),
    licenseType: z.string().min(1, { message: "Tipo de licencia es requerido" }),
    licenseExpiry: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Fecha inválida",
    }),
    country: z.string().min(1, { message: "País es requerido" }),
    province: z.string().min(1, { message: "Provincia es requerida" }),
    city: z.string().min(1, { message: "Localidad es requerida" }),
})
