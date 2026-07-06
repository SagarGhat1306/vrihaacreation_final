// add products to user cart — your existing logic kept as-is,
// with one addition: stock is validated before adding
const userModel = require("../models/UserModel");
const productModel = require("../models/ProductModel");

const addToCart = async (req, res) => {
  try {
    const { userId, itemId, size } = req.body;

    const UserData = await userModel.findById(userId);
    const cartData = await UserData.cartData;

    // check availability before adding
    const currentQty = cartData?.[itemId]?.[size] || 0;
    const product = await productModel.findById(itemId).select("sizes").lean();
    const sizeInfo = product?.sizes?.find((s) => s.size === size);

    if (!sizeInfo || sizeInfo.stock < currentQty + 1) {
      return res.json({ success: false, message: "Out of stock for this size" });
    }

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: " Added to cart " });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;

    if (quantity > 0) {
      const product = await productModel.findById(itemId).select("sizes").lean();
      const sizeInfo = product?.sizes?.find((s) => s.size === size);
      if (!sizeInfo || sizeInfo.stock < quantity) {
        return res.json({
          success: false,
          message: `Only ${sizeInfo?.stock || 0} left in stock`,
        });
      }
    }

    const UserData = await userModel.findById(userId);
    let cartData = await UserData.cartData;
    cartData[itemId][size] = quantity;

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: " cart updated " });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;
    const UserData = await userModel.findById(userId);
    let cartData = await UserData.cartData;
    res.json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

module.exports = { addToCart, updateCart, getUserCart };
