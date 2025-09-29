// backend/src/chatbot.ts
import { Router } from "express";

const router = Router();

// Knowledge Base (Pi App Studio data)
const knowledge = {
  welcome: "👋 I’m ABYUSH, your Pi Ecosystem Assistant. I’m here to help you explore the Pi Network — including Mainnet, Wallet, KYC, Apps, Consensus Value, Utility & more. 🌍 You can ask!",
  facts: [
    "Pi Network is a digital currency project founded by a team of Stanford graduates in 2019. It allows users to mine Pi coins through their mobile phones without draining battery.",
    "Pi Mainnet is the official blockchain network of Pi. It has two phases: Enclosed Mainnet (for internal use only) and Open Mainnet (coming soon, will allow external connections).",
    "KYC (Know Your Customer) is required to transfer Pi coins to Mainnet. Pi uses a decentralized KYC process with community validators.",
    "Pi Wallet allows users to store and transfer Pi coins on the blockchain. It can be accessed via Pi Browser.",
    "Consensus Value is the value of Pi agreed upon by the community to be used in real-world goods and services.",
    "Pi Ecosystem includes apps built inside Pi Browser, such as Pi Chat, Pi Marketplace, and third-party utility apps.",
    "The Core Team leads development but Pi’s future is in the hands of Pioneers through governance tools like Pi DAO.",
    "The whitepaper explains Pi's vision, tokenomics, and technical roadmap. It's available in the Pi app and at minepi.com.",
    "Pi does not have an official exchange listing yet. Trading Pi outside the ecosystem is not supported.",
    "Users should follow official announcements via the Pi app home screen or blog.minepi.com."
  ]
};

// Memory tracker for daily usage
const userQuestions: Record<string, { count: number; date: string }> = {};

router.post("/ask", (req, res) => {
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
      answer: "⚠️ You have used your 10 free questions for today. Please process a Pi payment to continue."
    });
  }

  userQuestions[userId].count++;

  // Simple answer search
  let answer = knowledge.facts.find(f =>
    f.toLowerCase().includes(question.toLowerCase())
  );

  if (!answer) {
    answer = "🤔 I don’t have an exact answer. Please check the official Pi app or blog.minepi.com for the latest updates.";
  }

  return res.json({ answer });
});

export default router;
