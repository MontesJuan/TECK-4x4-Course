import { Suspense } from "react"
import { RegisterForm } from "@/components/auth/register-form"

export default function RegisterPage() {
    return (
        <div className="h-full flex items-center justify-center">
            <Suspense>
                <RegisterForm />
            </Suspense>
        </div>
    )
}
