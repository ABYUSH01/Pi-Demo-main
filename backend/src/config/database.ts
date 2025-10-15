// src/config/database.ts
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Karanta environment variables
const user = process.env.MONGODB_USER;
const pass = process.env.MONGODB_PASSWORD;
const cluster = process.env.MONGODB_CLUSTER;
const dbName = process.env.MONGODB_DBNAME || "AbyushPiAssistant";

// Duba idan wani daga cikin variables baya nan
if (!user || !pass || !cluster) {
  console.error("❌ MongoDB ENV variables missing. Check Render Environment settings.");
  console.table({ user, pass, cluster, dbName });
  process.exit(1);
}

// Gina MongoDB URI
const mongoURI = `mongodb+srv://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${cluster}/${dbName}?retryWrites=true&w=majority`;

// Debug log
console.log("🔍 Connecting to MongoDB cluster:", cluster);

// Ƙirƙiri asynchronous connection
const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000, // ⏱ don kada ya tsaya dogon lokaci
    });
    console.log("✅ MongoDB connected successfully to:", dbName);
  } catch (error: any) {
    console.error("❌ MongoDB connection error:", error.message);
    console.error("🧩 Connection string used:", mongoURI.replace(pass || "", "••••••••"));
    process.exit(1);
  }
};

export default connectDB;
