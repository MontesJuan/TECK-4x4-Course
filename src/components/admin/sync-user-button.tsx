"use client"

import { Button } from "@/components/ui/button"
import { syncUserToSheet } from "@/actions/admin"
import { toast } from "sonner"
import { useTransition } from "react"
import { FileSpreadsheet } from "lucide-react"

interface SyncUserButtonProps {
    userId: string
}

export const SyncUserButton = ({ userId }: SyncUserButtonProps) => {
    const [isPending, startTransition] = useTransition()

    const onClick = () => {
        startTransition(() => {
            syncUserToSheet(userId)
                .then((data) => {
                    if (data.error) {
                        toast.error(data.error)
                    }
                    if (data.success) {
                        toast.success(data.success)
                    }
                })
        })
    }

    return (
        <Button
            onClick={onClick}
            disabled={isPending}
            size="sm"
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800"
        >
            <FileSpreadsheet className="w-4 h-4 mr-1" />
            {isPending ? "..." : "+PLANILLA"}
        </Button>
    )
}
