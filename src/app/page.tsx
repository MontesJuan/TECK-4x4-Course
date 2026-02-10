import { Button } from "@/components/ui/button"
import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function Home() {
  const session = await auth()

  if (session?.user) {
    if (session.user.role === "ADMIN") {
      redirect("/admin/dashboard")
    }
    redirect("/dashboard")
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800 p-24 text-white relative">
      <div className="space-y-6 text-center">
        <h1 className="text-6xl font-semibold drop-shadow-md">
          TEC 4x4
        </h1>
        <p className="text-lg">
          Aula Virtual de Capacitación
        </p>
        <div>
          <Button variant="secondary" size="lg" asChild>
            <Link href="/login">
              Ingresar a la Plataforma
            </Link>
          </Button>
        </div>
      </div>

      {/* Hidden Admin Login Trigger - Bottom Right */}
      <Link href="/login" className="absolute bottom-0 right-0 w-4 h-4 opacity-0 cursor-default" title="Admin Access" aria-hidden="true">
        .
      </Link>
    </main>
  )
}
