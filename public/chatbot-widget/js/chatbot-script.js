jQuery(document).ready(function($) {
    var chatbotDefaultBtn = $('#chatbot-default-btn');
    var chatbotMinimizedBtn = $('#chatbot-minimized-btn');
    var chatbotWindow = $('#chatbot-window');
    var startConversationBtn = $('#start-conversation-btn');
    var minimizeBtn = $('.minimize-btn');
    var closeBtn = $('.close-btn');
    var commonQuestions = $('.common-question');
    var chatbotInput = $('#chatbot-input');
    var sendBtn = $('#send-btn');
    var chatConversation = $('#chat-conversation');

    // Show/hide chat window
    startConversationBtn.on('click', function() {
        chatbotDefaultBtn.hide();
        chatbotWindow.show();
    });

    // Helper that matches your requested frontend contract:
    // Sends { message: userInput } and returns data.reply (robust to non-JSON)
    const sendMessageToBot = async (userInput) => {
        try {
            const resp = await fetch("https://asad902.app.n8n.cloud/webhook/chatbot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userInput })
            });

            const raw = await resp.text();
            let data = null;
            try {
                data = raw ? JSON.parse(raw) : null;
            } catch (jsonErr) {
                // not JSON — keep raw
                data = null;
                console.warn('[chatbot] response is not JSON:', jsonErr);
            }

            if (!resp.ok) {
                console.error('[chatbot] webhook non-OK status', resp.status, raw);
                // Still try to return any useful reply field if present
            }

            const reply = (data && (data.reply || (data.body && data.body.reply))) || (raw && raw.trim()) || null;
            return reply;
        } catch (err) {
            console.error('[chatbot] sendMessageToBot fetch error:', err);
            throw err;
        }
    };

    async function sendMessage(message) {
        // Append user message: plain text with small user icon on the right
        var userRow = $('<div class="chatbot-user-row"></div>');
        var userText = $('<span class="user-text"></span>').text(message);
        var userIcon = $('<span class="user-icon" aria-hidden="true"></span>');
        userRow.append(userText).append(userIcon);
        chatConversation.append(userRow);

        // Show temporary "sending" indicator
        var sendingRow = $('<div class="chatbot-message chatbot-message-admin sending-row"></div>');
        var sendingAvatar = $('<img class="admin-avatar" alt="Vic">').attr('src', chatbotData.vicAvatarUrl);
        sendingRow.append(sendingAvatar).append($('<div class="message-content"></div>').text('Sending...'));
        chatConversation.append(sendingRow);

        // Clear input field and reset button state
        chatbotInput.val('');
        chatbotInput.removeClass('active');
        sendBtn.removeClass('active').prop('disabled', true);

        try {
            const reply = await sendMessageToBot(message);
            sendingRow.remove();

            if (reply) {
                addAdminMessage(reply);
            } else {
                addBotMessage('Thank you for your message. The chatbot received your request (no reply).');
            }
        } catch (err) {
            console.error('[chatbot] sendMessageToBot error:', err);
            sendingRow.remove();
            addBotMessage('Network error or blocked by CORS. See console for details.');
        }

        // Scroll to the bottom of the chat
        chatConversation.scrollTop(chatConversation[0].scrollHeight);
    }
    // Function to add admin message with avatar
    function addAdminMessage(message) {
        var adminMessage = $('<div class="chatbot-message chatbot-message-admin"></div>');
        var adminAvatar = $('<img class="admin-avatar" alt="Admin">');
        adminAvatar.attr('src', chatbotData.adminAvatarUrl);
        var messageContent = $('<div class="message-content"></div>').text(message);
        
        adminMessage.append(adminAvatar).append(messageContent);
        chatConversation.append(adminMessage);
    }

    // Function to add bot message with avatar (same as admin)
    function addBotMessage(message) {
        var botMessage = $('<div class="chatbot-message chatbot-message-admin"></div>');
        var botAvatar = $('<img class="admin-avatar" alt="Vic">');
        botAvatar.attr('src', chatbotData.vicAvatarUrl);
        var messageContent = $('<div class="message-content"></div>').text(message);
        
        botMessage.append(botAvatar).append(messageContent);
        chatConversation.append(botMessage);
    }
});