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
        <div className="flex h-screen bg-background text-foreground">
            <aside className="w-64 bg-card border-r border-border flex flex-col">
                <div className="p-6 border-b border-border">
                    <h1 className="text-xl font-bold">Panel Admin</h1>
                    <p className="text-xs text-muted-foreground">TECK - CURSO 4x4</p>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                        <Link href="/admin/dashboard">
                            <Users className="h-4 w-4" /> Usuarios
                        </Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                        <Link href="/admin/modules">
                            <BookOpen className="h-4 w-4" /> Módulos
                        </Link>
                    </Button>
                </nav>
                <div className="p-4 border-t border-border">
                    <Button variant="ghost" className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10" asChild>
                        <a href="/api/auth/signout">
                            <LogOut className="h-4 w-4" /> Salir
                        </a>
                    </Button>
                </div>
            </aside>
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    )
}
