const mongoose = require("mongoose");

const streakSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    lastActivityDate: {
      type: Date,
      default: Date.now,
    },
    currentStreak: {
      type: Number,
      default: 1,
    },
    longestStreak: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Streak", streakSchema);
