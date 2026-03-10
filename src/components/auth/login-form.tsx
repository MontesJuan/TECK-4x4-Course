"use client"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoginSchema } from "@/schemas"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { CardWrapper } from "@/components/auth/card-wrapper"
import { Button } from "@/components/ui/button"
import { useState, useTransition } from "react"
import { login } from "@/actions/login"
import { toast } from "sonner"
import { useSearchParams } from "next/navigation"

export const LoginForm = () => {
    const searchParams = useSearchParams()
    const errorUrl = searchParams.get("error") === "OAuthAccountNotLinked"
        ? "Email en uso con otro proveedor!"
        : ""

    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError("")
        setSuccess("")

        startTransition(() => {
            login(values).then((data) => {
                if (data?.error) {
                    form.reset()
                    setError(data.error)
                    toast.error(data.error)
                }
                // If success, next-auth redirects, so we don't need to do anything here usually.
            })
        })
    }

    return (
        <CardWrapper
            headerLabel="Bienvenido de nuevo"
            backButtonLabel="¿No tienes cuenta? Regístrate"
            backButtonHref="/register"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email (o Usuario para Admin)</FormLabel>
                                    <FormControl>
                                        <Input disabled={isPending} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contraseña</FormLabel>
                                    <FormControl>
                                        <Input disabled={isPending} type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={isPending} type="submit" className="w-full">
                        Ingresar
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}
