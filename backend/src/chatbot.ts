import { Router } from "express";
import franc from "franc"; // detect language
import translate from "@vitalets/google-translate-api"; // translation

const router = Router();

// Knowledge base (asali a English kawai don sauki)
const knowledge = [
  {
    welcome: "👋 I’m ABYUSH, your Pi Ecosystem Assistant. I’m here to help you explore the Pi Network — including Mainnet, Wallet, KYC, Apps, Consensus Value, Utility & more. 🌍 You can ask!"
  },
  {
    key: "pi network",
    answer: "Pi Network is a digital currency project founded by a team of Stanford graduates in 2019. It allows users to mine Pi coins through their mobile phones without draining battery."
  },
  {
    key: "mainnet",
    answer: "Pi Mainnet is the official blockchain network of Pi. It has two phases: Enclosed Mainnet (for internal use only) and Open Mainnet (coming soon, will allow external connections)."
  },
  {
    key: "kyc",
    answer: "KYC (Know Your Customer) is required to transfer Pi coins to Mainnet. Pi uses a decentralized KYC process with community validators."
  },
  {
    key: "wallet",
    answer: "Pi Wallet allows users to store and transfer Pi coins on the blockchain. It can be accessed via Pi Browser."
  },
  {
    key: "consensus",
    answer: "Consensus Value is the value of Pi agreed upon by the community to be used in real-world goods and services."
  },
  {
    key: "ecosystem",
    answer: "Pi Ecosystem includes apps built inside Pi Browser, such as Pi Chat, Pi Marketplace, and third-party utility apps."
  },
  {
    key: "core team",
    answer: "The Core Team leads development but Pi’s future is in the hands of Pioneers through governance tools like Pi DAO."
  },
  {
    key: "whitepaper",
    answer: "The whitepaper explains Pi's vision, tokenomics, and technical roadmap. It's available in the Pi app and at minepi.com."
  },
  {
    key: "exchange",
    answer: "Pi does not have an official exchange listing yet. Trading Pi outside the ecosystem is not supported."
  },
  {
    key: "announcements",
    answer: "Users should follow official announcements via the Pi app home screen or blog.minepi.com."
  }
];

// Memory tracker
const userQuestions: Record<string, { count: number; date: string }> = {};

router.post("/ask", async (req, res) => {
  const { userId, question } = req.body;
  if (!userId || !question) {
    return res.status(400).json({ error: "Missing userId or question" });
  }

  const today = new Date().toDateString();
  if (!userQuestions[userId] || userQuestions[userId].date !== today) {
    userQuestions[userId] = { count: 0, date: today };
  }
  if (userQuestions[userId].count >= 10) {
    return res.json({
      answer: "⚠️ You have used your 10 free questions today. Please pay with Pi to continue."
    });
  }
  userQuestions[userId].count++;

  // Default answer
  let answer =
    "I don’t have an exact answer. Please check the official Pi app or blog.minepi.com for updates.";

  for (const fact of knowledge) {
    if (question && question.toLowerCase().includes(fact.key)) {
      answer = fact.answer;
      break;
    };
  }

  // Detect language of user question
  const langCode = franc(question, { minLength: 1 });// e.g. "hau" for Hausa, "eng" for English, "arb" for Arabic, "cmn" for Chinese
  try {
    if (langCode !== "eng") {
      const translated = await translate(answer, { to: langCode });
      answer = translated.text;
    }
  } catch (err) {
    console.error("Translation error:", err);
  }

  return res.json({ answer });
});

export default router;
