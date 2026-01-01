const mongoose = require('mongoose')


const productSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    image: {
      type: Array, // image URLs
      required: true
    },

    category: {
      type: String,
      required: true
    },

    subCategory: {
      type: String,
      required: true
    },

    sizes: {
      type: Array,
    },

    date: {
      type: Number,
      default: Date.now
    },

    bestseller: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }

)

const ProductModel =
  mongoose.models.product || mongoose.model("product", productSchema);

module.exports = ProductModel;



//   enum: ["S", "M", "L", "XL", "XXL"]