const mongoose = require("mongoose");

const assessmentBankSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Assessment title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      index: true,
    },
    durationMinutes: {
      type: Number,
      default: 15,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },
    topics: {
      type: [String],
      default: [],
    },
    skillsCovered: {
      type: [String],
      default: [],
    },
    careerPaths: {
      type: [String],
      default: [],
    },
    questionIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AssessmentBank", assessmentBankSchema);
