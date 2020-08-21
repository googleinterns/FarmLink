const { db } = require('../util/admin');
const axios = require('axios');
const _ = require('lodash');
require('dotenv').config();

//calculate travel times between farms and food banks
function calculateTravelTimes(data, request) {
    return new Promise(function(resolve, reject) {
        const url = new URL("https://maps.googleapis.com/maps/api/distancematrix/json");
        url.searchParams.set("units", "imperial");
        url.searchParams.set("origins", `place_id:${request.query.locationId}`);
        url.searchParams.set("destinations", `place_id:${data.locationId}`);
        url.searchParams.set("key", process.env.API_KEY);
        axios.get(url.href)
        .then((response) => {
            let durationValue = response.data.rows[0].elements[0].duration.value;
            let durationText = response.data.rows[0].elements[0].duration.text;
            durationText = durationText.split(" ");
            let days = parseInt(durationText[durationText.indexOf("days") - 1]);
            let hours = parseInt(durationText[durationText.indexOf("hours") - 1]);
            let minutes = parseInt(durationText[durationText.indexOf("mins") - 1]);
            days = (isNaN(days)) ? 0 : days;
            hours = (isNaN(hours)) ? 0 : hours;
            minutes = (isNaN(minutes)) ? 0 : minutes;
            if (convertTime(days, hours, minutes) < convertTime(parseInt(request.query.days), parseInt(request.query.hours), parseInt(request.query.minutes))) {
                data["durationValue"] = durationValue;
                data["durationText"] = durationText.join(" ");
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

//convert time from days, hours, and minutes to minutes
function convertTime(days, hours, minutes) {
    return (24 * 60 * days) + (60 * hours) + minutes;
}

/*
find food banks that are a specific travel time from a farm
GET /queryFoodBanksByTravelTime
URL params: locationId, days, hours, minutes
success response: array of food bank objects
*/
exports.queryFoodBanksByTravelTime = (request, response) => {
    db.collection('foodbanks').get()
    .then((data) => {
        let foodbanks = [];
        data.forEach((doc) => {
            foodbanks.push(doc.data());
        });

        Promise.all(foodbanks.map(function(foodbank) {
            return calculateTravelTimes(foodbank, request);
        }))
        .then((results) => {
            results = results.filter(result => result != null);
            results = _.orderBy(results, ["durationValue"]);
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
find farms that are a specific travel time from a food bank
GET /queryFarmsByTravelTime
URL params: locationId, days, hours, minutes
success response: array of farm objects
*/
exports.queryFarmsByTravelTime = (request, response) => {
    db.collection('farms').get()
    .then((data) => {
        let farms = [];
        data.forEach((doc) => {
            farms.push(doc.data());
        });

        Promise.all(farms.map(function(farm) {
            return calculateTravelTimes(farm, request);
        }))
        .then((results) => {
            results = results.filter(result => result != null);
            results = _.orderBy(results, ["durationValue"]);
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
find farms with surplus that are a specific travel time from a food bank
GET /querySurplusByTravelTime
URL params: locationId, days, hours, minutes
success response: array of surplus objects
*/
exports.querySurplusByTravelTime = (request, response) => {
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
                return calculateTravelTimes(result, request);
            }))
            .then((results) => {
                results = results.filter(result => result != null);
                results = _.orderBy(results, ["durationValue"]);
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