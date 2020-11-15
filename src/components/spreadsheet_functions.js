
import { GoogleSpreadsheet } from "google-spreadsheet";

require('dotenv').config();

// Config variables
// const SPREADSHEET_ID = process.env.REACT_APP_SPREADSHEET_ID;
// const SHEET_ID = process.env.REACT_APP_SHEET_ID;
// const CLIENT_EMAIL = process.env.REACT_APP_GOOGLE_CLIENT_EMAIL;
// const PRIVATE_KEY = process.env.REACT_APP_GOOGLE_SERVICE_PRIVATE_KEY;

const SPREADSHEET_ID = process.env.REACT_APP_SPREADSHEET_ID;
const SHEET_ID = process.env.REACT_APP_SHEET_ID;
const CLIENT_EMAIL = process.env.REACT_APP_GOOGLE_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.REACT_APP_GOOGLE_SERVICE_PRIVATE_KEY;

const doc = new GoogleSpreadsheet("1dIZEx5ifKIZPgmKQ7DMpebTNOX1UhN6acCl7yZZ4xLI");


// console.log(SHEET_ID)
// console.log(CLIENT_EMAIL)
// console.log(SPREADSHEET_ID)
// console.log(PRIVATE_KEY)


export const scrollToTop = () => {
  const c = document.documentElement.scrollTop || document.body.scrollTop;
  if (c > 0) {
    window.requestAnimationFrame(scrollToTop);
    window.scrollTo(0, c - c / 12);
  }
};


export async function appendSpreadsheet(row, callback, showThanks, hideForm) {
  try {
    await doc.useServiceAccountAuth({
      client_email: "weeding-spreadsheet@wedding-spreadsheet-293619.iam.gserviceaccount.com",
      private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC0ozQbf/HO/TeZ\njJkbHobqUA3DMdNzK4kQkvuXsZ04cv3X3jfL61yLrzNDp3zRAFQTeVu5l+3vFYTz\nWVSVvPkKgTVQb0Ta7qIU4G9ph/n8TZ1hi46oyY86WeeQ6FtNvrUDJlkEtCamFjpr\n/SDo8WxM1p6Svos5+I1vW0AXzn7TYLa3oHDDNEZPgYmOltPL4kCaLWPj1UwkjwfX\nPafQDoUHvZgr9VQb9MbS6c7WIIhRskJu8MRn+5iVF3DtNlO3iFaLGC2WIOOznL//\nZ9eyg310NkpBSt1fqCcUyzZnf9kdPGXs+E0hni9bK5iZJk9jffoAbZEimbCOu2Ad\nHdmMLUNrAgMBAAECggEAGinVVJ0DKhw1CbwlOkSr/T4xGseZvSxeGD93H3FDY2IM\ncFAoZr8lUroX7mxQ63i6X25hdw/mujgKCgaIoNOT2A3/lIc5QuNI00Xv/SoLxEZ9\nosZIQxxGmYiyE06vAs4PgRr0eSDwGXhOEpwW6zEkouXRu/wgmvnsNRJ+Gwn2sVN/\nK4/52oAsXO5Z5/k73zXr/vZDkWFt24GvXaNX6FaCB6DW8WaHETiwG6a9tCdKdL1o\npLQfpHT/Mbi4bw5+uPokk1waBPZ1jXJ9YuDik7cIWheqth+pmwQJgbqZJxJyP7F1\nKrS7MyL81hcXqbfVEW9/LGRuwv/Pwk9UNga/GZ1sCQKBgQDtMV1p3ssKTpYsin3e\nyXR+1evQHBUQ8+De8ApW0W5H4WiyMfDQGIvkG4PNs342+7R+w/wUOHD58EovHvYq\nnV83Lreku/3Eel9EfZbrwMKsgC/RDsPBzxjK4h0RLpnTokOjn0ohmo42Phm01qLO\niElLzV/aQivz+d1z0/zWaCttpQKBgQDC9dss8RqT/fgv40ybbIyBUEOPBnsvDkew\ng2CnnnzdCXy3Yq5fZWCPraPDXq0tx+BnD88FX+FBA7erJzJeB6U8znuzQ4mivt7+\n/6ffEFsPVFct6gicnJbA6n/AsLJ+IvGCEUpMAIIiWOX4/VjTck6+Qg8c04o4+lTV\ndc8YOIQ/zwKBgGrGNCT6lDA5nETEu1DVI0oNhrASVDFjd7EkIaNfd+OHxxegf6VN\nx3uSH000Jfcea+w80XdQyRraXqrDp1Ebsscmkqjnr58I72Xnm07ZYUlCE0Rq/xh5\n39FE5Izdi4XHn+dCR57E8ovcfLn5fSS4GTa0ZxfbfenAaz4/CayDDDm5AoGBAI+S\nChOwgggV8R0i4Blc+KOJ/hZniXN/qp98QENv3TfRcryBuTObLl7gWkbXg+TA2qpK\n5ANrNjBwkmNB/D9uleqPjFzZEZR9xy42CuOj4csKKyEuxaS/U+1BQ08dUHS/Ouaz\n4OjTPwIYQVL5Dt63wPEvKH3r8lA/WRXRKe8GP63VAoGBAIIdk0F70P1mhpT1RSaY\nYKqD8wWlZpVg0RQW+SIrTwXt6CBD7Mw9b1KISf+EpcS7AkFhbLR8ZvZNxmZlEiXn\na+bbtZ5xb1xu+oYesUHYIoRX1EEUmicmzrSi82ujRwa0wS/hSrg2RFH9on3mCPPE\ny4tA4jGW6HXc2H+VUneAY1FK\n-----END PRIVATE KEY-----\n"
    });
    // loads document properties and worksheets
    await doc.loadInfo();


    const sheet = doc.sheetsById[0];
    sheet.addRow(row).then(result => {
      if (callback) { callback().then(res => {
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
            hideForm("form transparentize");
            showThanks("thank-you");
            setTimeout(function(){
              hideForm("form hidden");
              scrollToTop();
            }, 1000);
          };
        })
      }) }
    })
  } catch (e) {
    console.error('Error: ', e);
  }
};

export async function checkSpreadsheet() {
  try {
    await doc.useServiceAccountAuth({
      client_email: "weeding-spreadsheet@wedding-spreadsheet-293619.iam.gserviceaccount.com",
      private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC0ozQbf/HO/TeZ\njJkbHobqUA3DMdNzK4kQkvuXsZ04cv3X3jfL61yLrzNDp3zRAFQTeVu5l+3vFYTz\nWVSVvPkKgTVQb0Ta7qIU4G9ph/n8TZ1hi46oyY86WeeQ6FtNvrUDJlkEtCamFjpr\n/SDo8WxM1p6Svos5+I1vW0AXzn7TYLa3oHDDNEZPgYmOltPL4kCaLWPj1UwkjwfX\nPafQDoUHvZgr9VQb9MbS6c7WIIhRskJu8MRn+5iVF3DtNlO3iFaLGC2WIOOznL//\nZ9eyg310NkpBSt1fqCcUyzZnf9kdPGXs+E0hni9bK5iZJk9jffoAbZEimbCOu2Ad\nHdmMLUNrAgMBAAECggEAGinVVJ0DKhw1CbwlOkSr/T4xGseZvSxeGD93H3FDY2IM\ncFAoZr8lUroX7mxQ63i6X25hdw/mujgKCgaIoNOT2A3/lIc5QuNI00Xv/SoLxEZ9\nosZIQxxGmYiyE06vAs4PgRr0eSDwGXhOEpwW6zEkouXRu/wgmvnsNRJ+Gwn2sVN/\nK4/52oAsXO5Z5/k73zXr/vZDkWFt24GvXaNX6FaCB6DW8WaHETiwG6a9tCdKdL1o\npLQfpHT/Mbi4bw5+uPokk1waBPZ1jXJ9YuDik7cIWheqth+pmwQJgbqZJxJyP7F1\nKrS7MyL81hcXqbfVEW9/LGRuwv/Pwk9UNga/GZ1sCQKBgQDtMV1p3ssKTpYsin3e\nyXR+1evQHBUQ8+De8ApW0W5H4WiyMfDQGIvkG4PNs342+7R+w/wUOHD58EovHvYq\nnV83Lreku/3Eel9EfZbrwMKsgC/RDsPBzxjK4h0RLpnTokOjn0ohmo42Phm01qLO\niElLzV/aQivz+d1z0/zWaCttpQKBgQDC9dss8RqT/fgv40ybbIyBUEOPBnsvDkew\ng2CnnnzdCXy3Yq5fZWCPraPDXq0tx+BnD88FX+FBA7erJzJeB6U8znuzQ4mivt7+\n/6ffEFsPVFct6gicnJbA6n/AsLJ+IvGCEUpMAIIiWOX4/VjTck6+Qg8c04o4+lTV\ndc8YOIQ/zwKBgGrGNCT6lDA5nETEu1DVI0oNhrASVDFjd7EkIaNfd+OHxxegf6VN\nx3uSH000Jfcea+w80XdQyRraXqrDp1Ebsscmkqjnr58I72Xnm07ZYUlCE0Rq/xh5\n39FE5Izdi4XHn+dCR57E8ovcfLn5fSS4GTa0ZxfbfenAaz4/CayDDDm5AoGBAI+S\nChOwgggV8R0i4Blc+KOJ/hZniXN/qp98QENv3TfRcryBuTObLl7gWkbXg+TA2qpK\n5ANrNjBwkmNB/D9uleqPjFzZEZR9xy42CuOj4csKKyEuxaS/U+1BQ08dUHS/Ouaz\n4OjTPwIYQVL5Dt63wPEvKH3r8lA/WRXRKe8GP63VAoGBAIIdk0F70P1mhpT1RSaY\nYKqD8wWlZpVg0RQW+SIrTwXt6CBD7Mw9b1KISf+EpcS7AkFhbLR8ZvZNxmZlEiXn\na+bbtZ5xb1xu+oYesUHYIoRX1EEUmicmzrSi82ujRwa0wS/hSrg2RFH9on3mCPPE\ny4tA4jGW6HXc2H+VUneAY1FK\n-----END PRIVATE KEY-----\n"
    });
    // loads document properties and worksheets
    await doc.loadInfo();

    const sheet = doc.sheetsById[0];
    const result = await sheet.getRows();
    return result;
  } catch (e) {
    console.error('Error: ', e);
  }
};


export default {appendSpreadsheet, checkSpreadsheet};
