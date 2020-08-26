const express = require("express");
const foodbanksRoute = express.Router();
const auth = require("../util/auth");
const { db } = require("../util/admin");

/*
read a list of all food banks
GET /foodbanks
success response: array of food bank objects (documented in POST /foodbanks)
*/
foodbanksRoute.get("/", auth, (req, res) => {
  db.collection("foodbanks")
    .get()
    .then((data) => {
      let foodbanks = [];
      data.forEach((doc) => {
        foodbanks.push({
          foodbankId: doc.id,
          foodbankName: doc.data().foodbankName,
          location: doc.data().location,
          hours: doc.data().hours,
          contacts: doc.data().contacts,
          forklift: doc.data().forklift,
          pallet: doc.data().pallet,
          loadingDock: doc.data().loadingDock,
          maxLoadSize: doc.data().maxLoadSize,
          refrigerationSpaceAvailable: doc.data().refrigerationSpaceAvailable,
          foodbankTags: doc.data().foodbankTags,
        });
      });
      return res.json(foodbanks);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.code });
    });
});

/*
read a specific food bank
GET /foodbanks/:id
success response: food bank object (documented in POST /foodbanks)
*/
foodbanksRoute.get("/:id", auth, (req, res) => {
  db.doc(`/foodbanks/${req.params.foodbankId}`)
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
create a new food bank
POST /foodbanks
data params:
{
    foodbankName: [string],
    location: [string],
    hours: [array],
    contacts: [array],
    forklift: [boolean],
    pallet: [boolean],
    loadingDock: [boolean],
    maxLoadSize: [number],
    refrigerationSpaceAvailable: [number],
    foodbankTags: [array]
}
success response: food bank object (documented in POST /foodbanks)
*/
foodbanksRoute.post("/", auth, (req, res) => {
  const newFoodBankItem = {
    foodbankName: req.body.foodbankName,
    location: req.body.location,
    hours: req.body.hours,
    contacts: req.body.contacts,
    forklift: req.body.forklift === "true",
    pallet: req.body.pallet === "true",
    loadingDock: req.body.loadingDock === "true",
    maxLoadSize: parseFloat(req.body.maxLoadSize),
    refrigerationSpaceAvailable: parseFloat(
      req.body.refrigerationSpaceAvailable
    ),
    foodbankTags: req.body.foodbankTags,
  };
  db.collection("foodbanks")
    .add(newFoodBankItem)
    .then((doc) => {
      let resFoodBankItem = newFoodBankItem;
      resFoodBankItem.id = doc.id;
      return res.json(resFoodBankItem);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.code });
    });
});

/*
delete a specific food bank
DELETE /foodbanks/:id
success response: {message: 'Delete successfully'}
*/
foodbanksRoute.delete("/:id", auth, (req, res) => {
  const document = db.doc(`/foodbanks/${req.params.foodbankId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res
          .status(404)
          .json({ error: "FoodBank Object not found" });
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
update a specific food bank
PUT /foodbanks/:id
success response: {message: 'Updated successfully'}
*/
foodbanksRoute.put("/:id", auth, (req, res) => {
  let document = db.collection("foodbanks").doc(`${req.params.foodbankId}`);
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

module.exports = foodbanksRoute;
