import Link from "next/link"
import Image from "next/image"
import { UserButton } from "@/components/user-button"
import { Button } from "@/components/ui/button"
import { auth } from "@/auth"

export const Navbar = async () => {
    const session = await auth()

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 h-20 flex items-center px-8 lg:px-12 justify-between transition-all duration-300">
            <div className="flex items-center gap-x-8">
                <Link href="/dashboard" className="flex items-center gap-x-6 group">
                    {/* Teck Logo */}
                    <div className="relative h-10 w-24 transition-transform group-hover:scale-105">
                        <Image
                            src="/assets/logo-teck.png"
                            alt="Teck Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    {/* Divider */}
                    <div className="h-8 w-[1px] bg-border" />
                    {/* Nielsen Logo */}
                    <div className="relative h-12 w-28 transition-transform group-hover:scale-105">
                        <Image
                            src="/assets/logo-nielsen.png"
                            alt="Nielsen Logo"
                            fill
                            className="object-contain"
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
