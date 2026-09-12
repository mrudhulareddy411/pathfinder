const mongoose = require("mongoose");
const User = require("../models/User");
const XPTransaction = require("../models/XPTransaction");
const Streak = require("../models/Streak");
const Badge = require("../models/Badge");

const XP_MAP = {
  COMPLETE_PROFILE: 50,
  INTEREST_ASSESSMENT: 100,
  CAREER_ASSESSMENT: 150,
  SKILL_ASSESSMENT: 100,
  COMPLETE_RESOURCE: 50,
  COMPLETE_CHALLENGE: 100,
  COMPLETE_PROJECT: 300,
  COMPLETE_ROADMAP_STAGE: 200,
};

const calculateLevel = (totalXP) => {
  if (totalXP < 100) return 1;
  if (totalXP < 300) return 2;
  if (totalXP < 600) return 3;
  if (totalXP < 1000) return 4;
  if (totalXP < 1500) return 5;
  if (totalXP < 2200) return 6;
  return 7;
};

const awardXP = async (userId, action, customXp = null, sourceActivity = "") => {
  const xpAmount = customXp || XP_MAP[action] || 50;

  let user;
  
    user = await User.findById(userId);
    if (!user) return null;

    user.xp = (user.xp || 0) + xpAmount;
    user.levelNumber = calculateLevel(user.xp);
    user.lastActivityDate = new Date();
    await user.save();

    await XPTransaction.create({
      userId,
      action,
      xpAmount,
      sourceActivity,
    });
  

  return user;
};

const updateStreak = async (userId) => {
  const now = new Date();
  let currentStreak = 1;
  let longestStreak = 1;

  
    let streakRecord = await Streak.findOne({ userId });
    if (!streakRecord) {
      streakRecord = await Streak.create({ userId, lastActivityDate: now, currentStreak: 1, longestStreak: 1 });
    } else {
      const lastDate = new Date(streakRecord.lastActivityDate);
      const diffTime = Math.abs(now - lastDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak = streakRecord.currentStreak + 1;
      } else if (diffDays > 1) {
        currentStreak = 1;
      } else {
        currentStreak = streakRecord.currentStreak;
      }

      longestStreak = Math.max(currentStreak, streakRecord.longestStreak || 1);
      streakRecord.currentStreak = currentStreak;
      streakRecord.longestStreak = longestStreak;
      streakRecord.lastActivityDate = now;
      await streakRecord.save();
    }
  
  return { currentStreak, longestStreak };
};

module.exports = {
  awardXP,
  updateStreak,
  XP_MAP,
  calculateLevel,
};
