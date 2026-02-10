
import { addToSheet } from "@/lib/google-sheets";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const testUser = {
            name: "API_TEST",
            surname: "DebugRoute",
            email: "debug-route@test.com",
            cuil: "20-99999999-9",
            phone: "1122334455",
            company: "Debug Inc",
            position: "Debugger",
            licenseType: "B1",
            licenseExpiry: new Date(),
            country: "Argentina",
            province: "Virtual",
            city: "Cloud",
            status: "DEBUG"
        };

        console.log("Testing Google Sheet Sync from API Route...");
        await addToSheet(testUser);

        return NextResponse.json({ success: true, message: "Sync successful" });
    } catch (error: any) {
        console.error("API Route Sync Error:", error);
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
