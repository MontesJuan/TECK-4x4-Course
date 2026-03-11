import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

// Config variables
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

export const addToSheet = async (userData: any) => {
    if (!SPREADSHEET_ID || !GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY) {
        console.warn("Google Sheets credentials missing. Skipping sync.");
        return;
    }

    try {
        const serviceAccountAuth = new JWT({
            email: GOOGLE_CLIENT_EMAIL,
            key: GOOGLE_PRIVATE_KEY,
            scopes: [
                'https://www.googleapis.com/auth/spreadsheets',
            ],
        });

        const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);

        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0];
        await sheet.loadHeaderRow(3); // Headers at Row 3

        const rows = await sheet.getRows();

        const getScoreValue = (keyword: string) => {
            if (!userData.moduleScores) return null;
            const key = Object.keys(userData.moduleScores).find(k => k.toLowerCase().includes(keyword.toLowerCase()));
            if (keyword.toLowerCase() === "intro") {
                console.log("DEBUG getScoreValue for Intro:");
                console.log(" - moduleScores keys available:", Object.keys(userData.moduleScores));
                console.log(" - matched key:", key);
                console.log(" - value:", key ? userData.moduleScores[key] : "null");
            }
            return key ? userData.moduleScores[key] : null;
        };

        const getScoreString = (keyword: string) => {
            const val = getScoreValue(keyword);
            return val !== null ? `${val.toFixed(2)}%` : "";
        };

        const formatDateToDDMMYYYY = (dateValue: any) => {
            if (!dateValue || dateValue === "Pendiente") return "Pendiente";
            const date = new Date(dateValue);
            // Validating if parsing generated an invalid result. If so, return original.
            if (isNaN(date.getTime())) return String(dateValue);
            
            // Getting components and using local mapping if timezones matter
            // Let's use UTC getter for date to guarantee stable dates from strings like "2024-03-10T00:00:00.000Z"
            // Wait, standard Date uses local timezone. We'll add padding.
            const d = date.getDate().toString().padStart(2, '0');
            const m = (date.getMonth() + 1).toString().padStart(2, '0');
            const y = date.getFullYear();
            return `${d}/${m}/${y}`;
        };

        let totalScore = 0;
        let completedModules = 0;
        const modulesToCheck = ["Intro", "Modulo 1", "Modulo 2", "Modulo 3", "Modulo 4"];
        modulesToCheck.forEach(m => {
            const val = getScoreValue(m);
            if (val !== null) {
                totalScore += val;
                completedModules++;
            }
        });
        const average = completedModules > 0 ? (totalScore / completedModules) : 0;
        const averageStr = completedModules > 0 ? `${average.toFixed(2)}%` : "";

        const rowData: Record<string, any> = {
            "Apellido": userData.surname,
            "Nombre": userData.name,
            "CUIL/RUT": userData.cuil,
            "Teléfono": userData.phone,
            "Email": userData.email,
            "Empresa": userData.company,
            "Puesto": userData.position,
            "Tipo de Licencia": userData.licenseType,
            "Vencimiento": formatDateToDDMMYYYY(userData.licenseExpiry),
            "País": userData.country,
            "Provincia": userData.province,
            "Localidad": userData.city,
            "INTRO": getScoreString("Intro"),
            "MODULO1": getScoreString("Modulo 1"),
            "MODULO2": getScoreString("Modulo 2"),
            "MODULO3": getScoreString("Modulo 3"),
            "MODULO4": getScoreString("Modulo 4"),
            "PROMEDIO TOTAL": averageStr,
            "FECHA DE INICIO": formatDateToDDMMYYYY(userData.createdAt)
        };

        let targetRowIndex: number;
        const existingRow = rows.find(r => r.get('Email')?.trim().toLowerCase() === userData.email?.trim().toLowerCase());

        if (existingRow) {
            existingRow.assign(rowData);
            await existingRow.save();
            targetRowIndex = existingRow.rowNumber;
        } else {
            // Find first empty row (where Apellido and Email are missing)
            const emptyRow = rows.find(r => !r.get('Apellido') && !r.get('Email'));
            if (emptyRow) {
                emptyRow.assign(rowData);
                await emptyRow.save();
                targetRowIndex = emptyRow.rowNumber;
            } else {
                const newRow = await sheet.addRow(rowData);
                targetRowIndex = newRow.rowNumber;
            }
        }

        try {
            await sheet.loadCells(`A${targetRowIndex}:S${targetRowIndex}`);
            for (let i = 0; i < 19; i++) {
                const cell = sheet.getCell(targetRowIndex - 1, i);
                cell.textFormat = { foregroundColor: { red: 0, green: 0, blue: 0 } };
            }
            await sheet.saveUpdatedCells();
            console.log(`Updated formatting to black for row ${targetRowIndex}`);
        } catch (colorError) {
            console.error("Error setting color format:", colorError);
        }

    } catch (e) {
        console.error("Error syncing to Google Sheet:", e);
    }
}
