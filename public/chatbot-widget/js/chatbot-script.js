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

    minimizeBtn.on('click', function() {
        chatbotWindow.hide();
        chatbotDefaultBtn.show();
    });

    chatbotMinimizedBtn.on('click', function() {
        chatbotMinimizedBtn.hide();
        chatbotWindow.show();
    });

    closeBtn.on('click', function() {
        chatbotWindow.hide();
        chatbotMinimizedBtn.show();
    });

    // Handle common questions
    commonQuestions.on('click', function() {
        var question = $(this).data('question');
        sendMessage(question);
    });

    // Handle typing and send button state
    chatbotInput.on('input', function() {
        if ($(this).val().trim().length > 0) {
            $(this).addClass('active');
            sendBtn.addClass('active').prop('disabled', false);
        } else {
            $(this).removeClass('active');
            sendBtn.removeClass('active').prop('disabled', true);
        }
    });

    // Handle sending a message
    sendBtn.on('click', function() {
        var message = chatbotInput.val().trim();
        if (message.length > 0) {
            sendMessage(message);
        }
    });

    // Handle Enter key for sending a message
    chatbotInput.on('keypress', function(e) {
        if (e.which === 13) {
            sendBtn.click();
        }
    });

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

        // Debug: log request
        console.log('[chatbot] POST -> https://asad902.app.n8n.cloud/webhook/chatbot', { message: message });

        // Try to send the message to the n8n webhook and display the reply
        try {
            var resp = await fetch('https://asad902.app.n8n.cloud/webhook/chatbot', {
                method: 'POST',
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: message })
            });

            console.log('[chatbot] response status:', resp.status, resp.statusText);

            // Read raw text first so non-JSON responses can be inspected
            var raw = await resp.text();
            console.log('[chatbot] raw response body:', raw);

            // Try parse JSON if present
            var data = null;
            try {
                data = raw ? JSON.parse(raw) : null;
            } catch (jsonErr) {
                console.warn('[chatbot] response is not JSON:', jsonErr);
            }

            // Remove sending indicator
            sendingRow.remove();

            if (resp.ok) {
                // Expecting the workflow to return { reply: '...' }
                if (data && data.reply) {
                    addAdminMessage(data.reply);
                } else if (data && data.body && data.body.reply) {
                    // in case n8n returns wrapped body
                    addAdminMessage(data.body.reply);
                } else if (raw && raw.trim().length > 0) {
                    // fallback: show raw text
                    addAdminMessage(raw);
                } else {
                    // Fallback message if webhook returns no useful payload
                    addBotMessage('Thank you for your message. The chatbot received your request (no reply body).');
                }
            } else {
                // Non-OK response: show error + console details
                console.error('[chatbot] Webhook responded with status', resp.status, raw);
                addBotMessage('Server returned status ' + resp.status + '. Check n8n workflow or network.');
            }
        } catch (err) {
            // Network / CORS / other errors: fallback to simulated response
            console.error('[chatbot] Error sending message to webhook:', err);
            sendingRow.remove();

            // Show a visible error message so you know the request failed
            addBotMessage('Network error or blocked by CORS. See console for details.');

            var isAdminResponse = message.toLowerCase().includes('admin') || 
                                  message.toLowerCase().includes('help') || 
                                  message.toLowerCase().includes('support');
            if (isAdminResponse) {
                addAdminMessage('Thank you for contacting us! An admin will assist you shortly with your request.');
            } else {
                // keep fallback short
                addBotMessage('We received your message locally and will process it.');
            }
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