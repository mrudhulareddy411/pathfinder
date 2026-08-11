const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Question text is required"],
      trim: true,
    },
    options: {
      type: [String],
      required: [true, "At least 2 options are required"],
      validate: [
        (val) => Array.isArray(val) && val.length >= 2,
        "Options array must contain at least 2 choices",
      ],
    },
    correctAnswer: {
      type: String,
      required: [true, "Correct answer is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      index: true,
    },
    topic: {
      type: String,
      required: [true, "Topic is required"],
      trim: true,
      index: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },
    skills: {
      type: [String],
      default: [],
    },
    careerPaths: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Question", questionSchema);
