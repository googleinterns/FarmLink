const { db } = require('../util/admin');

exports.getAllFoodBanks = (request, response) => {
    db.collection('foodbanks').get()
    .then((data) => {
        let foodbanks = [];
        data.forEach((doc) => {
            foodbanks.push({
                foodbankId: doc.id,
                foodbankName: doc.data().foodbankName,
                location: doc.data().location,
                hours: doc.data().hours,
                contactName: doc.data().contactName,
                contactPhone: doc.data().contactPhone,
                contactEmail: doc.data().contactEmail,
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
        return response.status(500).json({error: err.code});
    });
}

exports.getOneFoodBank = (request, response) => {
    db.doc(`/foodbanks/${request.params.foodbankId}`).get()
    .then((doc) => {
        return response.json(doc.data());
    })
    .catch((err) => {
        console.log(err);
        return response.status(500).json({error: err.code});
    });
}

exports.postOneFoodBank = (request, response) => {
    const newFoodBankItem = {
        foodbankName: request.body.foodbankName,
        location: request.body.location,
        hours: request.body.hours,
        contactName: request.body.contactName,
        contactPhone: request.body.contactPhone,
        contactEmail: request.body.contactEmail,
        forklift: request.body.forklift === 'true',
        pallet: request.body.pallet === 'true',
        loadingDock: request.body.loadingDock === 'true',
        maxLoadSize: parseFloat(request.body.maxLoadSize),
        refrigerationSpaceAvailable: parseFloat(request.body.refrigerationSpaceAvailable),
        foodbankTags: request.body.foodbankTags,
    };
    db
        .collection('foodbanks')
        .add(newFoodBankItem)
        .then((doc) => {
            let responseFoodBankItem = newFoodBankItem;
            responseFoodBankItem.id = doc.id;
            return response.json(responseFoodBankItem);
        })
        .catch((err) => {
            console.log(err);
            return response.status(500).json({error: err.code});
        });
}

exports.deleteFoodBank = (request, response) => {
    const document = db.doc(`/foodbanks/${request.params.foodbankId}`);
    document
        .get()
        .then((doc) => {
            if (!doc.exists) {
                return response.status(404).json({ error: 'FoodBank Object not found' })
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

exports.editFoodBank = (request, response) => {
    let document = db.collection('foodbanks').doc(`${request.params.foodbankId}`)
    document.update(request.body)
    .then(() => {
        response.json({message: 'Updated successfully'});
    })
    .catch((err) => {
        console.log(err);
        return response.status(500).json({error: err.code});
    });
}