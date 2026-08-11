const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    skills: [String],
    learningObjectives: [String],
    requirements: [String],
    xpReward: {
      type: Number,
      default: 300,
    },
    provenance: {
      sourceName: { type: String, required: true },
      sourceURL: { type: String, required: true },
      retrievedAt: { type: Date, default: Date.now },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);
