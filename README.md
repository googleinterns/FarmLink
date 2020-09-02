# FarmLink
Our capstone project is a web application that helps FarmLink, a non-profit organization that moves food surplus from farms around the country to food banks in need, automate the process of matching a food bank with a farm.

## Development
### Back-End
    cd functions
    firebase serve
### Front-End
    cd view
    npm start

## Deployment
### Back-End
    cd functions
    firebase deploy
### Front-End
    cd view
    npm run build
    firebase deploy

## Database Migration
Create a Google Sheet with the following headers in the first row:<br/>
- Farm Name
- Farm Location
- Farm Contact Name
- Farm Contact Phone
- Farm Contact Email
- Food Bank Name
- Food Bank Location
- Food Bank Contact Name
- Food Bank Contact Phone
- Food Bank Contact Email
- Delivery Date
- Produce Type
- Produce Quantity
- $ to Farm
- $ Shipping
- $ in Total

Initialize the following object in the `migrateDeals` function:<br/>

    sheets.spreadsheets.values.get(
        {
            spreadsheetId: "",
            range: "",
        }
    );

The [documentation](https://developers.google.com/sheets/api/guides/concepts) defines `spreadsheetId` and `range`.<br/>

Complete Step 1 in the [quickstart](https://developers.google.com/sheets/api/quickstart/nodejs) to enable the Google Sheets API.<br/>

Run the following commands:<br/>

    npm install googleapis@39 --save
    node migration.js
