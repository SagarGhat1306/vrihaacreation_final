const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, required: true, default: "Order Placed", index: true },
    paymentMethod: { type: String, required: true, index: true },
    payment: { type: Boolean, required: true, default: false },

    // dummy razorpay reference
    razorpayOrderId: { type: String, default: "" },
    razorpayPaymentId: { type: String, default: "" },

    date: { type: Number, default: Date.now, index: true },
  },
  { timestamps: true }
);

orderSchema.index({ date: -1 });

const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);

module.exports = orderModel;
