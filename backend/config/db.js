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
  const localFallbackUri = "mongodb://127.0.0.1:27017/pathfinder";

  try {
    console.log("🔌 Attempting connection to primary MongoDB Atlas cluster...");
    await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    console.log("✅ MongoDB Atlas Connected Successfully");
  } catch (primaryError) {
    console.error("⚠️ Primary MongoDB Atlas Connection Failed:", primaryError.message);

    try {
      console.log("🔄 Trying local MongoDB fallback (mongodb://127.0.0.1:27017/pathfinder)...");
      await mongoose.connect(localFallbackUri, {
        serverSelectionTimeoutMS: 1500,
        connectTimeoutMS: 1500,
      });
      console.log("✅ Local MongoDB Connected Successfully");
    } catch (localError) {
      console.error("❌ Local MongoDB also unavailable:", localError.message);
      console.log("⚡ Zero-Config File DB Fallback Active (localDbService.js)");
    }
  }
};

module.exports = connectDB;