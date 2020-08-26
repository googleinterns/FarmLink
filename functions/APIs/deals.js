const express = require("express");
const dealsRoute = express.Router();
const auth = require("../util/auth");
const { db } = require("../util/admin");

/*
read a list of all deals
GET /deals
success response: array of deal objects (documented in POST /deals)
*/
dealsRoute.get("/", auth, (req, res) => {
  db.collection("deals")
    .get()
    .then((data) => {
      let deals = [];
      data.forEach((doc) => {
        deals.push({
          dealId: doc.id,
          farmId: doc.data().farmId,
          foodbankId: doc.data().foodbankId,
          surplusId: doc.data().surplusId,
          farmContactKey: doc.data().farmContactKey,
          foodbankContactKey: doc.data().foodbankContactKey,
          farmlinkContactName: doc.data().farmlinkContactName,
          farmlinkContactPhone: doc.data().farmlinkContactPhone,
          farmlinkContactEmail: doc.data().farmlinkContactEmail,
          pickupDate: doc.data().pickupDate,
          pickupTime: doc.data().pickupTime,
          deliveryDate: doc.data().deliveryDate,
          deliveryTime: doc.data().deliveryTime,
          bill: doc.data().bill,
          fundsPaidToFarm: doc.data().fundsPaidToFarm,
          fundsPaidForShipping: doc.data().fundsPaidForShipping,
          totalSpent: doc.data().totalSpent,
          invoice: doc.data().invoice,
          associatedPress: doc.data().associatedPress,
          notes: doc.data().notes,
        });
      });
      return res.json(deals);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.code });
    });
});

/*
read a specific deal
GET /deals/:id
success response: deal object (documented in POST /deals)
*/
dealsRoute.get("/:id", auth, (req, res) => {
  db.doc(`/deals/${req.params.dealId}`)
    .get()
    .then((doc) => {
      return res.json(doc.data());
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.code });
    });
});

/*
create a new deal
POST /deals
data params:
{
    farmId: [string],
    foodbankId: [string],
    surplusId: [string],
    farmContactKey: [string],
    foodbankContactKey: [string],
    farmlinkContactName: [string],
    farmlinkContactPhone: [string],
    farmlinkContactEmail: [string],
    pickupDate: [string],
    pickupTime: [string],
    deliveryDate: [string],
    deliveryTime: [string],
    bill: [string],
    fundsPaidToFarm: [number],
    fundsPaidForShipping: [number],
    totalSpent: [number],
    invoice: [string],
    associatedPress: [array],
    notes: [string]
}
success response: deal object (documented in POST /deals)
*/
dealsRoute.post("/", auth, (req, res) => {
  const newDealItem = {
    farmId: req.body.farmId,
    foodbankId: req.body.foodbankId,
    surplusId: req.body.surplusId,
    farmContactKey: req.body.farmContactKey, //the index of the contact in the contacts array
    foodbankContactKey: req.body.foodbankContactKey, //the index of the contact in the contacts array
    farmlinkContactName: req.body.farmlinkContactName,
    farmlinkContactPhone: req.body.farmlinkContactPhone,
    farmlinkContactEmail: req.body.farmlinkContactEmail,
    pickupDate: req.body.pickupDate,
    pickupTime: req.body.pickupTime,
    deliveryDate: req.body.deliveryDate,
    deliveryTime: req.body.deliveryTime,
    bill: req.body.bill,
    fundsPaidToFarm: parseFloat(req.body.fundsPaidToFarm),
    fundsPaidForShipping: parseFloat(req.body.fundsPaidForShipping),
    totalSpent: parseFloat(req.body.totalSpent),
    invoice: req.body.invoice,
    associatedPress: req.body.associatedPress,
    notes: req.body.notes,
  };
  db.collection("deals")
    .add(newDealItem)
    .then((doc) => {
      let resDealItem = newDealItem;
      resDealItem.id = doc.id;
      return res.json(resDealItem);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.code });
    });
});

/*
delete a specific deal
DELETE /deals/:id
success response: {message: 'Delete successfully'}
*/
dealsRoute.delete("/:id", auth, (req, res) => {
  const document = db.doc(`/deals/${req.params.dealId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Deal Object not found" });
      }
      return document.delete();
    })
    .then(() => {
      res.json({ message: "Delete successfully" });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.code });
    });
});

/*
update a specific deal
PUT /deals/:id
success response: {message: 'Updated successfully'}
*/
dealsRoute.put("/:id", auth, (req, res) => {
  let document = db.collection("deals").doc(`${req.params.dealId}`);
  document
    .update(req.body)
    .then(() => {
      res.json({ message: "Updated successfully" });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.code });
    });
});

module.exports = dealsRoute;
