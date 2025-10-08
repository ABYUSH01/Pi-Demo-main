import "./database";
import fs from "fs";
import path from "path";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import logger from "morgan";
import MongoStore from "connect-mongo";
import { MongoClient } from "mongodb";
import env from "./environments";
import mountPaymentsEndpoints from "./handlers/payments";
import mountUserEndpoints from "./handlers/users";
import mountChatbotEndpoints from "./chatbot";
import "./types/session";

const dbName = env.mongo_db_name;
const mongoUri = `mongodb+srv://${env.mongo_user}:${env.mongo_password}@${env.mongo_host}/${dbName}?retryWrites=true&w=majority&authSource=admin`;

const mongoClientOptions = {};

// ⚙️ Initialize express app
const app: express.Application = express();

// 🧾 Log requests
app.use(logger("dev"));
app.use(
  logger("common", {
    stream: fs.createWriteStream(path.join(__dirname, "..", "log", "access.log"), { flags: "a" }),
  })
);

// 🧠 Middleware setup
app.use(express.json());
app.use(
  cors({
    origin: env.frontend_url,
    credentials: true,
  })
);
app.use(cookieParser());

// 🗄️ Session store in MongoDB
app.use(
  session({
    secret: env.session_secret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: mongoUri,
      mongoOptions: mongoClientOptions,
      dbName: dbName,
      collectionName: "user_sessions",
    }),
  })
);

// 📡 Payments route
const paymentsRouter = express.Router();
mountPaymentsEndpoints(paymentsRouter);
app.use("/payments", paymentsRouter);

// 👤 User route
const userRouter = express.Router();
mountUserEndpoints(userRouter);
app.use("/user", userRouter);

// 🤖 Chatbot route
const chatbotRouter = express.Router();
chatbotRouter.use("/", mountChatbotEndpoints);
app.use("/chatbot", chatbotRouter);

// 🌍 Root endpoint
app.get("/", async (_, res) => {
  res.status(200).send({ message: "✅ Abyush Pi Assistant Backend is running successfully!" });
});

// 🧪 Test endpoint (new)
app.get("/test", (req, res) => {
  res.status(200).send("✅ Abyush Pi Assistant backend is live and responding from /test route!");
});

// 🚀 Boot server
const PORT = process.env.PORT || 3000; // ⚠️ Render will auto-assign a port

app.listen(PORT, async () => {
  try {
    const client = await MongoClient.connect(mongoUri, mongoClientOptions);
    const db = client.db(dbName);
    app.locals.orderCollection = db.collection("orders");
    app.locals.userCollection = db.collection("users");
    console.log("✅ Connected to MongoDB on:", mongoUri);
  } catch (err) {
    console.error("❌ Connection to MongoDB failed:", err);
  }

  console.log(`🚀 Server listening on port ${PORT}`);
  console.log(`🌐 CORS: Frontend URL = ${env.frontend_url}`);
});
