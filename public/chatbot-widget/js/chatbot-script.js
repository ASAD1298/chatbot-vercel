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
        chatbotMinimizedBtn.show();
    });

    chatbotMinimizedBtn.on('click', function() {
        chatbotMinimizedBtn.hide();
        chatbotWindow.show();
    });

    closeBtn.on('click', function() {
        chatbotWindow.hide();
        chatbotDefaultBtn.show();
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

    function sendMessage(message) {
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
        
        // Simulate a response (could be admin or bot)
        setTimeout(function() {
            // For demo purposes, let's make some responses come from admin
            var isAdminResponse = message.toLowerCase().includes('admin') || 
                                message.toLowerCase().includes('help') || 
                                message.toLowerCase().includes('support');
            
            if (isAdminResponse) {
                addAdminMessage('Thank you for contacting us! An admin will assist you shortly with your request.');
            } else {
                addBotMessage('Thank you for your message. I am processing your request.');
            }
            
            // Scroll to the bottom of the chat
            chatConversation.scrollTop(chatConversation[0].scrollHeight);
        }, 1000);
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