/**
 * Additional features for the Virtual Companion application
 */
const AdditionalFeatures = {
    /**
     * Initializes additional features
     */
    init: function() {
        // Initialize avatar animations
        Avatar.init();
        
        // Add avatar emotion update to chat
        this.enhanceChatWithEmotions();
        
        // Initialize voice input if available
        this.initVoiceInput();
        
        // Initialize typing effect
        this.initTypingEffect();
    },
    
    /**
     * Enhances chat with emotion detection and avatar updates
     */
    enhanceChatWithEmotions: function() {
        // Extend Chat.addMessage to update avatar emotion
        const originalAddMessage = Chat.addMessage;
        Chat.addMessage = function(sender, content) {
            // Call original method
            originalAddMessage.call(this, sender, content);
            
            // Update avatar emotion for companion messages
            if (sender === 'companion') {
                Avatar.setEmotionFromMessage(content);
            }
        };
    },
    
    /**
     * Initializes voice input functionality if browser supports it
     */
    initVoiceInput: function() {
        // Check if browser supports speech recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            // Add voice input button to chat
            const chatInput = document.querySelector('.chat-input');
            if (chatInput) {
                const voiceButton = document.createElement('button');
                voiceButton.id = 'voice-input-button';
                voiceButton.innerHTML = '<i class="fas fa-microphone"></i>';
                voiceButton.title = 'Nhấn để nói';
                
                // Insert before send button
                const sendButton = document.getElementById('send-button');
                chatInput.insertBefore(voiceButton, sendButton);
                
                // Add styles
                const styleElement = document.createElement('style');
                styleElement.textContent = `
                    #voice-input-button {
                        width: 44px;
                        height: 44px;
                        border-radius: 50%;
                        background-color: #4ecdc4;
                        color: white;
                        border: none;
                        margin-left: 10px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    
                    #voice-input-button:hover {
                        background-color: #3dbdb4;
                    }
                    
                    #voice-input-button.listening {
                        background-color: #ff6b6b;
                        animation: pulse-recording 1.5s infinite;
                    }
                    
                    @keyframes pulse-recording {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.1); }
                        100% { transform: scale(1); }
                    }
                `;
                document.head.appendChild(styleElement);
                
                // Initialize speech recognition
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                const recognition = new SpeechRecognition();
                recognition.lang = 'vi-VN';
                recognition.continuous = false;
                recognition.interimResults = false;
                
                // Handle results
                recognition.onresult = function(event) {
                    const transcript = event.results[0][0].transcript;
                    const messageInput = document.getElementById('message-input');
                    messageInput.value = transcript;
                    
                    // Focus input
                    messageInput.focus();
                };
                
                // Handle end of speech
                recognition.onend = function() {
                    voiceButton.classList.remove('listening');
                };
                
                // Handle errors
                recognition.onerror = function(event) {
                    console.error('Speech recognition error:', event.error);
                    voiceButton.classList.remove('listening');
                };
                
                // Add click event
                voiceButton.addEventListener('click', function() {
                    if (voiceButton.classList.contains('listening')) {
                        recognition.stop();
                        voiceButton.classList.remove('listening');
                    } else {
                        recognition.start();
                        voiceButton.classList.add('listening');
                    }
                });
            }
        }
    },
    
    /**
     * Initializes typing effect for companion messages
     */
    initTypingEffect: function() {
        // Extend Chat.addMessage to add typing effect for companion messages
        const originalRenderMessage = Chat.renderMessage;
        Chat.renderMessage = function(message) {
            // For companion messages, use typing effect
            if (message.sender === 'companion') {
                const chatMessages = document.getElementById('chat-messages');
                
                // Create message element
                const messageElement = document.createElement('div');
                messageElement.classList.add('message', message.sender);
                
                // Format timestamp
                const timestamp = new Date(message.timestamp);
                const formattedTime = Utils.formatDate(timestamp);
                
                // Set initial HTML with empty content
                messageElement.innerHTML = `
                    <div class="message-content"></div>
                    <span class="message-time">${formattedTime}</span>
                `;
                
                // Add to chat container
                chatMessages.appendChild(messageElement);
                
                // Get content element
                const contentElement = messageElement.querySelector('.message-content');
                
                // Format message content with links
                const formattedContent = Utils.linkify(Utils.escapeHtml(message.content));
                
                // Apply typing effect
                this.typeText(contentElement, formattedContent);
                
                // Scroll to bottom
                this.scrollToBottom();
            } else {
                // For other messages, use original method
                originalRenderMessage.call(this, message);
            }
        };
        
        // Add typeText method to Chat
        Chat.typeText = function(element, text, index = 0) {
            if (index < text.length) {
                // Handle HTML tags (for links)
                if (text.substring(index).startsWith('<a href=')) {
                    // Find the end of the tag
                    const endTagIndex = text.indexOf('</a>', index) + 4;
                    if (endTagIndex > index) {
                        // Add the entire tag at once
                        element.innerHTML += text.substring(index, endTagIndex);
                        index = endTagIndex;
                    }
                } else {
                    // Add one character
                    element.innerHTML += text.charAt(index);
                    index++;
                }
                
                // Random delay between characters
                const delay = Utils.getRandomNumber(20, 50);
                
                // Continue typing
                setTimeout(() => {
                    this.typeText(element, text, index);
                }, delay);
            }
        };
    }
};
