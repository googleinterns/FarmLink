const { db } = require("../util/admin");

/**
 * Read a list of all farms.
 * GET /farms
 * Success response: array of farm objects (documented in POST /farms)
 */
exports.getAllFarms = (request, response) => {
  db.collection("farms")
    .get()
    .then((data) => {
      let farms = [];
      data.forEach((doc) => {
        farms.push({
          farmId: doc.id,
          farmName: doc.data().farmName,
          location: doc.data().location,
          locationId: doc.data().locationId,
          // TODO(andrewhojel): add the hours feature
          transportation: doc.data().transportation,
          contacts: doc.data().contacts,
          loadingDock: doc.data().loadingDock,
          forklift: doc.data().forklift,
          farmTags: doc.data().farmTags,
        });
      });
      return response.json(farms);
    })
    .catch((err) => {
      console.log(err);
      return response.status(500).json({ error: err.code });
    });
};

/**
 * Read a specific farm.
 * GET /farms/:id
 * Success response: farm object (documented in POST /farms)
 */
exports.getOneFarm = (request, response) => {
  db.doc(`/farms/${request.params.farmId}`)
    .get()
    .then((doc) => {
      return response.json(doc.data());
    })
    .catch((err) => {
      console.log(err);
      return response.status(500).json({ error: err.code });
    });
};

/**
 * Create a new farm.
 * POST /farms
 * Data params:
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
 * Success response: farm object (documented in POST /farms)
 */
exports.postOneFarm = (request, response) => {
  const newFarmItem = {
    farmName: request.body.farmName,
    location: request.body.location,
    // TODO(andrewhojel): add the hours feature
    locationId: request.body.locationId,
    transportation: request.body.transportation === "true",
    contacts: request.body.contacts,
    loadingDock: request.body.loadingDock === "true",
    forklift: request.body.forklift === "true",
    farmTags: request.body.farmTags,
  };
  db.collection("farms")
    .add(newFarmItem)
    .then((doc) => {
      let responseFarmItem = newFarmItem;
      responseFarmItem.id = doc.id;
      return response.json(responseFarmItem);
    })
    .catch((err) => {
      console.log(err);
      return response.status(500).json({ error: err.code });
    });
};

/**
 * Delete a specific farm and surplus and deals that refer to the farm.
 * DELETE /farms/:id
 * Success response: {message: 'Delete successfull'}
 */
exports.deleteFarm = (request, response) => {
  const document = db.doc(`/farms/${request.params.farmId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return response.status(404).json({ error: "Farm Object not found" });
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
      response.json({ message: "Delete successfull" });
    })
    .catch((err) => {
      console.log(err);
      return response.status(500).json({ error: err.code });
    });
};

/**
 * Update a specific farm.
 * PUT /farms/:id
 * Success response: {message: 'Updated successfully'}
 */
exports.editFarm = (request, response) => {
  let document = db.collection("farms").doc(`${request.params.farmId}`);
  document
    .update(request.body)
    .then(() => {
      response.json({ message: "Updated successfully" });
    })
    .catch((err) => {
      console.log(err);
      return response.status(500).json({ error: err.code });
    });
};
