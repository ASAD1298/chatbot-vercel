jQuery(document).ready(function ($) {
  // Selectors
  var chatbotDefaultBtn = $('#chatbot-default-btn');
  var chatbotMinimizedBtn = $('#chatbot-minimized-btn');
  var chatbotWindow = $('#chatbot-window');
  var startConversationBtn = $('#start-conversation-btn');
  var minimizeBtn = $('.minimize-btn');
  var closeBtn = $('.close-btn');
  var chatbotInput = $('#chatbot-input');
  var sendBtn = $('#send-btn');
  var chatConversation = $('#chat-conversation');

  // Show chat window
  startConversationBtn.on('click', function () {
    chatbotDefaultBtn.hide();
    chatbotWindow.show();
  });

  // Hide / minimize chat window
  minimizeBtn.on('click', function () {
    chatbotWindow.hide();
    chatbotMinimizedBtn.show();
  });

  chatbotMinimizedBtn.on('click', function () {
    chatbotMinimizedBtn.hide();
    chatbotWindow.show();
  });

  closeBtn.on('click', function () {
    chatbotWindow.hide();
    chatbotDefaultBtn.show();
  });

  // ✅ Send message to n8n webhook and get reply
  const sendMessageToBot = async (userInput) => {
    try {
      const resp = await fetch("https://asad902.app.n8n.cloud/webhook/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userInput }),
      });

      const raw = await resp.text();
      let data = null;

      try {
        data = raw ? JSON.parse(raw) : null;
      } catch (jsonErr) {
        console.warn("[chatbot] Response not JSON:", jsonErr);
      }

      // ✅ n8n best practice:
      // Response should look like { reply: "Hi! I'm your chatbot." }
      const reply =
        (data && (data.reply || (data.body && data.body.reply))) ||
        (raw && raw.trim()) ||
        "Sorry, I didn’t get a valid reply.";

      return reply;
    } catch (err) {
      console.error("[chatbot] sendMessageToBot error:", err);
      return "⚠️ Network error. Please check your connection.";
    }
  };

  // ✅ Main send message handler
  async function sendMessage(message) {
    if (!message.trim()) return;

    // Append user message
    var userRow = $('<div class="chatbot-user-row"></div>');
    var userText = $('<span class="user-text"></span>').text(message);
    var userIcon = $('<span class="user-icon" aria-hidden="true"></span>');
    userRow.append(userText).append(userIcon);
    chatConversation.append(userRow);

    // Show typing indicator
    var sendingRow = $('<div class="chatbot-message chatbot-message-admin sending-row"></div>');
    var sendingAvatar = $('<img class="admin-avatar" alt="Bot">').attr('src', chatbotData.vicAvatarUrl);
    sendingRow.append(sendingAvatar).append($('<div class="message-content"></div>').text('Typing...'));
    chatConversation.append(sendingRow);

    chatbotInput.val('');
    sendBtn.prop('disabled', true).removeClass('active');

    // Get bot reply
    const reply = await sendMessageToBot(message);

    sendingRow.remove();
    addAdminMessage(reply);

    // Scroll to bottom
    chatConversation.scrollTop(chatConversation[0].scrollHeight);
  }

  // ✅ Function to add admin message
  function addAdminMessage(message) {
    var adminMessage = $('<div class="chatbot-message chatbot-message-admin"></div>');
    var adminAvatar = $('<img class="admin-avatar" alt="Bot">').attr('src', chatbotData.adminAvatarUrl);
    var messageContent = $('<div class="message-content"></div>').text(message);
    adminMessage.append(adminAvatar).append(messageContent);
    chatConversation.append(adminMessage);
  }

  // ✅ Input & Send Button Logic
  chatbotInput.on('input', function () {
    var val = chatbotInput.val().trim();
    if (val.length > 0) {
      sendBtn.prop('disabled', false).addClass('active');
    } else {
      sendBtn.prop('disabled', true).removeClass('active');
    }
  });

  sendBtn.on('click', function () {
    const msg = chatbotInput.val().trim();
    if (msg) sendMessage(msg);
  });

  chatbotInput.on('keypress', function (e) {
    if (e.which === 13 && !e.shiftKey) {
      e.preventDefault();
      const msg = chatbotInput.val().trim();
      if (msg) sendMessage(msg);
    }
  });
});

