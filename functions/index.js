//index.js

const functions = require("firebase-functions");
const express = require("express");
const app = express();
const auth = require("./util/auth");

const {
  getAllProduce,
  postOneProduce,
  getOneProduce,
  deleteProduce,
  editProduce,
} = require("./APIs/produce");
const {
  getAllFarms,
  postOneFarm,
  getOneFarm,
  deleteFarm,
  editFarm,
} = require("./APIs/farms");
const {
  getAllFoodBanks,
  postOneFoodBank,
  getOneFoodBank,
  deleteFoodBank,
  editFoodBank,
} = require("./APIs/foodbanks");
const {
  getAllSurplus,
  postOneSurplus,
  getOneSurplus,
  deleteSurplus,
  editSurplus,
} = require("./APIs/surplus");
const {
  getAllDeals,
  postOneDeal,
  getOneDeal,
  deleteDeal,
  editDeal,
} = require("./APIs/deals");
const {
  queryFoodBanksByDistance,
  queryFarmsByDistance,
  querySurplusByDistance,
  queryFoodBanksByTravelTime,
  queryFarmsByTravelTime,
  querySurplusByTravelTime,
} = require("./APIs/queries");

app.get("/produce", auth, getAllProduce);
app.get("/produce/:produceId", auth, getOneProduce);
app.post("/produce", auth, postOneProduce);
app.delete("/produce/:produceId", auth, deleteProduce);
app.put("/produce/:produceId", auth, editProduce);

app.get("/farms", auth, getAllFarms);
app.get("/farms/:farmId", auth, getOneFarm);
app.post("/farms", auth, postOneFarm);
app.delete("/farms/:farmId", auth, deleteFarm);
app.put("/farms/:farmId", auth, editFarm);

app.get("/foodbanks", auth, getAllFoodBanks);
app.get("/foodbanks/:foodbankId", auth, getOneFoodBank);
app.post("/foodbanks", auth, postOneFoodBank);
app.delete("/foodbanks/:foodbankId", auth, deleteFoodBank);
app.put("/foodbanks/:foodbankId", auth, editFoodBank);

app.get("/surplus", auth, getAllSurplus);
app.get("/surplus/:surplusId", auth, getOneSurplus);
app.post("/surplus", auth, postOneSurplus);
app.delete("/surplus/:surplusId", auth, deleteSurplus);
app.put("/surplus/:surplusId", auth, editSurplus);

app.get("/deals", auth, getAllDeals);
app.get("/deals/:dealId", auth, getOneDeal);
app.post("/deals", auth, postOneDeal);
app.delete("/deals/:dealId", auth, deleteDeal);
app.put("/deals/:dealId", auth, editDeal);

app.get("/queryFoodBanksByDistance", auth, queryFoodBanksByDistance);
app.get("/queryFarmsByDistance", auth, queryFarmsByDistance);
app.get("/querySurplusByDistance", auth, querySurplusByDistance);
app.get("/queryFoodBanksByTravelTime", auth, queryFoodBanksByTravelTime);
app.get("/queryFarmsByTravelTime", auth, queryFarmsByTravelTime);
app.get("/querySurplusByTravelTime", auth, querySurplusByTravelTime);

const {
  loginUser,
  signUpUser,
  uploadProfilePhoto,
  getUserDetail,
  updateUserDetails,
} = require("./APIs/users");

// Users
app.post("/login", loginUser);
app.post("/signup", signUpUser);
app.post("/user/image", auth, uploadProfilePhoto);
app.get("/user", auth, getUserDetail);
app.post("/user", auth, updateUserDetails);

exports.api = functions.https.onRequest(app);
