import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './chat.css';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Fetch previous messages from the database on component mount
  useEffect(() => {
    axios.get('http://localhost:5000/messages')  // Updated to match backend route
      .then(response => {
        setMessages(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching messages!', error);
      });
  }, []);

  // Send message to backend
  const sendMessage = async () => {
    if (newMessage.trim()) {
      // Add user message to the local state
      const userMessage = { text: newMessage, sender: "user" };
      setMessages([...messages, userMessage]);

      // Hardcoded bot response logic
      let botResponse = "";
      if (newMessage.toLowerCase() === "hello") {
        botResponse = "Hi, how can I assist you today?";
      } 
      else if(newMessage.toLowerCase() === "hii") {
        botResponse = "Hello, how can I assist you today?";
      }
      else if(newMessage.toLowerCase() === "who are you") {
        botResponse = "I am omkar shinde's chatbot?";
      }
      else if(newMessage.toLowerCase() === "how are you") {
        botResponse = "I am fine , and how about you?";
      }
      else if(newMessage.toLowerCase() === "hi") {
        botResponse = "Hello, how can I assist you today?";
      }
      else if(newMessage.toLowerCase() === "what is your name") {
        botResponse = "My name is omkar's chatbot lilly?";
      }
      else if(newMessage.toLowerCase() === "bye") {
        botResponse = "GOOD BYE!";
      }

      else {
        botResponse = "Sorry, I didn't understand that.";
      }

      // Send both user and bot messages to the backend
      await axios.post('http://localhost:5000/messages', {  // Updated to match backend route
        user_message: newMessage,
        bot_response: botResponse
      });

      // Add bot response to the local state
      const botMessage = { text: botResponse, sender: "bot" };
      setMessages(prevMessages => [...prevMessages, botMessage]);

      // Clear input field
      setNewMessage("");
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className={msg.sender}>
              {msg.text}
            </div>
          ))}
        </div>
      </div>
      <div className="input-container">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
