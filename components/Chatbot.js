// components/Chatbot.js
import React, { useState } from "react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [hasSentMessage, setHasSentMessage] = useState(false);
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
    setIsOpen(false);
    setIsMinimized(true);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { type: "user", content: inputValue }]);
    
    // Mark that user has sent a message
    setHasSentMessage(true);
    
    // Clear input field
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      handleSend();
    }
  };

  const handleCommonQuestionClick = (question) => {
    // Send the question directly instead of setting it in input
    setMessages(prev => [...prev, { type: "user", content: question }]);
    
    // Mark that user has sent a message
    setHasSentMessage(true);
    
    // Simulate admin response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          type: "admin",
          avatar: "/chatbot-widget/images/vic-avatar.png",
          content: "Thank you for your question! We will assist you shortly.",
        },
      ]);
    }, 1000);
  };

  return (
    <div id="chatbot-container">
      {!isOpen && !isMinimized && (
        <div id="chatbot-default-btn" className="chatbot-btn">
          <img id="vic-avatar-btn" src="/chatbot-widget/images/vic-avatar.png" alt="Vic" />
          <button id="start-conversation-btn" onClick={startConversation}>
            <img src="/chatbot-widget/images/Vector.png" alt="Chat" className="conversation-icon" />
            Start a conversation
          </button>
        </div>
      )}

      {isMinimized && (
        <div id="chatbot-minimized-btn" className="chatbot-btn minimized-btn" onClick={() => {
          setIsMinimized(false);
          setIsOpen(true);
        }}>
          <div className="chatbot-icon-wrapper">
            <img src="/chatbot-widget/images/chat-icon-minimized.png" alt="Chat Icon" className="minimized-chat-image" />
            <span className="notification-dot"></span>
          </div>
        </div>
      )}

      {isOpen && (
        <div id="chatbot-window" className={hasSentMessage ? "expanded" : ""}>
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <img id="vic-avatar-header" src="/chatbot-widget/images/vic-avatar.png" alt="Vic" />
              <span>Vic</span>
            </div>
            <div className="chatbot-header-actions">
              <img src="/chatbot-widget/images/ic_round-call (1).png" alt="Call" className="header-icon call-icon" title="Call" />
              <img src="/chatbot-widget/images/mdi_minimize.png" alt="Minimize" className="header-icon minimize-icon" onClick={minimizeChatbot} title="Minimize" />
              <img src="/chatbot-widget/images/basil_cross-solid.png" alt="Close" className="header-icon close-icon" onClick={closeChatbot} title="Close" />
            </div>
          </div>

          <div className="chatbot-body">
            {messages.map((msg, idx) => (
              msg.type === "admin" ? (
                <div key={idx} className="chatbot-message chatbot-message-admin">
                  <img className="admin-avatar" src={msg.avatar} alt="Admin" />
                  <div className="message-content">{msg.content}</div>
                </div>
              ) : (
                <div key={idx} className="chatbot-user-row">
                  <span className="user-text">{msg.content}</span>
                  <span className="user-icon" aria-hidden="true"></span>
                </div>
              )
            ))}

            {!hasSentMessage && (
              <div className="chatbot-common-questions">
                <div className="common-questions-title">Common questions are:</div>
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
            )}
          </div>

          <div className="chatbot-footer">
            <input
              type="text"
              id="chatbot-input"
              className={inputValue.trim() ? "active" : ""}
              placeholder="Tell us how can we help..."
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
            <button
              id="send-btn"
              className={inputValue.trim() ? "active" : ""}
              onClick={handleSend}
              disabled={!inputValue.trim()}
            >
              {!inputValue.trim() && (
                <img src="/chatbot-widget/images/send-btn-chatbot.png" alt="Send" className="send-icon-default" />
              )}
            </button>
          </div>

          <div className="chatbot-disclaimer">AI can sometimes be inaccurate.</div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
