const { db } = require("../util/admin");

/**
 * Read a list of all surplus.
 * GET /surplus
 * Success response: array of surplus objects (documented in POST /surplus)
 */
exports.getAllSurplus = (request, response) => {
  db.collection("surplus")
    .get()
    .then((data) => {
      let surplus = [];
      data.forEach((doc) => {
        surplus.push(doc);
      });

      // Get produce object that is linked to surplus object.
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

      // Get farm object that is linked to surplus object.
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

      // Get produce and farm objects that are linked to surplus object.
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
          return response.json(results);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
      return response.status(500).json({ error: err.code });
    });
};

/**
 * Read a specific surplus.
 * GET /surplus/:id
 * Success response: surplus object (documented in POST /surplus)
 */
exports.getOneSurplus = (request, response) => {
  db.doc(`/surplus/${request.params.surplusId}`)
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
 * Create a new surplus.
 * POST /surplus
 * Data params:
{
    produceId: [string],
    originFarmId: [string],
    available: [boolean],
    cost: [number],
    totalQuantityAvailable: [number],
    packagingType: [string]
}
 * Success response: surplus object (documented in POST /surplus)
 */
exports.postOneSurplus = (request, response) => {
  const newSurplusItem = {
    produceId: request.body.produceId,
    originFarmId: request.body.originFarmId,
    available: request.body.available === "true",
    cost: parseFloat(request.body.cost),
    totalQuantityAvailable: parseFloat(request.body.totalQuantityAvailable),
    packagingType: request.body.packagingType,
  };
  db.collection("surplus")
    .add(newSurplusItem)
    .then((doc) => {
      let responseSurplusItem = newSurplusItem;
      responseSurplusItem.id = doc.id;
      return response.json(responseSurplusItem);
    })
    .catch((err) => {
      console.log(err);
      return response.status(500).json({ error: err.code });
    });
};

/**
 * Delete a specific surplus and deals that refer to the surplus.
 * DELETE /surplus/:id
 * Success response: {message: 'Delete successfull'}
 */
exports.deleteSurplus = (request, response) => {
  const document = db.doc(`/surplus/${request.params.surplusId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return response.status(404).json({ error: "Surplus Object not found" });
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
      response.json({ message: "Delete successfull" });
    })
    .catch((err) => {
      console.log(err);
      return response.status(500).json({ error: err.code });
    });
};

/**
 * Update a specific surplus.
 * PUT /surplus/:id
 * Success response: {message: 'Updated successfully'}
 */
exports.editSurplus = (request, response) => {
  let document = db.collection("surplus").doc(`${request.params.surplusId}`);
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
