// src/config/database.ts
import mongoose from "mongoose";
import dotenv from "dotenv";

// Load .env variables
dotenv.config();

// Karanta environment variables
const user = process.env.MONGODB_USER;
const pass = process.env.MONGODB_PASSWORD;
const cluster = process.env.MONGODB_CLUSTER;
const dbName = process.env.MONGODB_DBNAME || "AbyushPiAssistanrCluster";

// Duba idan akwai missing variables
if (!user || !pass || !cluster) {
  console.error("❌ MongoDB ENV variables missing. Ka duba Render environment settings.");
  console.log("Details:", { user, pass, cluster });
  process.exit(1);
}

// Gina MongoDB URI
const mongoURI = `mongodb+srv://${user}:${pass}@${cluster}/${dbName}?retryWrites=true&w=majority`;

// Debug log
console.log("🔍 Connecting to MongoDB cluster:", cluster);

// Ƙirƙiri asynchronous connection function
const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB connected successfully ✅");
  } catch (error: any) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

// Export don sauran files su iya amfani da shi
export default connectDB;
