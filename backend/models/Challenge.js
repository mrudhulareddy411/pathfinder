const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    xpReward: {
      type: Number,
      default: 100,
    },
    type: {
      type: String,
      enum: ["DAILY", "WEEKLY", "SKILL", "COMMUNITY"],
      default: "DAILY",
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    completionCriteria: {
      actionType: String,
      targetCount: { type: Number, default: 1 },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Challenge", challengeSchema);
