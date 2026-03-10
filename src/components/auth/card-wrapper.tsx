"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface CardWrapperProps {
    children: React.ReactNode
    headerLabel: string
    backButtonLabel: string
    backButtonHref: string
    showSocial?: boolean
}

export const CardWrapper = ({
    children,
    headerLabel,
    backButtonLabel,
    backButtonHref,
}: CardWrapperProps) => {
    return (
        <Card className="w-full shadow-2xl border-zinc-800 bg-black/40 backdrop-blur-sm text-zinc-100 p-2 md:p-6 rounded-2xl">
            <CardHeader>
                <div className="w-full flex flex-col gap-y-2 items-center justify-center">
                    <p className="text-zinc-400 text-sm text-center font-light uppercase tracking-widest">{headerLabel}</p>
                </div>
            </CardHeader>
            <CardContent>{children}</CardContent>
            <CardFooter>
                <Button variant="link" className="font-normal w-full text-zinc-400 hover:text-white transition-colors" size="sm" asChild>
                    <Link href={backButtonHref}>{backButtonLabel}</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
