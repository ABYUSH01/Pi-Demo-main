import { Router } from "express";
import franc from "franc";
import translate from "@vitalets/google-translate-api";
import axios from "axios";
// import env from "./env";   // CIRE WANNAN LAYI

const router = Router();

// ===== Yi amfani da environment variables kai tsaye =====
const serperApiKey = process.env.SERPER_API_KEY || '';

// ===== Knowledge Base =====
const knowledge = [
  {
    key: "welcome",
    answer:
      "👋 I'm ABYUSH, your Pi Ecosystem Assistant. I help you explore the Pi Network — Mainnet, Wallet, KYC, Apps, Consensus Value, Utility & more."
  },
  {
    key: "pi network",
    answer:
      "Pi Network is a digital currency project founded by Stanford graduates in 2019. Users can mine Pi coins through mobile phones without draining battery."
  },
  {
    key: "mainnet",
    answer:
      "Pi Mainnet is the official blockchain network of Pi. It has two phases: Enclosed Mainnet (internal use only) and Open Mainnet (coming soon)."
  },
  {
    key: "kyc",
    answer:
      "KYC (Know Your Customer) is required to transfer Pi coins to Mainnet. Verification ensures real users, not bots."
  }
];

// ===== Web Search (Serper.dev) =====
async function webSearch(query: string): Promise<string> {
  try {
    const response = await axios.post(
      "https://google.serper.dev/search",
      { q: query },
      {
        headers: {
          "X-API-KEY": serperApiKey,   // YANZU YANA AMFANI DA RENDER ENVIRONMENT
          "Content-Type": "application/json"
        }
      }
    );

    if (response.data?.organic?.length > 0) {
      const first = response.data.organic[0];
      return first.snippet || "🔎 No detailed result found.";
    } else {
      return "🔎 No relevant result found on Google Search.";
    }
  } catch (error) {
    console.error("Serper.dev search error:", error);
    return "⚠️ Sorry, I couldn't fetch results from Google Search.";
  }
}

// ===== Chatbot Endpoint =====
router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.json({ reply: "❌ Please provide a message." });
    }

    // Detect language
    let langCode: string = franc(message);
    if (langCode === "und") langCode = "en";

    // Translate input to English
    const translated = await translate(message, { to: "en" });
    const userMsg = translated.text.toLowerCase();

    // Default reply
    let reply =
      "❓ Sorry, I don't have info about that yet. Let me search Google for you...";

    // Knowledge base check
    for (const item of knowledge) {
      if (userMsg.includes(item.key)) {
        reply = item.answer;
        break;
      }
    }

    // If not found in knowledge base, use Serper search
    if (reply.startsWith("❓")) {
      reply = await webSearch(userMsg);
    }

    // Translate reply back to original language
    const finalReply = await translate(reply, { to: langCode });

    res.json({ reply: finalReply.text });
  } catch (error) {
    console.error("Chatbot Error:", error);
    res.status(500).json({ reply: "⚠️ Internal server error." });
  }
});

export default router;
