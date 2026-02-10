import { Navbar } from "@/components/navbar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="h-full min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-1 container mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {children}
            </div>
        </div>
    )
}
