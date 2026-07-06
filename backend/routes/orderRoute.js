const express = require("express");
const adminauth = require("../middleware/adminAuth");
const authuser = require("../middleware/auth");
const {
  placeorder,
  placeorderStrip,
  placeorderRazorpay,
  verifyRazorpay,
  allOrders,
  userorders,
  updateStatus,
} = require("../controllers/orderController");

const orderRouter = express.Router();

// admin feature
orderRouter.post("/list", adminauth, allOrders);
orderRouter.post("/status", adminauth, updateStatus);

// payment feature
orderRouter.post("/place", authuser, placeorder);
orderRouter.post("/stripe", authuser, placeorderStrip);
orderRouter.post("/razorpay", authuser, placeorderRazorpay);
orderRouter.post("/verifyRazorpay", authuser, verifyRazorpay);

// user feature
orderRouter.post("/userorders", authuser, userorders);

module.exports = orderRouter;
