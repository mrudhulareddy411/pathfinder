const mongoose = require("mongoose");
const SkillScore = require("../models/SkillScore");
const AssessmentAttempt = require("../models/AssessmentAttempt");
const User = require("../models/User");
const { generateRecommendations } = require("../services/recommendationEngine");
const localDb = require("../config/localDbService");

/**
 * GET /api/skill-gap
 * Computes skill gap analysis based on actual assessment results
 */
const getSkillGap = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Authentication required." });
    }

    let attemptsCount = 0;
    let skillMap = {};
    let user = req.user;

    if (mongoose.connection.readyState === 1) {
      try {
        attemptsCount = await AssessmentAttempt.countDocuments({ userId });
        const skillDoc = await SkillScore.findOne({ userId }).lean();
        if (skillDoc?.skills) {
          skillMap = skillDoc.skills instanceof Map ? Object.fromEntries(skillDoc.skills) : skillDoc.skills;
        }
        const u = await User.findById(userId).lean();
        if (u) user = u;
      } catch (dbErr) {
        console.warn("Mongo query failed in skillGapController, using localDb fallback:", dbErr.message);
      }
    }

    if (attemptsCount === 0) {
      const localAttempts = await localDb.getAttemptsLocal(userId);
      attemptsCount = localAttempts.length;
    }

    // Requirement 8 & 13: Do not generate skill gaps without assessment data
    if (attemptsCount === 0 && Object.keys(skillMap).length === 0) {
      return res.status(200).json({
        success: true,
        hasData: false,
        hasAssessment: false,
        message: "Complete more assessments to generate your skill analysis.",
        skills: [],
        weakSkillCount: 0,
        learningResources: [],
      });
    }

    const recResult = await generateRecommendations(user);
    const targetCareer = recResult.recommendations?.[0] || {
      title: "Software Developer",
      matchPercentage: 85,
    };

    const skillAnalysisList = [];
    const weakSkillNames = [];

    const defaultBenchmarkSkills = [
      { skill: "Data Structures", benchmark: 70 },
      { skill: "SQL", benchmark: 70 },
      { skill: "Python", benchmark: 70 },
      { skill: "JavaScript", benchmark: 70 },
      { skill: "Algorithms", benchmark: 70 },
    ];

    defaultBenchmarkSkills.forEach((item) => {
      const userLevel = skillMap[item.skill] ? Number(skillMap[item.skill]) : 0;
      const requiredLevel = item.benchmark;
      const gap = Math.max(0, requiredLevel - userLevel);

      let status = "Strong";
      if (userLevel < 40) {
        status = "High Gap";
        weakSkillNames.push(item.skill);
      } else if (userLevel < requiredLevel) {
        status = "Needs Improvement";
        weakSkillNames.push(item.skill);
      }

      skillAnalysisList.push({
        skill: item.skill,
        currentLevel: userLevel,
        requiredLevel,
        gap,
        status,
      });
    });

    const resources = await localDb.getResources({});
    const learningResources = resources.filter((r) =>
      weakSkillNames.some((ws) => r.skill?.toLowerCase().includes(ws.toLowerCase()))
    );

    return res.status(200).json({
      success: true,
      hasData: true,
      hasAssessment: true,
      career: targetCareer.title,
      overallMatch: targetCareer.matchPercentage || 85,
      skills: skillAnalysisList,
      weakSkillCount: weakSkillNames.length,
      learningResources,
    });
  } catch (error) {
    console.error("Get Skill Gap Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error generating skill gap analysis.",
      details: error.message,
    });
  }
};

module.exports = { getSkillGap };
