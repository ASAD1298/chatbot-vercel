import React, { useState } from "react";
import "../styles/chatbot-style.css";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "admin",
      text: "Hi! How can I assist you in finding the right solution for your need?",
      avatar: "/chatbot-widget/images/vic-avatar.png",
    },
  ]);
  const [input, setInput] = useState("");

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { type: "user", text: input }]);
    setInput("");
    // Mock admin response
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          type: "admin",
          text: `You said: ${input}`,
          avatar: "/chatbot-widget/images/vic-avatar.png",
        },
      ]);
    }, 800);
  };

  const handleQuestionClick = question => {
    setInput(question);
  };

  return (
    <div id="chatbot-container">
      {/* Default Button */}
      {!isOpen && (
        <div id="chatbot-default-btn" className="chatbot-btn" onClick={toggleChat}>
          <img src="/chatbot-widget/images/vic-avatar.png" alt="Vic" />
          <button>
            <i className="dashicons dashicons-format-chat"></i> Start a conversation
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div id="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <img src="/chatbot-widget/images/vic-avatar.png" alt="Vic" />
              <span>Vic</span>
            </div>
            <div className="chatbot-header-actions">
              <i className="dashicons dashicons-phone phone-icon"></i>
              <i className="dashicons dashicons-minus" onClick={toggleChat}></i>
              <i className="dashicons dashicons-no" onClick={toggleChat}></i>
            </div>
          </div>

          <div className="chatbot-body">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`chatbot-message ${
                  msg.type === "admin" ? "chatbot-message-admin" : "chatbot-message-user"
                }`}
              >
                {msg.avatar && <img className="admin-avatar" src={msg.avatar} alt="Admin" />}
                <div className="message-content">{msg.text}</div>
              </div>
            ))}

            <div className="chatbot-common-questions">
              {["I want to buy products", "I need admin help", "Can I call you directly?"].map(
                (q, i) => (
                  <div
                    key={i}
                    className="common-question"
                    onClick={() => handleQuestionClick(q)}
                  >
                    {q}
                  </div>
                )
              )}
            </div>
          </div>

          <div className="chatbot-footer">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Tell us how can we help..."
            />
            <button onClick={handleSend} disabled={!input.trim()}>
              Send
            </button>
          </div>

          <div className="chatbot-disclaimer">AI can sometimes be inaccurate.</div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
