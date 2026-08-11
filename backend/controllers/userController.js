const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const User = require("../models/User");
const localDb = require("../config/localDbService");
const { calculateJobReadiness } = require("../services/jobReadinessService");

/**
 * Format clean User Profile DTO for frontend
 */
const formatUserProfile = (userDoc) => {
  const user = userDoc.toObject ? userDoc.toObject() : userDoc;
  const { password, ...userNoPass } = user;

  const id = userNoPass._id || userNoPass.id;
  const fullName = userNoPass.fullName || "Student";
  const email = userNoPass.email || "";
  const phone = userNoPass.phone || "";
  const education = userNoPass.educationLevel || "B.Tech";
  const course = userNoPass.branch || userNoPass.classOrStatus || "Computer Science & Engineering";
  const college = userNoPass.college || "Engineering College";
  const graduationYear = userNoPass.graduationYear || "2027";
  const profileLevel = userNoPass.levelNumber || 1;
  const skills = userNoPass.skills || [];

  const careerGoalArr = userNoPass.careerInterests || [];
  const targetRole = userNoPass.targetRole || userNoPass.careerGoal || (careerGoalArr.length > 0 ? careerGoalArr[0] : "Software Developer");
  const recommendedCareer = userNoPass.selectedCareerDetails?.title || targetRole;

  // Return stored values as-is (no hardcoded fallbacks — frontend handles display defaults).
  const githubUrl = userNoPass.githubUrl || userNoPass.github || "";
  const linkedinUrl = userNoPass.linkedinUrl || userNoPass.linkedin || "";
  const portfolioUrl = userNoPass.portfolioUrl || userNoPass.portfolio || "";

  return {
    ...userNoPass,
    id,
    _id: id,
    fullName,
    email,
    phone,
    education,
    educationLevel: education,
    course,
    branch: course,
    college,
    graduationYear,
    profileLevel,
    levelNumber: profileLevel,
    skills,
    targetRole,
    careerGoal: targetRole,
    careerInterests: careerGoalArr.length > 0 ? careerGoalArr : [targetRole],
    recommendedCareer,
    github: githubUrl,
    githubUrl,
    linkedin: linkedinUrl,
    linkedinUrl,
    portfolio: portfolioUrl,
    portfolioUrl,
  };
};

/**
 * GET /api/users/profile
 */
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Authentication required." });
    }

    let user = null;
    if (mongoose.connection.readyState === 1) {
      user = await User.findById(userId).select("-password").lean();
    } else {
      user = await localDb.findUserById(userId);
    }

    if (!user) {
      return res.status(404).json({ success: false, message: "User profile not found." });
    }

    const formattedProfile = formatUserProfile(user);
    const readiness = calculateJobReadiness(user, user.selectedCareerDetails);

    return res.status(200).json({
      success: true,
      user: formattedProfile,
      jobReadiness: readiness,
    });
  } catch (error) {
    console.error("Get User Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching user profile.",
      details: error.message,
    });
  }
};

/**
 * PUT /api/users/profile
 */
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Authentication required." });
    }

    const {
      fullName,
      phone,
      education,
      educationLevel,
      course,
      branch,
      college,
      graduationYear,
      careerGoal,
      targetRole,
      careerInterests,
      skills,
      profileImage,
      profilePhoto,
      cgpa,
      linkedin,
      linkedinUrl,
      github,
      githubUrl,
      portfolio,
      portfolioUrl,
    } = req.body;

    const updates = {};
    if (fullName !== undefined) updates.fullName = String(fullName).trim();
    if (phone !== undefined) updates.phone = String(phone).trim();
    if (educationLevel !== undefined || education !== undefined) updates.educationLevel = String(educationLevel || education).trim();
    if (branch !== undefined || course !== undefined) updates.branch = String(branch || course).trim();
    if (college !== undefined) updates.college = String(college).trim();
    if (graduationYear !== undefined) updates.graduationYear = String(graduationYear).trim();
    if (skills !== undefined && Array.isArray(skills)) updates.skills = skills;

    const roleValue = targetRole !== undefined ? targetRole : careerGoal;
    if (roleValue !== undefined) {
      const trimmedRole = String(roleValue).trim();
      updates.targetRole = trimmedRole;
      updates.careerGoal = trimmedRole;
      updates.careerInterests = [trimmedRole];
    } else if (careerInterests !== undefined && Array.isArray(careerInterests)) {
      updates.careerInterests = careerInterests;
      if (careerInterests.length > 0) {
        updates.targetRole = careerInterests[0];
        updates.careerGoal = careerInterests[0];
      }
    }

    const ghVal = githubUrl !== undefined ? githubUrl : github;
    if (ghVal !== undefined) {
      const trimmedGh = String(ghVal).trim();
      updates.github = trimmedGh;
      updates.githubUrl = trimmedGh;
    }

    const liVal = linkedinUrl !== undefined ? linkedinUrl : linkedin;
    if (liVal !== undefined) {
      const trimmedLi = String(liVal).trim();
      updates.linkedin = trimmedLi;
      updates.linkedinUrl = trimmedLi;
    }

    const portVal = portfolioUrl !== undefined ? portfolioUrl : portfolio;
    if (portVal !== undefined) {
      const trimmedPort = String(portVal).trim();
      updates.portfolio = trimmedPort;
      updates.portfolioUrl = trimmedPort;
    }

    const photoUrl = profilePhoto || profileImage;
    if (photoUrl !== undefined) {
      updates.profileImage = photoUrl;
    }

    if (cgpa !== undefined) updates.cgpa = String(cgpa).trim();

    updates.profileCompleted = true;

    let updatedUser = null;
    if (mongoose.connection.readyState === 1) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true, runValidators: true }
      ).select("-password").lean();
    } else {
      updatedUser = await localDb.updateUser(userId, updates);
    }

    const formattedProfile = formatUserProfile(updatedUser);
    const readiness = calculateJobReadiness(updatedUser, updatedUser.selectedCareerDetails);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: formattedProfile,
      jobReadiness: readiness,
    });
  } catch (error) {
    console.error("Update User Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error updating profile.",
      details: error.message,
    });
  }
};

/**
 * POST /api/users/profile/photo
 * Accepts multipart/form-data with field "photo" (JPG/PNG ≤5 MB).
 * Stores file in /uploads/profiles/ and saves the URL in user.profileImage.
 */
const uploadProfilePhoto = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Authentication required." });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded. Please select a JPG, JPEG or PNG image." });
    }

    // Build the publicly accessible URL for the uploaded file
    const photoUrl = `/uploads/profiles/${req.file.filename}`;

    let updatedUser = null;
    if (mongoose.connection.readyState === 1) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { profileImage: photoUrl, profilePhoto: photoUrl } },
        { new: true }
      ).select("-password").lean();
    } else {
      updatedUser = await localDb.updateUser(userId, { profileImage: photoUrl, profilePhoto: photoUrl });
    }

    return res.status(200).json({
      success: true,
      message: "Profile photo uploaded successfully.",
      photoUrl,
      user: formatUserProfile(updatedUser),
    });
  } catch (error) {
    console.error("Upload Profile Photo Error:", error);
    // Clean up the uploaded file if DB save failed
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({
      success: false,
      message: "Server error uploading profile photo.",
      details: error.message,
    });
  }
};

/**
 * DELETE /api/users/profile/photo
 * Clears profileImage/profilePhoto from the user document (does NOT delete the file to preserve history).
 */
const removeProfilePhoto = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Authentication required." });
    }

    let updatedUser = null;
    if (mongoose.connection.readyState === 1) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { profileImage: null, profilePhoto: null } },
        { new: true }
      ).select("-password").lean();
    } else {
      updatedUser = await localDb.updateUser(userId, { profileImage: null, profilePhoto: null });
    }

    return res.status(200).json({
      success: true,
      message: "Profile photo removed.",
      user: formatUserProfile(updatedUser),
    });
  } catch (error) {
    console.error("Remove Profile Photo Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error removing profile photo.",
      details: error.message,
    });
  }
};

module.exports = { getUserProfile, updateUserProfile, uploadProfilePhoto, removeProfilePhoto };
