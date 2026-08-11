const mongoose = require("mongoose");

const badgeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: "🏆",
    },
    condition: {
      type: String,
      required: true,
    },
    xpReward: {
      type: Number,
      default: 100,
    },
    rarity: {
      type: String,
      enum: ["COMMON", "RARE", "EPIC", "LEGENDARY"],
      default: "COMMON",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Badge", badgeSchema);
