const { db } = require("../util/admin");

/**
 * Read a list of all produce.
 * GET /produce
 * Success response: array of produce objects (documented in POST /produce)
 */
exports.getAllProduce = (request, response) => {
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
      return response.json(produce);
    })
    .catch((err) => {
      console.log(err);
      return response.status(500).json({ error: err.code });
    });
};

/**
 * Read a specific produce.
 * GET /produce/:id
 * Success response: produce object (documented in POST /produce)
 */
exports.getOneProduce = (request, response) => {
  db.doc(`/produce/${request.params.produceId}`)
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
 * Create a new produce.
 * POST /produce
 * Data params:
{
    name: [string],
    shippingPresetTemperature: [number],
    shippingMaintenanceTemperatureLow: [number],
    shippingMaintenanceTemperatureHigh: [number],
    amountMoved: [number],
    price: [number],
    pricePaid: [number]
}
 * Success response: produce object (documented in POST /produce)
 */
exports.postOneProduce = (request, response) => {
  const newProduceItem = {
    name: request.body.name,
    shippingPresetTemperature: parseFloat(
      request.body.shippingPresetTemperature
    ),
    shippingMaintenanceTemperatureLow: parseFloat(
      request.body.shippingMaintenanceTemperatureLow
    ),
    shippingMaintenanceTemperatureHigh: parseFloat(
      request.body.shippingMaintenanceTemperatureHigh
    ),
    amountMoved: parseFloat(request.body.amountMoved),
    price: parseFloat(request.body.price),
    pricePaid: parseFloat(request.body.pricePaid),
  };
  db.collection("produce")
    .add(newProduceItem)
    .then((doc) => {
      let responseProduceItem = newProduceItem;
      responseProduceItem.id = doc.id;
      return response.json(responseProduceItem);
    })
    .catch((err) => {
      console.log(err);
      return response.status(500).json({ error: err.code });
    });
};

/**
 * Delete a specific produce and surplus and deals that refer to the produce.
 * DELETE /produce/:id
 * Success response: {message: 'Delete successfull'}
 */
exports.deleteProduce = (request, response) => {
  const document = db.doc(`/produce/${request.params.produceId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return response.status(404).json({ error: "Produce Object not found" });
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
      response.json({ message: "Delete successfull" });
    })
    .catch((err) => {
      console.log(err);
      return response.status(500).json({ error: err.code });
    });
};

/**
 * Update a specific produce.
 * PUT /produce/:id
 * Success response: {message: 'Updated successfully'}
 */
exports.editProduce = (request, response) => {
  let document = db.collection("produce").doc(`${request.params.produceId}`);
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
