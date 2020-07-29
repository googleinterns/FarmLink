//index.js

const functions = require('firebase-functions');
const app = require('express')();
const auth = require('./util/auth');

const {
    getAllTodos,
    postOneTodo,
    getOneTodo,
    deleteTodo,
    editTodo,
} = require('./APIs/todos')

exports.api = functions.https.onRequest(app);
app.get('/todos', auth, getAllTodos);
app.get('/todos', auth, getOneTodo);
app.post('/todo', auth, postOneTodo);
app.delete('/todo/:todoId', auth, deleteTodo);
app.put('/todo/:todoId', auth, editTodo);

const {
    loginUser,
    signUpUser,
    uploadProfilePhoto,
    getUserDetail,
    updateUserDetails
} = require('./APIs/users')

// Users
app.post('/login', loginUser);
app.post('/signup', signUpUser);
app.post('/user/image', auth, uploadProfilePhoto);
app.get('/user', auth, getUserDetail);
app.post('/user', auth, updateUserDetails);

// Produce
const {
    getAllProduce,
    postOneProduce,
    getOneProduce,
    deleteProduce,
    editProduce,
} = require('./APIs/produce')

exports.api = functions.https.onRequest(app);
app.get('/produce', auth, getAllProduce);
app.get('/produce/:produceId', auth, getOneProduce);
app.post('/produce', auth, postOneProduce);
app.delete('/produce/:produceId', auth, deleteProduce);
app.put('/produce/:produceId', auth, editProduce);

// Farms
const {
    getAllFarms,
    postOneFarm,
    getOneFarm,
    deleteFarm,
    editFarm,
} = require('./APIs/farms')

exports.api = functions.https.onRequest(app);
app.get('/farms', auth, getAllFarms);
app.get('/farms/:farmId', auth, getOneFarm);
app.post('/farms', auth, postOneFarm);
app.delete('/farms/:farmId', auth, deleteFarm);
app.put('/farms/:farmId', auth, editFarm);



