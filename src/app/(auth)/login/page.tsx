import { Suspense } from "react"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
    return (
        <div className="h-full flex items-center justify-center">
            <Suspense>
                <LoginForm />
            </Suspense>
        </div>
    )
}
