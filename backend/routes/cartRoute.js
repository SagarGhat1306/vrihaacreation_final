const express = require('express');

const {
addToCart,
updateCart,
getUserCart
} = require("../controllers/cartController");
const authuser = require('../middleware/auth');

const cartRouter = express.Router()

cartRouter.get('/get' , authuser,   getUserCart)
cartRouter.post('/add' , authuser,   addToCart)
cartRouter.post('/update' ,authuser,   updateCart)

module.exports = cartRouter;