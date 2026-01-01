// add products to use cart 

const { response } = require("express");
const userModel = require("../models/UserModel");

const addToCart = async(req,res) => {
    try{
        const {userId , itemId , size  } = req.body;
        console.log("ADD TO CART 👉", req.body);


        const UserData = await userModel.findById(userId)
        const cartData = await UserData.cartData;

        if(cartData[itemId]){
            if(cartData[itemId][size]){
                cartData[itemId][size] += 1
            }
            else{
                cartData[itemId][size] = 1
            }
        }
        else{
            cartData[itemId] = {}
            cartData[itemId][size] = 1
        }

        await userModel.findByIdAndUpdate(userId,{cartData})

        res.json({success : true   , message : " Added to cart "})

    }catch(error){
        res.json({success : false   , message : error.message})
    }

}

const updateCart = async (req,res) => {
    try{
        const {userId,itemId,size,quantity} = req.body;
        const UserData = await userModel.findById(userId)
        let cartData = await UserData.cartData;
        cartData[itemId][size] = quantity

        await userModel.findByIdAndUpdate(userId,{cartData})
         
        res.json({success : true   , message : " cart updated "})

    }catch(error){
        console.log(error)
        res.json({success : false   , message : error.message})
    }
}

const getUserCart = async(req,res) => {

     try{
        const {userId} = req.body;

        const UserData = await userModel.findById(userId)

        let cartData = await UserData.cartData;
         
        res.json({success : true , cartData})

    }catch(error){
        console.log(error)
        res.json({success : false   , message : error.message})
    }
}



module.exports = {
    addToCart,
    updateCart,
    getUserCart
};
