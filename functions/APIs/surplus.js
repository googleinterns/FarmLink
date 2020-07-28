const { db } = require('../util/admin');

exports.getAllSurplus = (request, response) => {
    db.collection('surplus').get()
    .then((data) => {
        let surplus = [];
        data.forEach((doc) => {
            surplus.push({
                surplusId: doc.id,
                produceName: doc.data().produceName,
                originFarm: doc.data().originFarm,
                available: doc.data().available,
                cost: doc.data().cost,
                totalQuantityAvailable: doc.data().totalQuantityAvailable,
                packagingType: doc.data().packagingType,
            });
        });
        return response.json(surplus);
    })
    .catch((err) => {
        console.log(err);
        return response.status(500).json({error: err.code});
    });
}

exports.getOneSurplus = (request, response) => {
    db.doc(`/surplus/${request.params.surplusId}`).get()
    .then((doc) => {
        return response.json(doc.data());
    })
    .catch((err) => {
        console.log(err);
        return response.status(500).json({error: err.code});
    });
}

exports.postOneSurplus = (request, response) => {
    const newSurplusItem = {
        produceName: request.body.produceName,
        originFarm: request.body.originFarm,
        available: request.body.available === 'true',
        cost: parseFloat(request.body.cost),
        totalQuantityAvailable: parseFloat(request.body.totalQuantityAvailable),
        packagingType: request.body.packagingType,
    };
    db
        .collection('surplus')
        .add(newSurplusItem)
        .then((doc) => {
            let responseSurplusItem = newSurplusItem;
            responseSurplusItem.id = doc.id;
            return response.json(responseSurplusItem);
        })
        .catch((err) => {
            console.log(err);
            return response.status(500).json({error: err.code});
        });
}

exports.deleteSurplus = (request, response) => {
    const document = db.doc(`/surplus/${request.params.surplusId}`);
    document
        .get()
        .then((doc) => {
            if (!doc.exists) {
                return response.status(404).json({ error: 'Surplus Object not found' })
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

exports.editSurplus = (request, response) => {
    let document = db.collection('surplus').doc(`${request.params.surplusId}`)
    document.update(request.body)
    .then(() => {
        response.json({message: 'Updated successfully'});
    })
    .catch((err) => {
        console.log(err);
        return response.status(500).json({error: err.code});
    });
}