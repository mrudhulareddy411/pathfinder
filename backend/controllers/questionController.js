const mongoose = require("mongoose");
const Question = require("../models/Question");
const localDb = require("../config/localDbService");

/**
 * GET /api/questions (Admin / Catalog search)
 * Returns questions with optional filtering by category, topic, difficulty, search term.
 */
const getQuestions = async (req, res) => {
  try {
    const { category, topic, difficulty, search } = req.query;
    let questions = [];

    if (mongoose.connection.readyState === 1) {
      try {
        const filter = {};
        if (category) filter.category = new RegExp(category.trim(), "i");
        if (topic) filter.topic = new RegExp(topic.trim(), "i");
        if (difficulty) filter.difficulty = difficulty.trim();
        if (search) {
          filter.$or = [
            { question: new RegExp(search.trim(), "i") },
            { category: new RegExp(search.trim(), "i") },
            { topic: new RegExp(search.trim(), "i") },
            { skills: new RegExp(search.trim(), "i") },
          ];
        }
        questions = await Question.find(filter).sort({ createdAt: -1 }).lean();
      } catch (dbErr) {
        console.warn("Mongo question query failed, using localDb fallback:", dbErr.message);
      }
    }

    if (!questions || questions.length === 0) {
      questions = await localDb.getQuestionsLocal();
    }

    return res.status(200).json({ success: true, count: questions.length, questions });
  } catch (error) {
    console.error("Get Questions Error:", error);
    return res.status(500).json({ success: false, message: "Server error fetching questions.", details: error.message });
  }
};

/**
 * POST /api/questions (Admin)
 * Creates a new question in the Question Bank.
 */
const createQuestion = async (req, res) => {
  try {
    const { question, options, correctAnswer, category, topic, difficulty, skills, careerPaths } = req.body;

    if (!question || !options || !correctAnswer || !category || !topic) {
      return res.status(400).json({
        success: false,
        message: "Question, options (at least 2), correctAnswer, category, and topic are required.",
      });
    }

    const cleanOptions = Array.isArray(options) ? options.map((opt) => String(opt).trim()) : [];
    if (cleanOptions.length < 2) {
      return res.status(400).json({ success: false, message: "At least 2 options are required." });
    }

    const cleanCorrect = String(correctAnswer).trim();
    if (!cleanOptions.includes(cleanCorrect)) {
      return res.status(400).json({
        success: false,
        message: "Correct answer must match one of the provided options exactly.",
      });
    }

    const qPayload = {
      question: String(question).trim(),
      options: cleanOptions,
      correctAnswer: cleanCorrect,
      category: String(category).trim(),
      topic: String(topic).trim(),
      difficulty: difficulty || "Medium",
      skills: Array.isArray(skills) ? skills.map((s) => String(s).trim()) : [],
      careerPaths: Array.isArray(careerPaths) ? careerPaths.map((cp) => String(cp).trim()) : [],
    };

    let newQuestion = null;
    if (mongoose.connection.readyState === 1) {
      try {
        newQuestion = await Question.create(qPayload);
      } catch (dbErr) {
        console.warn("Mongo question create failed:", dbErr.message);
      }
    }

    if (!newQuestion) {
      newQuestion = await localDb.saveQuestionLocal(qPayload);
    }

    return res.status(201).json({ success: true, message: "Question created successfully.", question: newQuestion });
  } catch (error) {
    console.error("Create Question Error:", error);
    return res.status(500).json({ success: false, message: "Server error creating question.", details: error.message });
  }
};

/**
 * PUT /api/questions/:id (Admin)
 * Updates an existing question.
 */
const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, options, correctAnswer, category, topic, difficulty, skills, careerPaths } = req.body;

    const updates = {};
    if (question !== undefined) updates.question = String(question).trim();
    if (options !== undefined && Array.isArray(options)) updates.options = options.map((opt) => String(opt).trim());
    if (correctAnswer !== undefined) updates.correctAnswer = String(correctAnswer).trim();
    if (category !== undefined) updates.category = String(category).trim();
    if (topic !== undefined) updates.topic = String(topic).trim();
    if (difficulty !== undefined) updates.difficulty = difficulty;
    if (skills !== undefined && Array.isArray(skills)) updates.skills = skills.map((s) => String(s).trim());
    if (careerPaths !== undefined && Array.isArray(careerPaths)) updates.careerPaths = careerPaths.map((cp) => String(cp).trim());

    let updated = null;
    if (mongoose.connection.readyState === 1) {
      try {
        updated = await Question.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true });
      } catch (e) {}
    }

    return res.status(200).json({ success: true, message: "Question updated successfully.", question: updated || { _id: id, ...updates } });
  } catch (error) {
    console.error("Update Question Error:", error);
    return res.status(500).json({ success: false, message: "Server error updating question.", details: error.message });
  }
};

/**
 * DELETE /api/questions/:id (Admin)
 * Deletes a question.
 */
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1) {
      try {
        await Question.findByIdAndDelete(id);
      } catch (e) {}
    }
    return res.status(200).json({ success: true, message: "Question deleted successfully." });
  } catch (error) {
    console.error("Delete Question Error:", error);
    return res.status(500).json({ success: false, message: "Server error deleting question.", details: error.message });
  }
};

/**
 * GET /api/questions/categories
 * Returns distinct categories and topics available in the Question Bank.
 */
const getCategories = async (req, res) => {
  try {
    let categories = [];
    let topics = [];
    if (mongoose.connection.readyState === 1) {
      try {
        categories = await Question.distinct("category");
        topics = await Question.distinct("topic");
      } catch (e) {}
    }
    if (!categories || categories.length === 0) {
      categories = ["Programming", "Data Structures", "Algorithms", "DBMS", "SQL", "JavaScript", "Web Development", "Machine Learning"];
      topics = ["Stack", "Queue", "OOP", "Sorting", "SQL Commands", "React Hooks", "OSI Model"];
    }
    return res.status(200).json({ success: true, categories, topics });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching categories." });
  }
};

module.exports = {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getCategories,
};
