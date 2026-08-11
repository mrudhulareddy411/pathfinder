const mongoose = require("mongoose");
const axios = require("axios");
const Career = require("../models/Career");
const Resource = require("../models/Resource");
const SkillScore = require("../models/SkillScore");
const AssessmentAttempt = require("../models/AssessmentAttempt");
const localDb = require("../config/localDbService");

const ML_API_URL = process.env.ML_API_URL || "http://127.0.0.1:8000";

/**
 * Recommendation Engine for Pathfinder AI
 * Incorporates GPA, Assessment Scores, Skill Performance, Interests, Projects & Career Goals
 */
const generateRecommendations = async (userProfile = {}) => {
  const userId = userProfile._id || userProfile.id;
  const educationLevel = userProfile.educationLevel || "B.Tech";
  const branch = userProfile.branch || "Computer Science & Engineering";
  const gpa = userProfile.cgpa || null;
  const careerGoal = userProfile.targetRole || userProfile.careerGoal || "";

  // Safely normalize user skills
  const rawSkills = Array.isArray(userProfile.skills) ? userProfile.skills : [];
  const skills = rawSkills
    .map((s) => {
      if (!s) return "";
      if (typeof s === "string") return s;
      if (typeof s === "object" && s.name) return String(s.name);
      return String(s);
    })
    .filter(Boolean);

  // Fetch actual student SkillScores & Attempts from DB if available
  let skillMap = {};
  let attemptsCount = 0;
  let avgTestScore = null;

  if (userId && mongoose.connection.readyState === 1) {
    try {
      const skillDoc = await SkillScore.findOne({ userId }).lean();
      if (skillDoc?.skills) {
        skillMap = skillDoc.skills instanceof Map ? Object.fromEntries(skillDoc.skills) : skillDoc.skills;
      }
      const attempts = await AssessmentAttempt.find({ userId }).lean();
      attemptsCount = attempts.length;
      if (attemptsCount > 0) {
        const sum = attempts.reduce((acc, curr) => acc + (curr.percentage || 0), 0);
        avgTestScore = Math.round(sum / attemptsCount);
      }
    } catch (e) {
      console.log("Error fetching user skill scores for recommendations:", e.message);
    }
  }

  // A. CAREER CATALOG LOADING
  let careers = [];
  try {
    if (mongoose.connection.readyState === 1) {
      careers = await Career.find({});
    }
  } catch {
    careers = [];
  }

  if (!careers || careers.length === 0) {
    careers = await localDb.getCareers();
  }

  if (!careers || careers.length === 0) {
    return {
      success: false,
      status: "INSUFFICIENT_DATA",
      recommendations: [],
    };
  }

  // B. ML MODEL INFERENCE (FastAPI)
  let mlPrediction = null;
  try {
    const mlPayload = {
      python: (skillMap["Python"] || 70) / 20,
      java: (skillMap["Java"] || 70) / 20,
      sql: (skillMap["SQL"] || 70) / 20,
      dsa: (skillMap["DSA"] || skillMap["Data Structures"] || 70) / 20,
      problem_solving: (skillMap["Problem Solving"] || 70) / 20,
      web_dev: (skillMap["Web Development"] || 70) / 20,
      ai_data: (skillMap["Machine Learning"] || skillMap["Data Science"] || 70) / 20,
    };
    const mlRes = await axios.post(`${ML_API_URL}/predict`, mlPayload, { timeout: 2500 });
    if (mlRes.data?.success) mlPrediction = mlRes.data;
  } catch {
    mlPrediction = null;
  }

  const recommendations = [];

  for (const career of careers) {
    const careerTitle = career.title || "";
    const matchingSkills = (career.requiredSkills || []).filter((s) =>
      skills.some((userSkill) => userSkill.toLowerCase() === String(s).toLowerCase())
    );

    const missingSkills = (career.requiredSkills || []).filter(
      (s) => !skills.some((userSkill) => userSkill.toLowerCase() === String(s).toLowerCase())
    );

    // Multi-input scoring calculation
    let matchPercentage = 0;
    const reasons = [];

    // 1. Skill Match Score (up to 40 points)
    const skillMatchScore = career.requiredSkills?.length
      ? Math.round((matchingSkills.length / career.requiredSkills.length) * 40)
      : 20;
    matchPercentage += skillMatchScore;
    if (matchingSkills.length > 0) {
      reasons.push(`Matches ${matchingSkills.length} key skills (${matchingSkills.slice(0, 3).join(", ")})`);
    }

    // 2. Assessment & Skill Score Performance (up to 30 points)
    let assessmentScoreBonus = 0;
    let highSkillCount = 0;

    for (const [sk, score] of Object.entries(skillMap)) {
      if (score >= 75) {
        highSkillCount++;
        if (
          careerTitle.toLowerCase().includes(sk.toLowerCase()) ||
          (career.requiredSkills || []).some((r) => r.toLowerCase().includes(sk.toLowerCase()))
        ) {
          reasons.push(`Strong assessment score in ${sk} (${score}%)`);
          assessmentScoreBonus += 15;
        }
      }
    }
    if (avgTestScore !== null && avgTestScore >= 70) {
      assessmentScoreBonus += 10;
      reasons.push(`Solid overall assessment average (${avgTestScore}%)`);
    } else if (attemptsCount === 0) {
      reasons.push("Assessment baseline pending");
    }
    matchPercentage += Math.min(30, assessmentScoreBonus);

    // 3. GPA Factor (up to 15 points)
    if (gpa) {
      const gpaNum = parseFloat(gpa);
      if (!isNaN(gpaNum)) {
        if (gpaNum >= 8.5) {
          matchPercentage += 15;
          reasons.push(`Excellent Academic GPA (${gpaNum})`);
        } else if (gpaNum >= 7.0) {
          matchPercentage += 10;
          reasons.push(`Good Academic GPA (${gpaNum})`);
        } else {
          matchPercentage += 5;
          reasons.push(`GPA recorded (${gpaNum})`);
        }
      }
    } else {
      reasons.push("GPA: Not provided");
    }

    // 4. Career Goal & Interest Alignment (up to 15 points)
    if (careerGoal && careerTitle.toLowerCase().includes(careerGoal.toLowerCase())) {
      matchPercentage += 15;
      reasons.push(`Matches target career goal: "${careerGoal}"`);
    }

    // Boost with ML prediction if available
    if (mlPrediction?.matchScores) {
      const matchedKey = Object.keys(mlPrediction.matchScores).find(
        (k) => k.toLowerCase().includes(careerTitle.toLowerCase()) || careerTitle.toLowerCase().includes(k.toLowerCase())
      );
      if (matchedKey) {
        const mlPct = Math.round(mlPrediction.matchScores[matchedKey]);
        matchPercentage = Math.round(matchPercentage * 0.5 + mlPct * 0.5);
        reasons.push(`ML Model Prediction Match (${mlPct}%)`);
      }
    }

    const finalMatch = Math.min(98, Math.max(35, matchPercentage));

    recommendations.push({
      careerId: career._id || career.id || career.onetCode || careerTitle,
      onetCode: career.onetCode || null,
      title: careerTitle,
      category: career.category || "Software Engineering & IT",
      description: career.description,
      matchPercentage: finalMatch,
      mlModel: mlPrediction ? "RandomForest + Multi-Input Engine" : "Multi-Factor Scoring Engine",
      mlConfidence: `${finalMatch}%`,
      reasons: Array.from(new Set(reasons)),
      explanation: `Career match calculated using multi-input scoring (GPA, Assessment Scores, Skills Matrix & Goals).`,
      matchingSkills,
      missingSkills,
      relevantEducation: career.educationRequirements || ["B.Tech Computer Science & Engineering"],
      salaryRange: career.salaryRange || { minLPA: 6.0, maxLPA: 22.0, currency: "INR" },
    });
  }

  recommendations.sort((a, b) => b.matchPercentage - a.matchPercentage);

  return {
    success: true,
    status: "SUCCESS",
    count: recommendations.length,
    recommendations,
  };
};

module.exports = { generateRecommendations };
