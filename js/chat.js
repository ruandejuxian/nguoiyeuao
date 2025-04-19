/**
 * Chat functionality for the Virtual Companion application
 */
const Chat = {
    /**
     * Chat history
     */
    history: [],
    
    /**
     * Current image to send
     */
    currentImage: null,
    
    /**
     * Initializes chat from storage
     */
    init: function() {
        // Try to load chat history from storage
        const savedHistory = Storage.load(CONFIG.CHAT.STORAGE_KEY);
        
        if (savedHistory && Array.isArray(savedHistory)) {
            this.history = savedHistory;
            this.renderChatHistory();
            return true;
        }
        
        this.history = [];
        return false;
    },
    
    /**
     * Initializes chat features
     */
    initChatFeatures: function() {
        // Initialize emoji picker
        this.initEmojiPicker();
        
        // Initialize file upload
        this.initFileUpload();
    },
    
    /**
     * Initializes emoji picker
     */
    initEmojiPicker: function() {
        const emojiButton = document.getElementById('emoji-button');
        const emojiPickerContainer = document.getElementById('emoji-picker-container');
        const messageInput = document.getElementById('message-input');
        
        if (emojiButton && emojiPickerContainer) {
            // Create emoji picker
            const picker = new EmojiMart.Picker({
                onSelect: emoji => {
                    // Insert emoji at cursor position
                    const cursorPos = messageInput.selectionStart;
                    const text = messageInput.value;
                    const newText = text.slice(0, cursorPos) + emoji.native + text.slice(cursorPos);
                    
                    messageInput.value = newText;
                    messageInput.focus();
                    messageInput.selectionStart = cursorPos + emoji.native.length;
                    messageInput.selectionEnd = cursorPos + emoji.native.length;
                    
                    // Trigger input event to resize textarea
                    const event = new Event('input', { bubbles: true });
                    messageInput.dispatchEvent(event);
                    
                    // Hide picker after selection
                    emojiPickerContainer.style.display = 'none';
                },
                i18n: {
                    search: 'Tìm kiếm',
                    categories: {
                        search: 'Kết quả tìm kiếm',
                        recent: 'Gần đây',
                        smileys: 'Mặt cười',
                        people: 'Người',
                        nature: 'Thiên nhiên',
                        foods: 'Thức ăn',
                        activity: 'Hoạt động',
                        places: 'Địa điểm',
                        objects: 'Đồ vật',
                        symbols: 'Biểu tượng',
                        flags: 'Cờ'
                    }
                }
            });
            
            emojiPickerContainer.appendChild(picker);
            
            // Toggle emoji picker on button click
            emojiButton.addEventListener('click', () => {
                if (emojiPickerContainer.style.display === 'block') {
                    emojiPickerContainer.style.display = 'none';
                } else {
                    emojiPickerContainer.style.display = 'block';
                }
            });
            
            // Close emoji picker when clicking outside
            document.addEventListener('click', (e) => {
                if (!emojiPickerContainer.contains(e.target) && e.target !== emojiButton) {
                    emojiPickerContainer.style.display = 'none';
                }
            });
        }
    },
    
    /**
     * Initializes file upload
     */
    initFileUpload: function() {
        const fileButton = document.getElementById('file-button');
        const fileInput = document.getElementById('file-input');
        const imagePreviewModal = document.getElementById('image-preview-modal');
        const imagePreview = document.getElementById('image-preview');
        const cancelImageBtn = document.getElementById('cancel-image');
        const sendImageBtn = document.getElementById('send-image');
        
        if (fileButton && fileInput) {
            // Open file dialog on button click
            fileButton.addEventListener('click', () => {
                fileInput.click();
            });
            
            // Handle file selection
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                
                if (file) {
                    // Check if file is an image
                    if (!file.type.startsWith('image/')) {
                        Utils.showModal('alert-modal', {
                            title: 'Loại file không hỗ trợ',
                            message: 'Vui lòng chọn file hình ảnh (jpg, png, gif, etc.)'
                        });
                        return;
                    }
                    
                    // Check file size (max 5MB)
                    if (file.size > 5 * 1024 * 1024) {
                        Utils.showModal('alert-modal', {
                            title: 'File quá lớn',
                            message: 'Kích thước file không được vượt quá 5MB'
                        });
                        return;
                    }
                    
                    // Show image preview
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        imagePreview.src = e.target.result;
                        this.currentImage = e.target.result;
                        
                        // Show preview modal
                        imagePreviewModal.style.display = 'flex';
                    };
                    reader.readAsDataURL(file);
                }
            });
            
            // Cancel image upload
            cancelImageBtn.addEventListener('click', () => {
                imagePreviewModal.style.display = 'none';
                fileInput.value = '';
                this.currentImage = null;
            });
            
            // Send image
            sendImageBtn.addEventListener('click', () => {
                if (this.currentImage) {
                    this.sendImage(this.currentImage);
                    imagePreviewModal.style.display = 'none';
                    fileInput.value = '';
                    this.currentImage = null;
                }
            });
        }
    },
    
    /**
     * Sends a message to the companion
     * @param {string} message - User message
     */
    sendMessage: async function(message) {
        if (!message.trim() || !Character.current) return;
        
        // Add user message to history
        this.addMessage('user', message);
        
        // Update character stats
        Character.current.stats.messagesSent++;
        Storage.save(CONFIG.CHARACTER.STORAGE_KEY, Character.current);
        
        // Check for intimacy keywords
        this.checkIntimacyKeywords(message);
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Generate AI response
        try {
            const apiKey = Storage.load(CONFIG.API.STORAGE_KEYS.API_KEY);
            
            if (!apiKey) {
                this.hideTypingIndicator();
                Utils.showModal('alert-modal', {
                    title: 'API Key không tồn tại',
                    message: 'Vui lòng thêm Gemini API Key trong phần Cài đặt để sử dụng chức năng chat.'
                });
                return;
            }
            
            // Generate prompt for AI
            const prompt = Character.generatePrompt(message, this.history.slice(-10));
            
            // Random delay to simulate typing
            const typingDelay = Utils.getRandomNumber(
                CONFIG.CHAT.TYPING_DELAY_MIN, 
                CONFIG.CHAT.TYPING_DELAY_MAX
            );
            
            // Wait for typing delay
            await new Promise(resolve => setTimeout(resolve, typingDelay));
            
            // Call Gemini API
            const response = await this.callGeminiAPI(apiKey, prompt);
            
            // Hide typing indicator
            this.hideTypingIndicator();
            
            if (response) {
                // Add AI response to history
                this.addMessage('companion', response);
                
                // Update character stats
                Character.current.stats.messagesReceived++;
                Storage.save(CONFIG.CHARACTER.STORAGE_KEY, Character.current);
                
                // Update intimacy
                Character.updateIntimacy(CONFIG.CHAT.POINTS_PER_MESSAGE);
                
                // Check for special moments
                this.checkSpecialMoments(message, response);
                
                // Update avatar emotion based on response
                this.updateAvatarEmotion(response);
            }
        } catch (error) {
            console.error('Error generating response:', error);
            this.hideTypingIndicator();
            
            // Add error message
            this.addMessage('system', 'Có lỗi xảy ra khi tạo phản hồi. Vui lòng thử lại sau.');
        }
    },
    
    /**
     * Sends an image to the chat
     * @param {string} imageData - Base64 encoded image data
     */
    sendImage: async function(imageData) {
        if (!Character.current) return;
        
        // Add image message to history
        this.addMessage('user', imageData, 'image');
        
        // Update character stats
        Character.current.stats.messagesSent++;
        Storage.save(CONFIG.CHARACTER.STORAGE_KEY, Character.current);
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Generate AI response
        try {
            const apiKey = Storage.load(CONFIG.API.STORAGE_KEYS.API_KEY);
            
            if (!apiKey) {
                this.hideTypingIndicator();
                Utils.showModal('alert-modal', {
                    title: 'API Key không tồn tại',
                    message: 'Vui lòng thêm Gemini API Key trong phần Cài đặt để sử dụng chức năng chat.'
                });
                return;
            }
            
            // Generate prompt for AI
            const prompt = Character.generatePrompt("Tôi đã gửi cho bạn một hình ảnh. Hãy phản hồi về hình ảnh này theo tính cách của bạn.", this.history.slice(-10));
            
            // Random delay to simulate typing
            const typingDelay = Utils.getRandomNumber(
                CONFIG.CHAT.TYPING_DELAY_MIN, 
                CONFIG.CHAT.TYPING_DELAY_MAX
            );
            
            // Wait for typing delay
            await new Promise(resolve => setTimeout(resolve, typingDelay));
            
            // Call Gemini API
            const response = await this.callGeminiAPI(apiKey, prompt);
            
            // Hide typing indicator
            this.hideTypingIndicator();
            
            if (response) {
                // Add AI response to history
                this.addMessage('companion', response);
                
                // Update character stats
                Character.current.stats.messagesReceived++;
                Storage.save(CONFIG.CHARACTER.STORAGE_KEY, Character.current);
                
                // Update intimacy
                Character.updateIntimacy(CONFIG.CHAT.POINTS_PER_MESSAGE);
                
                // Update avatar emotion based on response
                this.updateAvatarEmotion(response);
            }
        } catch (error) {
            console.error('Error generating response:', error);
            this.hideTypingIndicator();
            
            // Add error message
            this.addMessage('system', 'Có lỗi xảy ra khi tạo phản hồi. Vui lòng thử lại sau.');
        }
    },
    
    /**
     * Calls the Gemini API to generate a response
     * @param {string} apiKey - Gemini API key
     * @param {string} prompt - Prompt for the AI
     * @returns {string} AI response
     */
    callGeminiAPI: async function(apiKey, prompt) {
        try {
            const url = `${CONFIG.API.GEMINI_API_URL}?key=${apiKey}`;
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 1024,
                    }
                })
            });
            
            const data = await response.json();
            
            if (data.error) {
                console.error('API error:', data.error);
                return null;
            }
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                return data.candidates[0].content.parts[0].text;
            }
            
            return null;
        } catch (error) {
            console.error('Error calling Gemini API:', error);
            return null;
        }
    },
    
    /**
     * Adds a message to the chat history
     * @param {string} sender - 'user', 'companion', or 'system'
     * @param {string} content - Message content
     * @param {string} type - Message type ('text' or 'image')
     */
    addMessage: function(sender, content, type = 'text') {
        const message = {
            id: Utils.generateId(),
            sender: sender,
            content: content,
            type: type,
            timestamp: new Date().toISOString()
        };
        
        // Add to history
        this.history.push(message);
        
        // Limit history size
        if (this.history.length > CONFIG.CHAT.MAX_HISTORY_LENGTH) {
            this.history = this.history.slice(-CONFIG.CHAT.MAX_HISTORY_LENGTH);
        }
        
        // Save to storage
        Storage.save(CONFIG.CHAT.STORAGE_KEY, this.history);
        
        // Render the new message
        this.renderMessage(message);
        
        // Scroll to bottom
        this.scrollToBottom();
    },
    
    /**
     * Renders the chat history
     */
    renderChatHistory: function() {
        const chatMessages = document.getElementById('chat-messages');
        
        // Clear existing messages
        chatMessages.innerHTML = '';
        
        // Render each message
        this.history.forEach(message => {
            this.renderMessage(message);
        });
        
        // Scroll to bottom
        this.scrollToBottom();
    },
    
    /**
     * Renders a single message
     * @param {Object} message - Message object
     */
    renderMessage: function(message) {
        const chatMessages = document.getElementById('chat-messages');
        
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', message.sender);
        
        // Format timestamp
        const timestamp = new Date(message.timestamp);
        const formattedTime = Utils.formatDate(timestamp);
        
        // Set message HTML based on type
        if (message.type === 'text') {
            // Format message content with links and emojis
            const formattedContent = this.formatMessageContent(message.content);
            
            messageElement.innerHTML = `
                <div class="message-content">${formattedContent}</div>
                <span class="message-time">${formattedTime}</span>
            `;
        } else if (message.type === 'image') {
            messageElement.innerHTML = `
                <div class="message-content">
                    <img src="${message.content}" alt="Hình ảnh" class="message-image">
                </div>
                <span class="message-time">${formattedTime}</span>
            `;
            
            // Add click event to open image in full size
            const imageElement = messageElement.querySelector('.message-image');
            if (imageElement) {
                imageElement.addEventListener('click', () => {
                    const modal = document.createElement('div');
                    modal.classList.add('modal');
                    modal.style.display = 'flex';
                    
                    modal.innerHTML = `
                        <div class="modal-content" style="max-width: 90%; text-align: center;">
                            <img src="${message.content}" alt="Hình ảnh" style="max-width: 100%; max-height: 80vh;">
                            <button class="primary-btn" style="margin-top: 15px;">Đóng</button>
                        </div>
                    `;
                    
                    document.body.appendChild(modal);
                    
                    const closeButton = modal.querySelector('button');
                    closeButton.addEventListener('click', () => {
                        document.body.removeChild(modal);
                    });
                });
            }
        }
        
        // Add to chat container
        chatMessages.appendChild(messageElement);
    },
    
    /**
     * Formats message content with links and emojis
     * @param {string} content - Message content
     * @returns {string} Formatted content
     */
    formatMessageContent: function(content) {
        // Escape HTML
        let formattedContent = Utils.escapeHtml(content);
        
        // Convert URLs to links
        formattedContent = Utils.linkify(formattedContent);
        
        // Detect and highlight emojis
        formattedContent = formattedContent.replace(/(\p{Emoji}+)/gu, '<span class="emoji">$1</span>');
        
        return formattedContent;
    },
    
    /**
     * Shows the typing indicator
     */
    showTypingIndicator: function() {
        const chatMessages = document.getElementById('chat-messages');
        
        // Create typing indicator
        const typingElement = document.createElement('div');
        typingElement.classList.add('message', 'companion', 'typing-indicator-container');
        typingElement.id = 'typing-indicator';
        
        typingElement.innerHTML = `
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        
        // Add to chat container
        chatMessages.appendChild(typingElement);
        
        // Scroll to bottom
        this.scrollToBottom();
    },
    
    /**
     * Hides the typing indicator
     */
    hideTypingIndicator: function() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    },
    
    /**
     * Scrolls the chat to the bottom
     */
    scrollToBottom: function() {
        const chatMessages = document.getElementById('chat-messages');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    },
    
    /**
     * Clears the chat history
     */
    clearHistory: function() {
        this.history = [];
        Storage.remove(CONFIG.CHAT.STORAGE_KEY);
        this.renderChatHistory();
    },
    
    /**
     * Checks for intimacy keywords in user message
     * @param {string} message - User message
     */
    checkIntimacyKeywords: function(message) {
        if (!Character.current) return;
        
        const lowerMessage = message.toLowerCase();
        let pointsToAdd = 0;
        
        // Check for keywords that increase intimacy
        Object.keys(CONFIG.CHAT.POINTS_FOR_KEYWORDS).forEach(keyword => {
            if (lowerMessage.includes(keyword)) {
                pointsToAdd += CONFIG.CHAT.POINTS_FOR_KEYWORDS[keyword];
                
                // Check for first love word
                if (keyword === 'yêu' && 
                    !Character.current.stats.specialMoments.includes('first_love_word')) {
                    
                    Character.current.stats.specialMoments.push('first_love_word');
                    
                    // Add to diary
                    Diary.addEntry({
                        type: 'first_love_word',
                        title: 'Lời yêu đầu tiên',
                        content: `Bạn đã nói "yêu" với ${Character.current.name} lần đầu tiên!`,
                        timestamp: new Date().toISOString()
                    });
                }
            }
        });
        
        if (pointsToAdd > 0) {
            Character.updateIntimacy(pointsToAdd);
        }
    },
    
    /**
     * Checks for special moments in the conversation
     * @param {string} userMessage - User message
     * @param {string} aiResponse - AI response
     */
    checkSpecialMoments: function(userMessage, aiResponse) {
        if (!Character.current) return;
        
        // Check for special keywords or patterns
        // This is a simplified implementation - could be expanded
        const specialKeywords = {
            'proposal': ['cưới', 'kết hôn', 'làm vợ', 'làm chồng'],
            'anniversary': ['kỷ niệm', 'ngày đặc biệt'],
            'compliment': ['đẹp quá', 'dễ thương quá', 'thông minh quá']
        };
        
        const lowerUserMessage = userMessage.toLowerCase();
        
        for (const [moment, keywords] of Object.entries(specialKeywords)) {
            for (const keyword of keywords) {
                if (lowerUserMessage.includes(keyword)) {
                    // Add to diary if it's a new special moment
                    const momentKey = `special_${moment}`;
                    if (!Character.current.stats.specialMoments.includes(momentKey)) {
                        Character.current.stats.specialMoments.push(momentKey);
                        Storage.save(CONFIG.CHARACTER.STORAGE_KEY, Character.current);
                        
                        let title = '';
                        let content = '';
                        
                        switch (moment) {
                            case 'proposal':
                                title = 'Lời cầu hôn';
                                content = `Bạn đã ngỏ lời cầu hôn với ${Character.current.name}!`;
                                break;
                            case 'anniversary':
                                title = 'Kỷ niệm đặc biệt';
                                content = `Bạn và ${Character.current.name} đã nhắc đến ngày kỷ niệm của hai người.`;
                                break;
                            case 'compliment':
                                title = 'Lời khen ngợi';
                                content = `Bạn đã dành những lời khen ngợi ngọt ngào cho ${Character.current.name}.`;
                                break;
                        }
                        
                        Diary.addEntry({
                            type: momentKey,
                            title: title,
                            content: content,
                            timestamp: new Date().toISOString()
                        });
                    }
                }
            }
        }
    },
    
    /**
     * Updates the avatar emotion based on message content
     * @param {string} message - Message content
     */
    updateAvatarEmotion: function(message) {
        // This would be implemented with actual avatar animations
        // For now, we'll just detect the emotion
        const emotion = Utils.detectEmotion(message);
        console.log('Detected emotion:', emotion);
        
        // In a full implementation, this would change the avatar image/animation
        // based on the detected emotion
    }
};
