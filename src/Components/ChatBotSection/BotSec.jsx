// src/components/ChatBot.js
import React, { useState, useEffect, useRef } from "react";
import { chatDataset } from "../../DataSet";
import "../ChatBotSection/BotSec.css";

export default function ChatBot() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! I'm Nancee Bot, your healthcare assistant. How may I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Normalize input
    const userInput = input.toLowerCase().trim();

    // Try to find best match
    let response = chatDataset.find(
      (item) => userInput === item.question.toLowerCase()
    );

    if (!response) {
      response = chatDataset.find(
        (item) => userInput.includes(item.question.toLowerCase())
      );
    }

    // Default fallback
    if (!response) {
      response = chatDataset.find((item) => item.question === "default");
    }

    // Simulate typing delay
    setTimeout(() => {
      setMessages((prev) => [...prev, { from: "bot", text: response.answer }]);
      setIsTyping(false);
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const toggleChat = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className={`chatbot-container ${isMinimized ? 'minimized' : ''}`}>
      <div className="chatbot-header">
        <div className="header-content">
          <div className="bot-info">
            <div className="bot-avatar">
              <i className="fas fa-user-md"></i>
            </div>
            <div className="bot-details">
              <h3>Nancee Assistant</h3>
              <p>Healthcare Specialist</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="minimize-btn" onClick={toggleChat}>
              {isMinimized ? <i className="fas fa-comment"></i> : <i className="fas fa-minus"></i>}
            </button>
          </div>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="chat-window">
            <div className="welcome-message">
              <p>Welcome to Nancee Medicine. How can I assist with your healthcare needs today?</p>
            </div>
            
            {messages.map((msg, idx) => (
              <div key={idx} className={`message-row ${msg.from}`}>
                <div className={`message-bubble ${msg.from}`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="message-row bot">
                <div className="message-bubble bot typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="quick-replies">
            <button onClick={() => setInput("What medicines do you offer?")}>Available Medicines</button>
            <button onClick={() => setInput("How to place an order?")}>Order Process</button>
            <button onClick={() => setInput("Do you have prescription drugs?")}>Prescription Info</button>
          </div>

          <div className="chat-input-area">
            <div className="input-container">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your health-related question..."
              />
              <button onClick={handleSend} className="send-button">
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}