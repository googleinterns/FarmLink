const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const { db } = require("./functions/util/admin");

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json";

// Load client secrets from a local file.
fs.readFile("credentials.json", (err, content) => {
  if (err) return console.log("Error loading client secret file:", err);
  // Authorize a client with credentials, then call the Google Sheets API.
  authorize(JSON.parse(content), migrateDeals);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter the code from that page here: ", (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err)
        return console.error(
          "Error while trying to retrieve access token",
          err
        );
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Migrates data from Google Sheets to Cloud Firestore.
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function migrateDeals(auth) {
  const sheets = google.sheets({ version: "v4", auth });
  sheets.spreadsheets.values.get(
    {
      spreadsheetId: "",
      range: "",
    },
    (err, res) => {
      if (err) return console.log("The API returned an error: " + err);
      const rows = res.data.values;
      if (rows.length) {
        let row = rows[0];
        let columns = {};
        for (let i = 0; i < row.length; i++) {
          switch (row[i]) {
            case "Farm Name":
              columns["Farm Name"] = i;
              break;
            case "Farm Location":
              columns["Farm Location"] = i;
              break;
            case "Farm Contact Name":
              columns["Farm Contact Name"] = i;
              break;
            case "Farm Contact Phone":
              columns["Farm Contact Phone"] = i;
              break;
            case "Farm Contact Email":
              columns["Farm Contact Email"] = i;
              break;
            case "Food Bank Name":
              columns["Food Bank Name"] = i;
              break;
            case "Food Bank Location":
              columns["Food Bank Location"] = i;
              break;
            case "Food Bank Contact Name":
              columns["Food Bank Contact Name"] = i;
              break;
            case "Food Bank Contact Phone":
              columns["Food Bank Contact Phone"] = i;
              break;
            case "Food Bank Contact Email":
              columns["Food Bank Contact Email"] = i;
              break;
            case "Delivery Date":
              columns["Delivery Date"] = i;
              break;
            case "Produce Type":
              columns["Produce Type"] = i;
              break;
            case "Produce Quantity":
              columns["Produce Quantity"] = i;
              break;
            case "$ to Farm":
              columns["$ to Farm"] = i;
              break;
            case "$ Shipping":
              columns["$ Shipping"] = i;
              break;
            case "$ in Total":
              columns["$ in Total"] = i;
              break;
          }
        }
        rows.forEach((row, index) => {
          if (index != 0) {
            let produce = {
              name: row[columns["Produce Type"]],
              shippingPresetTemperature: "",
              shippingMaintenanceTemperatureLow: "",
              shippingMaintenanceTemperatureHigh: "",
              amountMoved: "",
              price: "",
              pricePaid: "",
            };
            let farm = {
              farmName: row[columns["Farm Name"]],
              location: row[columns["Farm Location"]],
              hours: "",
              transportation: "",
              contacts: [
                {
                  contactName: row[columns["Farm Contact Name"]],
                  contactPhone: row[columns["Farm Contact Phone"]],
                  contactEmail: row[columns["Farm Contact Email"]],
                },
              ],
              loadingDock: "",
              forklift: "",
              farmTags: [],
            };
            let foodbank = {
              foodbankName: row[columns["Food Bank Name"]],
              location: row[columns["Food Bank Location"]],
              hours: "",
              contacts: [
                {
                  contactName: row[columns["Food Bank Contact Name"]],
                  contactPhone: row[columns["Food Bank Contact Phone"]],
                  contactEmail: row[columns["Food Bank Contact Email"]],
                },
              ],
              forklift: "",
              pallet: "",
              loadingDock: "",
              maxLoadSize: "",
              refrigerationSpaceAvailable: "",
              foodbankTags: [],
            };
            let surplus = {
              available: "",
              cost: "",
              totalQuantityAvailable: row[columns["Produce Quantity"]],
              packagingType: "",
            };
            let deal = {
              farmContactKey: 0,
              foodbankContactKey: 0,
              farmlinkContactName: "",
              farmlinkContactPhone: "",
              farmlinkContactEmail: "",
              pickupDate: "",
              pickupTime: "",
              deliveryDate: row[columns["Delivery Date"]],
              deliveryTime: "",
              bill: "",
              fundsPaidToFarm: row[columns["$ to Farm"]],
              fundsPaidForShipping: row[columns["$ Shipping"]],
              totalSpent: row[columns["$ in Total"]],
              invoice: "",
              associatedPress: [],
              notes: "",
            };
            db.collection("produce")
              .add(produce)
              .then((doc) => {
                surplus["produceId"] = doc.id;
                db.collection("farms")
                  .add(farm)
                  .then((doc) => {
                    surplus["originFarmId"] = doc.id;
                    deal["farmId"] = doc.id;
                    db.collection("foodbanks")
                      .add(foodbank)
                      .then((doc) => {
                        deal["foodbankId"] = doc.id;
                        db.collection("surplus")
                          .add(surplus)
                          .then((doc) => {
                            deal["surplusId"] = doc.id;
                            db.collection("deals").add(deal);
                          });
                      });
                  });
              });
          }
        });
      } else {
        console.log("No data found.");
      }
    }
  );
}
