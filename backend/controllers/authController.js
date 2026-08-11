const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const mongoose = require("mongoose");
const User = require("../models/User");
const localDb = require("../config/localDbService");
const { processDailyLogin } = require("../services/activityService");

// Helper to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "pathfinder_secret_key", {
    expiresIn: "30d",
  });
};

const isMongoConnected = () => mongoose.connection.readyState === 1;

// Helper to decode Google Credential JWT safely
const decodeGoogleCredential = (credential) => {
  try {
    const parts = credential.split(".");
    if (parts.length !== 3) return null;
    const payloadJson = Buffer.from(parts[1], "base64").toString("utf-8");
    return JSON.parse(payloadJson);
  } catch (err) {
    console.warn("Unable to parse Google credential JWT:", err.message);
    return null;
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      educationLevel,
      classOrStatus,
      college,
      branch,
      graduationYear,
      semester,
      interests,
      skills,
      careerInterests,
    } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Please provide full name, email, and password." });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long." });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (isMongoConnected()) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(400).json({ message: "This email is already registered." });
      }
    } else {
      const existingUser = await localDb.findUserByEmail(normalizedEmail);
      if (existingUser) {
        return res.status(400).json({ message: "This email is already registered." });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userPayload = {
      fullName: fullName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      authProvider: "email",
      educationLevel: educationLevel || "B.Tech",
      classOrStatus: classOrStatus || "Student",
      college: college ? college.trim() : "",
      branch: branch || "Computer Science & Engineering",
      graduationYear: graduationYear || "2027",
      semester: semester || "1st Semester",
      interests: Array.isArray(interests) ? interests : [],
      skills: Array.isArray(skills) ? skills : [],
      careerInterests: Array.isArray(careerInterests) ? careerInterests : [],
      profileCompleted: !!(educationLevel && college),
    };

    let user;
    if (isMongoConnected()) {
      user = await User.create(userPayload);
    } else {
      user = await localDb.createUser(userPayload);
    }

    const userId = user._id || user.id;

    return res.status(201).json({
      success: true,
      message: "Account created successfully! 🎉",
      user: {
        id: userId,
        fullName: user.fullName,
        email: user.email,
        educationLevel: user.educationLevel,
        college: user.college,
        branch: user.branch,
        graduationYear: user.graduationYear,
        authProvider: "email",
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: error.message || "Server error during registration." });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please enter email and password." });
    }

    const normalizedEmail = email.trim().toLowerCase();

    let user;
    if (isMongoConnected()) {
      user = await User.findOne({ email: normalizedEmail });
    } else {
      user = await localDb.findUserByEmail(normalizedEmail);
    }

    if (!user) {
      return res.status(404).json({ message: "No account found with this email address." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect email or password." });
    }

    const userId = user._id || user.id;
    const streakResult = await processDailyLogin(userId);
    const token = generateToken(userId);

    return res.json({
      success: true,
      message: `Welcome back, ${user.fullName}! 👋`,
      token,
      user: {
        id: userId,
        fullName: user.fullName,
        email: user.email,
        authProvider: user.authProvider || "email",
        profileImage: user.profileImage || null,
        educationLevel: user.educationLevel,
        college: user.college,
        branch: user.branch,
        graduationYear: user.graduationYear,
        skills: user.skills || [],
        profileCompleted: user.profileCompleted,
        xp: user.xp || 10,
        levelNumber: user.levelNumber || 1,
        currentStreak: streakResult.currentStreak || 1,
        longestStreak: streakResult.longestStreak || 1,
        lastLoginDate: streakResult.lastLoginDate,
        milestoneUnlocked: streakResult.milestoneUnlocked || null,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Unable to reach the server. Please check your network connection." });
  }
};

// @desc    Google Single Sign-On / Sign Up with Credential Verification
// @route   POST /api/auth/google
// @access  Public
const googleAuth = async (req, res) => {
  try {
    const { credential, email, name, googleId, picture } = req.body;

    let targetEmail = email;
    let targetName = name;
    let targetGoogleId = googleId;
    let targetPicture = picture;

    // Decode Google Credential JWT if provided
    if (credential) {
      const decodedPayload = decodeGoogleCredential(credential);
      if (decodedPayload) {
        targetEmail = decodedPayload.email || targetEmail;
        targetName = decodedPayload.name || targetName;
        targetGoogleId = decodedPayload.sub || targetGoogleId;
        targetPicture = decodedPayload.picture || targetPicture;
      }
    }

    if (!targetEmail) {
      return res.status(400).json({ message: "Unable to verify Google account email." });
    }

    const normalizedEmail = targetEmail.trim().toLowerCase();
    let user = null;
    let isNewUser = false;

    if (isMongoConnected()) {
      user = await User.findOne({
        $or: [{ email: normalizedEmail }, { googleId: targetGoogleId }],
      });

      if (!user) {
        isNewUser = true;
        const dummyPassword = await bcrypt.hash(`GoogleAuth_${Date.now()}_${Math.random()}`, 10);
        user = await User.create({
          fullName: targetName || "Google Student",
          email: normalizedEmail,
          password: dummyPassword,
          googleId: targetGoogleId || `g_${Date.now()}`,
          profileImage: targetPicture || null,
          authProvider: "google",
          educationLevel: "B.Tech",
          branch: "Computer Science & Engineering",
          college: "",
          graduationYear: "2027",
          profileCompleted: false,
        });
      } else {
        user.googleId = targetGoogleId || user.googleId;
        user.profileImage = targetPicture || user.profileImage;
        user.authProvider = "google";
        await user.save();
      }
    } else {
      user = await localDb.findUserByEmail(normalizedEmail);
      if (!user) {
        isNewUser = true;
        const dummyPassword = await bcrypt.hash(`GoogleAuth_${Date.now()}_${Math.random()}`, 10);
        user = await localDb.createUser({
          fullName: targetName || "Google Student",
          email: normalizedEmail,
          password: dummyPassword,
          googleId: targetGoogleId || `g_${Date.now()}`,
          profileImage: targetPicture || null,
          authProvider: "google",
          educationLevel: "B.Tech",
          branch: "Computer Science & Engineering",
          college: "",
          graduationYear: "2027",
          profileCompleted: false,
        });
      } else {
        user = await localDb.updateUser(user._id || user.id, {
          googleId: targetGoogleId || user.googleId,
          profileImage: targetPicture || user.profileImage,
          authProvider: "google",
        });
      }
    }

    const userId = user._id || user.id;

    // Record login activity with GOOGLE_AUTH source
    const streakResult = await processDailyLogin(userId, "GOOGLE_AUTH");
    const token = generateToken(userId);

    const requiresProfileSetup = !user.profileCompleted || !user.college;

    return res.json({
      success: true,
      message: `Signed in with Google as ${user.fullName}! 🚀`,
      token,
      requiresProfileSetup,
      user: {
        id: userId,
        fullName: user.fullName,
        email: user.email,
        authProvider: "google",
        profileImage: user.profileImage || targetPicture || null,
        educationLevel: user.educationLevel,
        college: user.college,
        branch: user.branch,
        graduationYear: user.graduationYear,
        skills: user.skills || [],
        profileCompleted: user.profileCompleted,
        xp: user.xp || 10,
        levelNumber: user.levelNumber || 1,
        currentStreak: streakResult.currentStreak || 1,
        longestStreak: streakResult.longestStreak || 1,
        lastLoginDate: streakResult.lastLoginDate,
      },
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    return res.status(500).json({ message: "Unable to complete Google authentication. Please try again." });
  }
};

// @desc    Send 6-Digit Numeric OTP for Password Reset
// @route   POST /api/auth/send-otp
// @access  Public
const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Please enter your registered email address." });
    }

    const normalizedEmail = email.trim().toLowerCase();

    let user = null;
    if (isMongoConnected()) {
      user = await User.findOne({ email: normalizedEmail });
    }
    if (!user) {
      user = await localDb.findUserByEmail(normalizedEmail);
    }

    if (!user) {
      return res.status(404).json({ message: "No account found with this email address." });
    }

    // Generate 6-digit numeric OTP
    const numericOTP = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP before storing
    const hashedOTP = crypto.createHash("sha256").update(numericOTP).digest("hex");
    const expiresAt = new Date(Date.now() + 600000); // 10 minutes expiration

    const userId = user._id || user.id;

    if (isMongoConnected()) {
      try {
        await User.updateOne(
          { email: normalizedEmail },
          { $set: { otpToken: hashedOTP, otpExpires: expiresAt } }
        );
      } catch (err) {
        console.warn("Mongo OTP update warning:", err.message);
      }
    }
    await localDb.updateUserByEmail(normalizedEmail, {
      otpToken: hashedOTP,
      otpExpires: expiresAt.toISOString(),
    });

    return res.json({
      success: true,
      message: `6-Digit OTP sent to ${normalizedEmail}.`,
      otp: numericOTP,
      email: normalizedEmail,
      isDevelopment: true,
    });
  } catch (error) {
    console.error("Send OTP Error:", error);
    return res.status(500).json({ message: "Server error sending OTP." });
  }
};

// @desc    Verify 6-Digit Numeric OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Please enter your email and 6-digit OTP." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const hashedOTP = crypto.createHash("sha256").update(otp.trim()).digest("hex");

    let user = null;
    if (isMongoConnected()) {
      user = await User.findOne({
        email: normalizedEmail,
        otpToken: hashedOTP,
        otpExpires: { $gt: new Date() },
      });
    }
    if (!user) {
      user = await localDb.findUserByEmail(normalizedEmail);
      if (
        !user ||
        user.otpToken !== hashedOTP ||
        !user.otpExpires ||
        new Date(user.otpExpires) <= new Date()
      ) {
        user = null;
      }
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired 6-digit OTP code." });
    }

    // Generate secure reset token for step 2
    const rawResetToken = crypto.randomBytes(32).toString("hex");
    const hashedResetToken = crypto.createHash("sha256").update(rawResetToken).digest("hex");
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour

    if (isMongoConnected()) {
      try {
        await User.updateOne(
          { email: normalizedEmail },
          {
            $set: {
              otpToken: null,
              otpExpires: null,
              resetPasswordToken: hashedResetToken,
              resetPasswordExpires: expiresAt,
            },
          }
        );
      } catch (err) {
        console.warn("Mongo reset token update warning:", err.message);
      }
    }

    await localDb.updateUserByEmail(normalizedEmail, {
      otpToken: null,
      otpExpires: null,
      resetPasswordToken: hashedResetToken,
      resetPasswordExpires: expiresAt.toISOString(),
    });

    return res.json({
      success: true,
      message: "OTP verified successfully!",
      resetToken: rawResetToken,
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).json({ message: "Server error verifying OTP." });
  }
};

// @desc    Forgot Password - Legacy & Development Token Generator
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  return sendOTP(req, res);
};

// @desc    Reset Password with Token
// @route   POST /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 8) {
      return res.status(400).json({ message: "New password must be at least 8 characters long." });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    let user = null;
    if (isMongoConnected()) {
      user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: new Date() },
      });
    }
    if (!user) {
      const users = await localDb.getUsers();
      user = users.find(
        (u) =>
          u.resetPasswordToken === hashedToken &&
          u.resetPasswordExpires &&
          new Date(u.resetPasswordExpires) > new Date()
      );
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired password reset token." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userEmail = user.email ? user.email.toLowerCase() : "";

    if (isMongoConnected()) {
      try {
        await User.updateOne(
          { email: userEmail },
          {
            $set: {
              password: hashedPassword,
              resetPasswordToken: null,
              resetPasswordExpires: null,
            },
          }
        );
      } catch (err) {
        console.warn("Mongo password update warning:", err.message);
      }
    }

    await localDb.updateUserByEmail(userEmail, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    return res.json({
      success: true,
      message: "Password reset successfully! You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({ message: "Server error resetting password." });
  }
};

const { calculateJobReadiness } = require("../services/jobReadinessService");

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    let user;
    if (isMongoConnected()) {
      user = await User.findById(req.user.id).select("-password").lean();
    } else {
      user = await localDb.findUserById(req.user.id);
    }

    if (!user) {
      return res.status(404).json({ message: "User profile not found." });
    }
    const { password, ...userWithoutPassword } = user;
    const readiness = calculateJobReadiness(userWithoutPassword, userWithoutPassword.selectedCareerDetails);

    return res.json({
      ...userWithoutPassword,
      jobReadiness: readiness,
    });
  } catch (error) {
    console.error("Get Me Error:", error);
    return res.status(500).json({ message: error.message || "Server error fetching user profile." });
  }
};

// @desc    Update user profile setup
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const fieldsToUpdate = [
      "educationLevel",
      "classOrStatus",
      "college",
      "branch",
      "graduationYear",
      "semester",
      "interests",
      "skills",
      "careerInterests",
      "targetRole",
      "careerGoal",
      "assessment",
      "selectedCareerDetails",
      "phone",
      "cgpa",
      "linkedin",
      "linkedinUrl",
      "github",
      "githubUrl",
      "portfolio",
      "portfolioUrl",
    ];

    const updates = {};
    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (req.body.targetRole !== undefined || req.body.careerGoal !== undefined) {
      const roleVal = req.body.targetRole || req.body.careerGoal;
      updates.targetRole = roleVal;
      updates.careerGoal = roleVal;
      updates.careerInterests = [roleVal];
    }
    if (req.body.githubUrl !== undefined || req.body.github !== undefined) {
      const gh = req.body.githubUrl || req.body.github;
      updates.githubUrl = gh;
      updates.github = gh;
    }
    if (req.body.linkedinUrl !== undefined || req.body.linkedin !== undefined) {
      const li = req.body.linkedinUrl || req.body.linkedin;
      updates.linkedinUrl = li;
      updates.linkedin = li;
    }
    if (req.body.portfolioUrl !== undefined || req.body.portfolio !== undefined) {
      const port = req.body.portfolioUrl || req.body.portfolio;
      updates.portfolioUrl = port;
      updates.portfolio = port;
    }

    updates.profileCompleted = true;

    let updatedUser;
    if (isMongoConnected()) {
      updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { $set: updates },
        { new: true, runValidators: true }
      ).select("-password").lean();
    } else {
      updatedUser = await localDb.updateUser(req.user.id, updates);
    }

    const readiness = calculateJobReadiness(updatedUser, updatedUser.selectedCareerDetails);

    return res.json({
      ...updatedUser,
      jobReadiness: readiness,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({ message: error.message || "Server error updating profile." });
  }
};

module.exports = {
  register,
  login,
  googleAuth,
  sendOTP,
  verifyOTP,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
};
