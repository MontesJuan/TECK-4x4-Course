import { Button } from "@/components/ui/button"
import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

import Image from "next/image"

export default async function Home() {
  const session = await auth()

  if (session?.user) {
    if (session.user.role === "ADMIN") {
      redirect("/admin/dashboard")
    }
    redirect("/dashboard")
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900 to-slate-900 p-24 text-white relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0 opacity-20 bg-[url('/assets/pattern.png')] bg-cover bg-center mix-blend-overlay" />

      <div className="space-y-12 text-center z-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <div className="flex flex-col items-center gap-y-8">
          <div className="flex items-center gap-x-8 p-6 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl">
            <div className="relative h-20 w-44 transition-transform hover:scale-105 duration-500">
              <Image src="/assets/logo-teck.png" fill className="object-contain drop-shadow-xl" alt="Teck" priority />
            </div>
            <div className="h-16 w-[2px] bg-white/30 rounded-full" />
            <div className="relative h-24 w-48 transition-transform hover:scale-105 duration-500">
              <Image src="/assets/logo-nielsen.png" fill className="object-contain drop-shadow-xl" alt="Nielsen" priority />
            </div>
          </div>

          <div className="space-y-4 max-w-lg">
            <h1 className="text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 drop-shadow-sm">
              TECK - CURSO 4x4
            </h1>
            <p className="text-xl text-gray-200 font-light tracking-wide">
              Aula Virtual de Capacitación Profesional
            </p>
          </div>
        </div>

        <div>
          <Button variant="outline" size="lg" className="text-lg px-12 py-6 rounded-full border-white/20 bg-white/5 hover:bg-white/20 hover:text-white hover:border-white/50 transition-all duration-300 shadow-lg hover:shadow-primary/20 backdrop-blur-sm group" asChild>
            <Link href="/login" className="flex items-center gap-2">
              Ingresar a la Plataforma
              <span className="group-hover:translate-x-1 transition-transform">→</span>
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
