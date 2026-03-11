import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
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
    <main className="flex min-h-screen flex-col items-center justify-center relative bg-black text-zinc-50 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/teck-bg.png"
          alt="Offroad Background"
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </div>

      {/* Top Navigation / Logos */}
      <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-10">
        <Image
          src="/assets/logo-nielsen.png"
          alt="Nielsen Logo"
          width={180}
          height={60}
          className="object-contain"
        />
        <Image
          src="/assets/logo-teck.png"
          alt="Teck Logo"
          width={120}
          height={40}
          className="object-contain"
        />
      </div>

      {/* Hero Content */}
      <div className="z-10 space-y-8 text-center mt-12 px-4 max-w-3xl">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter drop-shadow-xl">
          Teck 4x4
        </h1>
        <p className="text-xl md:text-2xl text-zinc-300 font-light tracking-wide">
          Aula Virtual de Capacitación
        </p>
        <div className="pt-8">
          <Button
            size="lg"
            className="bg-white text-zinc-950 hover:bg-zinc-200 transition-all rounded-full px-8 py-6 text-lg font-medium tracking-wide shadow-2xl hover:scale-105"
            asChild
          >
            <Link href="/login">
              Ingresar a la Plataforma
            </Link>
          </Button>
        </div>
      </div>

      {/* Hidden Admin Login Trigger - Bottom Right */}
      <Link href="/login" className="absolute bottom-4 right-4 w-4 h-4 opacity-0 cursor-default z-20" title="Admin Access" aria-hidden="true">
        .
      </Link>
    </main>
  )
}
