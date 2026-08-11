import api from "./api";
import axios from "axios";

const DIRECT_ML_URL = "http://localhost:8000";

/**
 * Predict Career using Python ML API (:8000) serving career_model.pkl
 */
export const predictCareerML = async (assessmentData = {}) => {
  try {
    // Try Node Backend proxy first (/api/ml/predict)
    const res = await api.post("/ml/predict", assessmentData);
    return res.data;
  } catch (err) {
    try {
      // Direct call to Python FastAPI ML API (:8000)
      const directRes = await axios.post(`${DIRECT_ML_URL}/predict`, assessmentData, { timeout: 3000 });
      return {
        status: "SUCCESS",
        source: "Python ML API (:8000 Direct)",
        model: "RandomForest (career_model.pkl)",
        ...directRes.data,
      };
    } catch (directErr) {
      console.warn("ML API unreachable:", directErr.message);
      return {
        status: "FALLBACK",
        model: "Rule Engine Fallback",
        recommendedCareer: "Software Engineer",
        recommendations: [
          { career: "Software Engineer", match: 90.0, confidence: "90.0%" },
          { career: "Data Scientist", match: 85.0, confidence: "85.0%" },
        ],
      };
    }
  }
};

/**
 * Check ML API status
 */
export const checkMLHealth = async () => {
  try {
    const res = await api.get("/ml/health");
    return res.data;
  } catch (err) {
    return { mlApiStatus: "offline" };
  }
};
