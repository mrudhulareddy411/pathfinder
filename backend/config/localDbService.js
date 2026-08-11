const fs = require("fs").promises;
const path = require("path");
const mongoose = require("mongoose");
const { loadOnetCareers } = require("../services/onetDatasetService");

const DATA_DIR = path.join(__dirname, "../data");
const USERS_FILE = path.join(DATA_DIR, "users_store.json");
const CAREERS_FILE = path.join(DATA_DIR, "verifiedCareerData.json");
const RESOURCES_FILE = path.join(DATA_DIR, "verifiedResourcesData.json");
const QUESTIONS_FILE = path.join(DATA_DIR, "questions_store.json");
const ATTEMPTS_FILE = path.join(DATA_DIR, "attempts_store.json");
const SKILLS_FILE = path.join(DATA_DIR, "skill_scores_store.json");

// Helper to ensure data directory exists
const ensureDataDir = async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(USERS_FILE);
    } catch {
      await fs.writeFile(USERS_FILE, JSON.stringify([], null, 2), "utf8");
    }
  } catch (err) {
    console.error("Local DB dir initialization error:", err);
  }
};

// Users Methods
const getUsers = async () => {
  await ensureDataDir();
  try {
    const data = await fs.readFile(USERS_FILE, "utf8");
    return JSON.parse(data || "[]");
  } catch {
    return [];
  }
};

const saveUsers = async (users) => {
  await ensureDataDir();
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
};

const findUserByEmail = async (email) => {
  const users = await getUsers();
  return users.find((u) => u.email && u.email.toLowerCase() === email.toLowerCase());
};

const findUserById = async (id) => {
  const users = await getUsers();
  const searchId = id.toString();
  return users.find((u) => (u._id && u._id.toString() === searchId) || (u.id && u.id.toString() === searchId));
};

const createUser = async (userData) => {
  const users = await getUsers();
  const objectId = new mongoose.Types.ObjectId().toString();
  const newUser = {
    _id: objectId,
    id: objectId,
    ...userData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  users.push(newUser);
  await saveUsers(users);
  return newUser;
};

const updateUser = async (id, updates) => {
  const users = await getUsers();
  const searchId = id.toString();
  const index = users.findIndex((u) => (u._id && u._id.toString() === searchId) || (u.id && u.id.toString() === searchId));
  if (index === -1) return null;

  users[index] = {
    ...users[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await saveUsers(users);
  return users[index];
};

const updateUserByEmail = async (email, updates) => {
  const users = await getUsers();
  const searchEmail = email.trim().toLowerCase();
  const index = users.findIndex((u) => u.email && u.email.toLowerCase() === searchEmail);
  if (index === -1) return null;

  users[index] = {
    ...users[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await saveUsers(users);
  return users[index];
};

// Careers Methods - Merges verified JSON & O*NET CSV records
const getCareers = async () => {
  let staticCareers = [];
  try {
    const data = await fs.readFile(CAREERS_FILE, "utf8");
    staticCareers = JSON.parse(data || "[]");
  } catch {
    staticCareers = [];
  }

  const onetCareers = loadOnetCareers();
  const combinedMap = new Map();

  // Deduplicate by title
  [...staticCareers, ...onetCareers].forEach((item) => {
    if (item && item.title) {
      const key = item.title.toLowerCase();
      if (!combinedMap.has(key)) {
        combinedMap.set(key, item);
      }
    }
  });

  return Array.from(combinedMap.values());
};

// Resources Methods
const getResources = async (filter = {}) => {
  try {
    const data = await fs.readFile(RESOURCES_FILE, "utf8");
    let resources = JSON.parse(data || "[]");
    if (filter.skill) {
      resources = resources.filter((r) => r.skill.toLowerCase().includes(filter.skill.toLowerCase()));
    }
    if (filter.category) {
      resources = resources.filter((r) => r.category.toLowerCase().includes(filter.category.toLowerCase()));
    }
    return resources;
  } catch {
    return [];
  }
};

// Local Question Store
const getQuestionsLocal = async () => {
  await ensureDataDir();
  try {
    const data = await fs.readFile(QUESTIONS_FILE, "utf8");
    return JSON.parse(data || "[]");
  } catch {
    return [];
  }
};

const saveQuestionLocal = async (qData) => {
  await ensureDataDir();
  const questions = await getQuestionsLocal();
  const newQ = { _id: `local_q_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`, ...qData, createdAt: new Date() };
  questions.push(newQ);
  await fs.writeFile(QUESTIONS_FILE, JSON.stringify(questions, null, 2), "utf8");
  return newQ;
};

// Local Attempt Store
const getAttemptsLocal = async (userId) => {
  await ensureDataDir();
  try {
    const data = await fs.readFile(ATTEMPTS_FILE, "utf8");
    const list = JSON.parse(data || "[]");
    if (userId) return list.filter((a) => a.userId?.toString() === userId.toString());
    return list;
  } catch {
    return [];
  }
};

const saveAttemptLocal = async (attemptData) => {
  await ensureDataDir();
  const attempts = await getAttemptsLocal();
  const newAttempt = { _id: `local_att_${Date.now()}`, ...attemptData, completedAt: new Date() };
  attempts.push(newAttempt);
  await fs.writeFile(ATTEMPTS_FILE, JSON.stringify(attempts, null, 2), "utf8");
  return newAttempt;
};

module.exports = {
  getUsers,
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
  updateUserByEmail,
  getCareers,
  getResources,
  getQuestionsLocal,
  saveQuestionLocal,
  getAttemptsLocal,
  saveAttemptLocal,
};
