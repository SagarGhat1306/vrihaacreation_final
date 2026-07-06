const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.json({ success: false, message: "Not authorized, login again" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRETE_KEY);

    if (!decoded.role || decoded.role !== "admin") {
      return res.json({ success: false, message: "Not authorized, admin access only" });
    }

    next();
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

module.exports = adminAuth;
