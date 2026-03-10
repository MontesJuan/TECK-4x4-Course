import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Users, BookOpen, LogOut } from "lucide-react"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    if (session?.user.role !== "ADMIN") {
        redirect("/dashboard")
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-black text-zinc-50 overflow-hidden">
            <aside className="w-full md:w-64 bg-zinc-950/80 backdrop-blur-xl border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col z-20">
                <div className="p-6 border-b border-zinc-800 flex flex-col gap-2">
                    <div className="flex flex-col gap-4">
                        <img
                            src="/assets/logo-nielsen.png"
                            alt="Nielsen Logo"
                            className="w-32 object-contain filter brightness-0 invert"
                        />
                        <img
                            src="/assets/logo-teck.png"
                            alt="Teck Logo"
                            className="w-24 object-contain filter brightness-0 invert"
                        />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <h1 className="text-xl font-bold tracking-tight text-white">Panel Admin</h1>
                    </div>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-zinc-800/50 hover:text-white text-zinc-300" asChild>
                        <Link href="/admin/dashboard">
                            <Users className="h-5 w-5" /> Usuarios
                        </Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-zinc-800/50 hover:text-white text-zinc-300" asChild>
                        <Link href="/admin/modules">
                            <BookOpen className="h-5 w-5" /> Módulos
                        </Link>
                    </Button>
                </nav>
                <div className="p-4 border-t border-zinc-800">
                    <Button variant="ghost" className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-950/50" asChild>
                        <a href="/api/auth/signout">
                            <LogOut className="h-5 w-5" /> Salir
                        </a>
                    </Button>
                </div>
            </aside>
            <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
                {/* Internal Subtle Background Overlay */}
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-tr from-zinc-900 to-black" />
                </div>
                <div className="relative z-10 w-full">
                    {children}
                </div>
            </main>
        </div>
    )
}
