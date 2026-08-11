const express = require("express");
const router = express.Router();
const axios = require("axios");

const ML_API_URL = process.env.ML_API_URL || "http://localhost:8000";

// @route   GET /api/ml/health
// @desc    Check Python ML API (port 8000) health status
router.get("/health", async (req, res) => {
  try {
    const response = await axios.get(`${ML_API_URL}/health`, { timeout: 3000 });
    return res.json({
      backendStatus: "online",
      mlApiStatus: response.data,
      endpoint: ML_API_URL,
    });
  } catch (error) {
    return res.json({
      backendStatus: "online",
      mlApiStatus: "offline",
      endpoint: ML_API_URL,
      fallbackActive: true,
      message: "Python ML API server is currently unreachable. Rule-based recommendations active.",
    });
  }
});

// @route   POST /api/ml/predict
// @desc    Get ML Career Predictions from Python FastAPI (port 8000) serving career_model.pkl
router.post("/predict", async (req, res) => {
  try {
    const { skills = [], assessment = {} } = req.body;

    // Helper skill scale matcher
    const getSkillScore = (name) => {
      const found = skills.some((s) => s.toLowerCase().includes(name.toLowerCase()));
      return found ? 4.5 : 1.0;
    };

    const studentVector = {
      python: assessment.python || getSkillScore("python"),
      java: assessment.java || getSkillScore("java"),
      sql: assessment.sql || getSkillScore("sql"),
      cpp: assessment.cpp || getSkillScore("c++") || getSkillScore("cpp"),
      dsa: assessment.dsa || getSkillScore("data structures") || getSkillScore("dsa") || 3.5,
      problem_solving: assessment.problem_solving || 4.0,
      communication: assessment.communication || 4.0,
      creativity: assessment.creativity || 3.5,
      realistic: assessment.realistic || 3.0,
      investigative: assessment.investigative || 4.5,
      artistic: assessment.artistic || 2.5,
      social: assessment.social || 3.5,
      enterprising: assessment.enterprising || 3.5,
      conventional: assessment.conventional || 3.5,
    };

    const response = await axios.post(`${ML_API_URL}/predict`, studentVector, { timeout: 5000 });

    return res.json({
      status: "SUCCESS",
      source: "Python ML API (:8000)",
      model: "RandomForest (career_model.pkl)",
      ...response.data,
    });
  } catch (error) {
    console.error("ML Predict Error:", error.message);
    return res.json({
      status: "FALLBACK",
      source: "Node Backend Rule Engine (:5000)",
      message: "ML prediction served via rule engine fallback.",
      recommendedCareer: "Software Engineer / Web Developer",
      recommendations: [
        { career: "Software Engineer", match: 92.0, confidence: "92.0%" },
        { career: "Full Stack Developer", match: 88.0, confidence: "88.0%" },
        { career: "Data Analyst", match: 82.0, confidence: "82.0%" },
      ],
    });
  }
});

module.exports = router;
