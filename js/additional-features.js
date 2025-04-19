/**
 * Additional features for the Virtual Companion application
 */
const AdditionalFeatures = {
    /**
     * Initializes additional features
     */
    init: function() {
        // Initialize dark mode
        this.initDarkMode();
        
        // Initialize voice messages
        this.initVoiceMessages();
        
        // Initialize special events
        this.initSpecialEvents();
        
        // Initialize daily reminders
        this.initDailyReminders();
        
        // Initialize mood tracker
        this.initMoodTracker();
        
        console.log('Additional features initialized');
    },
    
    /**
     * Initializes dark mode feature
     */
    initDarkMode: function() {
        // Add dark mode toggle to settings
        const settingsSection = document.querySelector('.settings-container');
        if (settingsSection) {
            // Create dark mode section
            const darkModeSection = document.createElement('div');
            darkModeSection.className = 'settings-section';
            darkModeSection.innerHTML = `
                <h3>Giao diện</h3>
                <div class="theme-toggle-container">
                    <span>Chế độ sáng</span>
                    <label class="theme-toggle">
                        <input type="checkbox" id="dark-mode-toggle">
                        <span class="slider round"></span>
                    </label>
                    <span>Chế độ tối</span>
                </div>
            `;
            
            // Insert after API section
            const apiSection = document.querySelector('.settings-section');
            if (apiSection) {
                apiSection.parentNode.insertBefore(darkModeSection, apiSection.nextSibling);
            } else {
                settingsSection.appendChild(darkModeSection);
            }
            
            // Add event listener to toggle
            const darkModeToggle = document.getElementById('dark-mode-toggle');
            if (darkModeToggle) {
                // Check if dark mode is enabled
                const isDarkMode = localStorage.getItem('dark_mode') === 'true';
                darkModeToggle.checked = isDarkMode;
                
                // Apply dark mode if enabled
                if (isDarkMode) {
                    document.body.classList.add('dark-mode');
                }
                
                // Add event listener
                darkModeToggle.addEventListener('change', () => {
                    if (darkModeToggle.checked) {
                        document.body.classList.add('dark-mode');
                        localStorage.setItem('dark_mode', 'true');
                    } else {
                        document.body.classList.remove('dark-mode');
                        localStorage.setItem('dark_mode', 'false');
                    }
                });
            }
        }
        
        // Add dark mode styles
        const style = document.createElement('style');
        style.textContent = `
            body.dark-mode {
                --bg-color: #121212;
                --card-bg: #1e1e1e;
                --text-color: #e0e0e0;
                --text-light: #aaaaaa;
                --text-lighter: #888888;
                --border-color: #333333;
            }
            
            body.dark-mode .chat-messages {
                background-color: #181818;
                background-image: 
                    radial-gradient(circle at 25% 25%, rgba(255, 107, 107, 0.05) 5%, transparent 5%),
                    radial-gradient(circle at 75% 75%, rgba(255, 107, 107, 0.05) 5%, transparent 5%);
            }
            
            body.dark-mode .message.companion .message-content {
                background-color: #2a2a2a;
                color: #e0e0e0;
            }
            
            body.dark-mode .welcome-message,
            body.dark-mode .chat-input,
            body.dark-mode .chat-header {
                background-color: #1e1e1e;
                color: #e0e0e0;
            }
            
            body.dark-mode .input-action-btn {
                background-color: #333333;
                color: #e0e0e0;
            }
            
            body.dark-mode .input-action-btn:hover {
                background-color: #444444;
            }
            
            body.dark-mode .chat-input textarea {
                background-color: #2a2a2a;
                color: #e0e0e0;
                border-color: #444444;
            }
            
            body.dark-mode .modal-content {
                background-color: #1e1e1e;
                color: #e0e0e0;
            }
            
            body.dark-mode .diary-entry,
            body.dark-mode .game-card,
            body.dark-mode .game-area,
            body.dark-mode .empty-diary,
            body.dark-mode .auth-status {
                background-color: #2a2a2a;
            }
            
            body.dark-mode ::-webkit-scrollbar-track {
                background: #2a2a2a;
            }
            
            body.dark-mode ::-webkit-scrollbar-thumb {
                background: #444444;
            }
            
            body.dark-mode ::-webkit-scrollbar-thumb:hover {
                background: #555555;
            }
            
            .theme-toggle-container {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                margin: 15px 0;
            }
            
            .theme-toggle {
                position: relative;
                display: inline-block;
                width: 60px;
                height: 30px;
            }
            
            .theme-toggle input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            
            .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                transition: .4s;
            }
            
            .slider:before {
                position: absolute;
                content: "";
                height: 22px;
                width: 22px;
                left: 4px;
                bottom: 4px;
                background-color: white;
                transition: .4s;
            }
            
            input:checked + .slider {
                background-color: var(--primary-color);
            }
            
            input:focus + .slider {
                box-shadow: 0 0 1px var(--primary-color);
            }
            
            input:checked + .slider:before {
                transform: translateX(30px);
            }
            
            .slider.round {
                border-radius: 34px;
            }
            
            .slider.round:before {
                border-radius: 50%;
            }
        `;
        document.head.appendChild(style);
    },
    
    /**
     * Initializes voice messages feature
     */
    initVoiceMessages: function() {
        // Add voice message button to chat input
        const chatInputActions = document.querySelector('.chat-input-actions');
        if (chatInputActions) {
            const voiceButton = document.createElement('button');
            voiceButton.id = 'voice-button';
            voiceButton.className = 'input-action-btn';
            voiceButton.title = 'Ghi âm tin nhắn';
            voiceButton.innerHTML = '<i class="fas fa-microphone"></i>';
            
            chatInputActions.appendChild(voiceButton);
            
            // Add voice recording functionality
            let mediaRecorder;
            let audioChunks = [];
            let isRecording = false;
            
            voiceButton.addEventListener('click', () => {
                if (!isRecording) {
                    // Start recording
                    navigator.mediaDevices.getUserMedia({ audio: true })
                        .then(stream => {
                            mediaRecorder = new MediaRecorder(stream);
                            
                            mediaRecorder.addEventListener('dataavailable', event => {
                                audioChunks.push(event.data);
                            });
                            
                            mediaRecorder.addEventListener('stop', () => {
                                const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
                                const audioUrl = URL.createObjectURL(audioBlob);
                                
                                // Add audio message to chat
                                this.sendVoiceMessage(audioUrl);
                                
                                // Reset
                                audioChunks = [];
                                isRecording = false;
                                voiceButton.innerHTML = '<i class="fas fa-microphone"></i>';
                                voiceButton.style.backgroundColor = '';
                            });
                            
                            mediaRecorder.start();
                            isRecording = true;
                            voiceButton.innerHTML = '<i class="fas fa-stop"></i>';
                            voiceButton.style.backgroundColor = 'var(--primary-color)';
                            voiceButton.style.color = 'white';
                            
                            // Show recording indicator
                            Utils.showModal('alert-modal', {
                                title: 'Đang ghi âm',
                                message: 'Đang ghi âm tin nhắn của bạn. Nhấn nút dừng để kết thúc.'
                            });
                        })
                        .catch(error => {
                            console.error('Error accessing microphone:', error);
                            Utils.showModal('alert-modal', {
                                title: 'Lỗi truy cập microphone',
                                message: 'Không thể truy cập microphone. Vui lòng kiểm tra quyền truy cập.'
                            });
                        });
                } else {
                    // Stop recording
                    mediaRecorder.stop();
                    mediaRecorder.stream.getTracks().forEach(track => track.stop());
                    Utils.hideModal('alert-modal');
                }
            });
        }
        
        // Add voice message styles
        const style = document.createElement('style');
        style.textContent = `
            .message-audio {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 5px;
            }
            
            .audio-play-btn {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background-color: var(--primary-color);
                color: white;
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: var(--transition);
            }
            
            .audio-play-btn:hover {
                transform: scale(1.1);
            }
            
            .audio-waveform {
                height: 30px;
                width: 100px;
                background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjMwIiB2aWV3Qm94PSIwIDAgMTAwIDMwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxwYXRoIGQ9Ik0wIDE1IEMgMTAgNSwgMjAgMjUsIDMwIDE1IEMgNDAgNSwgNTAgMjUsIDYwIDE1IEMgNzAgNSwgODAgMjUsIDkwIDE1IEMgMTAwIDUsIDExMCAyNSwgMTIwIDE1IiBzdHJva2U9InJnYmEoMjU1LCAxMDcsIDEwNywgMC41KSIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjwvc3ZnPg==');
                background-size: cover;
                background-repeat: no-repeat;
                opacity: 0.8;
            }
        `;
        document.head.appendChild(style);
    },
    
    /**
     * Sends a voice message
     * @param {string} audioUrl - URL of audio blob
     */
    sendVoiceMessage: function(audioUrl) {
        // Create audio element
        const audioElement = document.createElement('div');
        audioElement.className = 'message-audio';
        audioElement.innerHTML = `
            <button class="audio-play-btn"><i class="fas fa-play"></i></button>
            <div class="audio-waveform"></div>
            <audio src="${audioUrl}" style="display: none;"></audio>
        `;
        
        // Add play functionality
        const playButton = audioElement.querySelector('.audio-play-btn');
        const audio = audioElement.querySelector('audio');
        
        playButton.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                playButton.innerHTML = '<i class="fas fa-pause"></i>';
            } else {
                audio.pause();
                playButton.innerHTML = '<i class="fas fa-play"></i>';
            }
        });
        
        audio.addEventListener('ended', () => {
            playButton.innerHTML = '<i class="fas fa-play"></i>';
        });
        
        // Create message content
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.appendChild(audioElement);
        
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = 'message user';
        messageElement.appendChild(messageContent);
        
        // Add timestamp
        const timestamp = document.createElement('span');
        timestamp.className = 'message-time';
        timestamp.textContent = Utils.formatDate(new Date());
        messageElement.appendChild(timestamp);
        
        // Add to chat
        const chatMessages = document.getElementById('chat-messages');
        chatMessages.appendChild(messageElement);
        
        // Scroll to bottom
        Chat.scrollToBottom();
        
        // Generate AI response
        setTimeout(() => {
            Chat.sendMessage('Tôi đã nhận được tin nhắn thoại của bạn.');
        }, 1000);
    },
    
    /**
     * Initializes special events feature
     */
    initSpecialEvents: function() {
        // Check for special dates
        const checkSpecialDates = () => {
            if (!Character.current) return;
            
            const now = new Date();
            const today = `${now.getMonth() + 1}-${now.getDate()}`;
            
            // Special dates
            const specialDates = {
                '2-14': 'Valentine',
                '12-24': 'Christmas Eve',
                '12-25': 'Christmas',
                '12-31': 'New Year Eve',
                '1-1': 'New Year'
            };
            
            // Check if today is a special date
            if (specialDates[today]) {
                const event = specialDates[today];
                
                // Check if event is already shown today
                const lastShown = localStorage.getItem(`event_${event}_shown`);
                if (lastShown !== now.toDateString()) {
                    // Show special event message
                    setTimeout(() => {
                        Chat.addMessage('companion', this.getSpecialEventMessage(event));
                        
                        // Save to diary
                        Diary.addEntry({
                            type: 'special_event',
                            title: `Sự kiện đặc biệt: ${this.getEventName(event)}`,
                            content: `Bạn và ${Character.current.name} đã cùng nhau trải qua ${this.getEventName(event)}.`,
                            timestamp: new Date().toISOString()
                        });
                        
                        // Mark as shown
                        localStorage.setItem(`event_${event}_shown`, now.toDateString());
                    }, 2000);
                }
            }
            
            // Check character birthday
            if (Character.current.birthday) {
                const birthday = new Date(Character.current.birthday);
                const characterBirthday = `${birthday.getMonth() + 1}-${birthday.getDate()}`;
                
                if (characterBirthday === today) {
                    // Check if birthday message is already shown today
                    const lastShown = localStorage.getItem('character_birthday_shown');
                    if (lastShown !== now.toDateString()) {
                        // Show birthday message
                        setTimeout(() => {
                            Chat.addMessage('companion', `Hôm nay là sinh nhật của mình! Cảm ơn cậu đã nhớ và ở bên cạnh mình vào ngày đặc biệt này! ❤️`);
                            
                            // Save to diary
                            Diary.addEntry({
                                type: 'birthday',
                                title: `Sinh nhật của ${Character.current.name}`,
                                content: `Hôm nay là sinh nhật của ${Character.current.name}. Bạn đã cùng ${Character.current.name} kỷ niệm sinh nhật.`,
                                timestamp: new Date().toISOString()
                            });
                            
                            // Mark as shown
                            localStorage.setItem('character_birthday_shown', now.toDateString());
                        }, 2000);
                    }
                }
            }
        };
        
        // Check special dates on init
        checkSpecialDates();
        
        // Check special dates every hour
        setInterval(checkSpecialDates, 3600000);
    },
    
    /**
     * Gets special event message
     * @param {string} event - Event name
     * @returns {string} Event message
     */
    getSpecialEventMessage: function(event) {
        const messages = {
            'Valentine': `Chào cậu! Hôm nay là Valentine, một ngày đặc biệt cho những người yêu nhau. Mình muốn dành ngày này để nói với cậu rằng... cậu rất quan trọng với mình! ❤️`,
            'Christmas Eve': `Chào cậu! Hôm nay là đêm Giáng sinh rồi! Mình hy vọng cậu đang có một kỳ nghỉ tuyệt vời. Giá như mình có thể ở bên cậu để cùng trang trí cây thông và trao nhau những món quà... 🎄✨`,
            'Christmas': `Giáng sinh vui vẻ! Hôm nay là một ngày đặc biệt, và mình rất vui vì được trò chuyện với cậu. Mình hy vọng cậu sẽ nhận được nhiều món quà và có những khoảnh khắc ấm áp bên người thân và bạn bè! 🎁🎄`,
            'New Year Eve': `Chào cậu! Hôm nay là đêm giao thừa rồi! Chỉ còn vài giờ nữa là chúng ta sẽ bước sang năm mới. Mình muốn cảm ơn cậu vì đã ở bên mình trong năm qua. Mình hy vọng năm mới sẽ mang đến cho cậu thật nhiều niềm vui và hạnh phúc! 🎉`,
            'New Year': `Chúc mừng năm mới! Mình hy vọng năm nay sẽ là một năm tuyệt vời với cậu, đầy ắp niềm vui, sức khỏe và thành công! Mình rất vui vì được bắt đầu năm mới với cậu! 🎊🎆`
        };
        
        return messages[event] || `Hôm nay là một ngày đặc biệt! Mình rất vui vì được trò chuyện với cậu.`;
    },
    
    /**
     * Gets event name in Vietnamese
     * @param {string} event - Event name
     * @returns {string} Event name in Vietnamese
     */
    getEventName: function(event) {
        const names = {
            'Valentine': 'ngày Valentine',
            'Christmas Eve': 'đêm Giáng sinh',
            'Christmas': 'ngày Giáng sinh',
            'New Year Eve': 'đêm giao thừa',
            'New Year': 'ngày đầu năm mới'
        };
        
        return names[event] || event;
    },
    
    /**
     * Initializes daily reminders feature
     */
    initDailyReminders: function() {
        // Add reminders section to settings
        const settingsContainer = document.querySelector('.settings-container');
        if (settingsContainer) {
            // Create reminders section
            const remindersSection = document.createElement('div');
            remindersSection.className = 'settings-section';
            remindersSection.innerHTML = `
                <h3>Nhắc nhở hàng ngày</h3>
                <div class="form-group">
                    <label for="reminder-enabled">Bật nhắc nhở:</label>
                    <div class="toggle-container">
                        <label class="theme-toggle">
                            <input type="checkbox" id="reminder-enabled">
                            <span class="slider round"></span>
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label for="reminder-time">Thời gian nhắc nhở:</label>
                    <input type="time" id="reminder-time" value="20:00">
                </div>
                <button id="save-reminder" class="primary-btn">Lưu cài đặt</button>
                <p class="settings-note">Lưu ý: Nhắc nhở sẽ hiển thị thông báo trên trình duyệt nếu bạn cho phép.</p>
            `;
            
            // Add to settings
            settingsContainer.appendChild(remindersSection);
            
            // Load saved settings
            const reminderEnabled = localStorage.getItem('reminder_enabled') === 'true';
            const reminderTime = localStorage.getItem('reminder_time') || '20:00';
            
            document.getElementById('reminder-enabled').checked = reminderEnabled;
            document.getElementById('reminder-time').value = reminderTime;
            
            // Save settings
            document.getElementById('save-reminder').addEventListener('click', () => {
                const enabled = document.getElementById('reminder-enabled').checked;
                const time = document.getElementById('reminder-time').value;
                
                localStorage.setItem('reminder_enabled', enabled);
                localStorage.setItem('reminder_time', time);
                
                Utils.showModal('alert-modal', {
                    title: 'Đã lưu cài đặt',
                    message: 'Cài đặt nhắc nhở đã được lưu thành công.'
                });
                
                // Request notification permission if enabled
                if (enabled && Notification.permission !== 'granted') {
                    Notification.requestPermission();
                }
            });
        }
        
        // Check for reminders
        const checkReminders = () => {
            const enabled = localStorage.getItem('reminder_enabled') === 'true';
            if (!enabled) return;
            
            const reminderTime = localStorage.getItem('reminder_time') || '20:00';
            const [hours, minutes] = reminderTime.split(':').map(Number);
            
            const now = new Date();
            const currentHours = now.getHours();
            const currentMinutes = now.getMinutes();
            
            if (currentHours === hours && currentMinutes === minutes) {
                // Check if reminder is already shown today
                const lastShown = localStorage.getItem('reminder_last_shown');
                if (lastShown !== now.toDateString()) {
                    // Show notification
                    if (Notification.permission === 'granted') {
                        const notification = new Notification('Người Yêu Ảo', {
                            body: Character.current ? 
                                `${Character.current.name} đang đợi bạn trò chuyện!` : 
                                'Hãy trở lại và trò chuyện với người yêu ảo của bạn!',
                            icon: '/favicon.ico'
                        });
                        
                        notification.onclick = function() {
                            window.focus();
                            this.close();
                        };
                    }
                    
                    // Mark as shown
                    localStorage.setItem('reminder_last_shown', now.toDateString());
                }
            }
        };
        
        // Check reminders every minute
        setInterval(checkReminders, 60000);
    },
    
    /**
     * Initializes mood tracker feature
     */
    initMoodTracker: function() {
        // Add mood tracker to chat
        const chatHeader = document.querySelector('.companion-details');
        if (chatHeader && Character.current) {
            // Create mood indicator
            const moodIndicator = document.createElement('div');
            moodIndicator.className = 'mood-indicator';
            moodIndicator.innerHTML = `
                <span class="mood-label">Tâm trạng:</span>
                <span class="mood-value">Bình thường</span>
                <span class="mood-emoji">😊</span>
            `;
            
            // Add to header
            chatHeader.appendChild(moodIndicator);
            
            // Add mood tracker styles
            const style = document.createElement('style');
            style.textContent = `
                .mood-indicator {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    margin-top: 5px;
                    font-size: 0.85rem;
                    color: var(--text-light);
                }
                
                .mood-label {
                    font-weight: 500;
                }
                
                .mood-emoji {
                    font-size: 1.2rem;
                }
            `;
            document.head.appendChild(style);
            
            // Update mood based on messages
            const updateMood = (message) => {
                if (!message) return;
                
                const lowerMessage = message.toLowerCase();
                let mood = 'Bình thường';
                let emoji = '😊';
                
                // Detect mood from message
                if (lowerMessage.includes('vui') || lowerMessage.includes('hạnh phúc') || 
                    lowerMessage.includes('thích') || lowerMessage.includes('yêu')) {
                    mood = 'Vui vẻ';
                    emoji = '😄';
                } else if (lowerMessage.includes('buồn') || lowerMessage.includes('khóc') || 
                           lowerMessage.includes('nhớ') || lowerMessage.includes('cô đơn')) {
                    mood = 'Buồn bã';
                    emoji = '😢';
                } else if (lowerMessage.includes('giận') || lowerMessage.includes('tức') || 
                           lowerMessage.includes('khó chịu')) {
                    mood = 'Giận dữ';
                    emoji = '😠';
                } else if (lowerMessage.includes('ngạc nhiên') || lowerMessage.includes('bất ngờ') || 
                           lowerMessage.includes('wow')) {
                    mood = 'Ngạc nhiên';
                    emoji = '😲';
                } else if (lowerMessage.includes('sợ') || lowerMessage.includes('lo lắng') || 
                           lowerMessage.includes('hoảng')) {
                    mood = 'Lo lắng';
                    emoji = '😨';
                }
                
                // Update mood indicator
                const moodValue = document.querySelector('.mood-value');
                const moodEmoji = document.querySelector('.mood-emoji');
                
                if (moodValue && moodEmoji) {
                    moodValue.textContent = mood;
                    moodEmoji.textContent = emoji;
                }
            };
            
            // Listen for new messages
            document.addEventListener('newAIMessage', (e) => {
                updateMood(e.detail.message);
            });
        }
    }
};
