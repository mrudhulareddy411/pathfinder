const express = require("express");
const router = express.Router();
const { getUserProfile, updateUserProfile, uploadProfilePhoto, removeProfilePhoto } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

// Profile photo endpoints
router.post("/profile/photo", protect, upload.single("photo"), uploadProfilePhoto);
router.delete("/profile/photo", protect, removeProfilePhoto);

module.exports = router;
