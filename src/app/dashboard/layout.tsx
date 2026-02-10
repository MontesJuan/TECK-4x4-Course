import { Navbar } from "@/components/navbar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="h-full min-h-screen flex flex-col bg-slate-50">
            <Navbar />
            <div className="flex-1 container mx-auto py-6">
                {children}
            </div>
        </div>
    )
}
