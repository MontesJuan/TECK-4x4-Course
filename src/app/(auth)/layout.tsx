
const AuthLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <div className="h-full flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 to-slate-950 text-white">
            <div className="w-full h-full flex flex-col items-center justify-center p-4 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 z-0 opacity-20 bg-[url('/assets/pattern.png')] bg-cover bg-center mix-blend-overlay" />

                <div className="z-10 w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
                    {children}
                </div>

                <div className="absolute bottom-6 text-sm text-gray-400 z-10 text-center">
                    <p>&copy; {new Date().getFullYear()} Teck Resources & Nielsen Expediciones</p>
                </div>
            </div>
        </div>
    );
}

export default AuthLayout;
