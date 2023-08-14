const express = require('express');
const Route = express.Router();
const path = require('path');
const ApiController = require('../controller/ApiController');

Route.get('/getItem', ApiController.item);
Route.get('/single/:id', ApiController.singleItem);

Route.post('/registration', ApiController.addUser);
Route.post('/login', ApiController.login);
Route.get('/profile/:id', ApiController.profile);

Route.post('/contact', ApiController.contact);
Route.post('/buynow', ApiController.BuyNow);
module.exports = Route;