const { db } = require('../util/admin');

/*
read a list of all farms
GET /farms
success response: array of farm objects (documented in POST /farms)
*/
exports.getAllFarms = (request, response) => {
    db.collection('farms').get()
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
        return response.json(farms);
    })
    .catch((err) => {
        console.log(err);
        return response.status(500).json({error: err.code});
    });
}

/*
read a specific farm
GET /farms/:id
success response: farm object (documented in POST /farms)
*/
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
exports.postOneFarm = (request, response) => {
    const newFarmItem = {
        farmName: request.body.farmName,
        location: request.body.location,
        hours: request.body.hours,
        transportation: request.body.transportation === 'true',
        contacts: request.body.contacts,
        loadingDock: request.body.loadingDock === 'true',
        forklift: request.body.forklift === 'true',
        farmTags: request.body.farmTags,
    };
    db.collection('farms').add(newFarmItem)
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

/*
delete a specific farm
DELETE /farms/:id
success response: {message: 'Delete successfull'}
*/
exports.deleteFarm = (request, response) => {
    const document = db.doc(`/farms/${request.params.farmId}`);
    document.get()
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

/*
update a specific farm
PUT /farms/:id
success response: {message: 'Updated successfully'}
*/
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