const express = require("express");
const surplusRoute = express.Router();
const auth = require("../util/auth");
const { db } = require("../util/admin");

/*
read a list of all surplus
GET /surplus
success response: array of surplus objects (documented in POST /surplus)
*/
surplusRoute.get("/", auth, (req, res) => {
  db.collection("surplus")
    .get()
    .then((data) => {
      let surplus = [];
      data.forEach((doc) => {
        surplus.push(doc);
      });

      //get produce object that is linked to surplus object
      function queryProduce(produceId) {
        return new Promise(function (resolve, reject) {
          db.doc(`/produce/${produceId}`)
            .get()
            .then((doc) => {
              resolve(doc.data());
            })
            .catch((err) => {
              return reject(err);
            });
        });
      }

      //get farm object that is linked to surplus object
      function queryFarms(originFarmId) {
        return new Promise(function (resolve, reject) {
          db.doc(`/farms/${originFarmId}`)
            .get()
            .then((doc) => {
              resolve(doc.data());
            })
            .catch((err) => {
              return reject(err);
            });
        });
      }

      //get produce and farm objects that are linked to surplus object
      function queryProduceAndFarms(doc) {
        return new Promise(function (resolve, reject) {
          Promise.all([
            queryProduce(doc.data().produceId),
            queryFarms(doc.data().originFarmId),
          ])
            .then((results) => {
              resolve({
                surplusId: doc.id,
                produceId: doc.data().produceId,
                produceName: results[0].name,
                originFarmId: doc.data().originFarmId,
                originFarmName: results[1].farmName,
                originFarmLocation: results[1].location,
                originFarmContactName: results[1].contactName,
                originFarmContactPhone: results[1].contactPhone,
                originFarmContactEmail: results[1].contactEmail,
                available: doc.data().available,
                cost: doc.data().cost,
                totalQuantityAvailable: doc.data().totalQuantityAvailable,
                packagingType: doc.data().packagingType,
              });
            })
            .catch((err) => {
              return reject(err);
            });
        });
      }

      Promise.all(surplus.map(queryProduceAndFarms))
        .then((results) => {
          return res.json(results);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.code });
    });
});

/*
read a specific surplus
GET /surplus/:id
success response: surplus object (documented in POST /surplus)
*/
surplusRoute.get("/:id", auth, (req, res) => {
  db.doc(`/surplus/${req.params.id}`)
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
create a new surplus
POST /surplus
data params:
{
    produceId: [string],
    originFarmId: [string],
    available: [boolean],
    cost: [number],
    totalQuantityAvailable: [number],
    packagingType: [string]
}
success response: surplus object (documented in POST /surplus)
*/
surplusRoute.post("/", auth, (req, res) => {
  const newSurplusItem = {
    produceId: req.body.produceId,
    originFarmId: req.body.originFarmId,
    available: req.body.available === "true",
    cost: parseFloat(req.body.cost),
    totalQuantityAvailable: parseFloat(req.body.totalQuantityAvailable),
    packagingType: req.body.packagingType,
  };
  db.collection("surplus")
    .add(newSurplusItem)
    .then((doc) => {
      let resSurplusItem = newSurplusItem;
      resSurplusItem.id = doc.id;
      return res.json(resSurplusItem);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.code });
    });
});

/*
delete a specific surplus
DELETE /surplus/:id
success response: {message: 'Delete successfully'}
*/
surplusRoute.delete("/:id", auth, (req, res) => {
  const document = db.doc(`/surplus/${req.params.id}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Surplus Object not found" });
      }
      db.collection("deals")
        .where("surplusId", "==", doc.id)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            db.doc(`/deals/${doc.id}`).delete();
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
update a specific surplus
PUT /surplus/:id
success response: {message: 'Updated successfully'}
*/
surplusRoute.put("/:id", auth, (req, res) => {
  let document = db.collection("surplus").doc(`${req.params.id}`);
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

module.exports = surplusRoute;
