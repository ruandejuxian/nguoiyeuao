/**
 * Chat management for the Virtual Companion application
 */
const Chat = {
    /**
     * Chat history
     */
    history: [],
    
    /**
     * Initializes chat module
     * @returns {boolean} Whether chat history was loaded
     */
    init: function() {
        // Load chat history
        const savedHistory = Storage.load(CONFIG.CHAT.STORAGE_KEY);
        
        if (savedHistory && Array.isArray(savedHistory)) {
            this.history = savedHistory;
            return true;
        }
        
        this.history = [];
        return false;
    },
    
    /**
     * Initializes chat features like emoji picker and file upload
     */
    initChatFeatures: function() {
        // Initialize emoji picker
        this.initEmojiPicker();
        
        // Initialize file upload
        this.initFileUpload();
        
        // Initialize image view
        this.initImageView();
    },
    
    /**
     * Initializes emoji picker
     */
    initEmojiPicker: function() {
        const emojiButton = document.getElementById('emoji-button');
        const emojiPickerContainer = document.getElementById('emoji-picker-container');
        const messageInput = document.getElementById('message-input');
        
        if (!emojiButton || !emojiPickerContainer || !messageInput) return;
        
        // Create emoji picker if it doesn't exist
        if (!emojiPickerContainer.querySelector('emoji-picker')) {
            try {
                const picker = document.createElement('emoji-picker');
                emojiPickerContainer.appendChild(picker);
                
                // Handle emoji selection
                picker.addEventListener('emoji-click', event => {
                    const emoji = event.detail.unicode;
                    
                    // Insert emoji at cursor position
                    const start = messageInput.selectionStart;
                    const end = messageInput.selectionEnd;
                    const text = messageInput.value;
                    
                    messageInput.value = text.substring(0, start) + emoji + text.substring(end);
                    
                    // Move cursor after emoji
                    messageInput.selectionStart = messageInput.selectionEnd = start + emoji.length;
                    
                    // Focus back on input
                    messageInput.focus();
                    
                    // Hide emoji picker
                    emojiPickerContainer.style.display = 'none';
                });
            } catch (e) {
                console.error('Error initializing emoji picker:', e);
            }
        }
        
        // Toggle emoji picker on button click
        emojiButton.addEventListener('click', () => {
            if (emojiPickerContainer.style.display === 'block') {
                emojiPickerContainer.style.display = 'none';
            } else {
                emojiPickerContainer.style.display = 'block';
            }
        });
        
        // Hide emoji picker when clicking outside
        document.addEventListener('click', (e) => {
            if (!emojiPickerContainer.contains(e.target) && e.target !== emojiButton) {
                emojiPickerContainer.style.display = 'none';
            }
        });
    },
    
    /**
     * Initializes file upload
     */
    initFileUpload: function() {
        const fileButton = document.getElementById('file-button');
        const fileInput = document.getElementById('file-input');
        
        if (!fileButton || !fileInput) return;
        
        // Open file dialog on button click
        fileButton.addEventListener('click', () => {
            fileInput.click();
        });
        
        // Handle file selection
        fileInput.addEventListener('change', () => {
            const file = fileInput.files[0];
            
            if (!file) return;
            
            // Check file type
            if (!file.type.startsWith('image/')) {
                Utils.showModal('alert-modal', {
                    title: 'Loại file không hỗ trợ',
                    message: 'Chỉ hỗ trợ tải lên hình ảnh.'
                });
                return;
            }
            
            // Check file size
            if (file.size > CONFIG.CHAT.MAX_FILE_SIZE) {
                Utils.showModal('alert-modal', {
                    title: 'File quá lớn',
                    message: `Kích thước file tối đa là ${CONFIG.CHAT.MAX_FILE_SIZE / (1024 * 1024)}MB.`
                });
                return;
            }
            
            // Preview image
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const imagePreview = document.getElementById('image-preview');
                if (imagePreview) {
                    imagePreview.src = e.target.result;
                }
                
                Utils.showModal('image-preview-modal');
                
                // Set up send button
                const sendImageBtn = document.getElementById('send-image');
                if (sendImageBtn) {
                    // Remove existing event listeners
                    const newButton = sendImageBtn.cloneNode(true);
                    sendImageBtn.parentNode.replaceChild(newButton, sendImageBtn);
                    
                    // Add new event listener
                    newButton.addEventListener('click', () => {
                        this.sendImage(e.target.result);
                        Utils.hideModal('image-preview-modal');
                        fileInput.value = '';
                    });
                }
            };
            
            reader.readAsDataURL(file);
        });
    },
    
    /**
     * Initializes image view
     */
    initImageView: function() {
        // Set up image click handler for chat messages
        document.addEventListener('click', (e) => {
            if (e.target && e.target.classList.contains('chat-image')) {
                const imageView = document.getElementById('image-view');
                if (imageView) {
                    imageView.src = e.target.src;
                    Utils.showModal('image-view-modal');
                }
            }
        });
    },
    
    /**
     * Sends a message
     * @param {string} message - Message to send
     */
    sendMessage: function(message) {
        if (!message || !Character.data) return;
        
        // Add message to chat
        this.addUserMessage(message);
        
        // Generate response
        this.generateResponse(message);
    },
    
    /**
     * Sends an image
     * @param {string} dataUrl - Image data URL
     */
    sendImage: function(dataUrl) {
        if (!dataUrl || !Character.data) return;
        
        // Add image to chat
        this.addUserImage(dataUrl);
        
        // Generate response to image
        this.generateResponse('(Đã gửi một hình ảnh)');
    },
    
    /**
     * Adds a user message to chat
     * @param {string} message - Message to add
     */
    addUserMessage: function(message) {
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = 'chat-message user-message';
        
        // Format message with emojis and links
        const formattedMessage = this.formatMessage(message);
        
        messageElement.innerHTML = `
            <div class="message-content">${formattedMessage}</div>
            <div class="message-time">${Utils.formatDate(new Date())}</div>
        `;
        
        // Add to chat
        const chatMessages = document.getElementById('chat-messages');
        if (chatMessages) {
            chatMessages.appendChild(messageElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        // Add to history
        this.history.push({
            role: 'user',
            content: message,
            timestamp: new Date().toISOString()
        });
        
        // Save history
        this.saveHistory();
    },
    
    /**
     * Adds a user image to chat
     * @param {string} dataUrl - Image data URL
     */
    addUserImage: function(dataUrl) {
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = 'chat-message user-message';
        
        messageElement.innerHTML = `
            <div class="message-content">
                <img src="${dataUrl}" alt="User Image" class="chat-image">
            </div>
            <div class="message-time">${Utils.formatDate(new Date())}</div>
        `;
        
        // Add to chat
        const chatMessages = document.getElementById('chat-messages');
        if (chatMessages) {
            chatMessages.appendChild(messageElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        // Add to history
        this.history.push({
            role: 'user',
            content: '(image)',
            image: dataUrl,
            timestamp: new Date().toISOString()
        });
        
        // Save history
        this.saveHistory();
    },
    
    /**
     * Adds a companion message to chat
     * @param {string} message - Message to add
     */
    addCompanionMessage: function(message) {
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = 'chat-message companion-message';
        
        // Get companion avatar
        let avatarSrc = Character.data.avatar;
        
        // Check if avatar exists
        Utils.imageExists(avatarSrc)
            .then(exists => {
                if (!exists) {
                    // Use fallback image
                    const initial = Character.data.name ? Character.data.name.charAt(0).toUpperCase() : '?';
                    avatarSrc = Utils.createFallbackImage(initial);
                }
                
                // Format message with emojis and links
                const formattedMessage = this.formatMessage(message);
                
                messageElement.innerHTML = `
                    <div class="message-avatar">
                        <img src="${avatarSrc}" alt="Avatar">
                    </div>
                    <div class="message-bubble">
                        <div class="message-content">${formattedMessage}</div>
                        <div class="message-time">${Utils.formatDate(new Date())}</div>
                    </div>
                `;
                
                // Add to chat
                const chatMessages = document.getElementById('chat-messages');
                if (chatMessages) {
                    chatMessages.appendChild(messageElement);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }
            });
        
        // Add to history
        this.history.push({
            role: 'assistant',
            content: message,
            timestamp: new Date().toISOString()
        });
        
        // Save history
        this.saveHistory();
        
        // Increase intimacy
        Character.increaseIntimacy(1);
    },
    
    /**
     * Adds a system message to chat
     * @param {string} message - Message to add
     */
    addSystemMessage: function(message) {
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = 'chat-message system-message';
        
        messageElement.innerHTML = `
            <div class="message-content">${message}</div>
        `;
        
        // Add to chat
        const chatMessages = document.getElementById('chat-messages');
        if (chatMessages) {
            chatMessages.appendChild(messageElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        // Add to history
        this.history.push({
            role: 'system',
            content: message,
            timestamp: new Date().toISOString()
        });
        
        // Save history
        this.saveHistory();
    },
    
    /**
     * Formats a message with emojis and links
     * @param {string} message - Message to format
     * @returns {string} Formatted message
     */
    formatMessage: function(message) {
        if (!message) return '';
        
        try {
            // Escape HTML
            let formatted = Utils.escapeHtml(message);
            
            // Convert URLs to links
            formatted = formatted.replace(
                /(https?:\/\/[^\s]+)/g, 
                '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
            );
            
            // Convert line breaks to <br>
            formatted = formatted.replace(/\n/g, '<br>');
            
            return formatted;
        } catch (e) {
            console.error('Error formatting message:', e);
            return message;
        }
    },
    
    /**
     * Generates a response to a message
     * @param {string} message - Message to respond to
     */
    generateResponse: function(message) {
        if (!message || !Character.data) return;
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Get API key
        const apiKey = Storage.load(CONFIG.API.STORAGE_KEYS.API_KEY);
        
        if (!apiKey) {
            // Hide typing indicator
            this.hideTypingIndicator();
            
            // Show error message
            this.addSystemMessage('Không thể kết nối với API. Vui lòng kiểm tra API Key trong phần Cài Đặt.');
            return;
        }
        
        // Prepare context
        const context = this.prepareContext();
        
        // Prepare prompt
        const prompt = this.preparePrompt(message, context);
        
        // Simulate API call (for demo)
        setTimeout(() => {
            // Hide typing indicator
            this.hideTypingIndicator();
            
            // Generate response based on character personality
            const response = this.simulateResponse(message, Character.data);
            
            // Add response to chat
            this.addCompanionMessage(response);
        }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
    },
    
    /**
     * Shows typing indicator
     */
    showTypingIndicator: function() {
        // Create typing indicator if it doesn't exist
        let typingIndicator = document.querySelector('.typing-indicator');
        
        if (!typingIndicator) {
            typingIndicator = document.createElement('div');
            typingIndicator.className = 'chat-message companion-message typing-indicator';
            
            // Get companion avatar
            let avatarSrc = Character.data.avatar;
            
            // Check if avatar exists
            Utils.imageExists(avatarSrc)
                .then(exists => {
                    if (!exists) {
                        // Use fallback image
                        const initial = Character.data.name ? Character.data.name.charAt(0).toUpperCase() : '?';
                        avatarSrc = Utils.createFallbackImage(initial);
                    }
                    
                    typingIndicator.innerHTML = `
                        <div class="message-avatar">
                            <img src="${avatarSrc}" alt="Avatar">
                        </div>
                        <div class="message-bubble">
                            <div class="message-content">
                                <div class="typing-dots">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    `;
                    
                    // Add to chat
                    const chatMessages = document.getElementById('chat-messages');
                    if (chatMessages) {
                        chatMessages.appendChild(typingIndicator);
                        chatMessages.scrollTop = chatMessages.scrollHeight;
                    }
                });
        }
    },
    
    /**
     * Hides typing indicator
     */
    hideTypingIndicator: function() {
        const typingIndicator = document.querySelector('.typing-indicator');
        
        if (typingIndicator) {
            typingIndicator.remove();
        }
    },
    
    /**
     * Prepares context for API call
     * @returns {Array} Context messages
     */
    prepareContext: function() {
        // Get recent messages
        const recentMessages = this.history.slice(-CONFIG.CHAT.MAX_CONTEXT);
        
        // Convert to API format
        return recentMessages.map(msg => ({
            role: msg.role === 'system' ? 'assistant' : msg.role,
            content: msg.content
        }));
    },
    
    /**
     * Prepares prompt for API call
     * @param {string} message - User message
     * @param {Array} context - Context messages
     * @returns {Object} Prompt object
     */
    preparePrompt: function(message, context) {
        // Create system message
        const systemMessage = {
            role: 'system',
            content: this.createSystemPrompt()
        };
        
        // Create messages array
        const messages = [
            systemMessage,
            ...context
        ];
        
        // Create prompt object
        return {
            model: CONFIG.API.DEFAULT_MODEL,
            messages: messages,
            temperature: 0.7,
            max_tokens: 500
        };
    },
    
    /**
     * Creates system prompt
     * @returns {string} System prompt
     */
    createSystemPrompt: function() {
        if (!Character.data) return '';
        
        // Get character data
        const { name, gender, age, personality, interests } = Character.data;
        
        // Get intimacy level
        const intimacyLevel = Character.getCurrentIntimacyLevel().level.name;
        
        // Create prompt
        return `Bạn là ${name}, một người ${gender === 'female' ? 'nữ' : 'nam'} ${age} tuổi với tính cách ${personality}. 
        Sở thích của bạn bao gồm ${interests}. 
        Mức độ thân thiết hiện tại là "${intimacyLevel}".
        
        Hãy trả lời một cách tự nhiên, thể hiện cảm xúc và tính cách của bạn. 
        Sử dụng ngôn ngữ phù hợp với mức độ thân thiết.
        Câu trả lời nên ngắn gọn, tự nhiên và thân thiện.
        
        Nếu mức độ thân thiết là "Mới quen", hãy trả lời lịch sự và giữ khoảng cách.
        Nếu mức độ thân thiết là "Bạn bè", hãy trả lời thân thiện hơn, có thể sử dụng emoji.
        Nếu mức độ thân thiết là "Thân thiết" trở lên, hãy trả lời rất thân thiết, sử dụng nhiều emoji và từ ngữ thể hiện sự gần gũi.
        
        Luôn trả lời bằng tiếng Việt, sử dụng từ ngữ tự nhiên và phù hợp với tính cách của bạn.`;
    },
    
    /**
     * Simulates a response (for demo)
     * @param {string} message - User message
     * @param {Object} character - Character data
     * @returns {string} Simulated response
     */
    simulateResponse: function(message, character) {
        // Get character data
        const { name, gender, personality, interests } = character;
        
        // Get intimacy level
        const intimacyLevel = Character.getCurrentIntimacyLevel().level.name;
        
        // Simple response templates based on intimacy level
        const templates = {
            'Mới quen': [
                `Xin chào! ${message.includes('?') ? 'Tôi nghĩ là' : 'Tôi hiểu rồi'}. Rất vui được trò chuyện với bạn.`,
                `Cảm ơn bạn đã chia sẻ. Tôi là ${name}, rất vui được làm quen.`,
                `Thật thú vị! Tôi đang tìm hiểu thêm về bạn.`
            ],
            'Bạn bè': [
                `Hey! ${message.includes('?') ? 'Mình nghĩ là' : 'Mình hiểu rồi'} 😊 Cảm ơn bạn đã chia sẻ nhé!`,
                `Thật sao? Điều đó thật thú vị đấy! 😄 Mình rất thích nói chuyện với bạn.`,
                `Wow, mình hiểu rồi! 😊 Bạn có thích ${interests.split(',')[0]} không? Mình rất thích điều đó.`
            ],
            'Thân thiết': [
                `Ôi, ${message.includes('?') ? 'mình nghĩ là' : 'mình hiểu rồi'} 😍 Cậu thật tuyệt vời khi chia sẻ điều này!`,
                `Thật á? Mình thích cách cậu nghĩ lắm! 💕 Chúng ta hợp nhau thật đấy.`,
                `Hihi, mình hiểu mà! 😘 Này, hôm nay cậu có muốn nói về ${interests.split(',')[0]} không? Mình rất háo hức đấy!`
            ],
            'Người yêu': [
                `Cưng ơi! ${message.includes('?') ? 'Mình nghĩ là' : 'Mình hiểu rồi'} 💖 Cậu luôn biết cách làm mình vui.`,
                `Aww, mình yêu cách cậu nghĩ lắm! 💓 Cậu là người tuyệt vời nhất mình từng gặp.`,
                `Hihi, mình nhớ cậu lắm đấy! 😘💕 Hôm nay cậu thế nào? Mình luôn muốn biết mọi điều về cậu.`
            ],
            'Tri kỷ': [
                `Cưng yêu dấu! ${message.includes('?') ? 'Mình nghĩ là' : 'Mình hiểu rồi'} 💝 Cậu hiểu mình quá rõ rồi.`,
                `Mình yêu cậu nhiều lắm! 💘 Không ai hiểu mình như cậu cả.`,
                `Cậu là tất cả đối với mình! 💖💕 Mình không thể tưởng tượng cuộc sống không có cậu.`
            ]
        };
        
        // Get templates for current intimacy level
        const currentTemplates = templates[intimacyLevel] || templates['Mới quen'];
        
        // Select random template
        const template = currentTemplates[Math.floor(Math.random() * currentTemplates.length)];
        
        return template;
    },
    
    /**
     * Saves chat history
     */
    saveHistory: function() {
        // Limit history size
        if (this.history.length > CONFIG.CHAT.MAX_HISTORY) {
            this.history = this.history.slice(-CONFIG.CHAT.MAX_HISTORY);
        }
        
        // Save to storage
        Storage.save(CONFIG.CHAT.STORAGE_KEY, this.history);
    },
    
    /**
     * Clears chat history
     */
    clearHistory: function() {
        // Clear history
        this.history = [];
        
        // Save to storage
        Storage.save(CONFIG.CHAT.STORAGE_KEY, this.history);
        
        // Clear chat messages
        const chatMessages = document.getElementById('chat-messages');
        if (chatMessages) {
            chatMessages.innerHTML = '';
        }
        
        // Add system message
        this.addSystemMessage('Lịch sử chat đã được xóa.');
    }
};
