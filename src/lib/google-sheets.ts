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
        let targetRow;

        // Find first empty row (where Apellido is missing)
        for (const row of rows) {
            if (!row.get('Apellido')) {
                targetRow = row;
                break;
            }
        }

        if (targetRow) {
            targetRow.assign({
                "Apellido": userData.surname,
                "Nombre": userData.name,
                "CUIL/RUT": userData.cuil,
                "Teléfono": userData.phone,
                "Email": userData.email,
                "Empresa": userData.company,
                "Puesto": userData.position,
                "Tipo de Licencia": userData.licenseType,
                "Vencimiento": userData.licenseExpiry.toISOString().split('T')[0],
                "País": userData.country,
                "Provincia": userData.province,
                "Localidad": userData.city,
                "Estado": "PENDIENTE"
            });
            await targetRow.save();
        } else {
            // Fallback if no empty rows found
            await sheet.addRow({
                "Apellido": userData.surname,
                "Nombre": userData.name,
                "CUIL/RUT": userData.cuil,
                "Teléfono": userData.phone,
                "Email": userData.email,
                "Empresa": userData.company,
                "Puesto": userData.position,
                "Tipo de Licencia": userData.licenseType,
                "Vencimiento": userData.licenseExpiry.toISOString().split('T')[0],
                "País": userData.country,
                "Provincia": userData.province,
                "Localidad": userData.city,
                "Estado": "PENDIENTE"
            });
        }

    } catch (e) {
        console.error("Error syncing to Google Sheet:", e);
    }
}
