const { db } = require('../util/admin');

exports.getAllFarms = (request, response) => {
    db.collection('farms').get()
    .then((data) => {
        let farms = [];
        data.forEach((doc) => {
            farms.push({
                farmId: doc.id,
                farmName: doc.data().farmName,
                location: doc.data().location,
                //hours: doc.data().hours,
                transportation: doc.data().transportation,
                contactName: doc.data().contactName,
                contactPhone: doc.data().contactPhone,
                contactEmail: doc.data().contactEmail,
                loadingDock: doc.data().loadingDoc,
                forklift: doc.data().forklift,
                farmTags: doc.data().farmTags,
                locationId: doc.data().locationId
            });
        });
        return response.json(farms);
    })
    .catch((err) => {
        console.log(err);
        return response.status(500).json({error: err.code});
    });
}

exports.getOneFarm = (request, response) => {
    db.doc(`/farms/${request.params.farmId}`).get()
    .then((doc) => {
        return response.json(doc.data());
    })
    .catch((err) => {
        console.log(err);
        return response.status(500).json({error: err.code});
    });
}

exports.postOneFarm = (request, response) => {
    const newFarmItem = {
        farmName: request.body.farmName,
        location: request.body.location,
        //hours: request.body.hours,
        transportation: request.body.transportation,// === 'true',
        contactName: request.body.contactName,
        contactPhone: request.body.contactPhone,
        contactEmail: request.body.contactEmail,
        loadingDock: request.body.loadingDock,// === 'true',
        forklift: request.body.forklift,// === 'true',
        farmTags: request.body.farmTags,
        locationId: request.body.locationId
    };
    db
        .collection('farms')
        .add(newFarmItem)
        .then((doc) => {
            let responseFarmItem = newFarmItem;
            responseFarmItem.id = doc.id;
            return response.json(responseFarmItem);
        })
        .catch((err) => {
            console.log(err);
            return response.status(500).json({error: err.code});
        });
}

exports.deleteFarm = (request, response) => {
    const document = db.doc(`/farms/${request.params.farmId}`);
    document
        .get()
        .then((doc) => {
            if (!doc.exists) {
                return response.status(404).json({ error: 'Farm Object not found' })
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

exports.editFarm = (request, response) => {
    let document = db.collection('farms').doc(`${request.params.farmId}`)
    document.update(request.body)
    .then(() => {
        response.json({message: 'Updated successfully'});
    })
    .catch((err) => {
        console.log(err);
        return response.status(500).json({error: err.code});
    });
}