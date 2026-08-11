const express = require("express");
const router = express.Router();
const {
  register,
  login,
  googleAuth,
  sendOTP,
  verifyOTP,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleAuth);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);

module.exports = router;
