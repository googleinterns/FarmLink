const { db } = require('../util/admin');

exports.getAllProduce = (request, response) => {
    db.collection('produce').get()
    .then((data) => {
        let produce = [];
        data.forEach((doc) => {
            produce.push({
                produceId: doc.id,
                name: doc.data().name,
                shippingPresetTemperature: doc.data().shippingPresetTemperature,
                shippingMaintenanceTemperatureLow: doc.data().shippingMaintenanceTemperatureLow,
                shippingMaintenanceTemperatureHigh: doc.data().shippingMaintenanceTemperatureHigh,
                amountMoved: doc.data().amountMoved,
                price: doc.data().price,
                pricePaid: doc.data().pricePaid,
            });
        });
        return response.json(produce);
    })
    .catch((err) => {
        console.log(err);
        return response.status(500).json({error: err.code});
    });
}

exports.getOneProduce = (request, response) => {
    db.doc(`/produce/${request.params.produceId}`).get()
    .then((doc) => {
        return response.json(doc.data());
    })
    .catch((err) => {
        console.log(err);
        return response.status(500).json({error: err.code});
    });
}

exports.postOneProduce = (request, response) => {
    const newProduceItem = {
        name: request.body.name,
        shippingPresetTemperature: parseFloat(request.body.shippingPresetTemperature),
        shippingMaintenanceTemperatureLow: parseFloat(request.body.shippingMaintenanceTemperatureLow),
        shippingMaintenanceTemperatureHigh: parseFloat(request.body.shippingMaintenanceTemperatureHigh),
        amountMoved: parseFloat(request.body.amountMoved),
        price: parseFloat(request.body.price),
        pricePaid: parseFloat(request.body.pricePaid),
    };
    db
        .collection('produce')
        .add(newProduceItem)
        .then((doc) => {
            let responseProduceItem = newProduceItem;
            responseProduceItem.id = doc.id;
            return response.json(responseProduceItem);
        })
        .catch((err) => {
            console.log(err);
            return response.status(500).json({error: err.code});
        });
}

exports.deleteProduce = (request, response) => {
    const document = db.doc(`/produce/${request.params.produceId}`);
    document
        .get()
        .then((doc) => {
            if (!doc.exists) {
                return response.status(404).json({ error: 'Produce Object not found' })
            }
            return document.delete();
        })
        .then(() => {
            response.json({ message: 'Delete successfull' });
        })
        .catch((err) => {
            console.log(err);
            return response.status(500).json({error: err.code});
        });
}

exports.editProduce = (request, response) => {
    let document = db.collection('produce').doc(`${request.params.produceId}`)
    document.update(request.body)
    .then(() => {
        response.json({message: 'Updated successfully'});
    })
    .catch((err) => {
        console.log(err);
        return response.status(500).json({error: err.code});
    });
}