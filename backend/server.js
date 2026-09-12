const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const connectDB = require("./config/db");
const seedVerifiedData = require("./services/seedService");

const app = express();

// Connect to MongoDB & Seed Verified Datasets
// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded profile photos as static files
const uploadsPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath, { recursive: true });
app.use("/uploads", express.static(uploadsPath));

// Routes
const authRoutes = require("./routes/authRoutes");
const careerRoutes = require("./routes/careerRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const calendarRoutes = require("./routes/calendarRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const mlRoutes = require("./routes/mlRoutes");
const assessmentRoutes = require("./routes/assessmentRoutes");
const questionRoutes = require("./routes/questionRoutes");
const academicRoutes = require("./routes/academicRoutes");
const skillGapRoutes = require("./routes/skillGapRoutes");
const userRoutes = require("./routes/userRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/careers", careerRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/ml", mlRoutes);
app.use("/api/assessment", assessmentRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/academic", academicRoutes);
app.use("/api/skill-gap", skillGapRoutes);
app.use("/api", calendarRoutes);

// Health Check
app.get("/", (req, res) => {
  res.send("🚀 Pathfinder AI Backend Running Successfully!");
});

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", service: "Pathfinder AI API", timestamp: new Date() });
});

// Connect to MongoDB & Seed Verified Datasets
connectDB()
  .then(() => {
    seedVerifiedData();

    // Start Server only after DB connection is successful
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to start server: MongoDB connection error.", err);
    process.exit(1);
  });