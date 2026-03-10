import { Button } from "@/components/ui/button"
import { auth, signOut } from "@/auth"
import { redirect } from "next/navigation"

export default async function BlockedPage() {
    const session = await auth()

    if (!session || (session.user as any).role === "ADMIN") {
        redirect("/")
    }

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-zinc-950 px-4">
            <div className="max-w-md text-center space-y-6">
                <h1 className="text-3xl font-bold text-zinc-50">Acceso Pausado</h1>
                <p className="text-zinc-400">
                    Han pasado 48 horas desde tu ingreso a la plataforma. Tu acceso se encuentra temporalmente pausado para nuevas evaluaciones.
                </p>
                <p className="text-zinc-400">
                    Por favor, comunícate con el administrador para habilitar tu cuenta nuevamente y continuar.
                </p>
                <div className="pt-6 border-t border-zinc-800">
                    <form action={async () => {
                        "use server"
                        await signOut()
                    }}>
                        <Button type="submit" variant="destructive" className="w-full">
                            Cerrar Sesión
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
