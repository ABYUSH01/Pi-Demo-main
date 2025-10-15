
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const user = process.env.MONGODB_USERNAME;
const pass = process.env.MONGODB_PASSWORD;
const cluster = process.env.MONGO_HOST;
const dbName = process.env.MONGODB_DATABASE_NAME || "AbyushPiAssistant";

if (!user || !pass || !cluster) {
  console.error("❌ MongoDB ENV variables missing:", { user, pass, cluster });
  process.exit(1);
}

const encodedPass = encodeURIComponent(pass);
const mongoURI = `mongodb+srv://${user}:${encodedPass}@${cluster}/${dbName}?retryWrites=true&w=majority`;

console.log("🔍 Connecting to MongoDB cluster:", cluster);

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
