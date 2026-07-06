const jwt = require("jsonwebtoken");
const userModel = require("../models/UserModel");

// allows APPROVED sellers (and admin) through
const sellerAuth = async (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.json({ success: false, message: "Not authorized, login again" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRETE_KEY);

    if (decoded.role === "admin") {
      req.isAdmin = true;
      return next();
    }

    const user = await userModel.findById(decoded.id).lean();

    if (!user || user.role !== "seller" || user.sellerStatus !== "approved") {
      return res.json({ success: false, message: "Not authorized, approved sellers only" });
    }

    req.seller = { id: user._id, shopName: user.shopName || user.name };
    req.body.sellerId = user._id;
    next();
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

module.exports = sellerAuth;
