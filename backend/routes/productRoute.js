const express = require('express');
const upload = require('../middleware/multer')
const {
  addproduct,
  listproduct,
  removeproduct,
  singleproduct
} = require("../controllers/productController");

const { model } = require("mongoose");
const { UploadStream } = require('cloudinary');
const adminAuth = require('../middleware/adminAuth');

const productRouter = express.Router();

productRouter.post(
  "/addproduct", 
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 }
  ]),
  addproduct
);

productRouter.get('/listproduct',  listproduct)
productRouter.post('/removeproduct',adminAuth , removeproduct)
productRouter.post('/singleproduct', singleproduct)

module.exports = productRouter;