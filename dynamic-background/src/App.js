import React, { useState } from 'react';
import './App.css';

function App() {
  const [question, setQuestion] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Function to handle input change
  const handleInputChange = (event) => {
    setQuestion(event.target.value);
  };

  // Function to handle the submit and fetch image from backend
  const getImage = async () => {
    try {
      const response = await fetch('http://localhost:3001/generate-image', {  // Adjust the URL if necessary
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),  // Send the input question to backend
      });

      const data = await response.json();
      setImageUrl(data.image_url);  // Update the imageUrl state with the URL returned from the backend
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div
      className="App"
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        transition: 'background-image 1s ease-in-out',
      }}
    >
      <div className="input-container">
        <input
          type="text"
          value={question}
          onChange={handleInputChange}
          placeholder="Enter your question"
        />
        <button onClick={getImage}>Submit</button>
      </div>
    </div>
  );
}

export default App;
