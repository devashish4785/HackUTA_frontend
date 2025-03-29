import React, { useState } from 'react';
import './App.css';  // Updated CSS
import therapistImage from './therapist.png';  // Replace with your therapist image

function App() {
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userMessage.trim()) return;

    // Add user message to chat history
    setChatHistory((prevChatHistory) => [
      ...prevChatHistory,
      { sender: 'user', text: userMessage },
    ]);
    setUserMessage('');

    try {
      const response = await fetch('https://hackuta-backend.onrender.com/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (response.ok) {
        // Change background color if provided
        if (data.background_color) {
          document.body.style.backgroundColor = data.background_color;
        }

        setChatHistory((prevChatHistory) => [
          ...prevChatHistory,
          { sender: 'bot', text: data.response },
        ]);
      } else {
        setChatHistory((prevChatHistory) => [
          ...prevChatHistory,
          { sender: 'bot', text: "I'm here for you. Something went wrong. Let's try again." },
        ]);
      }
    } catch (error) {
      console.error('Error:', error);
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        { sender: 'bot', text: "I'm here for you. Something went wrong. Let's try again." },
      ]);
    }
  };

  return (
    <div className="App">
      <img src={therapistImage} alt="Therapist" className="human-image" />
      <h1>Chat with Susan, Your Virtual Therapist</h1>

      <div className="chat-container">
        {chatHistory.slice(-3).map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            <span>{message.text}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Talk to me, I'm listening..."
          className="input-field"
        />
        <button type="submit" className="send-button">Send</button>
      </form>
    </div>
  );
}

export default App;
