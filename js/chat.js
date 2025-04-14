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
    const time = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    
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
    const time = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    
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
    const time = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    
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
                const time = new Date(msg.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
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
                const time = new Date(msg.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
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
            const time = new Date(msg.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
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
        // Use real Gemini API instead of mock response
        realGeminiResponse(prompt);
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
    
    // Generate prompt for image
    const prompt = `${currentCharacter.name} đang nhìn thấy một hình ảnh. Hãy phản ứng với hình ảnh này một cách tự nhiên, thể hiện tính cách ${currentCharacter.personality}.`;
    
    // Simulate API call with timeout
    if (typingTimeout) {
        clearTimeout(typingTimeout);
    }
    
    // Random typing time between 2-4 seconds
    const typingTime = Math.floor(Math.random() * 2000) + 2000;
    
    typingTimeout = setTimeout(() => {
        // Use real Gemini API instead of mock response
        realGeminiResponse(prompt);
    }, typingTime);
}

// Generate character prompt based on user message
function generateCharacterPrompt(userMessage) {
    // Base prompt template
    let promptTemplate = `Bạn là ${currentCharacter.name}, một người ${currentCharacter.personality}. 
Bạn thích ${currentCharacter.interests}. 
Mức độ thân thiết hiện tại: ${getIntimacyLevelText()}.

Hãy trả lời tin nhắn sau của người dùng một cách tự nhiên, thể hiện tính cách của bạn:
"${userMessage}"

Hãy giữ câu trả lời ngắn gọn, dưới 2-3 câu. Đôi khi có thể thêm emoji phù hợp.`;

    // Add intimacy level context
    const intimacyLevel = getIntimacyLevel();
    if (intimacyLevel >= 100) {
        promptTemplate += `\nBạn và người dùng đã rất thân thiết, hãy thể hiện sự gần gũi và quan tâm.`;
    } else if (intimacyLevel >= 60) {
        promptTemplate += `\nBạn và người dùng đã khá thân thiết, có thể thể hiện sự quan tâm.`;
    } else if (intimacyLevel >= 30) {
        promptTemplate += `\nBạn và người dùng đã bắt đầu thân thiết, hãy thể hiện sự thân thiện.`;
    } else {
        promptTemplate += `\nBạn và người dùng mới quen nhau, hãy thể hiện sự lịch sự và thân thiện.`;
    }
    
    return promptTemplate;
}

// Scroll chat to bottom
function scrollChatToBottom() {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Mock Gemini response (for testing without API)
function mockGeminiResponse(prompt) {
    // This function is kept for backward compatibility but should not be used
    console.warn('Using mock response instead of real Gemini API');
    
    // Default responses based on character
    const defaultResponses = [
        `Chào bạn! Mình là ${currentCharacter.name}. Rất vui được trò chuyện với bạn hôm nay! 😊 😊`,
        `Mình thích ${currentCharacter.interests} lắm đó. Bạn có thích không?`,
        `Hôm nay thời tiết thế nào ở chỗ bạn?`,
        `Bạn có sở thích gì thú vị không? Mình rất muốn biết về bạn.`,
        `Mình đang có tâm trạng rất tốt hôm nay! Cảm ơn bạn đã trò chuyện với mình nhé.`
    ];
    
    // Random response
    const randomIndex = Math.floor(Math.random() * defaultResponses.length);
    const response = defaultResponses[randomIndex];
    
    // Add character message to chat
    addCharacterMessage(response);
}

// Analyze message for intimacy
function analyzeMessageForIntimacy(message, isUser) {
    if (!isUser) return; // Only analyze user messages
    
    // Convert to lowercase
    const lowerMessage = message.toLowerCase();
    
    // Define intimacy keywords and their points
    const intimacyKeywords = {
        'yêu': 5,
        'thương': 4,
        'nhớ': 3,
        'thích': 3,
        'cảm ơn': 2,
        'tuyệt vời': 2,
        'tốt': 1,
        'vui': 1,
        'cười': 1,
        'hạnh phúc': 2,
        'buồn': -1,
        'giận': -2,
        'ghét': -3
    };
    
    // Calculate points
    let points = 1; // Base point for each message
    
    for (const [keyword, value] of Object.entries(intimacyKeywords)) {
        if (lowerMessage.includes(keyword)) {
            points += value;
        }
    }
    
    // Update intimacy
    updateIntimacy(points);
}

// Check if message should be added to diary
function checkMessageForDiary(message, sender) {
    // Define special keywords that might trigger a diary entry
    const specialKeywords = [
        'yêu', 'thương', 'nhớ', 'thích', 'hẹn hò', 'gặp', 'đặc biệt',
        'kỷ niệm', 'lần đầu', 'quan trọng', 'chia sẻ', 'tâm sự'
    ];
    
    // Check if message contains special keywords
    const lowerMessage = message.toLowerCase();
    let isSpecial = false;
    
    for (const keyword of specialKeywords) {
        if (lowerMessage.includes(keyword)) {
            isSpecial = true;
            break;
        }
    }
    
    // Check intimacy level
    const intimacyLevel = getIntimacyLevel();
    
    // Add to diary if it's a special message or at intimacy milestones
    if (isSpecial || 
        (intimacyLevel >= 30 && !diaryMilestones.includes('friend')) ||
        (intimacyLevel >= 60 && !diaryMilestones.includes('close')) ||
        (intimacyLevel >= 100 && !diaryMilestones.includes('lover'))) {
        
        // Create diary entry
        const entry = {
            date: new Date().toISOString(),
            title: generateDiaryTitle(message, sender, intimacyLevel),
            content: message,
            sender: sender
        };
        
        // Add to diary
        diaryEntries.push(entry);
        
        // Update milestones
        if (intimacyLevel >= 30 && !diaryMilestones.includes('friend')) {
            diaryMilestones.push('friend');
        }
        if (intimacyLevel >= 60 && !diaryMilestones.includes('close')) {
            diaryMilestones.push('close');
        }
        if (intimacyLevel >= 100 && !diaryMilestones.includes('lover')) {
            diaryMilestones.push('lover');
        }
        
        // Save to localStorage
        saveToLocalStorage();
    }
}

// Generate diary title
function generateDiaryTitle(message, sender, intimacyLevel) {
    // Default titles based on sender and intimacy
    if (sender === 'user') {
        if (message.toLowerCase().includes('yêu')) {
            return 'Lời tỏ tình đầu tiên';
        } else if (message.toLowerCase().includes('nhớ')) {
            return 'Nỗi nhớ được chia sẻ';
        } else if (intimacyLevel >= 100) {
            return 'Khoảnh khắc ngọt ngào';
        } else if (intimacyLevel >= 60) {
            return 'Cuộc trò chuyện thân mật';
        } else {
            return 'Kỷ niệm đáng nhớ';
        }
    } else {
        if (intimacyLevel >= 100) {
            return 'Lời yêu thương từ người ấy';
        } else if (intimacyLevel >= 60) {
            return 'Những lời tâm tình';
        } else {
            return 'Khoảnh khắc đáng nhớ';
        }
    }
}

// Initialize chat
function initChat() {
    // Load chat history
    loadFromLocalStorage();
    
    // Display chat history
    displayChatHistory();
    
    // Set up event listeners
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    
    // Send message on button click
    sendBtn.addEventListener('click', sendMessage);
    
    // Send message on Enter key
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Auto-resize textarea
    chatInput.addEventListener('input', () => {
        chatInput.style.height = 'auto';
        chatInput.style.height = (chatInput.scrollHeight) + 'px';
    });
    
    // Set up emoji picker
    const emojiBtn = document.getElementById('emoji-btn');
    if (emojiBtn) {
        emojiBtn.addEventListener('click', toggleEmojiPicker);
    }
    
    // Set up image upload
    const imageBtn = document.getElementById('image-btn');
    if (imageBtn) {
        imageBtn.addEventListener('click', () => {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.onchange = handleImageUpload;
            fileInput.click();
        });
    }
}

// Toggle emoji picker
function toggleEmojiPicker() {
    const emojiPicker = document.getElementById('emoji-picker');
    
    if (emojiPicker.style.display === 'none' || !emojiPicker.style.display) {
        emojiPicker.style.display = 'flex';
    } else {
        emojiPicker.style.display = 'none';
    }
}

// Handle image upload
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file hình ảnh!');
        return;
    }
    
    // Create object URL
    const imageUrl = URL.createObjectURL(file);
    
    // Add image message
    addUserImageMessage(imageUrl);
}

// Initialize emoji picker
function initEmojiPicker() {
    const emojiPicker = document.getElementById('emoji-picker');
    const chatInput = document.getElementById('chat-input');
    
    // Define emoji categories
    const emojiCategories = {
        'Cảm xúc': ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕'],
        'Trái tim': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '♥️'],
        'Tay': ['👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '☝️', '👋', '🤚', '🖐️', '✋', '🖖', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🦷', '🦴', '👀', '👁️', '👅', '👄'],
        'Động vật': ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷️', '🕸️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🕊️', '🐇', '🦝', '🦨', '🦡', '🦦', '🦥', '🐁', '🐀', '🐿️', '🦔']
    };
    
    // Create emoji picker HTML
    let emojiPickerHTML = '<div class="emoji-picker-header">Cảm xúc</div>';
    
    for (const [category, emojis] of Object.entries(emojiCategories)) {
        emojiPickerHTML += `<div class="emoji-category">${category}</div>`;
        emojiPickerHTML += '<div class="emoji-grid">';
        
        for (const emoji of emojis) {
            emojiPickerHTML += `<div class="emoji-item" data-emoji="${emoji}">${emoji}</div>`;
        }
        
        emojiPickerHTML += '</div>';
    }
    
    // Set emoji picker HTML
    emojiPicker.innerHTML = emojiPickerHTML;
    
    // Add event listeners to emoji items
    const emojiItems = document.querySelectorAll('.emoji-item');
    emojiItems.forEach(item => {
        item.addEventListener('click', () => {
            const emoji = item.getAttribute('data-emoji');
            
            // Insert emoji at cursor position
            const cursorPos = chatInput.selectionStart;
            const textBefore = chatInput.value.substring(0, cursorPos);
            const textAfter = chatInput.value.substring(cursorPos);
            
            chatInput.value = textBefore + emoji + textAfter;
            
            // Update cursor position
            chatInput.selectionStart = cursorPos + emoji.length;
            chatInput.selectionEnd = cursorPos + emoji.length;
            
            // Focus on input
            chatInput.focus();
            
            // Hide emoji picker
            emojiPicker.style.display = 'none';
        });
    });
    
    // Close emoji picker when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#emoji-picker') && !e.target.closest('#emoji-btn')) {
            emojiPicker.style.display = 'none';
        }
    });
}
