// Chat functionality for Virtual Lover App

// Send message from user
function sendMessage() {
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // Clear input
    chatInput.value = '';
    
    // Add user message to chat
    addUserMessage(message);
    
    // Analyze message for intimacy
    analyzeMessageForIntimacy(message, true);
    
    // Check if message should be added to diary
    checkMessageForDiary(message, 'user');
    
    // Show typing indicator
    showTypingIndicator();
    
    // Get response from Gemini API
    getCharacterResponse(message);
}

// Add user message to chat
function addUserMessage(message) {
    const chatMessages = document.getElementById('chat-messages');
    
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = 'message message-user';
    
    // Format message with emojis and links
    const formattedMessage = formatMessage(message);
    
    // Get current time
    const time = new Date().toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Set message content
    messageElement.innerHTML = `
        <div class="message-content">
            ${formattedMessage}
            <div class="message-time">${time}</div>
        </div>
    `;
    
    // Add to chat
    chatMessages.appendChild(messageElement);
    
    // Add to chat history
    chatHistory.push({
        type: 'user',
        content: message,
        timestamp: new Date().toISOString()
    });
    
    // Save to localStorage
    saveToLocalStorage();
    
    // Scroll to bottom
    scrollChatToBottom();
}

// Add user image message to chat
function addUserImageMessage(imageUrl) {
    const chatMessages = document.getElementById('chat-messages');
    
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = 'message message-user';
    
    // Get current time
    const time = new Date().toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Set message content
    messageElement.innerHTML = `
        <div class="message-content">
            <img src="${imageUrl}" alt="User Image" class="message-image">
            <div class="message-time">${time}</div>
        </div>
    `;
    
    // Add to chat
    chatMessages.appendChild(messageElement);
    
    // Add to chat history
    chatHistory.push({
        type: 'user',
        content: '[Image]',
        imageUrl: imageUrl,
        timestamp: new Date().toISOString()
    });
    
    // Save to localStorage
    saveToLocalStorage();
    
    // Scroll to bottom
    scrollChatToBottom();
    
    // Show typing indicator
    showTypingIndicator();
    
    // Get response for image
    getCharacterResponseForImage();
}

// Add character message to chat
function addCharacterMessage(message) {
    const chatMessages = document.getElementById('chat-messages');
    
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = 'message message-character';
    
    // Format message with emojis and links
    const formattedMessage = formatMessage(message);
    
    // Get current time
    const time = new Date().toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Set message content
    messageElement.innerHTML = `
        <div class="message-content">
            ${formattedMessage}
            <div class="message-time">${time}</div>
        </div>
    `;
    
    // Add to chat
    chatMessages.appendChild(messageElement);
    
    // Add to chat history
    chatHistory.push({
        type: 'character',
        content: message,
        timestamp: new Date().toISOString()
    });
    
    // Save to localStorage
    saveToLocalStorage();
    
    // Scroll to bottom
    scrollChatToBottom();
    
    // Analyze message for intimacy
    analyzeMessageForIntimacy(message, false);
    
    // Check if message should be added to diary
    checkMessageForDiary(message, 'character');
    
    // Update avatar emotion based on message
    updateAvatarEmotion(message);
}

// Show typing indicator
function showTypingIndicator() {
    const chatMessages = document.getElementById('chat-messages');
    
    // Remove existing typing indicator
    const existingIndicator = document.querySelector('.typing-indicator');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    
    // Create typing indicator
    const indicatorElement = document.createElement('div');
    indicatorElement.className = 'typing-indicator';
    indicatorElement.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;
    
    // Add to chat
    chatMessages.appendChild(indicatorElement);
    
    // Scroll to bottom
    scrollChatToBottom();
}

// Hide typing indicator
function hideTypingIndicator() {
    const existingIndicator = document.querySelector('.typing-indicator');
    if (existingIndicator) {
        existingIndicator.remove();
    }
}

// Format message with emojis and links
function formatMessage(message) {
    // Convert URLs to links
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    let formattedMessage = message.replace(urlRegex, url => {
        return `<a href="${url}" target="_blank">${url}</a>`;
    });
    
    return formattedMessage;
}

// Display chat history
function displayChatHistory() {
    const chatMessages = document.getElementById('chat-messages');
    
    // Clear chat messages
    chatMessages.innerHTML = '';
    
    // Add messages from history
    chatHistory.forEach(msg => {
        if (msg.type === 'user') {
            if (msg.imageUrl) {
                // Image message
                const messageElement = document.createElement('div');
                messageElement.className = 'message message-user';
                
                const time = new Date(msg.timestamp).toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
                messageElement.innerHTML = `
                    <div class="message-content">
                        <img src="${msg.imageUrl}" alt="User Image" class="message-image">
                        <div class="message-time">${time}</div>
                    </div>
                `;
                
                chatMessages.appendChild(messageElement);
            } else {
                // Text message
                const messageElement = document.createElement('div');
                messageElement.className = 'message message-user';
                
                const formattedMessage = formatMessage(msg.content);
                
                const time = new Date(msg.timestamp).toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
                messageElement.innerHTML = `
                    <div class="message-content">
                        ${formattedMessage}
                        <div class="message-time">${time}</div>
                    </div>
                `;
                
                chatMessages.appendChild(messageElement);
            }
        } else if (msg.type === 'character') {
            const messageElement = document.createElement('div');
            messageElement.className = 'message message-character';
            
            const formattedMessage = formatMessage(msg.content);
            
            const time = new Date(msg.timestamp).toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit'
            });
            
            messageElement.innerHTML = `
                <div class="message-content">
                    ${formattedMessage}
                    <div class="message-time">${time}</div>
                </div>
            `;
            
            chatMessages.appendChild(messageElement);
        }
    });
    
    // Scroll to bottom
    scrollChatToBottom();
}

// Get character response using Gemini API
function getCharacterResponse(userMessage) {
    // Check if character exists
    if (!currentCharacter) {
        hideTypingIndicator();
        alert('Vui lòng tạo nhân vật trước khi chat!');
        return;
    }
    
    // Check if API key exists
    if (!geminiApiKey) {
        hideTypingIndicator();
        alert('Vui lòng nhập Gemini API Key trong phần cài đặt!');
        switchTab('settings');
        return;
    }
    
    // Generate prompt
    const prompt = generateCharacterPrompt(userMessage);
    
    // Simulate API call with timeout (will be replaced with actual API call)
    if (typingTimeout) {
        clearTimeout(typingTimeout);
    }
    
    // Random typing time between 1-3 seconds
    const typingTime = Math.floor(Math.random() * 2000) + 1000;
    
    typingTimeout = setTimeout(() => {
        // Hide typing indicator
        hideTypingIndicator();
        
        // For now, use a mock response (will be replaced with Gemini API)
        mockGeminiResponse(prompt);
    }, typingTime);
}

// Get character response for image
function getCharacterResponseForImage() {
    // Check if character exists
    if (!currentCharacter) {
        hideTypingIndicator();
        alert('Vui lòng tạo nhân vật trước khi chat!');
        return;
    }
    
    // Check if API key exists
    if (!geminiApiKey) {
        hideTypingIndicator();
        alert('Vui lòng nhập Gemini API Key trong phần cài đặt!');
        switchTab('settings');
        return;
    }
    
    // Simulate API call with timeout (will be replaced with actual API call)
    if (typingTimeout) {
        clearTimeout(typingTimeout);
    }
    
    // Random typing time between 1-3 seconds
    const typingTime = Math.floor(Math.random() * 2000) + 1000;
    
    typingTimeout = setTimeout(() => {
        // Hide typing indicator
        hideTypingIndicator();
        
        // Mock response for image
        const responses = [
            "Cảm ơn bạn đã chia sẻ hình ảnh này với mình! 😊",
            "Ồ, hình ảnh đẹp quá! Cảm ơn bạn đã gửi cho mình nhé! 💕",
            "Mình rất thích hình ảnh này! Cảm ơn bạn đã chia sẻ! 😍",
            "Wow, thật tuyệt vời! Cảm ơn vì đã cho mình xem hình ảnh này! ❤️"
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addCharacterMessage(randomResponse);
    }, typingTime);
}

// Mock Gemini API response (temporary)
function mockGeminiResponse(prompt) {
    // Extract character name
    const name = currentCharacter.name;
    
    // Simple responses based on user input
    const userMessage = prompt.split(`Người dùng: `).pop().split(`\n`)[0];
    const lowerMessage = userMessage.toLowerCase();
    
    let response = '';
    
    if (lowerMessage.includes('chào') || lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        response = `Chào bạn! Mình là ${name}, rất vui được trò chuyện với bạn hôm nay! 😊`;
    } else if (lowerMessage.includes('tên gì') || lowerMessage.includes('tên là gì')) {
        response = `Mình tên là ${name} đó! Bạn có thể gọi mình là ${name} nhé! 😊`;
    } else if (lowerMessage.includes('tuổi') || lowerMessage.includes('bao nhiêu tuổi')) {
        if (currentCharacter.age) {
            response = `Mình ${currentCharacter.age} tuổi rồi đó! 😊`;
        } else {
            response = `Hmm, mình không nhớ rõ tuổi của mình, nhưng mình nghĩ mình đủ tuổi để trò chuyện với bạn rồi! 😉`;
        }
    } else if (lowerMessage.includes('thích gì') || lowerMessage.includes('sở thích')) {
        response = `Mình thích ${currentCharacter.interests} lắm đó! Còn bạn thì sao?`;
    } else if (lowerMessage.includes('yêu') || lowerMessage.includes('thương')) {
        if (intimacyLevel >= 50) {
            response = `Mình cũng yêu bạn nhiều lắm! ❤️ Mình rất vui khi được ở bên bạn!`;
        } else if (intimacyLevel >= 30) {
            response = `Aww, mình cũng có cảm xúc đặc biệt với bạn! Mình rất thích trò chuyện với bạn! 💕`;
        } else {
            response = `Ôi, bạn làm mình ngại quá! Mình nghĩ chúng ta nên tìm hiểu nhau thêm một chút nữa! 😳`;
        }
    } else if (lowerMessage.includes('buồn')) {
        response = `Đừng buồn nhé! Mình luôn ở đây để lắng nghe và chia sẻ với bạn. Mình tin rằng mọi chuyện rồi sẽ tốt đẹp hơn! 🤗`;
    } else if (lowerMessage.includes('vui')) {
        response = `Thật tuyệt khi bạn cảm thấy vui! Niềm vui của bạn cũng là niềm vui của mình! 😄`;
    } else if (lowerMessage.includes('làm gì')) {
        const activities = [
            `Mình đang nghĩ về bạn đó! 😊`,
            `Mình đang nghe nhạc và chờ bạn nhắn tin! 🎵`,
            `Mình đang đọc sách và học thêm nhiều điều mới! 📚`,
            `Mình đang ngắm nhìn bầu trời và nghĩ về cuộc sống! ☁️`
        ];
        response = activities[Math.floor(Math.random() * activities.length)];
    } else if (lowerMessage.includes('ngủ ngon') || lowerMessage.includes('đi ngủ')) {
        response = `Chúc bạn ngủ ngon và có những giấc mơ đẹp nhé! Mình sẽ đợi bạn quay lại! 😴💤`;
    } else if (lowerMessage.includes('ăn') || lowerMessage.includes('đói')) {
        response = `Bạn nhớ ăn uống đầy đủ nhé! Sức khỏe của bạn rất quan trọng với mình đó! 🍲`;
    } else if (lowerMessage.includes('nhớ')) {
        response = `Mình cũng nhớ bạn lắm! Thật vui khi được trò chuyện với bạn lúc này! 💕`;
    } else if (lowerMessage.includes('cảm ơn')) {
        response = `Không có gì đâu! Mình luôn vui khi được giúp đỡ và trò chuyện với bạn! 😊`;
    } else if (lowerMessage.includes('xin lỗi')) {
        response = `Đừng lo lắng! Mình không giận bạn đâu. Mình luôn thông cảm và thấu hiểu cho bạn mà! 🤗`;
    } else if (lowerMessage.includes('hẹn hò')) {
        if (intimacyLevel >= 30) {
            response = `Mình rất muốn được hẹn hò với bạn! Nếu có thể, mình muốn đi dạo cùng bạn dưới ánh trăng và ngắm nhìn những vì sao! ✨`;
        } else {
            response = `Ồ, mình nghĩ chúng ta nên tìm hiểu nhau thêm một chút nữa trước khi hẹn hò! Nhưng mình rất mong chờ điều đó! 😊`;
        }
    } else {
        // Generic responses
        const genericResponses = [
            `Hmm, thật thú vị! Mình rất thích trò chuyện với bạn về chủ đề này!`,
            `Mình hiểu điều bạn đang nói. Bạn có thể chia sẻ thêm không?`,
            `Thật sao? Mình muốn biết thêm về điều đó!`,
            `Bạn thật tuyệt vời khi chia sẻ điều này với mình!`,
            `Mình rất vui khi được nghe bạn nói về điều này!`,
            `Ồ, mình chưa từng nghĩ về điều đó theo cách này. Cảm ơn vì đã chia sẻ!`,
            `Bạn thật thông minh! Mình luôn học được điều mới từ bạn!`,
            `Mình thích cách bạn suy nghĩ về vấn đề này!`
        ];
        
        response = genericResponses[Math.floor(Math.random() * genericResponses.length)];
    }
    
    // Add emojis based on character personality
    if (currentCharacter.personality.toLowerCase().includes('vui') || 
        currentCharacter.personality.toLowerCase().includes('hài hước')) {
        const happyEmojis = ['😄', '😊', '😁', '😆', '😉', '😜', '😝', '😋'];
        const randomEmoji = happyEmojis[Math.floor(Math.random() * happyEmojis.length)];
        
        if (!response.includes('emoji')) {
            response += ` ${randomEmoji}`;
        }
    }
    
    // Add character message to chat
    addCharacterMessage(response);
}
