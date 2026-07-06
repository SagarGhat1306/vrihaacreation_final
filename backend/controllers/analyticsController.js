const orderModel = require("../models/OrderModel");
const productModel = require("../models/ProductModel");
const userModel = require("../models/UserModel");

/*
 * All analytics accept optional filters:
 *   ?from=2026-01-01&to=2026-01-31          (date range)
 *   ?paymentMethod=COD|Razorpay
 *   ?status=Delivered|Shipped|...
 *   ?category=Men                            (top products / category sales)
 */

const buildOrderMatch = (query) => {
  const match = {};

  if (query.from || query.to) {
    match.date = {};
    if (query.from) match.date.$gte = new Date(query.from).getTime();
    if (query.to) {
      const to = new Date(query.to);
      to.setHours(23, 59, 59, 999);
      match.date.$lte = to.getTime();
    }
  }
  if (query.paymentMethod) match.paymentMethod = query.paymentMethod;
  if (query.status) match.status = query.status;

  return match;
};

// KPI cards: revenue, orders, avg order value, units, users, low stock
const summary = async (req, res) => {
  try {
    const match = buildOrderMatch(req.query);

    const [orderStats] = await orderModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
          totalOrders: { $sum: 1 },
          paidOrders: { $sum: { $cond: ["$payment", 1, 0] } },
          codOrders: { $sum: { $cond: [{ $eq: ["$paymentMethod", "COD"] }, 1, 0] } },
        },
      },
    ]);

    const [unitStats] = await orderModel.aggregate([
      { $match: match },
      { $unwind: "$items" },
      { $group: { _id: null, unitsSold: { $sum: "$items.quantity" } } },
    ]);

    const [totalUsers, totalProducts, pendingProducts, lowStock] = await Promise.all([
      userModel.countDocuments({ role: "user" }),
      productModel.countDocuments({ status: "approved" }),
      productModel.countDocuments({ status: "pending" }),
      productModel.countDocuments({
        status: "approved",
        sizes: { $elemMatch: { stock: { $lte: 5 } } },
      }),
    ]);

    const totalRevenue = orderStats?.totalRevenue || 0;
    const totalOrders = orderStats?.totalOrders || 0;

    res.json({
      success: true,
      summary: {
        totalRevenue,
        totalOrders,
        avgOrderValue: totalOrders ? Math.round(totalRevenue / totalOrders) : 0,
        unitsSold: unitStats?.unitsSold || 0,
        paidOrders: orderStats?.paidOrders || 0,
        codOrders: orderStats?.codOrders || 0,
        totalUsers,
        totalProducts,
        pendingProducts,
        lowStockProducts: lowStock,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// daily sales line chart (revenue + orders per day)
const salesOverTime = async (req, res) => {
  try {
    const match = buildOrderMatch(req.query);

    const data = await orderModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: { $toDate: "$date" },
            },
          },
          revenue: { $sum: "$amount" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, day: "$_id", revenue: 1, orders: 1 } },
    ]);

    res.json({ success: true, data });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// which products sold the most (with optional category filter)
const topProducts = async (req, res) => {
  try {
    const match = buildOrderMatch(req.query);
    const limit = Math.min(50, Number(req.query.limit) || 10);

    const pipeline = [
      { $match: match },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items._id",
          name: { $first: "$items.name" },
          category: { $first: "$items.category" },
          image: { $first: "$items.image" },
          unitsSold: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
    ];

    if (req.query.category) {
      pipeline.push({ $match: { category: req.query.category } });
    }

    pipeline.push({ $sort: { unitsSold: -1 } }, { $limit: limit });

    const products = await orderModel.aggregate(pipeline);
    res.json({ success: true, products });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// revenue split by category (pie / bar)
const salesByCategory = async (req, res) => {
  try {
    const match = buildOrderMatch(req.query);

    const data = await orderModel.aggregate([
      { $match: match },
      { $unwind: "$items" },
      {
        $group: {
          _id: { $ifNull: ["$items.category", "Uncategorised"] },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          unitsSold: { $sum: "$items.quantity" },
        },
      },
      { $sort: { revenue: -1 } },
      { $project: { _id: 0, category: "$_id", revenue: 1, unitsSold: 1 } },
    ]);

    res.json({ success: true, data });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// order status funnel (Order Placed -> Delivered)
const ordersByStatus = async (req, res) => {
  try {
    const match = buildOrderMatch(req.query);

    const data = await orderModel.aggregate([
      { $match: match },
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $project: { _id: 0, status: "$_id", count: 1 } },
    ]);

    res.json({ success: true, data });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// products running out — restock alerts
const lowStock = async (req, res) => {
  try {
    const threshold = Number(req.query.threshold) || 5;

    const products = await productModel
      .find({
        status: "approved",
        sizes: { $elemMatch: { stock: { $lte: threshold } } },
      })
      .select("name category image sizes sellerName")
      .lean();

    res.json({ success: true, products, threshold });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

module.exports = {
  summary,
  salesOverTime,
  topProducts,
  salesByCategory,
  ordersByStatus,
  lowStock,
};
