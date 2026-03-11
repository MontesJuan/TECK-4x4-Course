require('dotenv').config({ path: '.env' });
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

async function testIntro() {
    const serviceAccountAuth = new JWT({
        email: process.env.GOOGLE_CLIENT_EMAIL,
        key: process.env.GOOGLE_PRIVATE_KEY ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n') : '',
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    await sheet.loadHeaderRow(3);
    
    // Add a test row
    await sheet.addRow({
        "Apellido": "Prueba",
        "Nombre": "Intro",
        "Email": "intro@prueba.com",
        "INTRO": "88.88%",
        "MODULO1": "77.77%"
    });
    console.log("Row added successfully!");
}
testIntro().catch(console.error);
