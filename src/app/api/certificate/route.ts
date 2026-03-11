import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import QRCode from "qrcode"
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

    const totalScore = progress.reduce((acc, curr) => acc + (curr.score ?? 0), 0);
    const averageScore = modules.length > 0 ? totalScore / modules.length : 0;

    if (averageScore < 80) {
        return new NextResponse("Promedio insuficiente para obtener el certificado", { status: 403 })
    }

    // Load template
    const templatePath = path.join(process.cwd(), "public", "Certificado Teck.pdf")
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

    // Embed standard font to measure text width for perfect centering
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    const fontSize = 28
    const textWidth = helveticaFont.widthOfTextAtSize(fullName, fontSize)

    firstPage.drawText(fullName, {
        x: (width / 2) - (textWidth / 2), // Perfect horizontal centering
        y: (height / 2) + 5, // Raised by 20 points to float above the dotted line
        size: fontSize,
        font: helveticaFont,
        color: rgb(0.2, 0.2, 0.2), // Dark grey for a more elegant look
    })

    // Add DNI
    let dniRaw = user.cuil || "No informado"
    let parsedDni = dniRaw
    if (dniRaw !== "No informado") {
        const numbersOnly = dniRaw.replace(/\D/g, '')
        let dniNumbers = numbersOnly
        if (numbersOnly.length === 11) {
            dniNumbers = numbersOnly.substring(2, numbersOnly.length - 1)
        }
        if (dniNumbers.length >= 7 && dniNumbers.length <= 8) {
            parsedDni = dniNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        } else {
            parsedDni = dniNumbers || dniRaw
        }
    }

    const dniText = `DNI: ${parsedDni}`
    const helveticaRegular = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const dniFontSize = 10 // Letra chica
    const dniTextWidth = helveticaRegular.widthOfTextAtSize(dniText, dniFontSize)

    firstPage.drawText(dniText, {
        x: (width / 2) - (dniTextWidth / 2),
        y: (height / 2) - 12, // Espacio blanco justo debajo de la línea de punto (y antes del texto 'Ha participado...')
        size: dniFontSize,
        font: helveticaRegular,
        color: rgb(0.3, 0.3, 0.3),
    })

    const pdfBytes = await pdfDoc.save()

    return new NextResponse(Buffer.from(pdfBytes), {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="Certificado_${user.surname}.pdf"`,
        },
    })
}
