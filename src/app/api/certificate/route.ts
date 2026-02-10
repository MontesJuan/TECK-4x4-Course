import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { PDFDocument, rgb } from "pdf-lib"
import fs from "fs"
import path from "path"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    const session = await auth()
    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    // Check completion
    // We can assume if they are requesting it, they completed it? Or we should verify.
    // Let's verify.
    const modules = await prisma.module.findMany({ select: { id: true } })
    const progress = await prisma.userProgress.findMany({
        where: { userId: session.user.id, completed: true }
    })

    if (progress.length < modules.length) {
        return new NextResponse("Curso no completado", { status: 403 })
    }

    // Load template
    const templatePath = path.join(process.cwd(), "public", "certificate-template.pdf")
    if (!fs.existsSync(templatePath)) {
        return new NextResponse("Template not found", { status: 500 })
    }
    const templateBytes = fs.readFileSync(templatePath)

    const pdfDoc = await PDFDocument.load(templateBytes)
    const pages = pdfDoc.getPages()
    const firstPage = pages[0]
    const { width, height } = firstPage.getSize()

    // Add Name
    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user) return new NextResponse("User not found", { status: 404 })

    const fullName = `${user.name} ${user.surname}`.toUpperCase()

    // Draw Name centered (approximate coordinates, need adjustment based on template)
    // Assuming template has space in the middle.
    // I will put it at strict coordinates or guess center.
    // Prompt didn't specify coordinates... I'll guess center-ish.
    // Or users usually want it big.

    firstPage.drawText(fullName, {
        x: width / 2 - (fullName.length * 10), // Rough centering
        y: height / 2 + 50, // Slightly above center? Or below?
        size: 30,
        color: rgb(0, 0, 0),
    })

    const pdfBytes = await pdfDoc.save()

    return new NextResponse(Buffer.from(pdfBytes), {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="Certificado_${user.surname}.pdf"`,
        },
    })
}
