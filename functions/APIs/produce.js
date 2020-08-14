const { db } = require("../util/admin");

/*
read a list of all produce
GET /produce
success response: array of produce objects (documented in POST /produce)
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

/*
read a specific produce
GET /produce/:id
success response: produce object (documented in POST /produce)
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

/*
delete a specific produce
DELETE /produce/:id
success response: {message: 'Delete successfull'}
*/
exports.deleteProduce = (request, response) => {
  const document = db.doc(`/produce/${request.params.produceId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return response.status(404).json({ error: "Produce Object not found" });
      }
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

/*
update a specific produce
PUT /produce/:id
success response: {message: 'Updated successfully'}
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
