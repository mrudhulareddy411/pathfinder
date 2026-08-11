const {
  recordActivity,
  processDailyLogin,
  getCalendarData,
  getDayActivities,
  getFormattedDate,
} = require("../services/activityService");
const { awardXP } = require("../services/gamificationEngine");
const Activity = require("../models/Activity");
const Streak = require("../models/Streak");
const User = require("../models/User");
const mongoose = require("mongoose");
const localDb = require("../config/localDbService");
const fs = require("fs").promises;
const path = require("path");

const DATA_DIR = path.join(__dirname, "../data");
const LOCAL_ACTIVITIES_FILE = path.join(DATA_DIR, "activities_store.json");

// Helper to read local activities file
const getLocalActivities = async () => {
  try {
    const data = await fs.readFile(LOCAL_ACTIVITIES_FILE, "utf8");
    return JSON.parse(data || "[]");
  } catch {
    return [];
  }
};

// @desc    Get authenticated user's activity log
// @route   GET /api/activity
// @access  Private
const getUserActivities = async (req, res) => {
  try {
    const { month } = req.query;
    const userId = req.user.id.toString();
    let activities = [];

    if (mongoose.connection.readyState === 1) {
      const filter = { userId: req.user.id };
      if (month) filter.date = new RegExp(`^${month}`);
      activities = await Activity.find(filter).sort({ timestamp: -1 });
    } else {
      const all = await getLocalActivities();
      activities = all.filter((a) => a.userId && a.userId.toString() === userId);
      if (month) {
        activities = activities.filter((a) => a.date && a.date.startsWith(month));
      }
    }

    return res.json({
      count: activities.length,
      activities,
    });
  } catch (error) {
    console.error("Get User Activities Error:", error);
    return res.status(500).json({ message: "Server error retrieving user activities." });
  }
};

// @desc    Get user's monthly activity calendar matrix
// @route   GET /api/calendar
// @access  Private
const getCalendar = async (req, res) => {
  try {
    const { year, month, timezone } = req.query;
    const userId = req.user.id;

    const dayMap = await getCalendarData(
      userId,
      year || new Date().getFullYear(),
      month || new Date().getMonth() + 1,
      timezone || "Asia/Kolkata"
    );

    return res.json({
      year: year || new Date().getFullYear(),
      month: month || new Date().getMonth() + 1,
      activitiesByDate: dayMap,
    });
  } catch (error) {
    console.error("Get Calendar Error:", error);
    return res.status(500).json({ message: "Server error retrieving activity calendar." });
  }
};

// @desc    Get activities for a specific day
// @route   GET /api/activity/day/:date
// @access  Private
const getActivitiesForDay = async (req, res) => {
  try {
    const { date } = req.params;
    const userId = req.user.id;

    const activities = await getDayActivities(userId, date);
    return res.json({
      date,
      count: activities.length,
      activities,
    });
  } catch (error) {
    console.error("Get Day Activities Error:", error);
    return res.status(500).json({ message: "Server error retrieving day activities." });
  }
};

// @desc    Get user streak metrics
// @route   GET /api/streak
// @access  Private
const getStreakMetrics = async (req, res) => {
  try {
    const userId = req.user.id;
    let currentStreak = 1;
    let longestStreak = 1;
    let lastLoginDate = getFormattedDate();

    if (mongoose.connection.readyState === 1) {
      const streakRecord = await Streak.findOne({ userId });
      if (streakRecord) {
        currentStreak = streakRecord.currentStreak || 1;
        longestStreak = streakRecord.longestStreak || 1;
        lastLoginDate = streakRecord.lastLoginDate || getFormattedDate();
      }
    } else {
      const user = await localDb.findUserById(userId);
      if (user) {
        currentStreak = user.currentStreak || 1;
        longestStreak = user.longestStreak || 1;
        lastLoginDate = user.lastLoginDate || getFormattedDate();
      }
    }

    return res.json({
      currentStreak,
      longestStreak,
      lastLoginDate,
      milestones: [
        { days: 3, unlocked: currentStreak >= 3 },
        { days: 7, unlocked: currentStreak >= 7 },
        { days: 14, unlocked: currentStreak >= 14 },
        { days: 30, unlocked: currentStreak >= 30 },
        { days: 60, unlocked: currentStreak >= 60 },
        { days: 100, unlocked: currentStreak >= 100 },
      ],
    });
  } catch (error) {
    console.error("Get Streak Metrics Error:", error);
    return res.status(500).json({ message: "Server error retrieving streak metrics." });
  }
};

// @desc    Complete a learning module / roadmap activity / challenge
// @route   POST /api/activity or POST /api/activity/complete
// @access  Private
const completeActivity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { activityId, activityType, title, xpEarned = 50, metadata = {} } = req.body;

    const actId = activityId || metadata.refId || (title ? title.toLowerCase().replace(/\W+/g, "_") : `act_${Date.now()}`);
    const searchUserId = userId.toString();

    let user;
    if (mongoose.connection.readyState === 1) {
      user = await User.findById(userId);
    } else {
      user = await localDb.findUserById(searchUserId);
    }

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const completedList = Array.isArray(user.completedActivities) ? user.completedActivities : [];
    const isAlreadyCompleted = completedList.some(
      (a) => (a.activityId && a.activityId === actId) || (a.title && a.title === title)
    );

    // Requirement 8: Do not allow duplicate completion to artificially increase XP or streak
    if (isAlreadyCompleted) {
      return res.json({
        success: false,
        duplicate: true,
        message: `Activity '${title || actId}' has already been completed! No extra XP or streak awarded.`,
        user,
      });
    }

    // 1. Record activity completion
    const newCompletion = {
      activityId: actId,
      activityType: activityType || "MODULE_COMPLETION",
      title: title || "Learning Activity",
      xpEarned: parseInt(xpEarned, 10) || 50,
      completedAt: new Date().toISOString(),
    };

    // 2. Record daily activity marker for Calendar & Streak
    const typeTag = activityType || "RESOURCE_COMPLETED";
    await recordActivity(userId, typeTag, { activityId: actId, title, ...metadata }, "USER_ACTION");

    // 3. Process streak update & award XP
    const streakResult = await processDailyLogin(userId);
    const updatedUserObj = await awardXP(userId, "COMPLETE_RESOURCE", newCompletion.xpEarned, title || "Module Completion");

    // 4. Update user completedActivities list
    let finalUser;
    if (mongoose.connection.readyState === 1) {
      user.completedActivities.push(newCompletion);
      await user.save();
      finalUser = await User.findById(userId).select("-password");
    } else {
      const updatedList = [...completedList, newCompletion];
      finalUser = await localDb.updateUser(searchUserId, {
        completedActivities: updatedList,
        xp: updatedUserObj?.xp || user.xp,
        levelNumber: updatedUserObj?.levelNumber || user.levelNumber,
      });
    }

    return res.json({
      success: true,
      duplicate: false,
      message: `Completed '${title || "Activity"}'! +${newCompletion.xpEarned} XP Awarded! 🎉`,
      xpEarned: newCompletion.xpEarned,
      streak: streakResult,
      user: finalUser,
    });
  } catch (error) {
    console.error("Complete Activity Error:", error);
    return res.status(500).json({ message: "Server error recording completed activity." });
  }
};

module.exports = {
  getUserActivities,
  getCalendar,
  getActivitiesForDay,
  getStreakMetrics,
  completeActivity,
};
