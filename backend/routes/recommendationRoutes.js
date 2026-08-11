const express = require("express");
const router = express.Router();
const { getRecommendations, selectCareer } = require("../controllers/recommendationController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getRecommendations);
router.post("/select", protect, selectCareer);

module.exports = router;
