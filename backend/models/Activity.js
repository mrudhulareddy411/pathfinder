const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    activityType: {
      type: String,
      enum: [
        "LOGIN",
        "PROFILE_COMPLETED",
        "CAREER_ASSESSMENT",
        "CAREER_EXPLORED",
        "CAREER_SAVED",
        "SKILL_ASSESSMENT",
        "RESOURCE_COMPLETED",
        "ROADMAP_TASK_COMPLETED",
        "PROJECT_STARTED",
        "PROJECT_COMPLETED",
        "CHALLENGE_COMPLETED",
        "GOAL_COMPLETED",
        "ACADEMIC_RECORD_ADDED",
      ],
      required: true,
    },
    date: {
      type: String, // Format: YYYY-MM-DD
      required: true,
      index: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    source: {
      type: String,
      default: "SYSTEM",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Activity", activitySchema);
