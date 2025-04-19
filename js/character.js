/**
 * Character management for the Virtual Companion application
 */
const Character = {
    /**
     * Current character data
     */
    data: null,
    
    /**
     * Initializes character module
     * @returns {boolean} Whether character was loaded
     */
    init: function() {
        // Load character data
        this.data = Storage.load(CONFIG.CHARACTER.STORAGE_KEY);
        
        // Update UI if character exists
        if (this.data) {
            this.updateUI();
            return true;
        }
        
        return false;
    },
    
    /**
     * Creates a new character
     * @param {Object} characterData - Character data
     */
    create: function(characterData) {
        // Add creation date and intimacy level
        characterData.createdAt = new Date().toISOString();
        characterData.intimacyLevel = 0;
        
        // Save character data
        this.data = characterData;
        Storage.save(CONFIG.CHARACTER.STORAGE_KEY, this.data);
        
        // Update UI
        this.updateUI();
        
        // Enable chat input
        const messageInput = document.getElementById('message-input');
        const sendButton = document.getElementById('send-button');
        
        if (messageInput) {
            messageInput.disabled = false;
        }
        
        if (sendButton) {
            sendButton.disabled = false;
        }
        
        // Clear chat messages
        const chatMessages = document.getElementById('chat-messages');
        if (chatMessages) {
            chatMessages.innerHTML = '';
        }
        
        // Add welcome message
        Chat.addSystemMessage(`Xin chào! Tôi là ${this.data.name}. Rất vui được gặp bạn!`);
    },
    
    /**
     * Updates character UI
     */
    updateUI: function() {
        if (!this.data) return;
        
        // Update avatar
        const avatarImg = document.getElementById('companion-avatar-img');
        if (avatarImg) {
            // Check if avatar exists
            Utils.imageExists(this.data.avatar)
                .then(exists => {
                    if (exists) {
                        avatarImg.src = this.data.avatar;
                    } else {
                        // Use fallback image
                        const initial = this.data.name ? this.data.name.charAt(0).toUpperCase() : '?';
                        avatarImg.src = Utils.createFallbackImage(initial);
                    }
                });
        }
        
        // Update name and personality
        const nameElement = document.getElementById('companion-name');
        const personalityElement = document.getElementById('companion-personality');
        
        if (nameElement) {
            nameElement.textContent = this.data.name;
        }
        
        if (personalityElement) {
            personalityElement.textContent = this.data.personality;
        }
        
        // Update intimacy level
        this.updateIntimacyLevel();
        
        // Enable chat input
        const messageInput = document.getElementById('message-input');
        const sendButton = document.getElementById('send-button');
        
        if (messageInput) {
            messageInput.disabled = false;
        }
        
        if (sendButton) {
            sendButton.disabled = false;
        }
    },
    
    /**
     * Updates intimacy level display
     */
    updateIntimacyLevel: function() {
        if (!this.data) return;
        
        const levelProgress = document.querySelector('.level-progress');
        const levelText = document.querySelector('.level-text');
        
        if (!levelProgress || !levelText) return;
        
        // Get current intimacy level
        const currentLevel = this.getCurrentIntimacyLevel();
        
        // Calculate progress percentage
        let percentage = 0;
        
        if (currentLevel.index < CONFIG.CHARACTER.INTIMACY_LEVELS.length - 1) {
            const nextLevel = CONFIG.CHARACTER.INTIMACY_LEVELS[currentLevel.index + 1];
            const prevThreshold = currentLevel.level.threshold;
            const nextThreshold = nextLevel.threshold;
            const range = nextThreshold - prevThreshold;
            const progress = this.data.intimacyLevel - prevThreshold;
            
            percentage = (progress / range) * 100;
        } else {
            percentage = 100;
        }
        
        // Update UI
        levelProgress.style.width = `${percentage}%`;
        levelText.textContent = `Mức độ thân thiết: ${currentLevel.level.name}`;
    },
    
    /**
     * Gets current intimacy level
     * @returns {Object} Current intimacy level and index
     */
    getCurrentIntimacyLevel: function() {
        if (!this.data) {
            return {
                level: CONFIG.CHARACTER.INTIMACY_LEVELS[0],
                index: 0
            };
        }
        
        let currentLevel = CONFIG.CHARACTER.INTIMACY_LEVELS[0];
        let currentIndex = 0;
        
        for (let i = 0; i < CONFIG.CHARACTER.INTIMACY_LEVELS.length; i++) {
            const level = CONFIG.CHARACTER.INTIMACY_LEVELS[i];
            
            if (this.data.intimacyLevel >= level.threshold) {
                currentLevel = level;
                currentIndex = i;
            } else {
                break;
            }
        }
        
        return {
            level: currentLevel,
            index: currentIndex
        };
    },
    
    /**
     * Increases intimacy level
     * @param {number} amount - Amount to increase
     */
    increaseIntimacy: function(amount) {
        if (!this.data) return;
        
        // Get current intimacy level
        const currentLevel = this.getCurrentIntimacyLevel();
        
        // Increase intimacy
        this.data.intimacyLevel += amount;
        
        // Save character data
        Storage.save(CONFIG.CHARACTER.STORAGE_KEY, this.data);
        
        // Update UI
        this.updateIntimacyLevel();
        
        // Check if level up
        const newLevel = this.getCurrentIntimacyLevel();
        
        if (newLevel.index > currentLevel.index) {
            // Show level up message
            Chat.addSystemMessage(`Mức độ thân thiết đã tăng lên ${newLevel.level.name}!`);
        }
    },
    
    /**
     * Deletes character
     */
    delete: function() {
        // Remove character data
        this.data = null;
        Storage.remove(CONFIG.CHARACTER.STORAGE_KEY);
        
        // Reset UI
        const avatarImg = document.getElementById('companion-avatar-img');
        const nameElement = document.getElementById('companion-name');
        const personalityElement = document.getElementById('companion-personality');
        
        if (avatarImg) {
            avatarImg.src = CONFIG.CHARACTER.DEFAULT_AVATAR;
        }
        
        if (nameElement) {
            nameElement.textContent = 'Chưa có nhân vật';
        }
        
        if (personalityElement) {
            personalityElement.textContent = 'Hãy tạo nhân vật của bạn';
        }
        
        // Reset intimacy level
        const levelProgress = document.querySelector('.level-progress');
        const levelText = document.querySelector('.level-text');
        
        if (levelProgress) {
            levelProgress.style.width = '0%';
        }
        
        if (levelText) {
            levelText.textContent = 'Mức độ thân thiết: Mới quen';
        }
        
        // Disable chat input
        const messageInput = document.getElementById('message-input');
        const sendButton = document.getElementById('send-button');
        
        if (messageInput) {
            messageInput.disabled = true;
        }
        
        if (sendButton) {
            sendButton.disabled = true;
        }
        
        // Clear chat messages
        const chatMessages = document.getElementById('chat-messages');
        if (chatMessages) {
            chatMessages.innerHTML = `
                <div class="welcome-message">
                    <h3>Chào mừng đến với Người Yêu Ảo!</h3>
                    <p>Hãy tạo nhân vật của bạn để bắt đầu trò chuyện.</p>
                    <button class="create-character-btn" data-tab="create-content">Tạo Nhân Vật Ngay</button>
                </div>
            `;
            
            // Reinitialize create character button
            UI.initCreateCharacterButton();
        }
        
        // Clear chat history
        Chat.clearHistory();
    }
};
