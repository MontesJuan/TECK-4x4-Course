import { Navbar } from "@/components/navbar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="h-full min-h-screen flex flex-col bg-zinc-950 text-zinc-50 selection:bg-zinc-800">
            <Navbar />
            <div className="flex-1 max-w-7xl mx-auto w-full py-8 px-4 sm:px-6 lg:px-8">
                {children}
            </div>
        </div>
    )
}
