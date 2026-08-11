import api from "./api";

export const predictCareerML = async (assessmentData = {}) => {
  try {
    const res = await api.post("/ml/predict", assessmentData);
    return res.data;
  } catch (err) {
    console.warn("Mobile ML endpoint fallback:", err.message);
    return {
      status: "FALLBACK",
      model: "Rule Engine Fallback",
      recommendedCareer: "Software Engineer",
      recommendations: [
        { career: "Software Engineer", match: 92.0, confidence: "92.0%" },
        { career: "Data Scientist", match: 86.5, confidence: "86.5%" },
        { career: "UX/UI Designer", match: 80.0, confidence: "80.0%" },
      ],
    };
  }
};
