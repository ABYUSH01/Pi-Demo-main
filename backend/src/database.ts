import mongoose from "mongoose";
import env from "./env";

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = `mongodb+srv://${env.mongo_user}:${env.mongo_password}@${env.mongo_host}/${env.mongo_db_name}?retryWrites=true&w=majority`;

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("✅ MongoDB connected successfully");
  } catch (error: any) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
