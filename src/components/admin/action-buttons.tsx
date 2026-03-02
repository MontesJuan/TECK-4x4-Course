"use client"

import { Button } from "@/components/ui/button"
import { approveUser, deleteUser, unblockUser } from "@/actions/admin"
import { toast } from "sonner"
import { useTransition } from "react"
import { Check, Trash, Unlock } from "lucide-react"

export const ApproveUserButton = ({ userId }: { userId: string }) => {
    const [isPending, startTransition] = useTransition()

    const onClick = () => {
        startTransition(() => {
            approveUser(userId).then(data => {
                if (data.error) toast.error(data.error)
                if (data.success) toast.success(data.success)
            })
        })
    }

    return (
        <Button
            onClick={onClick}
            disabled={isPending}
            size="sm"
            variant="ghost"
            className="text-green-600 hover:text-green-700 hover:bg-green-50"
        >
            <Check className="h-4 w-4" />
        </Button>
    )
}

export const DeleteUserButton = ({ userId }: { userId: string }) => {
    const [isPending, startTransition] = useTransition()

    const onClick = () => {
        if (!confirm("Are you sure?")) return

        startTransition(() => {
            deleteUser(userId).then(data => {
                if (data.error) toast.error(data.error)
                if (data.success) toast.success(data.success)
            })
        })
    }

    return (
        <Button
            onClick={onClick}
            disabled={isPending}
            size="sm"
            variant="ghost"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
            <Trash className="h-4 w-4" />
        </Button>
    )
}

export const UnblockUserButton = ({ userId }: { userId: string }) => {
    const [isPending, startTransition] = useTransition()

    const onClick = () => {
        startTransition(() => {
            unblockUser(userId).then(data => {
                if (data.error) toast.error(data.error)
                if (data.success) toast.success(data.success)
            })
        })
    }

    return (
        <Button
            onClick={onClick}
            disabled={isPending}
            size="sm"
            variant="outline"
            className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 border-yellow-200"
            title="Desbloquear por 48hs"
        >
            <Unlock className="h-4 w-4 mr-2" /> Desbloquear +48hs
        </Button>
    )
}
