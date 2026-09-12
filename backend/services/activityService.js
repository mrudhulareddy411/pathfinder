const mongoose = require("mongoose");
const fs = require("fs").promises;
const path = require("path");
const Activity = require("../models/Activity");
const User = require("../models/User");
const Streak = require("../models/Streak");
const { awardXP } = require("./gamificationEngine");

const DATA_DIR = path.join(__dirname, "../data");
const LOCAL_ACTIVITIES_FILE = path.join(DATA_DIR, "activities_store.json");

// Helper to format date string YYYY-MM-DD in timezone (default Asia/Kolkata)
const getFormattedDate = (dateObj = new Date(), timezone = "Asia/Kolkata") => {
  try {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formatter.format(dateObj); // Returns YYYY-MM-DD
  } catch {
    return dateObj.toISOString().split("T")[0];
  }
};

// Helper for local activities storage
const getLocalActivities = async () => {
  try {
    const data = await fs.readFile(LOCAL_ACTIVITIES_FILE, "utf8");
    return JSON.parse(data || "[]");
  } catch {
    return [];
  }
};

const saveLocalActivities = async (activities) => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(LOCAL_ACTIVITIES_FILE, JSON.stringify(activities, null, 2), "utf8");
  } catch (err) {
    console.error("Local activities save error:", err);
  }
};

// Record an activity
const recordActivity = async (userId, activityType, metadata = {}, source = "SYSTEM", timezone = "Asia/Kolkata") => {
  const todayStr = getFormattedDate(new Date(), timezone);
  const searchUserId = userId.toString();

  if (activityType === "LOGIN") {
    const existingLogin = await Activity.findOne({
      userId,
      activityType: "LOGIN",
      date: todayStr,
    });
    if (existingLogin) return existingLogin;
  }

  const newActivity = await Activity.create({
    userId,
    activityType,
    date: todayStr,
    timestamp: new Date(),
    metadata,
    source,
  });
  return newActivity;
};

// Process daily login & streak update
const processDailyLogin = async (userId, timezone = "Asia/Kolkata") => {
  const todayStr = getFormattedDate(new Date(), timezone);
  const searchUserId = userId.toString();

  // 1. Record login activity
  await recordActivity(userId, "LOGIN", { loginTime: new Date() }, "AUTH_LOGIN", timezone);

  let currentStreak = 1;
  let longestStreak = 1;
  let milestoneUnlocked = null;

  let streakRecord = await Streak.findOne({ userId });
  let user = await User.findById(userId);

  if (!streakRecord) {
    streakRecord = await Streak.create({
      userId,
      currentStreak: 1,
      longestStreak: 1,
      lastLoginDate: todayStr,
    });
  } else {
    const lastDateStr = streakRecord.lastLoginDate;
    if (lastDateStr === todayStr) {
      // Same day login: preserve current streak
      currentStreak = streakRecord.currentStreak;
    } else {
      // Calculate difference in calendar days
      const lastDate = new Date(lastDateStr);
      const todayDate = new Date(todayStr);
      const diffTime = Math.abs(todayDate - lastDate);
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak = (streakRecord.currentStreak || 0) + 1;
      } else {
        currentStreak = 1; // Missed a day: reset current streak
      }
    }

    longestStreak = Math.max(currentStreak, streakRecord.longestStreak || 1);
    streakRecord.currentStreak = currentStreak;
    streakRecord.longestStreak = longestStreak;
    streakRecord.lastLoginDate = todayStr;
    await streakRecord.save();
  }

  if (user) {
    user.currentStreak = currentStreak;
    user.longestStreak = longestStreak;
    user.lastActivityDate = new Date();
    await user.save();
  }

  // Award +10 login XP once
  await awardXP(userId, "DAILY_LOGIN", 10, "Daily Login Bonus");

  // Check milestones (3, 7, 14, 30, 60, 100 days)
  const milestones = [3, 7, 14, 30, 60, 100];
  if (milestones.includes(currentStreak)) {
    milestoneUnlocked = `${currentStreak}-Day Streak Milestone!`;
    await awardXP(userId, "STREAK_MILESTONE", currentStreak * 10, `${currentStreak}-Day Streak Bonus`);
  }

  return {
    currentStreak,
    longestStreak,
    lastLoginDate: todayStr,
    milestoneUnlocked,
  };
};

// Fetch calendar activity matrix for a month
const getCalendarData = async (userId, year, month, timezone = "Asia/Kolkata") => {
  const searchUserId = userId.toString();
  const targetYear = parseInt(year, 10) || new Date().getFullYear();
  const targetMonth = parseInt(month, 10) || new Date().getMonth() + 1;

  const monthStr = targetMonth < 10 ? `0${targetMonth}` : `${targetMonth}`;
  const datePattern = `${targetYear}-${monthStr}`;

  let userActivities = [];

  userActivities = await Activity.find({
    userId,
    date: new RegExp(`^${datePattern}`),
  }).lean();

  // Group by day date string
  const dayMap = {};
  userActivities.forEach((act) => {
    if (!dayMap[act.date]) {
      dayMap[act.date] = {
        date: act.date,
        login: false,
        learning: false,
        roadmap: false,
        challenge: false,
        project: false,
        goal: false,
        count: 0,
        activities: [],
      };
    }
    dayMap[act.date].count += 1;
    dayMap[act.date].activities.push(act);

    if (act.activityType === "LOGIN") dayMap[act.date].login = true;
    if (act.activityType === "RESOURCE_COMPLETED") dayMap[act.date].learning = true;
    if (act.activityType === "ROADMAP_TASK_COMPLETED") dayMap[act.date].roadmap = true;
    if (act.activityType === "CHALLENGE_COMPLETED") dayMap[act.date].challenge = true;
    if (act.activityType === "PROJECT_COMPLETED" || act.activityType === "PROJECT_STARTED") dayMap[act.date].project = true;
    if (act.activityType === "GOAL_COMPLETED") dayMap[act.date].goal = true;
  });

  return dayMap;
};

// Fetch activities for a specific day
const getDayActivities = async (userId, dateString) => {
  const searchUserId = userId.toString();
  return await Activity.find({ userId, date: dateString }).sort({ timestamp: -1 });
};

module.exports = {
  recordActivity,
  processDailyLogin,
  getCalendarData,
  getDayActivities,
  getFormattedDate,
};
