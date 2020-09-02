const { db } = require("../util/admin");

/**
 * Read a list of all food banks.
 * GET /foodbanks
 * Success response: array of food bank objects (documented in POST /foodbanks)
 */
exports.getAllFoodBanks = (request, response) => {
  db.collection("foodbanks")
    .get()
    .then((data) => {
      let foodbanks = [];
      data.forEach((doc) => {
        foodbanks.push({
          foodbankId: doc.id,
          foodbankName: doc.data().foodbankName,
          location: doc.data().location,
          locationId: doc.data().locationId,
          // TODO(andrewhojel): add the hours feature
          contacts: doc.data().contacts,
          forklift: doc.data().forklift,
          pallet: doc.data().pallet,
          loadingDock: doc.data().loadingDock,
          maxLoadSize: doc.data().maxLoadSize,
          refrigerationSpaceAvailable: doc.data().refrigerationSpaceAvailable,
          foodbankTags: doc.data().foodbankTags,
        });
      });
      return response.json(foodbanks);
    })
    .catch((err) => {
      console.log(err);
      return response.status(500).json({ error: err.code });
    });
};

/**
 * Read a specific food bank.
 * GET /foodbanks/:id
 * Success response: food bank object (documented in POST /foodbanks)
 */
exports.getOneFoodBank = (request, response) => {
  db.doc(`/foodbanks/${request.params.foodbankId}`)
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
 * Create a new food bank.
 * POST /foodbanks
 * Data params:
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
 * Success response: food bank object (documented in POST /foodbanks)
 */
exports.postOneFoodBank = (request, response) => {
  const newFoodBankItem = {
    foodbankName: request.body.foodbankName,
    location: request.body.location,
    locationId: request.body.locationId,
    // TODO(andrewhojel): add the hours feature
    contacts: request.body.contacts,
    forklift: request.body.forklift === "true",
    pallet: request.body.pallet === "true",
    loadingDock: request.body.loadingDock === "true",
    maxLoadSize: parseFloat(request.body.maxLoadSize),
    refrigerationSpaceAvailable: parseFloat(
      request.body.refrigerationSpaceAvailable
    ),
    foodbankTags: request.body.foodbankTags,
  };
  db.collection("foodbanks")
    .add(newFoodBankItem)
    .then((doc) => {
      let responseFoodBankItem = newFoodBankItem;
      responseFoodBankItem.id = doc.id;
      return response.json(responseFoodBankItem);
    })
    .catch((err) => {
      console.log(err);
      return response.status(500).json({ error: err.code });
    });
};

/**
 * Delete a specific food bank and deals that refer to the food bank.
 * DELETE /foodbanks/:id
 * Success response: {message: 'Delete successfull'}
 */
exports.deleteFoodBank = (request, response) => {
  const document = db.doc(`/foodbanks/${request.params.foodbankId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return response
          .status(404)
          .json({ error: "FoodBank Object not found" });
      }
      db.collection("deals")
        .where("foodbankId", "==", doc.id)
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
 * Update a specific food bank.
 * PUT /foodbanks/:id
 * Success response: {message: 'Updated successfully'}
 */
exports.editFoodBank = (request, response) => {
  let document = db.collection("foodbanks").doc(`${request.params.foodbankId}`);
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
