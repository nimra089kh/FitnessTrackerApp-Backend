const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // Header mein token hai?
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. Login first.",
    });
  }

  try {
    // Token verify karo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // User find karo
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Try login again",
    });
  }
};

module.exports = { protect };