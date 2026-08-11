const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");
const localDb = require("../config/localDbService");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "pathfinder_secret_key");

      if (mongoose.connection.readyState === 1) {
        req.user = await User.findById(decoded.id).select("-password");
      } else {
        const found = await localDb.findUserById(decoded.id);
        if (found) {
          const { password, ...userNoPass } = found;
          req.user = userNoPass;
        }
      }

      if (!req.user) {
        return res.status(401).json({ message: "User not found or token invalid." });
      }

      return next();
    } catch (error) {
      console.error("Auth Middleware error:", error.message);
      return res.status(401).json({ message: "Not authorized, invalid token." });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, token missing." });
  }
};

module.exports = { protect };
