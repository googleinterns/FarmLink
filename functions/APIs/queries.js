const { db } = require('../util/admin');
const axios = require('axios');
require('dotenv').config();

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

        //calculate distances between farms and food banks
        function calculateDistances(data) {
            return new Promise(function(resolve, reject) {
                axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=place_id:${request.query.locationId}&destinations=place_id:${data.locationId}&key=${process.env.API_KEY}`)
                .then((response) => {
                    let distance = response.data.rows[0].elements[0].distance.text;
                    if (parseInt(distance.split(" ")[0].replace(/,/g, "")) < request.query.distance) {
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

        Promise.all(foodbanks.map(calculateDistances))
        .then((results) => {
            return response.json(results.filter(result => result != null));
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

        //calculate distances between farms and food banks
        function calculateDistances(data) {
            return new Promise(function(resolve, reject) {
                axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=place_id:${request.query.locationId}&destinations=place_id:${data.locationId}&key=${process.env.API_KEY}`)
                .then((response) => {
                    let distance = response.data.rows[0].elements[0].distance.text;
                    if (parseInt(distance.split(" ")[0].replace(/,/g, "")) < request.query.distance) {
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

        Promise.all(farms.map(calculateDistances))
        .then((results) => {
            return response.json(results.filter(result => result != null));
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