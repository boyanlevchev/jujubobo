
import { GoogleSpreadsheet } from "google-spreadsheet";

require('dotenv').config();

// Config variables
const SPREADSHEET_ID = process.env.REACT_APP_SPREADSHEET_ID;
const SHEET_ID = process.env.REACT_APP_SHEET_ID;
const CLIENT_EMAIL = process.env.REACT_APP_GOOGLE_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.REACT_APP_GOOGLE_SERVICE_PRIVATE_KEY;

console.log(PRIVATE_KEY, "pk")

const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

export async function appendSpreadsheet(row, callback, showThanks, hideForm) {
  try {
    await doc.useServiceAccountAuth({
      client_email: CLIENT_EMAIL,
      private_key: PRIVATE_KEY
    });
    // loads document properties and worksheets
    await doc.loadInfo();

    const sheet = doc.sheetsById[SHEET_ID];
    sheet.addRow(row).then(result => {
      if (callback) { callback().then(res => {
        console.log(res)
        res.forEach(retrievedRow => {
          if (retrievedRow["First Name"] === row["First Name"]
            && retrievedRow["Last Name"] === row["Last Name"]
            && retrievedRow["Email"] === row["Email"]
            && retrievedRow["Address Street and Number"] === row["Address Street and Number"]
            && retrievedRow["Address Additional"] === row["Address Additional"]
            && retrievedRow["Address City"] === row["Address City"]
            && retrievedRow["Address Country"] === row["Address Country"]
            && retrievedRow["Address Zip Code"] === row["Address Zip Code"])
          {
            console.log("there's a match!")
            hideForm("form hidden");
            showThanks("thank-you");
          };
        })
      }) }
    })
    // console.log(result)
  } catch (e) {
    console.error('Error: ', e);
  }
};

export async function checkSpreadsheet() {
  try {
    await doc.useServiceAccountAuth({
      client_email: CLIENT_EMAIL,
      private_key: PRIVATE_KEY
    });
    // loads document properties and worksheets
    await doc.loadInfo();

    const sheet = doc.sheetsById[SHEET_ID];
    const result = await sheet.getRows();
    return result;
  } catch (e) {
    console.error('Error: ', e);
  }
};

// const row = {
//       "First Name": "e.target[0].value",
//       "Last Name": "e.target[1].value",
//       "Email": "e.target[2].value",
//       "Address Street and Number": "e.target[3].value",
//       "Address Additional": "",
//       "Address City": "e.target[5].value",
//       "Address Country": "e.target[6].value",
//       "Address Zip Code": "e.target[7].value"
//     }

// appendSpreadsheet(row, checkSpreadsheet, console.log, console.log)

export default {appendSpreadsheet, checkSpreadsheet};
