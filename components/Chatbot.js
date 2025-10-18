// components/Chatbot.js
import React, { useState, useRef, useEffect } from "react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [hasSentMessage, setHasSentMessage] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "admin",
      avatar: "/chatbot-widget/images/vic-avatar.png",
      content:
        "Hi! How can I assist you in finding the right solution for your need?",
    },
  ]);

  const chatBodyRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

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
    if (hasSentMessage) {
      setShowClearModal(true);
    } else {
      setIsOpen(false);
      setIsMinimized(false);
      setInputValue("");
    }
  };

  const minimizeChatbot = () => {
    setIsOpen(false);
    setIsMinimized(true);
    setInputValue("");
  };

  const handleClearChat = () => {
    setMessages([
      {
        type: "admin",
        avatar: "/chatbot-widget/images/vic-avatar.png",
        content:
          "Hi! How can I assist you in finding the right solution for your need?",
      },
    ]);
    setHasSentMessage(false);
    setInputValue("");
    setShowClearModal(false);
  };

  const handleCancelClear = () => {
    setShowClearModal(false);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // 🟢 UPDATED: Send message to n8n webhook
  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    setMessages((prev) => [...prev, { type: "user", content: userMessage }]);
    setHasSentMessage(true);
    setInputValue("");
    setIsTyping(true);

    try {
      // 🔗 Send message to your n8n webhook
      const response = await fetch("https://asad902.app.n8n.cloud/webhook-test/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      setIsTyping(false);

      // 🧠 Add chatbot reply to messages
      setMessages((prev) => [
        ...prev,
        {
          type: "admin",
          avatar: "/chatbot-widget/images/vic-avatar.png",
          content: data.reply || "Sorry, I didn’t get a response.",
        },
      ]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          type: "admin",
          avatar: "/chatbot-widget/images/vic-avatar.png",
          content:
            "⚠️ There was an error connecting to the chatbot. Please try again.",
        },
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      handleSend();
    }
  };

  // 🟣 UPDATED: Common question click → send to webhook
  const handleCommonQuestionClick = async (question) => {
    setMessages((prev) => [...prev, { type: "user", content: question }]);
    setHasSentMessage(true);
    setIsTyping(true);

    try {
      const response = await fetch("https://asad902.app.n8n.cloud/webhook-test/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question }),
      });

      const data = await response.json();
      setIsTyping(false);

      setMessages((prev) => [
        ...prev,
        {
          type: "admin",
          avatar: "/chatbot-widget/images/vic-avatar.png",
          content: data.reply || "Sorry, I didn’t get a response.",
        },
      ]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          type: "admin",
          avatar: "/chatbot-widget/images/vic-avatar.png",
          content:
            "⚠️ There was an error connecting to the chatbot. Please try again.",
        },
      ]);
    }
  };

  return (
    <div id="chatbot-container">
      {!isOpen && !isMinimized && (
        <div id="chatbot-default-btn" className="chatbot-btn">
          <img
            id="vic-avatar-btn"
            src="/chatbot-widget/images/vic-avatar.png"
            alt="Vic"
          />
          <button id="start-conversation-btn" onClick={startConversation}>
            <img
              src="/chatbot-widget/images/Vector.png"
              alt="Chat"
              className="conversation-icon"
            />
            Start a conversation
          </button>
        </div>
      )}

      {isMinimized && (
        <div
          id="chatbot-minimized-btn"
          className="chatbot-btn minimized-btn"
          onClick={() => {
            setIsMinimized(false);
            setIsOpen(true);
          }}
        >
          <div className="chatbot-icon-wrapper">
            <img
              src="/chatbot-widget/images/chat-icon-minimized.png"
              alt="Chat Icon"
              className="minimized-chat-image"
            />
            <span className="notification-dot"></span>
          </div>
        </div>
      )}

      {isOpen && (
        <div id="chatbot-window" className={hasSentMessage ? "expanded" : ""}>
          {/* Clear Chat Confirmation Modal */}
          {showClearModal && (
            <div className="clear-modal-overlay">
              <div className="clear-modal">
                <h3 className="clear-modal-title">Clear chat</h3>
                <p className="clear-modal-message">
                  After clearing history you won't be able to access previous
                  chats.
                </p>
                <div className="clear-modal-actions">
                  <button className="cancel-btn" onClick={handleCancelClear}>
                    Cancel
                  </button>
                  <button className="clear-btn" onClick={handleClearChat}>
                    Clear chat
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <img
                id="vic-avatar-header"
                src="/chatbot-widget/images/vic-avatar.png"
                alt="Vic"
              />
              <span>Vic</span>
            </div>
            <div className="chatbot-header-actions">
              <img
                src="/chatbot-widget/images/ic_round-call (1).png"
                alt="Call"
                className="header-icon call-icon"
                title="Call"
              />
              <img
                src="/chatbot-widget/images/mdi_minimize.png"
                alt="Minimize"
                className="header-icon minimize-icon"
                onClick={minimizeChatbot}
                title="Minimize"
              />
              <img
                src="/chatbot-widget/images/basil_cross-solid.png"
                alt={hasSentMessage ? "Restart" : "Close"}
                className="header-icon close-icon"
                onClick={closeChatbot}
                title={hasSentMessage ? "Restart" : "Close"}
              />
            </div>
          </div>

          <div className="chatbot-body" ref={chatBodyRef}>
            {messages.map((msg, idx) =>
              msg.type === "admin" ? (
                <div key={idx} className="chatbot-message chatbot-message-admin">
                  <img
                    className="admin-avatar"
                    src={msg.avatar}
                    alt="Admin"
                  />
                  <div className="message-content">{msg.content}</div>
                </div>
              ) : (
                <div key={idx} className="chatbot-user-row">
                  <span className="user-text">{msg.content}</span>
                  <span className="user-icon" aria-hidden="true"></span>
                </div>
              )
            )}

            {/* Typing indicator */}
            {isTyping && (
              <div className="chatbot-message chatbot-message-admin typing-indicator">
                <img
                  className="admin-avatar"
                  src="/chatbot-widget/images/vic-avatar.png"
                  alt="Admin"
                />
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            {!hasSentMessage && (
              <div className="chatbot-common-questions">
                <div className="common-questions-title">
                  Common questions are:
                </div>
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
                <img
                  src="/chatbot-widget/images/send-btn-chatbot.png"
                  alt="Send"
                  className="send-icon-default"
                />
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
