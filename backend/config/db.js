const mongoose = require("mongoose");
const dns = require("dns");

// Set reliable fallback DNS for MongoDB SRV resolution
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {}

// Disable Mongoose query buffering when DB is offline to prevent timeouts
mongoose.set("bufferCommands", false);

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI;

  try {
    console.log("🔌 Attempting connection to primary MongoDB Atlas cluster...");
    await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    console.log("✅ MongoDB Atlas Connected Successfully");
  } catch (primaryError) {
    console.error("⚠️ Primary MongoDB Atlas Connection Failed:", primaryError.message);
    console.error("⚠️ FATAL: Cannot start the application without a database connection.");
    process.exit(1);
  }
};

module.exports = connectDB;