// placing orders using cod 
const express = require('express');
const orderModel = require('../models/OrderModel');
const userModel = require('../models/UserModel');

const placeorder = async(req,res) => {
    try{
        const {userId, items , amount , address} = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod : "COD",
            payment: false,
            date: Date.now()

        }

        console.log(orderData)

        const neworder = new orderModel(orderData) 
        await neworder.save()

        await userModel.findByIdAndUpdate(userId,{cartData:{}})

        res.json({success:true, message:"Order placed"})

    }catch(error){
    console.log(error)
     res.json({success:false, message: error.message})
    }
}

const placeorderStrip = async(req,res) => {
    
}

const placeordeRazorpay = async(req,res) => {
    
}

const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};





const userorders = async (req, res) => {
  try {
    const { userId } = req.body;

    const orders = await orderModel.find({ userId });

    if (!orders || orders.length === 0) {
      return res.json({ success: true, Orders: [], message: "No orders found" });
    }

    // Send orders
    res.json({ success: true, Orders: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


const updateStatus = async(req,res) => {
    try{
        const {orderId, status} = req.body;
        await orderModel.findByIdAndUpdate(orderId, {status})
        res.json({success:true ,message :'status updated'})


    }catch(error){
    console.log(error)
     res.json({success:false ,message :error.message})
    }
    
}


module.exports = {
  placeorder,placeorderStrip, placeordeRazorpay, allOrders,  userorders, updateStatus
};
