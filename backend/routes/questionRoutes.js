const express = require("express");
const router = express.Router();
const {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getCategories,
} = require("../controllers/questionController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getQuestions);
router.get("/categories", protect, getCategories);
router.post("/", protect, createQuestion);
router.put("/:id", protect, updateQuestion);
router.delete("/:id", protect, deleteQuestion);

module.exports = router;
