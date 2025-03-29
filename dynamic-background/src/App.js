import React, { useState } from 'react';
import './App.css'; // Optional, you can add your own styling

function App() {
  // State to store user message and chat history
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the user input is empty
    if (!userMessage.trim()) {
      return;
    }

    // Add the user message to the chat history
    setChatHistory([
      ...chatHistory,
      { sender: 'user', text: userMessage },
    ]);
    setUserMessage('');

    try {
      // Send the user message to the Flask backend
      const response = await fetch('https://hackuta-backend.onrender.com/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }), // Send message as JSON
      });

      const data = await response.json(); // Parse the JSON response

      // Log the backend response to the console
      console.log('Response from Backend:', data);

      if (response.ok) {
        // Add the bot's response to the chat history
        setChatHistory((prevChatHistory) => [
          ...prevChatHistory,
          { sender: 'bot', text: data.response }, // Display bot's response
        ]);
      } else {
        setChatHistory((prevChatHistory) => [
          ...prevChatHistory,
          { sender: 'bot', text: "Sorry, something went wrong! Please try again." },
        ]);
        console.error('Error:', data.error); // Log any errors from the backend
      }
    } catch (error) {
      console.error('Error:', error); // Log any fetch errors
    }
    
  };

  return (
    <div className="App">
      <h1>Chat with the Bot</h1>

      {/* Display the chat history */}
      <div className="chat-container">
        {chatHistory.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender}`}
          >
            <span>{message.text}</span>
          </div>
        ))}
      </div>

      {/* User input form */}
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Type a message..."
          className="input-field"
        />
        <button type="submit" className="send-button">Send</button>
      </form>
    </div>
  );
}

export default App;
