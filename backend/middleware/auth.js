const jwt = require("jsonwebtoken");

const authuser = (req, res, next) => {
  const token = req.headers.token;

  if (!token) {
    return res.json({ success: false, message: "Not authorized, login again" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRETE_KEY);
    req.body.userId = decoded.id;
    next();
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

module.exports = authuser;
