// src/api/openai.js
import axios from 'axios';

const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

const openai = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  }
});

export const sendMessage = async (message) => {
  const response = await openai.post('/chat/completions', {
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: message }],
  });
  return response.data.choices[0].message.content;
};
