const express = require("express");
const router = express.Router();
const {
  getAssessments,
  createAssessment,
  getAssessmentForTake,
  submitAssessment,
} = require("../controllers/assessmentController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getAssessments);
router.post("/", protect, createAssessment);
router.get("/:id/take", protect, getAssessmentForTake);
router.post("/:id/submit", protect, submitAssessment);

// Legacy compat route
router.post("/submit", protect, submitAssessment);

module.exports = router;
