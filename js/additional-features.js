/**
 * Additional features for the Virtual Companion application
 */
const AdditionalFeatures = {
    /**
     * Initializes additional features
     */
    init: function() {
        console.log('Initializing additional features...');
        
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
        
        console.log('Additional features initialized successfully');
    },
    
    /**
     * Initializes dark mode feature
     */
    initDarkMode: function() {
        console.log('Initializing dark mode...');
        
        // Add dark mode toggle button in sidebar
        const themeToggleBtn = document.getElementById('theme-toggle-btn');
        
        if (themeToggleBtn) {
            // Check if dark mode is enabled in localStorage
            const isDarkMode = localStorage.getItem('dark_mode') === 'true';
            
            // Apply dark mode immediately if enabled
            if (isDarkMode) {
                document.body.classList.add('dark-mode');
                themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i><span>Chế độ sáng</span>';
            } else {
                document.body.classList.remove('dark-mode');
                themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i><span>Chế độ tối</span>';
            }
            
            // Add event listener to toggle button
            themeToggleBtn.addEventListener('click', () => {
                // Toggle dark mode class on body
                document.body.classList.toggle('dark-mode');
                
                // Update localStorage
                const newDarkMode = document.body.classList.contains('dark-mode');
                localStorage.setItem('dark_mode', newDarkMode);
                
                // Update button text and icon
                if (newDarkMode) {
                    themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i><span>Chế độ sáng</span>';
                } else {
                    themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i><span>Chế độ tối</span>';
                }
                
                console.log('Dark mode toggled:', newDarkMode);
            });
            
            console.log('Dark mode toggle button initialized');
        } else {
            console.error('Theme toggle button not found');
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
                --primary-color: #ff6b6b;
                --primary-hover: #ff8a8a;
                --secondary-color: #4a4a4a;
                --secondary-hover: #5a5a5a;
                color-scheme: dark;
            }
            
            body.dark-mode .app-container {
                background-color: var(--bg-color);
                color: var(--text-color);
            }
            
            body.dark-mode .sidebar {
                background-color: #1a1a1a;
                color: var(--text-color);
                border-right: 1px solid var(--border-color);
            }
            
            body.dark-mode .nav-menu ul li {
                color: var(--text-color);
            }
            
            body.dark-mode .nav-menu ul li:hover,
            body.dark-mode .nav-menu ul li.active {
                background-color: rgba(255, 107, 107, 0.1);
            }
            
            body.dark-mode .tab-content {
                background-color: var(--bg-color);
                color: var(--text-color);
            }
            
            body.dark-mode .chat-messages {
                background-color: #181818;
                background-image: 
                    radial-gradient(circle at 25% 25%, rgba(255, 107, 107, 0.05) 5%, transparent 5%),
                    radial-gradient(circle at 75% 75%, rgba(255, 107, 107, 0.05) 5%, transparent 5%);
            }
            
            body.dark-mode .message-bubble {
                background-color: #2a2a2a;
                color: var(--text-color);
            }
            
            body.dark-mode .user-message .message-bubble {
                background-color: #3a3a3a;
            }
            
            body.dark-mode .companion-message .message-bubble {
                background-color: #2a2a2a;
            }
            
            body.dark-mode .welcome-message,
            body.dark-mode .chat-input,
            body.dark-mode .chat-header {
                background-color: #1e1e1e;
                color: var(--text-color);
            }
            
            body.dark-mode .input-action-btn {
                background-color: #333333;
                color: var(--text-color);
            }
            
            body.dark-mode .input-action-btn:hover {
                background-color: #444444;
            }
            
            body.dark-mode .chat-input textarea {
                background-color: #2a2a2a;
                color: var(--text-color);
                border-color: #444444;
            }
            
            body.dark-mode .modal-content {
                background-color: #1e1e1e;
                color: var(--text-color);
            }
            
            body.dark-mode .diary-entry,
            body.dark-mode .game-card,
            body.dark-mode .game-area,
            body.dark-mode .empty-diary,
            body.dark-mode .auth-status {
                background-color: #2a2a2a;
                color: var(--text-color);
            }
            
            body.dark-mode .form-group input,
            body.dark-mode .form-group select,
            body.dark-mode .form-group textarea {
                background-color: #2a2a2a;
                color: var(--text-color);
                border-color: #444444;
            }
            
            body.dark-mode .primary-btn {
                background-color: var(--primary-color);
                color: white;
            }
            
            body.dark-mode .secondary-btn {
                background-color: #3a3a3a;
                color: var(--text-color);
            }
            
            body.dark-mode .danger-btn {
                background-color: #e74c3c;
                color: white;
            }
            
            body.dark-mode .connection-status {
                background-color: #2a2a2a;
                color: var(--text-color);
            }
            
            body.dark-mode .theme-toggle {
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
            
            body.dark-mode em-emoji-picker {
                --background: #2a2a2a;
                --border-color: #444444;
                --category-icon-active-color: var(--primary-color);
                --indicator-color: var(--primary-color);
                --input-border-color: #444444;
                --input-font-color: var(--text-color);
                --input-placeholder-color: var(--text-light);
                --secondary-background: #333333;
                --text-color: var(--text-color);
            }
        `;
        document.head.appendChild(style);
        
        console.log('Dark mode styles added');
    },
    
    /**
     * Initializes voice messages feature
     */
    initVoiceMessages: function() {
        console.log('Initializing voice messages...');
        
        // Voice recording functionality is now handled in chat.js
        
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
            
            .recording-waves {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: var(--primary-color);
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 20px auto;
            }
            
            .recording-waves::before,
            .recording-waves::after {
                content: '';
                position: absolute;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: var(--primary-color);
                opacity: 0.6;
                animation: pulse 2s infinite;
            }
            
            .recording-waves::after {
                animation-delay: 0.5s;
            }
            
            @keyframes pulse {
                0% {
                    transform: scale(1);
                    opacity: 0.6;
                }
                50% {
                    transform: scale(1.5);
                    opacity: 0;
                }
                100% {
                    transform: scale(1);
                    opacity: 0;
                }
            }
            
            .recording-time {
                font-size: 1.5rem;
                font-weight: bold;
                margin-top: 10px;
                text-align: center;
            }
            
            .recording-controls {
                display: flex;
                justify-content: center;
                margin-top: 20px;
            }
        `;
        document.head.appendChild(style);
        
        console.log('Voice messages initialized');
    },
    
    /**
     * Initializes special events feature
     */
    initSpecialEvents: function() {
        console.log('Initializing special events...');
        
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
                        Chat.addCompanionMessage(this.getSpecialEventMessage(event));
                        
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
                            Chat.addCompanionMessage(`Hôm nay là sinh nhật của mình! Cảm ơn cậu đã nhớ và ở bên cạnh mình vào ngày đặc biệt này! ❤️`);
                            
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
        
        console.log('Special events initialized');
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
        console.log('Initializing daily reminders...');
        
        // Add reminders section to settings
        const settingsContainer = document.querySelector('.settings-container');
        if (settingsContainer) {
            // Create reminders section if it doesn't exist
            if (!document.querySelector('.settings-section:has(h3:contains("Thông báo"))')) {
                // Create reminders section
                const remindersSection = document.createElement('div');
                remindersSection.className = 'settings-section';
                remindersSection.innerHTML = `
                    <h3>Thông báo</h3>
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="enable-notifications">
                            Bật thông báo nhắc nhở hàng ngày
                        </label>
                    </div>
                    <div class="form-group">
                        <label for="notification-time">Thời gian nhắc nhở:</label>
                        <input type="time" id="notification-time" value="18:00">
                    </div>
                    <button id="save-notification-settings" class="primary-btn">Lưu cài đặt thông báo</button>
                `;
                
                // Add to settings
                settingsContainer.appendChild(remindersSection);
                
                // Load saved settings
                const notificationsEnabled = localStorage.getItem('notifications_enabled') === 'true';
                const notificationTime = localStorage.getItem('notification_time') || '18:00';
                
                document.getElementById('enable-notifications').checked = notificationsEnabled;
                document.getElementById('notification-time').value = notificationTime;
                
                // Save settings
                document.getElementById('save-notification-settings').addEventListener('click', () => {
                    const enabled = document.getElementById('enable-notifications').checked;
                    const time = document.getElementById('notification-time').value;
                    
                    localStorage.setItem('notifications_enabled', enabled);
                    localStorage.setItem('notification_time', time);
                    
                    Utils.showModal('alert-modal', {
                        title: 'Đã lưu cài đặt',
                        message: 'Cài đặt thông báo đã được lưu thành công.'
                    });
                    
                    // Request notification permission if enabled
                    if (enabled && Notification.permission !== 'granted') {
                        Notification.requestPermission();
                    }
                });
            }
        }
        
        // Check for reminders
        const checkReminders = () => {
            const enabled = localStorage.getItem('notifications_enabled') === 'true';
            if (!enabled) return;
            
            const reminderTime = localStorage.getItem('notification_time') || '18:00';
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
                            icon: 'img/favicon.ico'
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
        
        console.log('Daily reminders initialized');
    },
    
    /**
     * Initializes mood tracker feature
     */
    initMoodTracker: function() {
        console.log('Initializing mood tracker...');
        
        // Add mood tracker to chat
        const chatHeader = document.querySelector('.companion-details');
        if (chatHeader && Character.current) {
            // Create mood indicator if it doesn't exist
            if (!document.querySelector('.mood-indicator')) {
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
                    
                    .mood-happy .mood-value { color: #4CAF50; }
                    .mood-sad .mood-value { color: #2196F3; }
                    .mood-angry .mood-value { color: #F44336; }
                    .mood-surprised .mood-value { color: #FF9800; }
                    .mood-neutral .mood-value { color: var(--text-light); }
                `;
                document.head.appendChild(style);
            }
            
            // Update mood based on character's current mood
            this.updateMoodUI();
            
            // Create custom event for mood updates
            const moodUpdateEvent = new CustomEvent('moodUpdate');
            
            // Listen for mood updates
            document.addEventListener('moodUpdate', () => {
                this.updateMoodUI();
            });
        }
        
        console.log('Mood tracker initialized');
    },
    
    /**
     * Updates mood UI based on character's current mood
     */
    updateMoodUI: function() {
        if (!Character.current || !Character.current.mood) return;
        
        const moodValue = document.querySelector('.mood-value');
        const moodEmoji = document.querySelector('.mood-emoji');
        const moodIndicator = document.querySelector('.mood-indicator');
        
        if (!moodValue || !moodEmoji || !moodIndicator) return;
        
        // Remove all mood classes
        moodIndicator.classList.remove('mood-happy', 'mood-sad', 'mood-angry', 'mood-surprised', 'mood-neutral');
        
        // Set mood based on character's mood
        let moodText = 'Bình thường';
        let emoji = '😊';
        let moodClass = 'mood-neutral';
        
        switch (Character.current.mood) {
            case 'happy':
                moodText = 'Vui vẻ';
                emoji = '😄';
                moodClass = 'mood-happy';
                break;
            case 'sad':
                moodText = 'Buồn bã';
                emoji = '😢';
                moodClass = 'mood-sad';
                break;
            case 'angry':
                moodText = 'Giận dữ';
                emoji = '😠';
                moodClass = 'mood-angry';
                break;
            case 'surprised':
                moodText = 'Ngạc nhiên';
                emoji = '😲';
                moodClass = 'mood-surprised';
                break;
            default:
                moodText = 'Bình thường';
                emoji = '😊';
                moodClass = 'mood-neutral';
        }
        
        // Update mood indicator
        moodValue.textContent = moodText;
        moodEmoji.textContent = emoji;
        moodIndicator.classList.add(moodClass);
    }
};
