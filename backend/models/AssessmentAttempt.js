const mongoose = require("mongoose");

const assessmentAttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    assessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AssessmentBank",
      default: null,
    },
    assessmentTitle: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: "General",
      trim: true,
    },
    score: {
      type: Number,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    skillScores: {
      type: Map,
      of: Number,
      default: {},
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AssessmentAttempt", assessmentAttemptSchema);
