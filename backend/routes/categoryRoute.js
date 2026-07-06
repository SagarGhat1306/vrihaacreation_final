const express = require("express");
const upload = require("../middleware/multer");
const adminAuth = require("../middleware/adminAuth");
const {
  listCategories,
  listAllCategories,
  addCategory,
  updateCategory,
  removeCategory,
} = require("../controllers/categoryController");

const categoryRouter = express.Router();

// public — storefront navbar + admin dropdowns
categoryRouter.get("/list", listCategories);

// admin
categoryRouter.get("/all", adminAuth, listAllCategories);
categoryRouter.post("/add", adminAuth, upload.single("image"), addCategory);
categoryRouter.post("/update", adminAuth, upload.single("image"), updateCategory);
categoryRouter.post("/remove", adminAuth, removeCategory);

module.exports = categoryRouter;
