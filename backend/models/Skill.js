const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    name: {
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
    },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
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

module.exports = mongoose.model("Skill", skillSchema);
