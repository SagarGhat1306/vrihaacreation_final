const express = require("express");
const adminAuth = require("../middleware/adminAuth");
const {
  summary,
  salesOverTime,
  topProducts,
  salesByCategory,
  ordersByStatus,
  lowStock,
} = require("../controllers/analyticsController");

const analyticsRouter = express.Router();

analyticsRouter.get("/summary", adminAuth, summary);
analyticsRouter.get("/sales-over-time", adminAuth, salesOverTime);
analyticsRouter.get("/top-products", adminAuth, topProducts);
analyticsRouter.get("/sales-by-category", adminAuth, salesByCategory);
analyticsRouter.get("/orders-by-status", adminAuth, ordersByStatus);
analyticsRouter.get("/low-stock", adminAuth, lowStock);

module.exports = analyticsRouter;
