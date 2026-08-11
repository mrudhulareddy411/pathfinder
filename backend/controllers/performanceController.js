const mongoose = require("mongoose");
const AssessmentAttempt = require("../models/AssessmentAttempt");
const SkillScore = require("../models/SkillScore");
const AssessmentBank = require("../models/AssessmentBank");
const User = require("../models/User");
const localDb = require("../config/localDbService");

/**
 * GET /api/academic/performance
 * Returns student academic & assessment performance metrics
 */
const getAcademicPerformance = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Authentication required." });
    }

    let user = req.user;
    let attempts = [];
    let skillMap = {};
    let recommendedAssessments = [];

    if (mongoose.connection.readyState === 1) {
      try {
        const u = await User.findById(userId).lean();
        if (u) user = u;
        attempts = await AssessmentAttempt.find({ userId }).sort({ completedAt: -1 }).lean();
        const skillDoc = await SkillScore.findOne({ userId }).lean();
        if (skillDoc?.skills) {
          skillMap = skillDoc.skills instanceof Map ? Object.fromEntries(skillDoc.skills) : skillDoc.skills;
        }
        recommendedAssessments = await AssessmentBank.find().limit(6).lean();
      } catch (dbErr) {
        console.warn("Mongo connection query failed, using localDb fallback:", dbErr.message);
      }
    }

    if (!user) {
      user = await localDb.findUserById(userId);
    }

    if (!attempts || attempts.length === 0) {
      attempts = await localDb.getAttemptsLocal(userId);
    }

    // Calculate assessment stats
    const assessmentsCompletedCount = attempts.length;
    let averageScore = null;
    if (assessmentsCompletedCount > 0) {
      const sumPercentage = attempts.reduce((acc, curr) => acc + (curr.percentage || 0), 0);
      averageScore = Math.round(sumPercentage / assessmentsCompletedCount);
    }

    // Categorize skills based on actual test scores
    const skillEntries = Object.entries(skillMap).map(([name, score]) => ({ name, score: Number(score) }));
    skillEntries.sort((a, b) => b.score - a.score);

    const strongestSkills = skillEntries.filter((s) => s.score >= 70);
    const skillsToImprove = skillEntries.filter((s) => s.score < 70);

    const topSkill = strongestSkills.length > 0 ? `${strongestSkills[0].name} — ${strongestSkills[0].score}%` : null;
    const weakestSkill = skillsToImprove.length > 0 ? `${skillsToImprove[0].name} — ${skillsToImprove[0].score}%` : null;

    if (!recommendedAssessments || recommendedAssessments.length === 0) {
      recommendedAssessments = [
        { id: "rec_asm_1", title: "Full Stack Software Engineering Assessment", category: "Software Developer", durationMinutes: 20, difficulty: "Medium" },
        { id: "rec_asm_2", title: "Data Structures & Algorithms Core Test", category: "Data Structures", durationMinutes: 15, difficulty: "Medium" },
        { id: "rec_asm_3", title: "Database Management & SQL Fundamentals", category: "DBMS", durationMinutes: 15, difficulty: "Easy" },
      ];
    }

    return res.status(200).json({
      success: true,
      performance: {
        gpa: user?.cgpa ? `${user.cgpa}` : "Not provided",
        degree: user?.educationLevel || "Not provided",
        branch: user?.branch || "Not provided",
        graduationYear: user?.graduationYear || "Not provided",
        college: user?.college || "Not provided",
        assessmentsCompletedCount,
        averageScore: averageScore !== null ? `${averageScore}%` : "No assessments yet",
        averageScoreNumber: averageScore,
        strongestSkills,
        skillsToImprove,
        topSkill,
        weakestSkill,
        recentAttempts: attempts.slice(0, 5).map((att) => ({
          id: att._id || att.id,
          title: att.assessmentTitle || att.title || "Assessment",
          category: att.category || "General",
          score: att.score || 0,
          totalQuestions: att.totalQuestions || 10,
          percentage: att.percentage || 0,
          completedAt: att.completedAt || new Date(),
        })),
        recommendedAssessments: recommendedAssessments.map((a) => ({
          id: a._id || a.id,
          title: a.title,
          category: a.category,
          durationMinutes: a.durationMinutes || 15,
          difficulty: a.difficulty,
        })),
      },
    });
  } catch (error) {
    console.error("Get Academic Performance Error:", error);
    return res.status(500).json({ success: false, message: "Error loading academic performance.", details: error.message });
  }
};

module.exports = { getAcademicPerformance };
