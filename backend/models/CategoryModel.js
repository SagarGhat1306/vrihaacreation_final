const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    image: {
      url: { type: String },
      public_id: { type: String },
    },
    subCategories: [
      {
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true, lowercase: true },
      },
    ],
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

categorySchema.index({ isActive: 1, sortOrder: 1 });

const categoryModel =
  mongoose.models.category || mongoose.model("category", categorySchema);

module.exports = categoryModel;
