const express = require('express');
const adminauth = require('../middleware/adminAuth')
const authuser = require('../middleware/auth')
const {
 placeorder,placeorderStrip, placeordeRazorpay, allOrders,  userorders, updateStatus
} = require("../controllers/orderController");


const orderRouter = express.Router()

// admin feture 
orderRouter.post('/list', allOrders)
orderRouter.post('/status' ,  adminauth, updateStatus )

// payment feture

orderRouter.post('/place',authuser, placeorder)
orderRouter.post('/stripe',authuser, placeorderStrip)
orderRouter.post('/razorpay',authuser, placeordeRazorpay)

// user feture 
orderRouter.post('/userorders',authuser, userorders)

module.exports = orderRouter;