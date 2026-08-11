const express = require("express");
const router = express.Router();
const { getAcademicPerformance } = require("../controllers/performanceController");
const { protect } = require("../middleware/authMiddleware");

router.get("/performance", protect, getAcademicPerformance);

module.exports = router;
