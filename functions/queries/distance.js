const { db } = require('../util/admin');
const axios = require('axios');
const _ = require('lodash');
require('dotenv').config();

//calculate distances between farms and food banks
function calculateDistances(data, request) {
    return new Promise(function(resolve, reject) {
        const url = new URL("https://maps.googleapis.com/maps/api/distancematrix/json");
        url.searchParams.set("units", "imperial");
        url.searchParams.set("origins", `place_id:${request.query.locationId}`);
        url.searchParams.set("destinations", `place_id:${data.locationId}`);
        url.searchParams.set("key", process.env.API_KEY);
        axios.get(url.href)
        .then((response) => {
            let distanceValue = response.data.rows[0].elements[0].distance.value;
            let distanceText = response.data.rows[0].elements[0].distance.text;
            if (parseInt(distanceText.split(" ")[0].replace(/,/g, "")) < parseInt(request.query.distance)) {
                data["distanceValue"] = distanceValue;
                data["distanceText"] = distanceText;
                resolve(data);
            }
            else {
                resolve();
            }
        })
        .catch((err) => {
            return reject(err);
        });
    })
}

/*
find food banks that are a specific distance from a farm
GET /queryFoodBanksByDistance
URL params: locationId, distance (miles)
success response: array of food bank objects
*/
exports.queryFoodBanksByDistance = (request, response) => {
    db.collection('foodbanks').get()
    .then((data) => {
        let foodbanks = [];
        data.forEach((doc) => {
            foodbanks.push(doc.data());
        });

        Promise.all(foodbanks.map(function(foodbank) {
            return calculateDistances(foodbank, request);
        }))
        .then((results) => {
            results = results.filter(result => result != null);
            results = _.orderBy(results, ["distanceValue"]);
            return response.json(results);
        })
        .catch((err) => {
            console.log(err);
        });
    })
    .catch((err) => {
        console.log(err);
        return response.status(500).json({error: err.code});
    });
}

/*
find farms that are a specific distance from a food bank
GET /queryFarmsByDistance
URL params: locationId, distance (miles)
success response: array of farm objects
*/
exports.queryFarmsByDistance = (request, response) => {
    db.collection('farms').get()
    .then((data) => {
        let farms = [];
        data.forEach((doc) => {
            farms.push(doc.data());
        });

        Promise.all(farms.map(function(farm) {
            return calculateDistances(farm, request);
        }))
        .then((results) => {
            results = results.filter(result => result != null);
            results = _.orderBy(results, ["distanceValue"]);
            return response.json(results);
        })
        .catch((err) => {
            console.log(err);
        });
    })
    .catch((err) => {
        console.log(err);
        return response.status(500).json({error: err.code});
    });
}

/*
find farms with surplus that are a specific distance from a food bank
GET /querySurplusByDistance
URL params: locationId, distance (miles)
success response: array of surplus objects
*/
exports.querySurplusByDistance = (request, response) => {
    db.collection('surplus').get()
    .then((data) => {
        let surplus = [];
        data.forEach((doc) => {
            surplus.push(doc.data());
        });

        function queryFarms(data) {
            return new Promise(function(resolve, reject) {
                db.doc(`/farms/${data.originFarmId}`).get()
                .then((doc) => {
                    let surplus = data;
                    let farm = doc.data();
                    resolve({
                        ...surplus,
                        ...farm
                    });
                })
                .catch((err) => {
                    return reject(err);
                });
            });
        }

        Promise.all(surplus.map(queryFarms))
        .then((results) => {
            Promise.all(results.map(function(result) {
                return calculateDistances(result, request);
            }))
            .then((results) => {
                results = results.filter(result => result != null);
                results = _.orderBy(results, ["distanceValue"]);
                return response.json(results);
            })
            .catch((err) => {
                console.log(err);
            });
        })
        .catch((err) => {
            console.log(err);
        });
    })
    .catch((err) => {
        console.log(err);
        return response.status(500).json({error: err.code});
    });
}