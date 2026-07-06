const userModel = require("../models/UserModel");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const createToken = (id, role = "user") => {
  return jwt.sign({ id, role }, process.env.JWT_SECRETE_KEY);
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "user doesn't exists" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = createToken(user._id, user.role);
      res.json({ success: true, token, role: user.role });
    } else {
      return res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exist = await userModel.findOne({ email });

    if (exist) {
      return res.json({ success: false, message: "user alredy exists" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "please enter a valid email" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "password must atleast 8 character" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({ name, email, password: hashedpassword });
    const user = await newUser.save();

    const token = createToken(user._id, user.role);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// admin credentials stay in .env exactly like before —
// but the token now carries { role: 'admin' } so adminAuth works correctly
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { id: "admin", role: "admin", email },
        process.env.JWT_SECRETE_KEY
      );
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ---------- SELLER (third-party, Meesho style) ----------

// an existing user applies to become a seller
const applySeller = async (req, res) => {
  try {
    const { userId, shopName, gstNumber, phone } = req.body;

    if (!shopName) {
      return res.json({ success: false, message: "Shop name is required" });
    }

    await userModel.findByIdAndUpdate(userId, {
      role: "seller",
      sellerStatus: "pending",
      shopName,
      gstNumber: gstNumber || "",
      phone: phone || "",
    });

    res.json({ success: true, message: "Seller application submitted, wait for admin approval" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// direct seller registration (register + apply in one shot)
const registerSeller = async (req, res) => {
  try {
    const { name, email, password, shopName, gstNumber, phone } = req.body;

    const exist = await userModel.findOne({ email });
    if (exist) {
      return res.json({ success: false, message: "user alredy exists" });
    }
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "please enter a valid email" });
    }
    if (password.length < 8) {
      return res.json({ success: false, message: "password must atleast 8 character" });
    }
    if (!shopName) {
      return res.json({ success: false, message: "Shop name is required" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    const user = await new userModel({
      name,
      email,
      password: hashedpassword,
      role: "seller",
      sellerStatus: "pending",
      shopName,
      gstNumber: gstNumber || "",
      phone: phone || "",
    }).save();

    const token = createToken(user._id, "seller");
    res.json({
      success: true,
      token,
      message: "Seller account created. You can add products once admin approves you.",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// admin: list sellers
const listSellers = async (req, res) => {
  try {
    const sellers = await userModel
      .find({ role: "seller" })
      .select("-password -cartData")
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, sellers });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// admin: approve / block a seller
const updateSellerStatus = async (req, res) => {
  try {
    const { sellerId, sellerStatus } = req.body; // approved | blocked | pending

    if (!["approved", "blocked", "pending"].includes(sellerStatus)) {
      return res.json({ success: false, message: "Invalid status" });
    }

    await userModel.findByIdAndUpdate(sellerId, { sellerStatus });
    res.json({ success: true, message: `Seller ${sellerStatus}` });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

module.exports = {
  loginUser,
  registerUser,
  adminLogin,
  applySeller,
  registerSeller,
  listSellers,
  updateSellerStatus,
};
