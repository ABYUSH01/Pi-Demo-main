// src/index.ts
import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import logger from "morgan";
import MongoStore from "connect-mongo";

import env from "./environments";
import connectDB from "./config/database"; // import connectDB function
import mountPaymentsEndpoints from "./handlers/payments";
import mountUserEndpoints from "./handlers/users";
import mountChatbotEndpoints from "./chatbot";
import "./types/session";

(async () => {
  // 🔗 Connect to MongoDB before starting the server
  await connectDB();

  const app: express.Application = express();

  // 🧾 Log requests
  const logDir = path.join(__dirname, "..", "log");
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir); // ✅ create log folder if missing

  app.use(logger("dev"));
  app.use(
    logger("common", {
      stream: fs.createWriteStream(path.join(logDir, "access.log"), {
        flags: "a",
      }),
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
        mongoUrl: `mongodb+srv://${env.mongo_user}:${env.mongo_password}@${env.mongo_host}/${env.mongo_db_name}?retryWrites=true&w=majority`,
        collectionName: "user_sessions",
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        sameSite: "none",
        secure: process.env.NODE_ENV === "production", // ✅ secure cookie for Render
      },
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
  app.get("/", (_, res) => {
    res.status(200).send({
      message: "✅ Abyush Pi Assistant Backend is running successfully!",
    });
  });

  // 🧪 Test endpoint
  app.get("/test", (_, res) => {
    res.status(200).send("✅ Abyush Pi Assistant backend is live and responding from /test route!");
  });

  // ⚠️ Global error handler
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("❌ Unexpected error:", err.message);
    res.status(500).json({ error: "Internal Server Error", message: err.message });
  });

  // 🚀 Boot server
  const PORT = Number(process.env.PORT) || 3000; // ✅ fixed
  app.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
    console.log(`🌐 CORS: Frontend URL = ${env.frontend_url}`);
  });
})();
