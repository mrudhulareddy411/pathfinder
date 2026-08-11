const mongoose = require("mongoose");

const levelSchema = new mongoose.Schema(
  {
    levelNumber: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    icon: {
      type: String,
      default: "🎯",
    },
    requiredXP: {
      type: Number,
      required: true,
      default: 100,
    },
    unlockCondition: {
      type: String,
      default: "Complete previous level activities",
    },
    activities: [
      {
        title: String,
        actionCode: String,
        xpReward: Number,
      },
    ],
    careerSpecific: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Career",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Level", levelSchema);
