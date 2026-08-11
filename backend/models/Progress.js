const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetCareer: {
      type: String,
    },
    completedSkills: [String],
    completedResources: [
      {
        resourceId: { type: mongoose.Schema.Types.ObjectId, ref: "Resource" },
        completedAt: { type: Date, default: Date.now },
      },
    ],
    roadmapProgressPercentage: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Progress", progressSchema);
