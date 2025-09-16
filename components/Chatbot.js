// components/Chatbot.js
import React, { useState } from "react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([
    {
      type: "admin",
      avatar: "/chatbot-widget/images/vic-avatar.png",
      content: "Hi! How can I assist you in finding the right solution for your need?",
    },
  ]);

  const commonQuestions = [
    "I want to buy products",
    "I need admin help",
    "Can I call you directly?",
  ];

  const startConversation = () => {
    setIsOpen(true);
    setIsMinimized(false);
  };

  const closeChatbot = () => {
    setIsOpen(false);
    setIsMinimized(false);
    setInputValue("");
  };

  const minimizeChatbot = () => {
    setIsMinimized(true);
  };

  const handleInputChange = (e) => setInputValue(e.target.value);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    setMessages([...messages, { type: "user", content: inputValue }]);
    setInputValue("");

    // Simulate admin response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          type: "admin",
          avatar: "/chatbot-widget/images/vic-avatar.png",
          content: "Thank you! We will assist you shortly.",
        },
      ]);
    }, 1000);
  };

  const handleCommonQuestionClick = (question) => setInputValue(question);

  return (
    <div id="chatbot-container">
      {!isOpen && !isMinimized && (
        <div id="chatbot-default-btn" className="chatbot-btn">
          <img id="vic-avatar-btn" src="/chatbot-widget/images/vic-avatar.png" alt="Vic" />
          <button id="start-conversation-btn" onClick={startConversation}>
            <i className="dashicons dashicons-format-chat"></i> Start a conversation
          </button>
        </div>
      )}

      {isMinimized && (
        <div id="chatbot-minimized-btn" className="chatbot-btn minimized-btn" onClick={() => setIsMinimized(false)}>
          <div className="chatbot-icon-wrapper">
            <img src="/chatbot-widget/images/chat-icon-minimized.png" alt="Chat Icon" />
            <span className="notification-dot"></span>
          </div>
        </div>
      )}

      {isOpen && (
        <div id="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <img id="vic-avatar-header" src="/chatbot-widget/images/vic-avatar.png" alt="Vic" />
              <span>Vic</span>
            </div>
            <div className="chatbot-header-actions">
              <i className="dashicons dashicons-phone phone-icon"></i>
              <i className="dashicons dashicons-minus minimize-btn" onClick={minimizeChatbot}></i>
              <i className="dashicons dashicons-no close-btn" onClick={closeChatbot}></i>
            </div>
          </div>

          <div className="chatbot-body">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`chatbot-message ${msg.type === "admin" ? "chatbot-message-admin" : "chatbot-message-user"}`}
                style={{ justifyContent: msg.type === "user" ? "flex-end" : "flex-start" }}
              >
                {msg.avatar && msg.type === "admin" && (
                  <img className="admin-avatar" src={msg.avatar} alt="Admin" />
                )}
                <div className="message-content">{msg.content}</div>
              </div>
            ))}

            <div className="chatbot-common-questions">
              {commonQuestions.map((q, idx) => (
                <div
                  key={idx}
                  className="common-question"
                  onClick={() => handleCommonQuestionClick(q)}
                  data-question={q}
                >
                  {q}
                </div>
              ))}
            </div>
          </div>

          <div className="chatbot-footer">
            <input
              type="text"
              id="chatbot-input"
              placeholder="Tell us how can we help..."
              value={inputValue}
              onChange={handleInputChange}
            />
            <button
              id="send-btn"
              onClick={handleSend}
              disabled={!inputValue.trim()}
              style={{
                backgroundColor: inputValue.trim() ? "rgb(1, 129, 151)" : "#ccc",
                color: inputValue.trim() ? "#fff" : "#666",
              }}
            >
              ➤
            </button>
          </div>

          <div className="chatbot-disclaimer">AI can sometimes be inaccurate.</div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
