const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Technical Skills (0 to 100)
    python: { type: Number, default: 50, min: 0, max: 100 },
    java: { type: Number, default: 50, min: 0, max: 100 },
    sql: { type: Number, default: 50, min: 0, max: 100 },
    javascript: { type: Number, default: 50, min: 0, max: 100 },
    html: { type: Number, default: 50, min: 0, max: 100 },
    css: { type: Number, default: 50, min: 0, max: 100 },
    dataStructures: { type: Number, default: 50, min: 0, max: 100 },
    machineLearning: { type: Number, default: 50, min: 0, max: 100 },

    // Career Interests / Holland RIASEC (0 to 100)
    realistic: { type: Number, default: 50, min: 0, max: 100 },
    investigative: { type: Number, default: 50, min: 0, max: 100 },
    artistic: { type: Number, default: 50, min: 0, max: 100 },
    social: { type: Number, default: 50, min: 0, max: 100 },
    enterprising: { type: Number, default: 50, min: 0, max: 100 },
    conventional: { type: Number, default: 50, min: 0, max: 100 },

    // Academic Information
    educationLevel: { type: String, default: "B.Tech", trim: true },
    stream: { type: String, default: "Computer Science & Engineering", trim: true },
    percentage: { type: Number, default: 75, min: 0, max: 100 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Assessment", assessmentSchema);
