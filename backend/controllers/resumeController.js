const mongoose = require("mongoose");
const Resume = require("../models/Resume");
const fs = require("fs").promises;
const path = require("path");

const DATA_DIR = path.join(__dirname, "../data");
const LOCAL_RESUMES_FILE = path.join(DATA_DIR, "resumes_store.json");

const getLocalResumes = async () => {
  try {
    const data = await fs.readFile(LOCAL_RESUMES_FILE, "utf8");
    return JSON.parse(data || "[]");
  } catch {
    return [];
  }
};

const saveLocalResumes = async (resumes) => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(LOCAL_RESUMES_FILE, JSON.stringify(resumes, null, 2), "utf8");
  } catch (err) {
    console.error("Local resumes save error:", err);
  }
};

// @desc    Get all resumes for logged-in user
// @route   GET /api/resumes
// @access  Private
const getResumes = async (req, res) => {
  try {
    const userId = req.user.id.toString();
    let resumes = [];

    if (mongoose.connection.readyState === 1) {
      resumes = await Resume.find({ userId: req.user.id }).sort({ updatedAt: -1 });
    } else {
      const all = await getLocalResumes();
      resumes = all.filter((r) => r.userId && r.userId.toString() === userId);
    }

    return res.json(resumes);
  } catch (error) {
    console.error("Get Resumes Error:", error);
    return res.status(500).json({ message: "Server error fetching resumes." });
  }
};

// @desc    Get single resume by ID
// @route   GET /api/resumes/:id
// @access  Private
const getResumeById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id.toString();
    let resume = null;

    if (mongoose.connection.readyState === 1) {
      resume = await Resume.findOne({ _id: id, userId: req.user.id });
    } else {
      const all = await getLocalResumes();
      resume = all.find((r) => (r._id === id || r.id === id) && r.userId.toString() === userId);
    }

    if (!resume) {
      return res.status(404).json({ message: "Resume not found." });
    }

    return res.json(resume);
  } catch (error) {
    console.error("Get Resume By ID Error:", error);
    return res.status(500).json({ message: "Server error fetching resume details." });
  }
};

// @desc    Create new resume
// @route   POST /api/resumes
// @access  Private
const createResume = async (req, res) => {
  try {
    const userId = req.user.id;
    const resumeData = {
      ...req.body,
      userId,
    };

    let newResume;
    if (mongoose.connection.readyState === 1) {
      newResume = await Resume.create(resumeData);
    } else {
      const resumes = await getLocalResumes();
      const objectId = new mongoose.Types.ObjectId().toString();
      newResume = {
        _id: objectId,
        id: objectId,
        ...resumeData,
        userId: userId.toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      resumes.push(newResume);
      await saveLocalResumes(resumes);
    }

    return res.status(201).json(newResume);
  } catch (error) {
    console.error("Create Resume Error:", error);
    return res.status(500).json({ message: "Server error creating resume." });
  }
};

// @desc    Update existing resume
// @route   PUT /api/resumes/:id
// @access  Private
const updateResume = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id.toString();

    let updated;
    if (mongoose.connection.readyState === 1) {
      updated = await Resume.findOneAndUpdate(
        { _id: id, userId: req.user.id },
        { $set: req.body },
        { new: true, runValidators: true }
      );
    } else {
      const resumes = await getLocalResumes();
      const index = resumes.findIndex((r) => (r._id === id || r.id === id) && r.userId.toString() === userId);
      if (index !== -1) {
        resumes[index] = {
          ...resumes[index],
          ...req.body,
          updatedAt: new Date().toISOString(),
        };
        await saveLocalResumes(resumes);
        updated = resumes[index];
      }
    }

    if (!updated) {
      return res.status(404).json({ message: "Resume not found or unauthorized." });
    }

    return res.json(updated);
  } catch (error) {
    console.error("Update Resume Error:", error);
    return res.status(500).json({ message: "Server error updating resume." });
  }
};

// @desc    Delete resume
// @route   DELETE /api/resumes/:id
// @access  Private
const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id.toString();

    if (mongoose.connection.readyState === 1) {
      await Resume.findOneAndDelete({ _id: id, userId: req.user.id });
    } else {
      let resumes = await getLocalResumes();
      resumes = resumes.filter((r) => !(r._id === id || r.id === id) && r.userId.toString() === userId);
      await saveLocalResumes(resumes);
    }

    return res.json({ message: "Resume deleted successfully." });
  } catch (error) {
    console.error("Delete Resume Error:", error);
    return res.status(500).json({ message: "Server error deleting resume." });
  }
};

module.exports = {
  getResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
};
