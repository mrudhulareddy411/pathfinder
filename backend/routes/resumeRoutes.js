const express = require("express");
const router = express.Router();
const {
  getResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
} = require("../controllers/resumeController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getResumes);
router.get("/:id", protect, getResumeById);
router.post("/", protect, createResume);
router.put("/:id", protect, updateResume);
router.delete("/:id", protect, deleteResume);

module.exports = router;
