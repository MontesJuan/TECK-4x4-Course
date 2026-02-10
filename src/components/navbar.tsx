import Link from "next/link"
import { UserButton } from "@/components/user-button"
import { Button } from "@/components/ui/button"
import { auth } from "@/auth"

export const Navbar = async () => {
    const session = await auth()

    return (
        <nav className="border-b bg-background h-16 flex items-center px-8 justify-between">
            <div className="flex items-center gap-x-4">
                <Link href="/dashboard" className="text-2xl font-bold">
                    TEC 4x4
                </Link>
                {session?.user?.role === "ADMIN" && (
                    <Button variant="outline" asChild size="sm">
                        <Link href="/admin/dashboard">Panel Admin</Link>
                    </Button>
                )}
            </div>

            <div className="flex items-center gap-x-4">
                <UserButton user={session?.user} />
            </div>
        </nav>
    )
}
