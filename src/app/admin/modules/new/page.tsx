import { AdminModuleForm } from "@/components/admin/module-form"

export default function NewModulePage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Nuevo Módulo</h1>
            <AdminModuleForm />
        </div>
    )
}
