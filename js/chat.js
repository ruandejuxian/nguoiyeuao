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
     * Emoji picker instance
     */
    emojiPicker: null,
    
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
        
        // Initialize voice recording
        this.initVoiceRecording();
        
        // Initialize image view modal
        this.initImageViewModal();
    },
    
    /**
     * Initializes emoji picker
     */
    initEmojiPicker: function() {
        const emojiButton = document.getElementById('emoji-button');
        const emojiPickerContainer = document.getElementById('emoji-picker-container');
        const messageInput = document.getElementById('message-input');
        
        if (!emojiButton || !emojiPickerContainer || !messageInput) {
            console.error('Emoji picker elements not found');
            return;
        }
        
        // Create emoji picker if it doesn't exist
        if (!emojiPickerContainer.querySelector('em-emoji-picker')) {
            try {
                // Create the picker element
                const picker = document.createElement('em-emoji-picker');
                emojiPickerContainer.appendChild(picker);
                
                // Store reference to the picker
                this.emojiPicker = picker;
                
                // Handle emoji selection
                picker.addEventListener('emoji-click', event => {
                    const emoji = event.detail.unicode;
                    
                    // Insert emoji at cursor position
                    const cursorPos = messageInput.selectionStart;
                    const text = messageInput.value;
                    const newText = text.slice(0, cursorPos) + emoji + text.slice(cursorPos);
                    
                    messageInput.value = newText;
                    messageInput.focus();
                    messageInput.selectionStart = cursorPos + emoji.length;
                    messageInput.selectionEnd = cursorPos + emoji.length;
                    
                    // Trigger input event to resize textarea
                    const inputEvent = new Event('input', { bubbles: true });
                    messageInput.dispatchEvent(inputEvent);
                    
                    // Hide picker after selection
                    emojiPickerContainer.style.display = 'none';
                });
                
                console.log('Emoji picker initialized successfully');
            } catch (error) {
                console.error('Error initializing emoji picker:', error);
            }
        }
        
        // Toggle emoji picker on button click
        emojiButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event from bubbling up
            
            if (emojiPickerContainer.style.display === 'block') {
                emojiPickerContainer.style.display = 'none';
            } else {
                // Position the picker correctly
                const buttonRect = emojiButton.getBoundingClientRect();
                emojiPickerContainer.style.bottom = `${window.innerHeight - buttonRect.top + 10}px`;
                emojiPickerContainer.style.left = `${buttonRect.left}px`;
                
                emojiPickerContainer.style.display = 'block';
            }
        });
        
        // Close emoji picker when clicking outside
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
        const imagePreviewModal = document.getElementById('image-preview-modal');
        const imagePreview = document.getElementById('image-preview');
        const cancelImageBtn = document.getElementById('cancel-image');
        const sendImageBtn = document.getElementById('send-image');
        
        if (!fileButton || !fileInput || !imagePreviewModal || !imagePreview || !cancelImageBtn || !sendImageBtn) {
            console.error('File upload elements not found');
            return;
        }
        
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
    },
    
    /**
     * Initializes voice recording
     */
    initVoiceRecording: function() {
        const voiceButton = document.getElementById('voice-button');
        const voiceRecordingModal = document.getElementById('voice-recording-modal');
        const stopRecordingBtn = document.getElementById('stop-recording');
        const cancelRecordingBtn = document.getElementById('cancel-recording');
        const sendRecordingBtn = document.getElementById('send-recording');
        const recordingTime = document.querySelector('.recording-time');
        
        if (!voiceButton || !voiceRecordingModal || !stopRecordingBtn || !cancelRecordingBtn || !sendRecordingBtn || !recordingTime) {
            console.error('Voice recording elements not found');
            return;
        }
        
        let mediaRecorder = null;
        let audioChunks = [];
        let recordingInterval = null;
        let recordingStartTime = 0;
        
        // Start recording on button click
        voiceButton.addEventListener('click', async () => {
            try {
                // Request microphone access
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                
                // Create media recorder
                mediaRecorder = new MediaRecorder(stream);
                
                // Handle data available event
                mediaRecorder.addEventListener('dataavailable', (e) => {
                    audioChunks.push(e.data);
                });
                
                // Handle recording stop event
                mediaRecorder.addEventListener('stop', () => {
                    // Enable send button
                    sendRecordingBtn.disabled = false;
                    
                    // Stop recording timer
                    clearInterval(recordingInterval);
                });
                
                // Start recording
                audioChunks = [];
                mediaRecorder.start();
                
                // Show recording modal
                voiceRecordingModal.style.display = 'flex';
                
                // Start recording timer
                recordingStartTime = Date.now();
                recordingInterval = setInterval(() => {
                    const elapsedTime = Math.floor((Date.now() - recordingStartTime) / 1000);
                    const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, '0');
                    const seconds = (elapsedTime % 60).toString().padStart(2, '0');
                    recordingTime.textContent = `${minutes}:${seconds}`;
                    
                    // Limit recording to 2 minutes
                    if (elapsedTime >= 120) {
                        stopRecordingBtn.click();
                    }
                }, 1000);
            } catch (error) {
                console.error('Error starting voice recording:', error);
                Utils.showModal('alert-modal', {
                    title: 'Không thể ghi âm',
                    message: 'Không thể truy cập microphone. Vui lòng kiểm tra quyền truy cập.'
                });
            }
        });
        
        // Stop recording
        stopRecordingBtn.addEventListener('click', () => {
            if (mediaRecorder && mediaRecorder.state === 'recording') {
                mediaRecorder.stop();
                
                // Stop all tracks
                mediaRecorder.stream.getTracks().forEach(track => track.stop());
            }
        });
        
        // Cancel recording
        cancelRecordingBtn.addEventListener('click', () => {
            // Stop recording if active
            if (mediaRecorder && mediaRecorder.state === 'recording') {
                mediaRecorder.stop();
                
                // Stop all tracks
                mediaRecorder.stream.getTracks().forEach(track => track.stop());
            }
            
            // Clear recording timer
            clearInterval(recordingInterval);
            
            // Hide modal
            voiceRecordingModal.style.display = 'none';
            
            // Reset recording time
            recordingTime.textContent = '00:00';
            
            // Disable send button
            sendRecordingBtn.disabled = true;
        });
        
        // Send recording
        sendRecordingBtn.addEventListener('click', () => {
            if (audioChunks.length > 0) {
                // Create audio blob
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                
                // Convert to base64
                const reader = new FileReader();
                reader.onload = (e) => {
                    const audioData = e.target.result;
                    
                    // Send audio message
                    this.sendAudio(audioData);
                    
                    // Hide modal
                    voiceRecordingModal.style.display = 'none';
                    
                    // Reset recording time
                    recordingTime.textContent = '00:00';
                    
                    // Disable send button
                    sendRecordingBtn.disabled = true;
                };
                reader.readAsDataURL(audioBlob);
            }
        });
    },
    
    /**
     * Initializes image view modal
     */
    initImageViewModal: function() {
        const imageViewModal = document.getElementById('image-view-modal');
        const closeImageViewBtn = document.getElementById('close-image-view');
        
        if (!imageViewModal || !closeImageViewBtn) {
            console.error('Image view modal elements not found');
            return;
        }
        
        // Close image view
        closeImageViewBtn.addEventListener('click', () => {
            imageViewModal.style.display = 'none';
        });
        
        // Close on click outside image
        imageViewModal.addEventListener('click', (e) => {
            if (e.target === imageViewModal) {
                imageViewModal.style.display = 'none';
            }
        });
    },
    
    /**
     * Renders chat history
     */
    renderChatHistory: function() {
        const chatMessages = document.getElementById('chat-messages');
        
        if (!chatMessages) return;
        
        // Clear chat container
        chatMessages.innerHTML = '';
        
        // Render each message
        this.history.forEach(message => {
            this.renderMessage(message);
        });
        
        // Scroll to bottom
        this.scrollToBottom();
    },
    
    /**
     * Adds a message to the chat
     * @param {string} sender - Message sender ('user', 'companion', or 'system')
     * @param {string} content - Message content
     * @param {string} type - Message type ('text', 'image', 'audio', or 'system')
     */
    addMessage: function(sender, content, type = 'text') {
        // Create message object
        const message = {
            id: Utils.generateId(),
            sender: sender,
            content: content,
            type: type,
            timestamp: new Date().toISOString()
        };
        
        // Add to history
        this.history.push(message);
        
        // Save to storage
        Storage.save(CONFIG.CHAT.STORAGE_KEY, this.history);
        
        // Render message
        this.renderMessage(message);
        
        // Scroll to bottom
        this.scrollToBottom();
    },
    
    /**
     * Adds a companion message directly
     * @param {string} content - Message content
     * @param {string} type - Message type ('text', 'image', or 'audio')
     */
    addCompanionMessage: function(content, type = 'text') {
        this.addMessage('companion', content, type);
    },
    
    /**
     * Renders a message in the chat
     * @param {Object} message - Message object
     */
    renderMessage: function(message) {
        const chatMessages = document.getElementById('chat-messages');
        
        if (!chatMessages) return;
        
        // Format timestamp
        const timestamp = new Date(message.timestamp);
        const formattedTime = `${timestamp.getHours().toString().padStart(2, '0')}:${timestamp.getMinutes().toString().padStart(2, '0')}, ${timestamp.getDate().toString().padStart(2, '0')}/${(timestamp.getMonth() + 1).toString().padStart(2, '0')}/${timestamp.getFullYear()}`;
        
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.dataset.id = message.id;
        
        // Create message wrapper
        const messageWrapper = document.createElement('div');
        messageWrapper.classList.add('message-wrapper');
        
        if (message.sender === 'user') {
            messageWrapper.classList.add('user-message');
        } else if (message.sender === 'companion') {
            messageWrapper.classList.add('companion-message');
            
            // Add avatar for companion messages
            if (Character.current) {
                const avatarElement = document.createElement('div');
                avatarElement.classList.add('message-avatar');
                
                const avatarImg = document.createElement('img');
                avatarImg.src = Character.current.avatar || 'img/default-avatar.png';
                avatarImg.alt = 'Avatar';
                
                avatarElement.appendChild(avatarImg);
                messageWrapper.appendChild(avatarElement);
            }
        } else if (message.sender === 'system') {
            messageWrapper.classList.add('system-message');
        }
        
        // Create message bubble
        const messageBubble = document.createElement('div');
        messageBubble.classList.add('message-bubble');
        
        // Handle different message types
        if (message.type === 'text') {
            const messageContent = document.createElement('div');
            messageContent.classList.add('message-content');
            messageContent.innerHTML = this.formatMessageContent(message.content);
            
            const messageTime = document.createElement('span');
            messageTime.classList.add('message-time');
            messageTime.textContent = formattedTime;
            
            messageBubble.appendChild(messageContent);
            messageBubble.appendChild(messageTime);
        } else if (message.type === 'image') {
            const messageContent = document.createElement('div');
            messageContent.classList.add('message-content');
            
            const imageElement = document.createElement('img');
            imageElement.src = message.content;
            imageElement.alt = 'Hình ảnh';
            imageElement.classList.add('message-image');
            
            // Add click event to open image in full size
            imageElement.addEventListener('click', () => {
                const imageViewModal = document.getElementById('image-view-modal');
                const imageView = document.getElementById('image-view');
                
                if (imageViewModal && imageView) {
                    imageView.src = message.content;
                    imageViewModal.style.display = 'flex';
                }
            });
            
            messageContent.appendChild(imageElement);
            
            const messageTime = document.createElement('span');
            messageTime.classList.add('message-time');
            messageTime.textContent = formattedTime;
            
            messageBubble.appendChild(messageContent);
            messageBubble.appendChild(messageTime);
        } else if (message.type === 'audio') {
            const messageContent = document.createElement('div');
            messageContent.classList.add('message-content');
            
            const audioElement = document.createElement('audio');
            audioElement.src = message.content;
            audioElement.controls = true;
            audioElement.classList.add('message-audio');
            
            messageContent.appendChild(audioElement);
            
            const messageTime = document.createElement('span');
            messageTime.classList.add('message-time');
            messageTime.textContent = formattedTime;
            
            messageBubble.appendChild(messageContent);
            messageBubble.appendChild(messageTime);
        } else if (message.type === 'system') {
            messageBubble.textContent = message.content;
        }
        
        // Add message bubble to wrapper
        messageWrapper.appendChild(messageBubble);
        
        // Add wrapper to message element
        messageElement.appendChild(messageWrapper);
        
        // Add to chat container
        chatMessages.appendChild(messageElement);
    },
    
    /**
     * Formats message content with links and emojis
     * @param {string} content - Message content
     * @returns {string} Formatted content
     */
    formatMessageContent: function(content) {
        if (!content) return '';
        
        // Escape HTML
        let formattedContent = Utils.escapeHtml(content);
        
        // Convert URLs to links
        formattedContent = formattedContent.replace(
            /(https?:\/\/[^\s]+)/g, 
            '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
        );
        
        // Convert emoji shortcodes to actual emojis
        formattedContent = formattedContent.replace(
            /:([\w+-]+):/g, 
            (match, code) => {
                return `<span class="emoji">${match}</span>`;
            }
        );
        
        return formattedContent;
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
                    message: 'Vui lòng thêm API Key trong phần Cài đặt để sử dụng chức năng chat.'
                });
                return;
            }
            
            // Get API type
            const apiType = Storage.load(CONFIG.API.STORAGE_KEYS.API_TYPE) || 'openai';
            
            // Generate prompt for AI
            const prompt = Character.generatePrompt(message, this.history.slice(-10));
            
            // Random delay to simulate typing
            const typingDelay = Utils.getRandomNumber(
                CONFIG.CHAT.TYPING_DELAY_MIN, 
                CONFIG.CHAT.TYPING_DELAY_MAX
            );
            
            // Wait for typing delay
            await new Promise(resolve => setTimeout(resolve, typingDelay));
            
            // Call appropriate API based on type
            let response;
            switch (apiType) {
                case 'gemini':
                    response = await this.callGeminiAPI(apiKey, prompt);
                    break;
                case 'character':
                    response = await this.callCharacterAPI(apiKey, prompt);
                    break;
                case 'openai':
                default:
                    response = await this.callOpenAIAPI(apiKey, prompt);
                    break;
            }
            
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
                Character.updateMood(response);
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
                    message: 'Vui lòng thêm API Key trong phần Cài đặt để sử dụng chức năng chat.'
                });
                return;
            }
            
            // Get API type
            const apiType = Storage.load(CONFIG.API.STORAGE_KEYS.API_TYPE) || 'openai';
            
            // Generate prompt for AI
            const prompt = Character.generatePrompt("Tôi đã gửi cho bạn một hình ảnh. Hãy phản hồi về hình ảnh này theo tính cách của bạn.", this.history.slice(-10));
            
            // Random delay to simulate typing
            const typingDelay = Utils.getRandomNumber(
                CONFIG.CHAT.TYPING_DELAY_MIN, 
                CONFIG.CHAT.TYPING_DELAY_MAX
            );
            
            // Wait for typing delay
            await new Promise(resolve => setTimeout(resolve, typingDelay));
            
            // Call appropriate API based on type
            let response;
            switch (apiType) {
                case 'gemini':
                    response = await this.callGeminiAPI(apiKey, prompt);
                    break;
                case 'character':
                    response = await this.callCharacterAPI(apiKey, prompt);
                    break;
                case 'openai':
                default:
                    response = await this.callOpenAIAPI(apiKey, prompt);
                    break;
            }
            
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
                Character.updateMood(response);
            }
        } catch (error) {
            console.error('Error generating response:', error);
            this.hideTypingIndicator();
            
            // Add error message
            this.addMessage('system', 'Có lỗi xảy ra khi tạo phản hồi. Vui lòng thử lại sau.');
        }
    },
    
    /**
     * Sends an audio message to the chat
     * @param {string} audioData - Base64 encoded audio data
     */
    sendAudio: async function(audioData) {
        if (!Character.current) return;
        
        // Add audio message to history
        this.addMessage('user', audioData, 'audio');
        
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
                    message: 'Vui lòng thêm API Key trong phần Cài đặt để sử dụng chức năng chat.'
                });
                return;
            }
            
            // Get API type
            const apiType = Storage.load(CONFIG.API.STORAGE_KEYS.API_TYPE) || 'openai';
            
            // Generate prompt for AI
            const prompt = Character.generatePrompt("Tôi đã gửi cho bạn một tin nhắn thoại. Hãy phản hồi theo tính cách của bạn.", this.history.slice(-10));
            
            // Random delay to simulate typing
            const typingDelay = Utils.getRandomNumber(
                CONFIG.CHAT.TYPING_DELAY_MIN, 
                CONFIG.CHAT.TYPING_DELAY_MAX
            );
            
            // Wait for typing delay
            await new Promise(resolve => setTimeout(resolve, typingDelay));
            
            // Call appropriate API based on type
            let response;
            switch (apiType) {
                case 'gemini':
                    response = await this.callGeminiAPI(apiKey, prompt);
                    break;
                case 'character':
                    response = await this.callCharacterAPI(apiKey, prompt);
                    break;
                case 'openai':
                default:
                    response = await this.callOpenAIAPI(apiKey, prompt);
                    break;
            }
            
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
                Character.updateMood(response);
            }
        } catch (error) {
            console.error('Error generating response:', error);
            this.hideTypingIndicator();
            
            // Add error message
            this.addMessage('system', 'Có lỗi xảy ra khi tạo phản hồi. Vui lòng thử lại sau.');
        }
    },
    
    /**
     * Calls the OpenAI API to generate a response
     * @param {string} apiKey - OpenAI API key
     * @param {string} prompt - Prompt for the AI
     * @returns {string} AI response
     */
    callOpenAIAPI: async function(apiKey, prompt) {
        try {
            const response = await fetch(CONFIG.API.OPENAI_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: CONFIG.API.OPENAI_MODEL,
                    messages: [
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 1024
                })
            });
            
            const data = await response.json();
            
            if (data.error) {
                console.error('API error:', data.error);
                return null;
            }
            
            if (data.choices && data.choices[0] && data.choices[0].message) {
                return data.choices[0].message.content;
            }
            
            return null;
        } catch (error) {
            console.error('Error calling OpenAI API:', error);
            return null;
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
     * Calls the Character.AI API to generate a response
     * @param {string} apiKey - Character.AI API key
     * @param {string} prompt - Prompt for the AI
     * @returns {string} AI response
     */
    callCharacterAPI: async function(apiKey, prompt) {
        try {
            const response = await fetch(CONFIG.API.CHARACTER_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${apiKey}`
                },
                body: JSON.stringify({
                    character_id: CONFIG.API.CHARACTER_ID,
                    message: prompt
                })
            });
            
            const data = await response.json();
            
            if (data.error) {
                console.error('API error:', data.error);
                return null;
            }
            
            if (data.response) {
                return data.response;
            }
            
            return null;
        } catch (error) {
            console.error('Error calling Character.AI API:', error);
            return null;
        }
    },
    
    /**
     * Shows typing indicator
     */
    showTypingIndicator: function() {
        const chatMessages = document.getElementById('chat-messages');
        
        if (!chatMessages) return;
        
        // Remove existing typing indicator
        this.hideTypingIndicator();
        
        // Create typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.id = 'typing-indicator';
        typingIndicator.classList.add('typing-indicator');
        
        // Add avatar
        if (Character.current) {
            const avatarElement = document.createElement('div');
            avatarElement.classList.add('message-avatar');
            
            const avatarImg = document.createElement('img');
            avatarImg.src = Character.current.avatar || 'img/default-avatar.png';
            avatarImg.alt = 'Avatar';
            
            avatarElement.appendChild(avatarImg);
            typingIndicator.appendChild(avatarElement);
        }
        
        // Add dots
        const dots = document.createElement('div');
        dots.classList.add('dots');
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            dots.appendChild(dot);
        }
        
        typingIndicator.appendChild(dots);
        
        // Add to chat container
        chatMessages.appendChild(typingIndicator);
        
        // Scroll to bottom
        this.scrollToBottom();
    },
    
    /**
     * Hides typing indicator
     */
    hideTypingIndicator: function() {
        const typingIndicator = document.getElementById('typing-indicator');
        
        if (typingIndicator) {
            typingIndicator.remove();
        }
    },
    
    /**
     * Scrolls chat to bottom
     */
    scrollToBottom: function() {
        const chatMessages = document.getElementById('chat-messages');
        
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    },
    
    /**
     * Checks for intimacy keywords in message
     * @param {string} message - User message
     */
    checkIntimacyKeywords: function(message) {
        if (!Character.current) return;
        
        const lowerMessage = message.toLowerCase();
        
        // Check for intimacy keywords
        for (const keyword of CONFIG.CHAT.INTIMACY_KEYWORDS) {
            if (lowerMessage.includes(keyword.toLowerCase())) {
                Character.updateIntimacy(CONFIG.CHAT.POINTS_PER_KEYWORD);
                break;
            }
        }
    },
    
    /**
     * Checks for special moments in conversation
     * @param {string} userMessage - User message
     * @param {string} aiResponse - AI response
     */
    checkSpecialMoments: function(userMessage, aiResponse) {
        if (!Character.current) return;
        
        // Check for diary-worthy moments
        const specialMoments = [
            { keyword: 'yêu', points: 5 },
            { keyword: 'nhớ', points: 3 },
            { keyword: 'thích', points: 2 },
            { keyword: 'ghét', points: -2 },
            { keyword: 'buồn', points: -1 }
        ];
        
        const lowerUserMessage = userMessage.toLowerCase();
        const lowerAiResponse = aiResponse.toLowerCase();
        
        for (const moment of specialMoments) {
            if (lowerUserMessage.includes(moment.keyword) || lowerAiResponse.includes(moment.keyword)) {
                // Update intimacy
                Character.updateIntimacy(moment.points);
                
                // Add to diary if positive moment
                if (moment.points > 0) {
                    Diary.addEntry({
                        type: 'special_moment',
                        title: `Khoảnh khắc đặc biệt với ${Character.current.name}`,
                        content: `${userMessage}\n\n${aiResponse}`,
                        timestamp: new Date().toISOString()
                    });
                }
                
                break;
            }
        }
    }
};
