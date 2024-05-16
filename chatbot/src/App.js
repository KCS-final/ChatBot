// src/App.js
import React, { useState } from 'react';
import { sendMessage } from './api/openai';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);

    const botResponse = await sendMessage(input);
    const botMessage = { role: 'bot', content: botResponse };
    setMessages([...messages, userMessage, botMessage]);

    setInput('');
  };

  return (
    <div className="App">
      <h1>OpenAI 챗봇</h1>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요..."
        />
        <button type="submit">보내기</button>
      </form>
    </div>
  );
}

export default App;
