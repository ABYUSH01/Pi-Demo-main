import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const user = process.env.MONGODB_USER;
const pass = encodeURIComponent(process.env.MONGODB_PASSWORD || "");
const cluster = process.env.MONGODB_CLUSTER;
const dbName = process.env.MONGODB_DBNAME || "AbyushPiAssistant";

if (!user || !pass || !cluster) {
  console.error("❌ MongoDB ENV variables missing:", { user, pass, cluster });
  process.exit(1);
}

const mongoURI = `mongodb+srv://${user}:${pass}@${cluster}/${dbName}?retryWrites=true&w=majority`;

console.log("🔍 Connecting to MongoDB cluster:", cluster);
console.log("🔗 Mongo URI:", mongoURI.replace(pass, "*****")); // don kada a nuna password duka

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
