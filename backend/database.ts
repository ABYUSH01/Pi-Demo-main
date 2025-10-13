import mongoose from "mongoose";
import env from "./env";  // yana karanta variables daga env.ts

// GINA CONNECTION STRING
const mongoUri = `mongodb+srv://abyush017_db_user:<db_password>@abyushpiassistanrcluste.3xmik6q.mongodb.net/?retryWrites=true&w=majority&appName=AbyushPiAssistanrCluster`;

console.log("Connecting to MongoDB Atlas...");

mongoose.connect(mongoUri)
  .then(() => console.log("✅ Successfully connected to MongoDB Atlas"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:");
    console.error(err);
  });

// Export don sauran files su iya amfani da shi
export default mongoose;
