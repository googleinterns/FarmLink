const express = require("express");
const produceRoute = express.Router();
const auth = require("../util/auth");
const { db } = require("../util/admin");

/*
read a list of all produce
GET /produce
success response: array of produce objects (documented in POST /produce)
*/
produceRoute.get("/", auth, (req, res) => {
  db.collection("produce")
    .get()
    .then((data) => {
      let produce = [];
      data.forEach((doc) => {
        produce.push({
          produceId: doc.id,
          name: doc.data().name,
          shippingPresetTemperature: doc.data().shippingPresetTemperature,
          shippingMaintenanceTemperatureLow: doc.data()
            .shippingMaintenanceTemperatureLow,
          shippingMaintenanceTemperatureHigh: doc.data()
            .shippingMaintenanceTemperatureHigh,
          amountMoved: doc.data().amountMoved,
          price: doc.data().price,
          pricePaid: doc.data().pricePaid,
        });
      });
      return res.json(produce);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.code });
    });
});

/*
read a specific produce
GET /produce/:id
success response: produce object (documented in POST /produce)
*/
produceRoute.get("/:id", auth, (req, res) => {
  db.doc(`/produce/${req.params.id}`)
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
create a new produce
POST /produce
data params:
{
    name: [string],
    shippingPresetTemperature: [number],
    shippingMaintenanceTemperatureLow: [number],
    shippingMaintenanceTemperatureHigh: [number],
    amountMoved: [number],
    price: [number],
    pricePaid: [number]
}
success response: produce object (documented in POST /produce)
*/
produceRoute.post("/", auth, (req, res) => {
  const newProduceItem = {
    name: req.body.name,
    shippingPresetTemperature: parseFloat(req.body.shippingPresetTemperature),
    shippingMaintenanceTemperatureLow: parseFloat(
      req.body.shippingMaintenanceTemperatureLow
    ),
    shippingMaintenanceTemperatureHigh: parseFloat(
      req.body.shippingMaintenanceTemperatureHigh
    ),
    amountMoved: parseFloat(req.body.amountMoved),
    price: parseFloat(req.body.price),
    pricePaid: parseFloat(req.body.pricePaid),
  };
  db.collection("produce")
    .add(newProduceItem)
    .then((doc) => {
      let resProduceItem = newProduceItem;
      resProduceItem.id = doc.id;
      return res.json(resProduceItem);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.code });
    });
});

/*
delete a specific produce
DELETE /produce/:id
success response: {message: 'Delete successfully'}
*/
produceRoute.delete("/:id", auth, (req, res) => {
  const document = db.doc(`/produce/${req.params.id}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Produce Object not found" });
      }
      db.collection("surplus")
        .where("produceId", "==", doc.id)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            db.collection("deals")
              .where("surplusId", "==", doc.id)
              .get()
              .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                  db.doc(`/deals/${doc.id}`).delete();
                });
              });
            db.doc(`/surplus/${doc.id}`).delete();
          });
        });
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
update a specific produce
PUT /produce/:id
success response: {message: 'Updated successfully'}
*/
produceRoute.put("/:id", auth, (req, res) => {
  let document = db.collection("produce").doc(`${req.params.id}`);
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

module.exports = produceRoute;
