const mongoose = require("mongoose");
const { generateRecommendations } = require("../services/recommendationEngine");
const { calculateJobReadiness } = require("../services/jobReadinessService");
const { getOnetCareerDetails } = require("../services/onetDatasetService");
const User = require("../models/User");

const getRecommendations = async (req, res) => {
  try {
    let user = null;
    const userId = req.user?._id || req.user?.id;

    if (mongoose.connection.readyState === 1 && userId) {
      user = await User.findById(userId);
    }

    if (!user) {
      user = req.user || {
        _id: "guest",
        fullName: "Student",
        skills: ["JavaScript", "Python", "React", "SQL", "Node.js"],
        branch: "Computer Science & Engineering",
        educationLevel: "B.Tech",
      };
    }

    const result = await generateRecommendations(user);
    const targetCareer = user.selectedCareerDetails || (result.recommendations && result.recommendations[0]);
    const readinessInfo = calculateJobReadiness(user, targetCareer);

    return res.json({
      ...result,
      selectedCareer: user.selectedCareerDetails || null,
      jobReadiness: readinessInfo,
    });
  } catch (error) {
    console.error("[CAREER API ERROR]", {
      Route: "GET /api/recommendations",
      Status: 500,
      Error: error.message,
      Stack: error.stack,
      DataSource: "local O*NET dataset (software_careers.csv)"
    });

    return res.status(500).json({
      success: false,
      error: "Career data unavailable",
      source: "local O*NET dataset",
      details: error.message
    });
  }
};

const selectCareer = async (req, res) => {
  try {
    const { onetCode, careerId, title } = req.body;
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required to select target career." });
    }

    const targetCode = onetCode || careerId || title;
    const careerDetails = getOnetCareerDetails(targetCode);

    if (!careerDetails) {
      return res.status(404).json({ message: "O*NET Career information unavailable." });
    }

    let updatedUser;
    updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          selectedCareerDetails: careerDetails,
          careerInterests: [careerDetails.title],
        },
      },
      { new: true }
    ).select("-password");

    const readinessInfo = calculateJobReadiness(updatedUser, careerDetails);

    return res.json({
      success: true,
      message: `Selected '${careerDetails.title}' as your target career path! 🎯`,
      selectedCareer: careerDetails,
      jobReadiness: readinessInfo,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Select Career Error:", error);
    return res.status(500).json({ message: "Failed to save selected target career." });
  }
};

module.exports = { getRecommendations, selectCareer };
