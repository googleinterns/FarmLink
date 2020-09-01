const express = require("express");
const farmsRoute = express.Router();
const auth = require("../util/auth");
const { db } = require("../util/admin");

/*
read a list of all farms
GET /farms
success response: array of farm objects (documented in POST /farms)
*/
farmsRoute.get("/", auth, (req, res) => {
  db.collection("farms")
    .get()
    .then((data) => {
      let farms = [];
      data.forEach((doc) => {
        farms.push({
          farmId: doc.id,
          farmName: doc.data().farmName,
          location: doc.data().location,
          hours: doc.data().hours,
          transportation: doc.data().transportation,
          contacts: doc.data().contacts,
          loadingDock: doc.data().loadingDock,
          forklift: doc.data().forklift,
          farmTags: doc.data().farmTags,
        });
      });
      return res.json(farms);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.code });
    });
});

/*
read a specific farm
GET /farms/:id
success response: farm object (documented in POST /farms)
*/
farmsRoute.get("/:id", auth, (req, res) => {
  db.doc(`/farms/${req.params.id}`)
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
create a new farm
POST /farms
data params:
{
    farmName: [string],
    location: [string],
    hours: [array],
    transportation: [boolean],
    contacts: [array],
    loadingDock: [boolean],
    forklift: [boolean],
    farmTags: [array]
}
success response: farm object (documented in POST /farms)
*/
farmsRoute.post("/", auth, (req, res) => {
  const newFarmItem = {
    farmName: req.body.farmName,
    location: req.body.location,
    hours: req.body.hours,
    transportation: req.body.transportation === "true",
    contacts: req.body.contacts,
    loadingDock: req.body.loadingDock === "true",
    forklift: req.body.forklift === "true",
    farmTags: req.body.farmTags,
  };
  db.collection("farms")
    .add(newFarmItem)
    .then((doc) => {
      let resFarmItem = newFarmItem;
      resFarmItem.id = doc.id;
      return res.json(resFarmItem);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.code });
    });
});

/*
delete a specific farm
DELETE /farms/:id
success response: {message: 'Delete successfully'}
*/
farmsRoute.delete("/:id", auth, (req, res) => {
  const document = db.doc(`/farms/${req.params.id}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Farm Object not found" });
      }
      db.collection("surplus")
        .where("farmId", "==", doc.id)
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
      db.collection("deals")
        .where("farmId", "==", doc.id)
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
update a specific farm
PUT /farms/:id
success response: {message: 'Updated successfully'}
*/
farmsRoute.put("/:id", auth, (req, res) => {
  let document = db.collection("farms").doc(`${req.params.id}`);
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

module.exports = farmsRoute;
