import mongoose from "mongoose";
import env from "./env";  // yana karanta variables daga env.ts

// GINA CONNECTION STRING
const mongoUri = `mongodb+srv://${env.mongo_user}:${env.mongo_password}@${env.mongo_host}/${env.mongo_db_name}?retryWrites=true&w=majority`;

console.log("Connecting to MongoDB Atlas...");

mongoose.connect(mongoUri)
  .then(() => console.log("✅ Successfully connected to MongoDB Atlas"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:");
    console.error(err);
  });

// Export don sauran files su iya amfani da shi
export default mongoose;
