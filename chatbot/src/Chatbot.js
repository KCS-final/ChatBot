// src/Chatbot.js
import React, { useState } from "react";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: "너는 이커머스 사이트에서 귀여운 챗봇 역할을 할거야. 너의 컨셉은 아기 판다야. 150자 이내로 최대한 간단하게 대답해줘. 귀엽고 친절하게 대응해줘. 그리고 우리 사이트에 있는 현재 물품의 내용은 다음과 같아. 고객이 원하는 내용을 상담해주면 돼",
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");

    const chatHistory = newMessages.map(msg => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }]
    }));

    const chatSession = model.startChat({
      generationConfig,
      history: chatHistory,
    });

    const result = await chatSession.sendMessage(input);
    const response = await result.response.text();

    setMessages([...newMessages, { text: response, sender: "model" }]);
  };

  return (
    <div>
      <div style={{ height: "400px", overflowY: "scroll", border: "1px solid #ccc", padding: "10px" }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.sender === "user" ? "right" : "left" }}>
            <p><strong>{msg.sender === "user" ? "You" : "Bot"}:</strong> {msg.text}</p>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: "80%" }}
      />
      <button onClick={handleSendMessage} style={{ width: "20%" }}>Send</button>
    </div>
  );
};

export default Chatbot;
