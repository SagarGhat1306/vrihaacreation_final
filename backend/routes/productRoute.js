const express = require("express");
const upload = require("../middleware/multer");

const {
  addproduct,
  sellerAddProduct,
  listproduct,
  adminListProducts,
  updateProductStatus,
  updateStock,
  checkAvailability,
  removeproduct,
  singleproduct,
  sellerListProducts,
} = require("../controllers/productController");

const adminAuth = require("../middleware/adminAuth");
const sellerAuth = require("../middleware/sellerAuth");

const productRouter = express.Router();

const imageFields = upload.fields([
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 },
  { name: "image3", maxCount: 1 },
  { name: "image4", maxCount: 1 },
]);

// admin
productRouter.post("/addproduct", adminAuth, imageFields, addproduct);
productRouter.get("/adminlist", adminAuth, adminListProducts);
productRouter.post("/status", adminAuth, updateProductStatus);
productRouter.post("/removeproduct", adminAuth, removeproduct);
productRouter.post("/stock", adminAuth, updateStock);

// seller (third-party)
productRouter.post("/seller/add", sellerAuth, imageFields, sellerAddProduct);
productRouter.get("/seller/list", sellerAuth, sellerListProducts);

// public / frontend — kept as-is, now with optional query params
productRouter.get("/listproduct", listproduct);
productRouter.post("/singleproduct", singleproduct);
productRouter.post("/availability", checkAvailability);

module.exports = productRouter;
