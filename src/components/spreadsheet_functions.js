
import { GoogleSpreadsheet } from "google-spreadsheet";

require('dotenv').config();

// Config variables
const SPREADSHEET_ID = process.env.REACT_APP_SPREADSHEET_ID;
const SHEET_ID = process.env.REACT_APP_SHEET_ID;
const CLIENT_EMAIL = process.env.REACT_APP_GOOGLE_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.REACT_APP_GOOGLE_SERVICE_PRIVATE_KEY;

const doc = new GoogleSpreadsheet('1dIZEx5ifKIZPgmKQ7DMpebTNOX1UhN6acCl7yZZ4xLI');

export async function appendSpreadsheet(row, callback, showThanks, hideForm) {
  try {
    await doc.useServiceAccountAuth({
      client_email: 'weeding-spreadsheet@wedding-spreadsheet-293619.iam.gserviceaccount.com',
      private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDH7oQCmP7J6MIB\n7rmjyNsgYbbta0tFGYKsFkee+4QaoeyA0DlafVFWLcppug6k06EGALyehGrG9z28\nOOMJPrBhMxKtLjD6O60frfaa9e51ceNbaaS6ouvqmiQCWkyTCNXPD/PbYEVuXDaY\nQEVJhU2uorHQ7PeKLrAhfvtFvVe0Llhigv+7uASsGDYQo7ku+oWYAOBRALXCRDuF\n7DCF21F3k8113KsU/M/17VjYXZhhDi0Cld2RwCHBUNsDEQNTXU3esestXu6XC9vL\n67ADxFBQLiEutO1Hvl2orqkZYE5CC3sqzEpkLywi61Zv2zd4HHGQ4v7J+UytGJ9G\niPE6TXhrAgMBAAECggEACtPiUZNAYpDY3PHRqWdGSBvWMoCwyH2EeTm8x8xa+pJ8\ngqWgsRjxk1kvLU9viF6vSaL+d6W35gNp8I/PBwOloPfCLpFpH4UW2oz5ZVR66OCc\nf362y8LMtbLYJEoIbbuq0RnqWUjFu5+ehYY7U0e3Dej9afwKhfDmIu61h80y0EJa\naw0ObYNG1M5jBNVkEv5bakEDQgiz0AXS67+rNdhKTodIN8huTI1t/WBw3h6GZn0b\nk5TUvffaBSPxpmE+SszHDM0iJidFVuERizIQLGGvTmWc9q9pebtTOVMAcTEC6uFB\nb89z9BYROM8ytjBtZmT7faefKxoBcKGLswxDSDStOQKBgQDuHRki+JZOrqQd/I1t\nreH2Vb8qQUQTpDYzuvsHr1znx43z+Gjq5ct+F7Ybv/DjVDVFQrazdiM7+pnGTB9P\nEIhm60QrJQ7nvl8qnxtyQfxEvP3n85iAgkhDo+yhem1V+Jo1XYzwBTkdZiPxUQBh\n08DOHprV5d//F6lZ0b+eP85yEwKBgQDW8y6io301KiULBw34i87Lwvstg1Tw9NYR\nVA7DQvQImenVmTbmwO76yMJGSIZ5rizw4k6kW7D3QXNQ/V9H/qqQ8wnv/hSO6nPd\nhLFiWoJhdOquzQ7D5Auya8Fq4drFc/UCrbETJn74GCVeDmE1mavro9ddhRUh+Q9B\nBYlmRltrSQKBgQCNdh4T56msjxaTdhIzweUHqwOKQAIIxTsqWoB+nVFNpgGQmtkC\nDIlrnPyk2dBrzgBj6HGQhrQCEyy+YUUMfN78ffMeysJjLXduY94zcD5GPB2AavkE\nB+KUxNN1T72bILnE0JJFmmTHMYJTAHOAqwPVsNr+DraX31/OK81yX6fvnwKBgFN0\nhYXF3iYXH9zBN25psbexE16fYApRtQ9zSGwNgbwZLg2teABtphueeLdbD0MNGgvI\ngeoUY4gMVF58kVLdkJHImvIf/xFh++xkyY47P+XgxAFsQjBSSSxT4/vAhvUkyVrp\n3xdlWeSvU0rKYHm0GWja6xI3SnYvQfnn0WnxJStpAoGAa0NEXYeO8XhPNfZP9rgs\nNnYqeIoXJMFaOIJfS9Wa1Edkgoxe7jnc1rzTH8eLgwIu6hF5HkMNrjM5D9kDVew+\nrwyN2Pt+P2j9RzKuaZ/lqFfjUD+y6ant607Fj++8IuOnCaKoEzgb4fGv3W8NTf06\nVsiNmpozmg8I83BfdLUOcWE=\n-----END PRIVATE KEY-----\n"
    });
    // loads document properties and worksheets
    await doc.loadInfo();

    const sheet = doc.sheetsById[0];
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
      client_email: 'weeding-spreadsheet@wedding-spreadsheet-293619.iam.gserviceaccount.com',
      private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDH7oQCmP7J6MIB\n7rmjyNsgYbbta0tFGYKsFkee+4QaoeyA0DlafVFWLcppug6k06EGALyehGrG9z28\nOOMJPrBhMxKtLjD6O60frfaa9e51ceNbaaS6ouvqmiQCWkyTCNXPD/PbYEVuXDaY\nQEVJhU2uorHQ7PeKLrAhfvtFvVe0Llhigv+7uASsGDYQo7ku+oWYAOBRALXCRDuF\n7DCF21F3k8113KsU/M/17VjYXZhhDi0Cld2RwCHBUNsDEQNTXU3esestXu6XC9vL\n67ADxFBQLiEutO1Hvl2orqkZYE5CC3sqzEpkLywi61Zv2zd4HHGQ4v7J+UytGJ9G\niPE6TXhrAgMBAAECggEACtPiUZNAYpDY3PHRqWdGSBvWMoCwyH2EeTm8x8xa+pJ8\ngqWgsRjxk1kvLU9viF6vSaL+d6W35gNp8I/PBwOloPfCLpFpH4UW2oz5ZVR66OCc\nf362y8LMtbLYJEoIbbuq0RnqWUjFu5+ehYY7U0e3Dej9afwKhfDmIu61h80y0EJa\naw0ObYNG1M5jBNVkEv5bakEDQgiz0AXS67+rNdhKTodIN8huTI1t/WBw3h6GZn0b\nk5TUvffaBSPxpmE+SszHDM0iJidFVuERizIQLGGvTmWc9q9pebtTOVMAcTEC6uFB\nb89z9BYROM8ytjBtZmT7faefKxoBcKGLswxDSDStOQKBgQDuHRki+JZOrqQd/I1t\nreH2Vb8qQUQTpDYzuvsHr1znx43z+Gjq5ct+F7Ybv/DjVDVFQrazdiM7+pnGTB9P\nEIhm60QrJQ7nvl8qnxtyQfxEvP3n85iAgkhDo+yhem1V+Jo1XYzwBTkdZiPxUQBh\n08DOHprV5d//F6lZ0b+eP85yEwKBgQDW8y6io301KiULBw34i87Lwvstg1Tw9NYR\nVA7DQvQImenVmTbmwO76yMJGSIZ5rizw4k6kW7D3QXNQ/V9H/qqQ8wnv/hSO6nPd\nhLFiWoJhdOquzQ7D5Auya8Fq4drFc/UCrbETJn74GCVeDmE1mavro9ddhRUh+Q9B\nBYlmRltrSQKBgQCNdh4T56msjxaTdhIzweUHqwOKQAIIxTsqWoB+nVFNpgGQmtkC\nDIlrnPyk2dBrzgBj6HGQhrQCEyy+YUUMfN78ffMeysJjLXduY94zcD5GPB2AavkE\nB+KUxNN1T72bILnE0JJFmmTHMYJTAHOAqwPVsNr+DraX31/OK81yX6fvnwKBgFN0\nhYXF3iYXH9zBN25psbexE16fYApRtQ9zSGwNgbwZLg2teABtphueeLdbD0MNGgvI\ngeoUY4gMVF58kVLdkJHImvIf/xFh++xkyY47P+XgxAFsQjBSSSxT4/vAhvUkyVrp\n3xdlWeSvU0rKYHm0GWja6xI3SnYvQfnn0WnxJStpAoGAa0NEXYeO8XhPNfZP9rgs\nNnYqeIoXJMFaOIJfS9Wa1Edkgoxe7jnc1rzTH8eLgwIu6hF5HkMNrjM5D9kDVew+\nrwyN2Pt+P2j9RzKuaZ/lqFfjUD+y6ant607Fj++8IuOnCaKoEzgb4fGv3W8NTf06\nVsiNmpozmg8I83BfdLUOcWE=\n-----END PRIVATE KEY-----\n"
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
