import React, { useState } from 'react';

const App = () => {
  const assistantId = 'asst_2eLQK8JgQPNK6CA0NrDAQylW'; // 기존 어시스턴트 ID
  const threadId = 'thread_s31hUT1Xf8V8zKiopU7fmr1w'; // 제공된 쓰레드 ID
  const [message, setMessage] = useState('');
  const [responses, setResponses] = useState([]);

  const sendMessage = async () => {
    try {
      const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: message
            }
          ]
        })
      });

      const responseData = await response.json();
      console.log('Response status:', response.status);
      console.log('Response data:', responseData);

      if (!response.ok) {
        console.error('Response error:', responseData);
        throw new Error('Failed to send message');
      }

      setResponses([...responses, responseData]);
      setMessage(''); // 메시지 전송 후 입력창 초기화
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message here..."
      />
      <button onClick={sendMessage}>Send Message</button>
      <div>
        <h3>Responses:</h3>
        {responses.map((response, index) => (
          <div key={index}>{JSON.stringify(response)}</div>
        ))}
      </div>
    </div>
  );
};

export default App;
