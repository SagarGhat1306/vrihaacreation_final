const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },

    image: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],

    // dynamic category system (category collection drives these values)
    category: { type: String, required: true, index: true },
    subCategory: { type: String, required: true, index: true },

    // stock is tracked PER SIZE to prevent overselling.
    // for products without sizes (e.g. electronics) use size: "FREE"
    sizes: [
      {
        size: { type: String, required: true }, // S, M, L, XL, XXL, FREE...
        stock: { type: Number, required: true, min: 0, default: 0 },
      },
    ],

    bestseller: { type: Boolean, default: false },

    // marketplace fields (third-party sellers like Meesho)
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
    sellerName: { type: String, default: "Vrihaa Bazaar" },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved", // admin-added products are auto-approved
      index: true,
    },

    // analytics counters
    soldCount: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },

    date: { type: Number, default: Date.now },
  },
  { timestamps: true }
);

// compound indexes for storefront queries at scale (2000+ products)
productSchema.index({ status: 1, category: 1, subCategory: 1 });
productSchema.index({ status: 1, bestseller: 1 });
productSchema.index({ name: "text", description: "text" });
productSchema.index({ soldCount: -1 });

const ProductModel =
  mongoose.models.product || mongoose.model("product", productSchema);

module.exports = ProductModel;
