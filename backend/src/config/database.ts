// src/config/database.ts

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Karanta environment variables
const user = process.env.MONGODB_USER;
const pass = process.env.MONGODB_PASSWORD;
const cluster = process.env.MONGODB_CLUSTER;
const dbName = process.env.MONGODB_DBNAME || "AbyushPiAssistant";

// Duba idan wani variable baya nan
if (!user || !pass || !cluster) {
  console.error("❌ MongoDB ENV variables missing. Check your Render settings.");
  console.log("Details:", { user, pass, cluster });
  process.exit(1);
}

// Gina MongoDB URI
const mongoURI = `mongodb+srv://${user}:${pass}@${cluster}/${dbName}?retryWrites=true&w=majority`;

// Debug log
console.log("🔍 Connecting to MongoDB cluster:", cluster);

// Ƙirƙiri asynchronous connection
const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB connected successfully");
  } catch (error: any) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
