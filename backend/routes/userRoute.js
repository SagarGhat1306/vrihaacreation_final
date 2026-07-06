const express = require("express");
const {
  loginUser,
  registerUser,
  adminLogin,
  applySeller,
  registerSeller,
  listSellers,
  updateSellerStatus,
} = require("../controllers/userController");
const authuser = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);

// seller (third-party) flows
userRouter.post("/seller/register", registerSeller);
userRouter.post("/seller/apply", authuser, applySeller);

// admin manages sellers
userRouter.get("/sellers", adminAuth, listSellers);
userRouter.post("/seller/status", adminAuth, updateSellerStatus);

module.exports = userRouter;
