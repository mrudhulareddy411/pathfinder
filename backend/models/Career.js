const mongoose = require("mongoose");

const careerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    educationRequirements: {
      type: [String],
      default: [],
    },
    requiredSkills: {
      type: [String],
      default: [],
    },
    matchingBranches: {
      type: [String],
      default: [],
    },
    salaryRange: {
      minLPA: Number,
      maxLPA: Number,
      currency: { type: String, default: "INR" },
    },
    provenance: {
      sourceName: { type: String, required: true },
      sourceURL: { type: String, required: true },
      retrievedAt: { type: Date, default: Date.now },
      sourceDescription: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Career", careerSchema);
