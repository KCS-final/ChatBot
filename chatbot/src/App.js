// src/App.js
import React, { useState, useEffect } from 'react';
import { sendMessage, fetchItems } from './api/openai';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [items, setItems] = useState([]);

  // baseUrl 환경 변수 설정
  const baseUrl = process.env.REACT_APP_API_URL;

  // 컴포넌트가 마운트될 때 아이템 목록을 가져오는 useEffect
  useEffect(() => {
    const getItems = async () => {
      const itemsData = await fetchItems();
      setItems(itemsData);

      // 아이템 목록을 초기 메시지로 설정하여 OpenAI API에 전달
      const itemMessages = itemsData.map(item => `Item ID: ${item.itemId}, Title: ${item.title}`).join('\n');
      const botResponse = await sendMessage(`너는 이커머스 사이트에서 귀여운 챗봇 역할을 할거야.150자 이내로 최대한 간단하게 대답해줘 귀엽고,친절하게 대응해줘 내가 물품에대한정보를 줄게:\n${itemMessages}`);
      const botMessage = { role: 'bot', content: botResponse };
      console.log('정보를 보냄');
      setMessages([botMessage]);
    };

    getItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);

    const botResponse = await sendMessageWithItems(input, items, baseUrl);
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

const sendMessageWithItems = async (message, items, baseUrl) => {
  const itemLinks = items.map(item => ({
    text: item.title,
    url: `${baseUrl}/v1/no-auth/auction/${item.itemId}`
  }));
  
  const itemLinksText = itemLinks.map(link => `${link.text}: ${link.url}`).join('\n');
  const fullMessage = `${message}\n\n링크를 요청하면 이걸 주면돼:\n${itemLinksText}`;

  const response = await sendMessage(fullMessage);
  return response;
};

export default App;
