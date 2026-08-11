const mongoose = require("mongoose");

const roadmapSchema = new mongoose.Schema(
  {
    careerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Career",
      required: true,
    },
    careerTitle: {
      type: String,
      required: true,
    },
    stages: [
      {
        stageName: { type: String, required: true },
        description: { type: String },
        skillsToLearn: [String],
        resources: [
          {
            title: String,
            provider: String,
            url: String,
            type: String,
            verifiedAt: Date,
          },
        ],
      },
    ],
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

module.exports = mongoose.model("Roadmap", roadmapSchema);
