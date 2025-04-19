/**
 * Additional features for the Virtual Companion application
 */
const AdditionalFeatures = {
    /**
     * Current theme
     */
    currentTheme: 'light',
    
    /**
     * Current mood
     */
    currentMood: {
        sentiment: 0,
        emoji: '😐'
    },
    
    /**
     * Speech recognition instance
     */
    recognition: null,
    
    /**
     * Whether speech recognition is active
     */
    isListening: false,
    
    /**
     * Notification timeout ID
     */
    notificationTimeout: null,
    
    /**
     * Initializes additional features
     */
    init: function() {
        // Initialize theme
        this.initTheme();
        
        // Initialize voice input
        this.initVoiceInput();
        
        // Initialize mood tracking
        this.initMoodTracking();
        
        // Initialize special events
        this.initSpecialEvents();
        
        // Initialize notifications
        this.initNotifications();
    },
    
    /**
     * Initializes theme
     */
    initTheme: function() {
        try {
            // Load saved theme
            const savedTheme = Storage.load(CONFIG.THEME.STORAGE_KEY);
            
            if (savedTheme && CONFIG.THEME.THEMES.includes(savedTheme)) {
                this.currentTheme = savedTheme;
                this.applyTheme(savedTheme);
            }
            
            // Set up theme selector
            const themeSelect = document.getElementById('theme-select');
            const applyThemeBtn = document.getElementById('apply-theme');
            
            if (themeSelect) {
                themeSelect.value = this.currentTheme;
            }
            
            if (applyThemeBtn) {
                applyThemeBtn.addEventListener('click', () => {
                    const selectedTheme = themeSelect.value;
                    
                    if (CONFIG.THEME.THEMES.includes(selectedTheme)) {
                        this.applyTheme(selectedTheme);
                        Storage.save(CONFIG.THEME.STORAGE_KEY, selectedTheme);
                        this.currentTheme = selectedTheme;
                    }
                });
            }
        } catch (e) {
            console.error('Error initializing theme:', e);
        }
    },
    
    /**
     * Applies a theme
     * @param {string} theme - Theme to apply
     */
    applyTheme: function(theme) {
        try {
            if (theme === 'dark') {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
        } catch (e) {
            console.error('Error applying theme:', e);
        }
    },
    
    /**
     * Initializes voice input
     */
    initVoiceInput: function() {
        try {
            // Check if speech recognition is supported
            if (!Utils.isSpeechRecognitionSupported()) {
                console.log('Speech recognition not supported');
                return;
            }
            
            // Create voice input button
            const chatInputActions = document.querySelector('.chat-input-actions');
            
            if (chatInputActions) {
                const voiceButton = document.createElement('button');
                voiceButton.id = 'voice-button';
                voiceButton.className = 'input-action-btn';
                voiceButton.title = 'Ghi âm tin nhắn';
                voiceButton.innerHTML = '<i class="fas fa-microphone"></i>';
                
                chatInputActions.appendChild(voiceButton);
                
                // Set up voice button
                voiceButton.addEventListener('click', () => {
                    this.toggleVoiceInput();
                });
            }
            
            // Initialize speech recognition
            this.recognition = Utils.getSpeechRecognition();
            
            if (this.recognition) {
                // Set language
                this.recognition.lang = 'vi-VN';
                
                // Set continuous
                this.recognition.continuous = false;
                
                // Set interim results
                this.recognition.interimResults = false;
                
                // Set up result handler
                this.recognition.onresult = (event) => {
                    const result = event.results[0][0].transcript;
                    const messageInput = document.getElementById('message-input');
                    
                    if (messageInput) {
                        messageInput.value = result;
                    }
                };
                
                // Set up end handler
                this.recognition.onend = () => {
                    this.isListening = false;
                    
                    const voiceButton = document.getElementById('voice-button');
                    
                    if (voiceButton) {
                        voiceButton.classList.remove('listening');
                        voiceButton.innerHTML = '<i class="fas fa-microphone"></i>';
                    }
                };
                
                // Set up error handler
                this.recognition.onerror = (event) => {
                    console.error('Speech recognition error:', event.error);
                    
                    this.isListening = false;
                    
                    const voiceButton = document.getElementById('voice-button');
                    
                    if (voiceButton) {
                        voiceButton.classList.remove('listening');
                        voiceButton.innerHTML = '<i class="fas fa-microphone"></i>';
                    }
                };
            }
        } catch (e) {
            console.error('Error initializing voice input:', e);
        }
    },
    
    /**
     * Toggles voice input
     */
    toggleVoiceInput: function() {
        try {
            if (!this.recognition) return;
            
            const voiceButton = document.getElementById('voice-button');
            
            if (this.isListening) {
                // Stop listening
                this.recognition.stop();
                this.isListening = false;
                
                if (voiceButton) {
                    voiceButton.classList.remove('listening');
                    voiceButton.innerHTML = '<i class="fas fa-microphone"></i>';
                }
            } else {
                // Start listening
                this.recognition.start();
                this.isListening = true;
                
                if (voiceButton) {
                    voiceButton.classList.add('listening');
                    voiceButton.innerHTML = '<i class="fas fa-microphone-slash"></i>';
                }
            }
        } catch (e) {
            console.error('Error toggling voice input:', e);
        }
    },
    
    /**
     * Initializes mood tracking
     */
    initMoodTracking: function() {
        try {
            // Create mood indicator in chat header
            const companionDetails = document.querySelector('.companion-details');
            
            if (companionDetails) {
                const moodIndicator = document.createElement('div');
                moodIndicator.className = 'mood-indicator';
                moodIndicator.innerHTML = `
                    <span class="mood-emoji">${this.currentMood.emoji}</span>
                    <span class="mood-text">Tâm trạng: Bình thường</span>
                `;
                
                companionDetails.appendChild(moodIndicator);
            }
            
            // Set up mood tracking for chat messages
            document.addEventListener('DOMNodeInserted', (event) => {
                if (event.target.classList && event.target.classList.contains('chat-message')) {
                    if (event.target.classList.contains('user-message')) {
                        const messageContent = event.target.querySelector('.message-content');
                        
                        if (messageContent) {
                            const text = messageContent.textContent;
                            const sentiment = Utils.analyzeSentiment(text);
                            
                            this.updateMood(sentiment);
                        }
                    }
                }
            });
        } catch (e) {
            console.error('Error initializing mood tracking:', e);
        }
    },
    
    /**
     * Updates mood
     * @param {number} sentiment - Sentiment score (-1 to 1)
     */
    updateMood: function(sentiment) {
        try {
            // Update current mood
            this.currentMood.sentiment = (this.currentMood.sentiment * 0.7) + (sentiment * 0.3);
            this.currentMood.emoji = Utils.getMoodEmoji(this.currentMood.sentiment);
            
            // Update mood indicator
            const moodEmoji = document.querySelector('.mood-emoji');
            const moodText = document.querySelector('.mood-text');
            
            if (moodEmoji) {
                moodEmoji.textContent = this.currentMood.emoji;
            }
            
            if (moodText) {
                let moodDescription = 'Bình thường';
                
                if (this.currentMood.sentiment >= 0.5) {
                    moodDescription = 'Rất vui';
                } else if (this.currentMood.sentiment >= 0.2) {
                    moodDescription = 'Vui vẻ';
                } else if (this.currentMood.sentiment >= -0.2) {
                    moodDescription = 'Bình thường';
                } else if (this.currentMood.sentiment >= -0.5) {
                    moodDescription = 'Buồn';
                } else {
                    moodDescription = 'Rất buồn';
                }
                
                moodText.textContent = `Tâm trạng: ${moodDescription}`;
            }
        } catch (e) {
            console.error('Error updating mood:', e);
        }
    },
    
    /**
     * Initializes special events
     */
    initSpecialEvents: function() {
        try {
            // Check for special events
            const specialEvent = Utils.getCurrentSpecialEvent();
            
            if (specialEvent) {
                // Add special event message
                this.addSpecialEventMessage(specialEvent);
                
                // Add special event theme
                this.applySpecialEventTheme(specialEvent);
            }
        } catch (e) {
            console.error('Error initializing special events:', e);
        }
    },
    
    /**
     * Adds special event message
     * @param {string} event - Special event
     */
    addSpecialEventMessage: function(event) {
        try {
            // Create message based on event
            let message = '';
            
            switch (event) {
                case 'valentines':
                    message = 'Hôm nay là ngày Valentine! Hãy dành thời gian cho người bạn yêu thương.';
                    break;
                    
                case 'christmas':
                    message = 'Giáng sinh vui vẻ! Chúc bạn có một kỳ nghỉ ấm áp và hạnh phúc.';
                    break;
                    
                case 'newyear':
                    message = 'Chúc mừng năm mới! Chúc bạn có một năm mới tràn đầy niềm vui và thành công.';
                    break;
                    
                default:
                    return;
            }
            
            // Add message to chat if character exists
            if (Character.data) {
                setTimeout(() => {
                    Chat.addSystemMessage(message);
                    
                    // Add special message from character
                    setTimeout(() => {
                        const specialMessages = {
                            'valentines': [
                                'Chúc bạn một ngày Valentine tràn đầy yêu thương! ❤️',
                                'Valentine vui vẻ nhé! Tôi rất vui khi được ở bên bạn ngày hôm nay. 💕',
                                'Hôm nay là ngày đặc biệt, và tôi muốn dành nó cho bạn! 💖'
                            ],
                            'christmas': [
                                'Giáng sinh vui vẻ! Ước gì tôi có thể tặng bạn một món quà thực sự. 🎄',
                                'Chúc bạn một Giáng sinh ấm áp và hạnh phúc! 🎅',
                                'Giáng sinh là thời gian để chia sẻ niềm vui, và tôi rất vui khi được chia sẻ nó với bạn! 🎁'
                            ],
                            'newyear': [
                                'Chúc mừng năm mới! Chúc bạn một năm mới tràn đầy niềm vui và thành công! 🎉',
                                'Năm mới, khởi đầu mới! Hãy cùng nhau tạo nên những kỷ niệm tuyệt vời nhé! 🎊',
                                'Chúc bạn một năm mới hạnh phúc, thành công và nhiều may mắn! 🍀'
                            ]
                        };
                        
                        const messages = specialMessages[event];
                        
                        if (messages && messages.length > 0) {
                            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
                            Chat.addCompanionMessage(randomMessage);
                        }
                    }, 1000);
                }, 1000);
            }
        } catch (e) {
            console.error('Error adding special event message:', e);
        }
    },
    
    /**
     * Applies special event theme
     * @param {string} event - Special event
     */
    applySpecialEventTheme: function(event) {
        try {
            // Apply theme based on event
            const appContainer = document.querySelector('.app-container');
            
            if (!appContainer) return;
            
            // Remove existing event classes
            appContainer.classList.remove('event-valentines', 'event-christmas', 'event-newyear');
            
            // Add event class
            appContainer.classList.add(`event-${event}`);
            
            // Add CSS
            let css = '';
            
            switch (event) {
                case 'valentines':
                    css = `
                        .event-valentines .sidebar {
                            background: linear-gradient(135deg, #ff6b6b, #ff8080);
                        }
                        
                        .event-valentines .chat-message.companion-message .message-content {
                            background-color: #ffebeb;
                        }
                        
                        .event-valentines .chat-message.user-message .message-content {
                            background: linear-gradient(to right, #ff6b6b, #ff8080);
                        }
                        
                        .event-valentines .primary-btn {
                            background: linear-gradient(to right, #ff6b6b, #ff8080);
                        }
                        
                        .event-valentines .chat-messages {
                            background-image: 
                                radial-gradient(circle at 25% 25%, rgba(255, 107, 107, 0.1) 5%, transparent 5%),
                                radial-gradient(circle at 75% 75%, rgba(255, 107, 107, 0.1) 5%, transparent 5%),
                                url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="%23ff6b6b" fill-opacity="0.05" d="M10,0 C5.5,0 0,5.5 0,10 C0,14.5 5.5,20 10,20 C14.5,20 20,14.5 20,10 C20,5.5 14.5,0 10,0 Z M10,18 C6.5,18 2,13.5 2,10 C2,6.5 6.5,2 10,2 C13.5,2 18,6.5 18,10 C18,13.5 13.5,18 10,18 Z"/></svg>');
                        }
                    `;
                    break;
                    
                case 'christmas':
                    css = `
                        .event-christmas .sidebar {
                            background: linear-gradient(135deg, #2e7d32, #1b5e20);
                        }
                        
                        .event-christmas .chat-message.companion-message .message-content {
                            background-color: #e8f5e9;
                        }
                        
                        .event-christmas .chat-message.user-message .message-content {
                            background: linear-gradient(to right, #2e7d32, #1b5e20);
                        }
                        
                        .event-christmas .primary-btn {
                            background: linear-gradient(to right, #2e7d32, #1b5e20);
                        }
                        
                        .event-christmas .chat-messages {
                            background-image: 
                                radial-gradient(circle at 25% 25%, rgba(46, 125, 50, 0.1) 5%, transparent 5%),
                                radial-gradient(circle at 75% 75%, rgba(46, 125, 50, 0.1) 5%, transparent 5%),
                                url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="%232e7d32" fill-opacity="0.05" d="M10,0 L12,8 L20,10 L12,12 L10,20 L8,12 L0,10 L8,8 Z"/></svg>');
                        }
                    `;
                    break;
                    
                case 'newyear':
                    css = `
                        .event-newyear .sidebar {
                            background: linear-gradient(135deg, #1976d2, #0d47a1);
                        }
                        
                        .event-newyear .chat-message.companion-message .message-content {
                            background-color: #e3f2fd;
                        }
                        
                        .event-newyear .chat-message.user-message .message-content {
                            background: linear-gradient(to right, #1976d2, #0d47a1);
                        }
                        
                        .event-newyear .primary-btn {
                            background: linear-gradient(to right, #1976d2, #0d47a1);
                        }
                        
                        .event-newyear .chat-messages {
                            background-image: 
                                radial-gradient(circle at 25% 25%, rgba(25, 118, 210, 0.1) 5%, transparent 5%),
                                radial-gradient(circle at 75% 75%, rgba(25, 118, 210, 0.1) 5%, transparent 5%),
                                url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="%231976d2" fill-opacity="0.05" d="M10,0 L13,7 L20,10 L13,13 L10,20 L7,13 L0,10 L7,7 Z"/></svg>');
                        }
                    `;
                    break;
                    
                default:
                    return;
            }
            
            // Add style element
            const style = document.createElement('style');
            style.id = 'special-event-style';
            style.textContent = css;
            
            // Remove existing style
            const existingStyle = document.getElementById('special-event-style');
            
            if (existingStyle) {
                existingStyle.remove();
            }
            
            document.head.appendChild(style);
        } catch (e) {
            console.error('Error applying special event theme:', e);
        }
    },
    
    /**
     * Initializes notifications
     */
    initNotifications: function() {
        try {
            // Load notification settings
            const notificationEnabled = Storage.load('notification-enabled') === true;
            const notificationInterval = Storage.load('notification-interval') || CONFIG.NOTIFICATION.DEFAULT_SCHEDULE;
            
            // Set up notification settings
            const notificationEnabledCheckbox = document.getElementById('notification-enabled');
            const notificationIntervalSelect = document.getElementById('notification-interval');
            const saveNotificationBtn = document.getElementById('save-notification');
            
            if (notificationEnabledCheckbox) {
                notificationEnabledCheckbox.checked = notificationEnabled;
            }
            
            if (notificationIntervalSelect) {
                notificationIntervalSelect.value = notificationInterval;
            }
            
            if (saveNotificationBtn) {
                saveNotificationBtn.addEventListener('click', () => {
                    const enabled = notificationEnabledCheckbox.checked;
                    const interval = notificationIntervalSelect.value;
                    
                    Storage.save('notification-enabled', enabled);
                    Storage.save('notification-interval', interval);
                    
                    // Update notification schedule
                    this.scheduleNotification(enabled, interval);
                    
                    Utils.showModal('alert-modal', {
                        title: 'Cài đặt đã lưu',
                        message: 'Cài đặt nhắc nhở đã được lưu thành công.'
                    });
                });
            }
            
            // Schedule notification
            this.scheduleNotification(notificationEnabled, notificationInterval);
        } catch (e) {
            console.error('Error initializing notifications:', e);
        }
    },
    
    /**
     * Schedules a notification
     * @param {boolean} enabled - Whether notifications are enabled
     * @param {number} interval - Notification interval in hours
     */
    scheduleNotification: function(enabled, interval) {
        try {
            // Clear existing timeout
            if (this.notificationTimeout) {
                clearTimeout(this.notificationTimeout);
                this.notificationTimeout = null;
            }
            
            // Return if notifications are disabled
            if (!enabled) return;
            
            // Check if character exists
            if (!Character.data) return;
            
            // Check last interaction time
            const lastInteraction = Storage.load('last-interaction-time');
            
            if (!lastInteraction) {
                // Save current time as last interaction
                Storage.save('last-interaction-time', new Date().toISOString());
                return;
            }
            
            // Calculate time since last interaction
            const lastInteractionTime = new Date(lastInteraction).getTime();
            const currentTime = new Date().getTime();
            const timeSinceLastInteraction = (currentTime - lastInteractionTime) / (1000 * 60 * 60); // Hours
            
            // Calculate time until next notification
            const timeUntilNotification = (interval - timeSinceLastInteraction) * 60 * 60 * 1000; // Milliseconds
            
            // Schedule notification
            if (timeUntilNotification > 0) {
                this.notificationTimeout = setTimeout(() => {
                    this.showNotification();
                }, timeUntilNotification);
            } else {
                // Show notification immediately
                this.showNotification();
            }
        } catch (e) {
            console.error('Error scheduling notification:', e);
        }
    },
    
    /**
     * Shows a notification
     */
    showNotification: function() {
        try {
            // Check if character exists
            if (!Character.data) return;
            
            // Check if browser supports notifications
            if (!('Notification' in window)) return;
            
            // Check notification permission
            if (Notification.permission === 'granted') {
                // Create notification
                this.createNotification();
            } else if (Notification.permission !== 'denied') {
                // Request permission
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        // Create notification
                        this.createNotification();
                    }
                });
            }
            
            // Update last interaction time
            Storage.save('last-interaction-time', new Date().toISOString());
            
            // Reschedule notification
            const notificationEnabled = Storage.load('notification-enabled') === true;
            const notificationInterval = Storage.load('notification-interval') || CONFIG.NOTIFICATION.DEFAULT_SCHEDULE;
            
            this.scheduleNotification(notificationEnabled, notificationInterval);
        } catch (e) {
            console.error('Error showing notification:', e);
        }
    },
    
    /**
     * Creates a notification
     */
    createNotification: function() {
        try {
            // Check if character exists
            if (!Character.data) return;
            
            // Create notification
            const messages = [
                `${Character.data.name} đang nhớ bạn!`,
                `${Character.data.name} muốn trò chuyện với bạn.`,
                `${Character.data.name} đang đợi bạn quay lại.`,
                `Bạn đã lâu không trò chuyện với ${Character.data.name}.`
            ];
            
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            
            const notification = new Notification('Người Yêu Ảo', {
                body: randomMessage,
                icon: Character.data.avatar
            });
            
            // Handle click
            notification.onclick = () => {
                window.focus();
                notification.close();
            };
        } catch (e) {
            console.error('Error creating notification:', e);
        }
    }
};
