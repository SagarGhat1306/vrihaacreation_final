const crypto = require("crypto");
const orderModel = require("../models/OrderModel");
const userModel = require("../models/UserModel");
const productModel = require("../models/ProductModel");

/*
 * STOCK RESERVATION (prevents double booking / overselling)
 * -----------------------------------------------------------------
 * For every item we run ONE atomic MongoDB operation:
 *   filter:  { _id, sizes: { $elemMatch: { size, stock: { $gte: qty } } } }
 *   update:  { $inc: { "sizes.$.stock": -qty, soldCount: qty, revenue: price*qty } }
 *
 * MongoDB executes each updateOne atomically, so if 500 users try to buy
 * the last piece at the same moment, exactly ONE update matches — everyone
 * else gets "out of stock". If any item in the cart fails, we roll back
 * the items already reserved.
 */
const reserveStock = async (items) => {
  const reserved = [];

  for (const item of items) {
    const qty = Number(item.quantity) || 0;
    if (qty <= 0) continue;

    const result = await productModel.updateOne(
      {
        _id: item._id,
        status: "approved",
        sizes: { $elemMatch: { size: item.size, stock: { $gte: qty } } },
      },
      {
        $inc: {
          "sizes.$.stock": -qty,
          soldCount: qty,
          revenue: (Number(item.price) || 0) * qty,
        },
      }
    );

    if (result.modifiedCount === 0) {
      // rollback everything reserved so far
      await releaseStock(reserved);
      const err = new Error(
        `"${item.name}" (size ${item.size}) is out of stock or has insufficient quantity`
      );
      err.outOfStock = true;
      throw err;
    }

    reserved.push(item);
  }

  return reserved;
};

const releaseStock = async (items) => {
  for (const item of items) {
    const qty = Number(item.quantity) || 0;
    if (qty <= 0) continue;
    await productModel.updateOne(
      { _id: item._id, "sizes.size": item.size },
      {
        $inc: {
          "sizes.$.stock": qty,
          soldCount: -qty,
          revenue: -(Number(item.price) || 0) * qty,
        },
      }
    );
  }
};

// ---------------- COD ----------------
const placeorder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    if (!items || items.length === 0) {
      return res.json({ success: false, message: "Cart is empty" });
    }

    // 1. reserve stock atomically (throws if anything unavailable)
    await reserveStock(items);

    // 2. create the order
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    const neworder = new orderModel(orderData);
    await neworder.save();

    // 3. clear the user cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order placed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ---------------- RAZORPAY (DUMMY) ----------------
// Step 1: create a dummy razorpay order + reserve stock.
// Stock is reserved here so two users can't pay for the same last piece.
const placeorderRazorpay = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    if (!items || items.length === 0) {
      return res.json({ success: false, message: "Cart is empty" });
    }

    await reserveStock(items);

    const razorpayOrderId = "order_dummy_" + crypto.randomBytes(8).toString("hex");

    const neworder = new orderModel({
      userId,
      items,
      address,
      amount,
      paymentMethod: "Razorpay",
      payment: false,
      razorpayOrderId,
      date: Date.now(),
    });
    await neworder.save();

    // what a real razorpay order response looks like (dummy)
    res.json({
      success: true,
      order: {
        id: razorpayOrderId,
        amount: amount * 100, // razorpay uses paise
        currency: "INR",
        receipt: neworder._id.toString(),
        key: "rzp_test_dummykey123",
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Step 2: verify (dummy). success:true -> mark paid + clear cart.
// success:false -> release the reserved stock and delete the order.
const verifyRazorpay = async (req, res) => {
  try {
    const { userId, razorpayOrderId, success } = req.body;

    const order = await orderModel.findOne({ razorpayOrderId });
    if (!order) return res.json({ success: false, message: "Order not found" });

    if (success === true || success === "true") {
      order.payment = true;
      order.razorpayPaymentId = "pay_dummy_" + crypto.randomBytes(8).toString("hex");
      await order.save();

      await userModel.findByIdAndUpdate(userId, { cartData: {} });

      return res.json({ success: true, message: "Payment successful, order placed" });
    }

    // payment failed / cancelled -> give the stock back
    await releaseStock(order.items);
    await orderModel.findByIdAndDelete(order._id);

    res.json({ success: false, message: "Payment failed, order cancelled" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const placeorderStrip = async (req, res) => {
  res.json({ success: false, message: "Stripe not enabled yet" });
};

// ---------------- ADMIN ----------------
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ date: -1 }).lean();
    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const userorders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId }).sort({ date: -1 }).lean();

    if (!orders || orders.length === 0) {
      return res.json({ success: true, Orders: [], message: "No orders found" });
    }
    res.json({ success: true, Orders: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const order = await orderModel.findById(orderId);
    if (!order) return res.json({ success: false, message: "Order not found" });

    // restore stock when an order gets cancelled
    if (status === "Cancelled" && order.status !== "Cancelled") {
      await releaseStock(order.items);
    }

    order.status = status;
    await order.save();
    res.json({ success: true, message: "status updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

module.exports = {
  placeorder,
  placeorderStrip,
  placeorderRazorpay,
  verifyRazorpay,
  allOrders,
  userorders,
  updateStatus,
};
