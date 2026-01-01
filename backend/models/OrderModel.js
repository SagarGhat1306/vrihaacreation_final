const mongoose = require('mongoose')


const orderSchema = new mongoose.Schema({

    userId :{
      type: String,
      required: true,
    },
    items:{
        type: Array,
      required: true,
      
    },
    amount: {
      type: Number,
      required: true,
      
    },

    address: {
      type: Object,
      required: true
    },

    status : {
      type: String,
      required: true,
      default:"Order Placed"
    },

    paymentMethod: {
      type: String, 
      required: true
    },

    payemt: {
      type: Boolean,
      required: true,
      default:false
    },

    // subCategory: {
    //   type: String,
    //   required: true
    // },


    date: {
      type: Number,
      default: Date.now
    },

 
  },

)

const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);

module.exports = orderModel;



//   enum: ["S", "M", "L", "XL", "XXL"]