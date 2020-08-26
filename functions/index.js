const functions = require("firebase-functions");
const express = require("express");
const authRoute = require("./APIs/users");
const produceRoute = require("./APIs/produce");
const farmsRoute = require("./APIs/farms");
const foodbanksRoute = require("./APIs/foodbanks");
const surplusRoute = require("./APIs/surplus");
const dealsRoute = require("./APIs/deals");
const traveltimeQueriesRoute = require("./queries/traveltime");
const app = express();

app.use("/", authRoute);
app.use("/produce", produceRoute);
app.use("/farms", farmsRoute);
app.use("/foodbanks", foodbanksRoute);
app.use("/surplus", surplusRoute);
app.use("/deals", dealsRoute);
app.use("/", traveltimeQueriesRoute);

exports.api = functions.https.onRequest(app);
