const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    googleId: {
      type: String,
      default: null,
    },
    profileImage: {
      type: String,
      default: null,
    },
    authProvider: {
      type: String,
      enum: ["email", "google"],
      default: "email",
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    cgpa: {
      type: String,
      trim: true,
      default: "",
    },
    targetRole: {
      type: String,
      trim: true,
      default: "",
    },
    careerGoal: {
      type: String,
      trim: true,
      default: "",
    },
    github: {
      type: String,
      trim: true,
      default: "",
    },
    githubUrl: {
      type: String,
      trim: true,
      default: "",
    },
    linkedin: {
      type: String,
      trim: true,
      default: "",
    },
    linkedinUrl: {
      type: String,
      trim: true,
      default: "",
    },
    portfolio: {
      type: String,
      trim: true,
      default: "",
    },
    portfolioUrl: {
      type: String,
      trim: true,
      default: "",
    },
    dateOfBirth: {
      type: Date,
    },
    educationLevel: {
      type: String,
      enum: ["10th", "12th", "B.Tech", "Other"],
      default: "12th",
    },
    classOrStatus: {
      type: String,
      trim: true,
    },
    college: {
      type: String,
      trim: true,
    },
    branch: {
      type: String,
      trim: true,
    },
    graduationYear: {
      type: String,
      trim: true,
    },
    semester: {
      type: String,
      trim: true,
    },
    interests: {
      type: [String],
      default: [],
    },
    skills: {
      type: [String],
      default: [],
    },
    careerInterests: {
      type: [String],
      default: [],
    },
    selectedCareer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Career",
    },
    selectedCareerDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    assessment: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    completedActivities: [
      {
        activityId: { type: String },
        activityType: { type: String },
        title: { type: String },
        xpEarned: { type: Number, default: 0 },
        completedAt: { type: Date, default: Date.now },
      },
    ],
    profileCompleted: {
      type: Boolean,
      default: false,
    },
    // Gamification Engine Fields
    xp: {
      type: Number,
      default: 0,
    },
    levelNumber: {
      type: Number,
      default: 1,
    },
    currentStreak: {
      type: Number,
      default: 1,
    },
    longestStreak: {
      type: Number,
      default: 1,
    },
    lastActivityDate: {
      type: Date,
      default: Date.now,
    },
    unlockedBadges: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Badge",
      },
    ],
    savedCareers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Career",
      },
    ],
    savedResources: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Resource",
      },
    ],
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    // Password Reset & OTP Fields
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
    otpToken: {
      type: String,
      default: null,
    },
    otpExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
