const { db } = require('../util/admin');

/*
read a list of all deals
GET /deals
success response: array of deal objects
*/
exports.getAllDeals = (request, response) => {
    db.collection('deals').get()
    .then((data) => {
        let deals = [];
        data.forEach((doc) => {
            deals.push({
                dealId: doc.id,
                farmId: doc.data().farmId,
                foodbankId: doc.data().foodbankId,
                surplusId: doc.data().surplusId,
                farmContactKey: doc.data().farmContactKey,
                foodbankContactKey: doc.data().foodbankContactKey,
                farmlinkContactName: doc.data().farmlinkContactName,
                farmlinkContactPhone: doc.data().farmlinkContactPhone,
                farmlinkContactEmail: doc.data().farmlinkContactEmail,
                pickupDate: doc.data().pickupDate,
                pickupTime: doc.data().pickupTime,
                deliveryDate: doc.data().deliveryDate,
                deliveryTime: doc.data().deliveryTime,
                bill: doc.data().bill,
                fundsPaidToFarm: doc.data().fundsPaidToFarm,
                fundsPaidForShipping: doc.data().fundsPaidForShipping,
                totalSpent: doc.data().totalSpent,
                invoice: doc.data().invoice,
                associatedPress: doc.data().associatedPress,
                notes: doc.data().notes,
            });
        });
        return response.json(deals);
    })
    .catch((err) => {
        console.log(err);
        return response.status(500).json({error: err.code});
    });
}

/*
read a specific deal
GET /deals/:id
success response: deal object
*/
exports.getOneDeal = (request, response) => {
    db.doc(`/deals/${request.params.dealId}`).get()
    .then((doc) => {
        return response.json(doc.data());
    })
    .catch((err) => {
        console.log(err);
        return response.status(500).json({error: err.code});
    });
}

/*
create a new deal
POST /deals
data params:
{
    farmId: [string],
    foodbankId: [string],
    surplusId: [string],
    farmContactKey: [string],
    foodbankContactKey: [string],
    farmlinkContactName: [string],
    farmlinkContactPhone: [string],
    farmlinkContactEmail: [string],
    pickupDate: [string],
    pickupTime: [string],
    deliveryDate: [string],
    deliveryTime: [string],
    bill: [string],
    fundsPaidToFarm: [number],
    fundsPaidForShipping: [number],
    totalSpent: [number],
    invoice: [string],
    associatedPress: [array],
    notes: [string]
}
success response: deal object
*/
exports.postOneDeal = (request, response) => {
    const newDealItem = {
        farmId: request.body.farmId,
        foodbankId: request.body.foodbankId,
        surplusId: request.body.surplusId,
        farmContactKey: request.body.farmContactKey, //the index of the contact in the contacts array
        foodbankContactKey: request.body.foodbankContactKey, //the index of the contact in the contacts array
        farmlinkContactName: request.body.farmlinkContactName,
        farmlinkContactPhone: request.body.farmlinkContactPhone,
        farmlinkContactEmail: request.body.farmlinkContactEmail,
        pickupDate: request.body.pickupDate,
        pickupTime: request.body.pickupTime,
        deliveryDate: request.body.deliveryDate,
        deliveryTime: request.body.deliveryTime,
        bill: request.body.bill,
        fundsPaidToFarm: parseFloat(request.body.fundsPaidToFarm),
        fundsPaidForShipping: parseFloat(request.body.fundsPaidForShipping),
        totalSpent: parseFloat(request.body.totalSpent),
        invoice: request.body.invoice,
        associatedPress: request.body.associatedPress,
        notes: request.body.notes,
    };
    db.collection('deals').add(newDealItem)
    .then((doc) => {
        let responseDealItem = newDealItem;
        responseDealItem.id = doc.id;
        return response.json(responseDealItem);
    })
    .catch((err) => {
        console.log(err);
        return response.status(500).json({error: err.code});
    });
}

/*
delete a specific deal
DELETE /deals/:id
success response: {message: 'Delete successfull'}
*/
exports.deleteDeal = (request, response) => {
    const document = db.doc(`/deals/${request.params.dealId}`);
    document.get()
    .then((doc) => {
        if (!doc.exists) {
            return response.status(404).json({ error: 'Deal Object not found' })
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
update a specific deal
PUT /deals/:id
success response: {message: 'Updated successfully'}
*/
exports.editDeal = (request, response) => {
    let document = db.collection('deals').doc(`${request.params.dealId}`)
    document.update(request.body)
    .then(() => {
        response.json({message: 'Updated successfully'});
    })
    .catch((err) => {
        console.log(err);
        return response.status(500).json({error: err.code});
    });
}