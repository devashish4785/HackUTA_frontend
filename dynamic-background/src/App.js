import React, { useState } from 'react';
import './App.css';  // Updated CSS
import therapistImage from './therapist.png';  // Replace with your therapist image

// Convert hex color to RGBA with specified opacity
function hexToRGBA(hex, opacity) {
  let r = 0, g = 0, b = 0;

  // Convert 3-digit hex to 6-digit hex
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }
  

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function App() {
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userMessage.trim()) return;

    // Add user message to chat history
    setChatHistory([
      ...chatHistory,
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
        // Change background color if provided in response
        if (data.background_color) {
          const rgbaColor = hexToRGBA(data.background_color, 0.8); // 0.8 opacity
          document.body.style.backgroundColor = rgbaColor;
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
