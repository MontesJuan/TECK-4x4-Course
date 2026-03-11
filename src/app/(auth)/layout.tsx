
const AuthLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <div className="min-h-screen flex text-zinc-50 bg-black overflow-hidden selection:bg-zinc-800">
            <div className="w-full flex">
                {/* Left Side - Visual */}
                <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/assets/teck-bg.png"
                            alt="Background offroad"
                            className="w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                    </div>

                    {/* Logos at top left */}
                    <div className="relative z-20 flex flex-col gap-6">
                        <img
                            src="/assets/logo-nielsen.png"
                            alt="Nielsen Logo"
                            className="w-48 object-contain"
                        />
                        <img
                            src="/assets/logo-teck.png"
                            alt="Teck Logo"
                            className="w-32 object-contain"
                        />
                    </div>

                    <div className="relative z-20 mt-auto max-w-lg">
                        <h2 className="text-4xl font-bold tracking-tight mb-4 text-white drop-shadow-lg">
                            Capacitación Especializada en Manejo 4x4
                        </h2>
                        <blockquote className="space-y-2 border-l-4 border-zinc-500 pl-4 mt-8">
                            <p className="text-lg text-zinc-300 font-light leading-relaxed">
                                &ldquo;La seguridad y la excelencia operativa son los pilares fundamentales de nuestra preparación en terreno.&rdquo;
                            </p>
                        </blockquote>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-zinc-950 relative">
                    {/* Mobile Logos (hidden on desktop) */}
                    <div className="absolute top-8 left-8 flex flex-col gap-4 lg:hidden z-20">
                        <img
                            src="/assets/logo-nielsen.png"
                            alt="Nielsen Logo"
                            className="w-32 object-contain"
                        />
                        <img
                            src="/assets/logo-teck.png"
                            alt="Teck Logo"
                            className="w-24 object-contain"
                        />
                    </div>

                    <div className="w-full max-w-md space-y-8 z-10 pt-24 lg:pt-0">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthLayout;
