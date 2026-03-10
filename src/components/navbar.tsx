import Link from "next/link"
import Image from "next/image"
import { UserButton } from "@/components/user-button"
import { Button } from "@/components/ui/button"
import { auth } from "@/auth"

export const Navbar = async () => {
    const session = await auth()

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md h-20 flex items-center px-4 sm:px-8 justify-between">
            <div className="flex items-center gap-x-8">
                <Link href="/dashboard" className="flex items-center gap-x-6 group">
                    <div className="relative h-10 w-32 transition-transform group-hover:scale-105">
                        <Image
                            src="/assets/logo-nielsen.png"
                            alt="Nielsen Logo"
                            fill
                            className="object-contain object-left filter brightness-0 invert"
                            priority
                        />
                    </div>
                    <div className="hidden sm:block border-l border-zinc-700 h-8"></div>
                    <div className="relative h-8 w-24 hidden sm:block transition-transform group-hover:scale-105">
                        <Image
                            src="/assets/logo-teck.png"
                            alt="Teck Logo"
                            fill
                            className="object-contain object-left"
                            priority
                        />
                    </div>
                </Link>
            </div>

            <div className="flex items-center gap-x-4">
                {session?.user?.role === "ADMIN" && (
                    <Button variant="ghost" asChild size="sm" className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                        <Link href="/admin/dashboard">Panel Admin</Link>
                    </Button>
                )}
                <UserButton user={session?.user} />
            </div>
        </nav>
    )
}
