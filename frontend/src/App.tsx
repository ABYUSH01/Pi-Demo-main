import React, { useState, useEffect } from "react";

interface Message {
  sender: "user" | "bot";
  text: string;
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [questionCount, setQuestionCount] = useState(0);
  const [isPayRequired, setIsPayRequired] = useState(false);

  // Free questions = 10 per day
  const DAILY_LIMIT = 10;

  useEffect(() => {
    // Reset counter each day
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem("lastUsedDate");
    const savedCount = localStorage.getItem("questionCount");

    if (savedDate === today && savedCount) {
      setQuestionCount(parseInt(savedCount));
    } else {
      localStorage.setItem("lastUsedDate", today);
      localStorage.setItem("questionCount", "0");
    }

    // Add welcome message once
    setMessages([
      {
        sender: "bot",
        text: "👋 Ina kwana! Ni ne **ABYUSH Pi Ecosystem Assistant**. Ina nan domin taimaka maka da tambayoyi game da Pi Network — Wallet, KYC, Mainnet, Apps, Consensus Value, da sauransu. Kana da tambaya? 😊",
      },
    ]);
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    if (questionCount >= DAILY_LIMIT && !isPayRequired) {
      setIsPayRequired(true);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ Ka cika tambayoyi 10 na yau. Don ci gaba, sai ka biya da Pi.",
        },
      ]);
      return;
    }

    const newMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);

    setInput("");

    // Aika zuwa backend (dummy URL yanzu)
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL || "https://dummy-backend.com/ask",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: input }),
        }
      );

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.answer || "❌ Ba a samu amsa ba." },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Matsala wajen haɗawa da backend." },
      ]);
    }

    // Update counter
    const newCount = questionCount + 1;
    setQuestionCount(newCount);
    localStorage.setItem("questionCount", newCount.toString());
  };

  const handlePayWithPi = () => {
    // Pi SDK payment logic (za mu cike daga baya)
    alert("💰 Za a saka Pi payment SDK a nan.");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>💜 ABYUSH Pi Assistant</h1>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          height: "400px",
          overflowY: "scroll",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.sender === "user" ? "right" : "left",
              margin: "5px 0",
            }}
          >
            <b>{msg.sender === "user" ? "You" : "ABYUSH"}:</b> {msg.text}
          </div>
        ))}
      </div>

      {!isPayRequired ? (
        <div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ width: "70%", padding: "5px" }}
            placeholder="Tambayi wani abu..."
          />
          <button onClick={sendMessage} style={{ padding: "5px 10px" }}>
            Tura
          </button>
        </div>
      ) : (
        <button
          onClick={handlePayWithPi}
          style={{
            padding: "10px 15px",
            background: "purple",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          💰 Biya da Pi domin ci gaba
        </button>
      )}

      <p>
        Tambayoyi yau: {questionCount}/{DAILY_LIMIT}
      </p>
    </div>
  );
};

export default App;
