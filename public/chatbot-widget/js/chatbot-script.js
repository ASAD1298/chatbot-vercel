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
        
        // Clear input field and reset button state
        chatbotInput.val('');
        chatbotInput.removeClass('active');
        sendBtn.removeClass('active').prop('disabled', true);

        // Try to send the message to the n8n webhook and display the reply
        try {
            var resp = await fetch('https://asad902.app.n8n.cloud/webhook/chatbot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: message })
            });

            if (resp.ok) {
                var data = await resp.json();
                // Expecting the workflow to return { reply: '...' }
                if (data && data.reply) {
                    addAdminMessage(data.reply);
                } else if (data && data.body && data.body.reply) {
                    // in case n8n returns wrapped body
                    addAdminMessage(data.body.reply);
                } else {
                    // Fallback message if webhook returns no useful payload
                    addBotMessage('Thank you for your message. The chatbot received your request.');
                }
            } else {
                // Non-OK response: fall back to a local reply
                console.error('Webhook responded with status', resp.status);
                addBotMessage('Sorry, could not fetch a reply from server. Please try again later.');
            }
        } catch (err) {
            // Network / CORS / other errors: fallback to simulated response
            console.error('Error sending message to webhook:', err);
            var isAdminResponse = message.toLowerCase().includes('admin') || 
                                  message.toLowerCase().includes('help') || 
                                  message.toLowerCase().includes('support');
            if (isAdminResponse) {
                addAdminMessage('Thank you for contacting us! An admin will assist you shortly with your request.');
            } else {
                addBotMessage('Thank you for your message. I am processing your request.');
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