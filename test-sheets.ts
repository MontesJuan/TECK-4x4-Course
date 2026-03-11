import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

async function main() {
    const serviceAccountAuth = new JWT({
        email: GOOGLE_CLIENT_EMAIL,
        key: GOOGLE_PRIVATE_KEY,
        scopes: [
            'https://www.googleapis.com/auth/spreadsheets',
        ],
    });

    const doc = new GoogleSpreadsheet(SPREADSHEET_ID!, serviceAccountAuth);

    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    await sheet.loadHeaderRow(3);

    console.log("Adding a test row...");
    const newRow = await sheet.addRow({ "Apellido": "TestColor", "Nombre": "TestColor" });
    const targetRowIndex = newRow.rowNumber;
    console.log("Row added at index", targetRowIndex);

    await sheet.loadCells(`A${targetRowIndex}:S${targetRowIndex}`);
    for (let i = 0; i < 19; i++) {
        const cell = sheet.getCell(targetRowIndex - 1, i);
        cell.textFormat = { foregroundColor: { red: 0, green: 0, blue: 0 } };
    }
    await sheet.saveUpdatedCells();
    console.log("Cells color updated to black");
    
    // cleanup
    await newRow.delete();
    console.log("Test row deleted.");
}

main().catch(console.error);
