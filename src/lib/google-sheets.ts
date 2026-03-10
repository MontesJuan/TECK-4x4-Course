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
            return key ? userData.moduleScores[key] : null;
        };

        const getScoreString = (keyword: string) => {
            const val = getScoreValue(keyword);
            return val !== null ? `${val.toFixed(2)}%` : "";
        };

        let totalScore = 0;
        let completedModules = 0;
        const modulesToCheck = ["Modulo 1", "Modulo 2", "Modulo 3", "Modulo 4", "Modulo 5"];
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
            "Vencimiento": userData.licenseExpiry instanceof Date ? userData.licenseExpiry.toISOString().split('T')[0] : userData.licenseExpiry,
            "País": userData.country,
            "Provincia": userData.province,
            "Localidad": userData.city,
            "MODULO1": getScoreString("Modulo 1"),
            "MODULO2": getScoreString("Modulo 2"),
            "MODULO3": getScoreString("Modulo 3"),
            "MODULO4": getScoreString("Modulo 4"),
            "MODULO5": getScoreString("Modulo 5"),
            "PROMEDIO TOTAL": averageStr,
            "FECHA DE INICIO": userData.createdAt ? (userData.createdAt instanceof Date ? userData.createdAt.toISOString().split('T')[0] : userData.createdAt) : "Pendiente"
        };

        // Find existing row by email
        const existingRow = rows.find(r => r.get('Email') === userData.email);

        if (existingRow) {
            existingRow.assign(rowData);
            await existingRow.save();
        } else {
            // Find first empty row (where Apellido and Email are missing)
            const emptyRow = rows.find(r => !r.get('Apellido') && !r.get('Email'));
            if (emptyRow) {
                emptyRow.assign(rowData);
                await emptyRow.save();
            } else {
                await sheet.addRow(rowData);
            }
        }

    } catch (e) {
        console.error("Error syncing to Google Sheet:", e);
    }
}
