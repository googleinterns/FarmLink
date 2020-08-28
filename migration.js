function migrateDeals() {
  const email;
  const key;
  const projectId;
  var firestore = FirestoreApp.getFirestore(email, key, projectId);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  sheets.forEach(function(sheet) {
    var row = sheet.getLastRow();
    var column = sheet.getLastColumn();
    var range = sheet.getRange(1, 1, row, column);
    var data = range.getValues();
    var columns = {};
    for (var i = 0; i < data[0].length; i++) {
      switch (data[0][i]) {
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
    for (var i = 1; i < data.length; i++) {
      var produce = {
        name: data[i][columns["Produce Type"]],
        shippingPresetTemperature: "",
        shippingMaintenanceTemperatureLow: "",
        shippingMaintenanceTemperatureHigh: "",
        amountMoved: "",
        price: "",
        pricePaid: "",
      };
      firestore.createDocument("produce", produce);
      var produceDocument = firestore.query("produce").Where("name", "==", data[i][columns["Produce Type"]]).Execute();
      var farm = {
        farmName: data[i][columns["Farm Name"]],
        location: data[i][columns["Farm Location"]],
        hours: "",
        transportation: "",
        contacts: [
          {
            contactName: data[i][columns["Farm Contact Name"]],
            contactPhone: data[i][columns["Farm Contact Phone"]],
            contactEmail: data[i][columns["Farm Contact Email"]],
          }
        ],
        loadingDock: "",
        forklift: "",
        farmTags: [],
      };
      firestore.createDocument("farms", farm);
      var farmDocument = firestore.query("farms").Where("farmName", "==", data[i][columns["Farm Name"]]).Execute();
      var foodbank = {
        foodbankName: data[i][columns["Food Bank Name"]],
        location: data[i][columns["Food Bank Location"]],
        hours: "",
        contacts: [
          {
            contactName: data[i][columns["Food Bank Contact Name"]],
            contactPhone: data[i][columns["Food Bank Contact Phone"]],
            contactEmail: data[i][columns["Food Bank Contact Email"]],
          }
        ],
        forklift: "",
        pallet: "",
        loadingDock: "",
        maxLoadSize: "",
        refrigerationSpaceAvailable: "",
        foodbankTags: [],
      };
      firestore.createDocument("foodbanks", foodbank);
      var foodbankDocument = firestore.query("foodbanks").Where("foodbankName", "==", data[i][columns["Food Bank Name"]]).Execute();
      var surplus = {
        produceId: produceDocument.produceId,
        originFarmId: farmDocument.farmId,
        available: "",
        cost: "",
        totalQuantityAvailable: data[i][columns["Produce Quantity"]],
        packagingType: "",
      };
      firestore.createDocument("surplus", surplus);
      var surplusDocument = firestore.query("surplus").Where("produceId", "==", produceDocument.produceId).Execute();
      var deal = {
        farmId: farmDocument.farmId,
        foodbankId: foodbankDocument.foodbankId,
        surplusId: surplusDocument.surplusId,
        farmContactKey: 0,
        foodbankContactKey: 0,
        farmlinkContactName: "",
        farmlinkContactPhone: "",
        farmlinkContactEmail: "",
        pickupDate: "",
        pickupTime: "",
        deliveryDate: data[i][columns["Delivery Date"]],
        deliveryTime: "",
        bill: "",
        fundsPaidToFarm: data[i][columns["$ to Farm"]],
        fundsPaidForShipping: data[i][columns["$ Shipping"]],
        totalSpent: data[i][columns["$ in Total"]],
        invoice: "",
        associatedPress: [],
        notes: "",
      };
      firestore.createDocument("deals", deal);
    }
  })
}
