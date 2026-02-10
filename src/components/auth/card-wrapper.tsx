"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

import Image from "next/image"

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
        <Card className="w-[400px] shadow-2xl border-white/10 bg-black/30 backdrop-blur-md text-white">
            <CardHeader>
                <div className="w-full flex flex-col gap-y-6 items-center justify-center">
                    <div className="flex items-center gap-x-4 justify-center w-full">
                        <div className="relative h-12 w-28">
                            <Image src="/assets/logo-teck.png" fill className="object-contain" alt="Teck" priority />
                        </div>
                        <div className="h-8 w-[1px] bg-border/60" />
                        <div className="relative h-14 w-32">
                            <Image src="/assets/logo-nielsen.png" fill className="object-contain" alt="Nielsen" priority />
                        </div>
                    </div>
                    <p className="text-muted-foreground text-sm font-medium">{headerLabel}</p>
                </div>
            </CardHeader>
            <CardContent>{children}</CardContent>
            <CardFooter>
                <Button variant="link" className="font-normal w-full text-white/80 hover:text-white" size="sm" asChild>
                    <Link href={backButtonHref}>{backButtonLabel}</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
