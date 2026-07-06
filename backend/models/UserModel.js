const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },

    // 'user' = shopper, 'seller' = third-party seller, 'admin' = you
    role: {
      type: String,
      enum: ["user", "seller", "admin"],
      default: "user",
      index: true,
    },

    // seller specific
    sellerStatus: {
      type: String,
      enum: ["none", "pending", "approved", "blocked"],
      default: "none",
    },
    shopName: { type: String, default: "" },
    gstNumber: { type: String, default: "" },
    phone: { type: String, default: "" },

    cartData: { type: Object, default: {} },
  },
  { minimize: false, timestamps: true }
);

const userModel = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = userModel;
