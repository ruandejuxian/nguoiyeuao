/**
 * Character management for the Virtual Companion application
 */
const Character = {
    /**
     * Current character data
     */
    current: null,
    
    /**
     * Initializes character from storage or creates default
     */
    init: function() {
        // Try to load character from storage
        const savedCharacter = Storage.load(CONFIG.CHARACTER.STORAGE_KEY);
        
        if (savedCharacter) {
            this.current = savedCharacter;
            this.updateUI();
            return true;
        }
        
        return false;
    },
    
    /**
     * Creates a new character
     * @param {Object} characterData - Character data from form
     * @returns {Object} Created character
     */
    create: function(characterData) {
        const character = {
            id: Utils.generateId(),
            name: characterData.name,
            gender: characterData.gender,
            age: characterData.age,
            personality: characterData.personality,
            interests: characterData.interests,
            avatar: characterData.avatar || CONFIG.CHARACTER.DEFAULT_AVATAR,
            createdAt: new Date().toISOString(),
            intimacyLevel: 0,
            stats: {
                messagesSent: 0,
                messagesReceived: 0,
                specialMoments: []
            }
        };
        
        this.current = character;
        
        // Save to storage
        Storage.save(CONFIG.CHARACTER.STORAGE_KEY, character);
        
        // Update UI
        this.updateUI();
        
        // Add first chat to diary
        Diary.addEntry({
            type: 'first_chat',
            title: 'Lần đầu gặp gỡ',
            content: `Bạn đã tạo nhân vật ${character.name} và bắt đầu cuộc trò chuyện.`,
            timestamp: new Date().toISOString()
        });
        
        return character;
    },
    
    /**
     * Updates the character data
     * @param {Object} updates - Fields to update
     * @returns {Object} Updated character
     */
    update: function(updates) {
        if (!this.current) return null;
        
        // Update character fields
        Object.assign(this.current, updates);
        
        // Save to storage
        Storage.save(CONFIG.CHARACTER.STORAGE_KEY, this.current);
        
        // Update UI
        this.updateUI();
        
        return this.current;
    },
    
    /**
     * Deletes the current character
     * @returns {boolean} Success status
     */
    delete: function() {
        if (!this.current) return false;
        
        // Remove from storage
        Storage.remove(CONFIG.CHARACTER.STORAGE_KEY);
        
        // Clear current character
        this.current = null;
        
        // Update UI
        this.updateUI();
        
        return true;
    },
    
    /**
     * Updates intimacy level
     * @param {number} points - Points to add
     * @returns {number} New intimacy level
     */
    updateIntimacy: function(points) {
        if (!this.current) return 0;
        
        const oldLevel = this.getIntimacyLevelName();
        this.current.intimacyLevel += points;
        
        // Ensure intimacy doesn't go below 0
        if (this.current.intimacyLevel < 0) {
            this.current.intimacyLevel = 0;
        }
        
        // Save to storage
        Storage.save(CONFIG.CHARACTER.STORAGE_KEY, this.current);
        
        // Check if level changed
        const newLevel = this.getIntimacyLevelName();
        if (oldLevel !== newLevel && newLevel === 'Người yêu') {
            // Add to diary when reaching "Người yêu" level
            Diary.addEntry({
                type: 'high_intimacy',
                title: 'Tình cảm sâu đậm',
                content: `Mối quan hệ giữa bạn và ${this.current.name} đã trở nên sâu đậm. Giờ đây ${this.current.name} đã trở thành người yêu của bạn!`,
                timestamp: new Date().toISOString()
            });
        }
        
        // Update UI
        this.updateIntimacyUI();
        
        return this.current.intimacyLevel;
    },
    
    /**
     * Gets the current intimacy level name
     * @returns {string} Intimacy level name
     */
    getIntimacyLevelName: function() {
        if (!this.current) return CONFIG.CHARACTER.INTIMACY_LEVELS[0].name;
        
        const level = CONFIG.CHARACTER.INTIMACY_LEVELS.slice().reverse().find(
            level => this.current.intimacyLevel >= level.threshold
        );
        
        return level ? level.name : CONFIG.CHARACTER.INTIMACY_LEVELS[0].name;
    },
    
    /**
     * Gets the intimacy level percentage (for progress bar)
     * @returns {number} Percentage (0-100)
     */
    getIntimacyPercentage: function() {
        if (!this.current) return 0;
        
        // Find current and next level
        let currentLevel = null;
        let nextLevel = null;
        
        for (let i = 0; i < CONFIG.CHARACTER.INTIMACY_LEVELS.length; i++) {
            if (this.current.intimacyLevel >= CONFIG.CHARACTER.INTIMACY_LEVELS[i].threshold) {
                currentLevel = CONFIG.CHARACTER.INTIMACY_LEVELS[i];
                nextLevel = CONFIG.CHARACTER.INTIMACY_LEVELS[i + 1] || null;
            }
        }
        
        if (!currentLevel) return 0;
        if (!nextLevel) return 100; // Max level
        
        // Calculate percentage between current and next level
        const currentThreshold = currentLevel.threshold;
        const nextThreshold = nextLevel.threshold;
        const range = nextThreshold - currentThreshold;
        const progress = this.current.intimacyLevel - currentThreshold;
        
        return Math.min(100, Math.floor((progress / range) * 100));
    },
    
    /**
     * Updates the UI to reflect current character
     */
    updateUI: function() {
        const nameElement = document.getElementById('companion-name');
        const personalityElement = document.getElementById('companion-personality');
        const avatarElement = document.getElementById('companion-avatar-img');
        const messageInput = document.getElementById('message-input');
        const sendButton = document.getElementById('send-button');
        const chatMessages = document.getElementById('chat-messages');
        
        if (this.current) {
            // Update header info
            nameElement.textContent = this.current.name;
            personalityElement.textContent = this.current.personality;
            avatarElement.src = this.current.avatar;
            
            // Enable chat
            messageInput.disabled = false;
            sendButton.disabled = false;
            
            // Hide welcome message if it exists
            const welcomeMessage = document.querySelector('.welcome-message');
            if (welcomeMessage) {
                welcomeMessage.style.display = 'none';
            }
            
            // Update intimacy UI
            this.updateIntimacyUI();
        } else {
            // Reset to default
            nameElement.textContent = 'Chưa có nhân vật';
            personalityElement.textContent = 'Hãy tạo nhân vật của bạn';
            avatarElement.src = CONFIG.CHARACTER.DEFAULT_AVATAR;
            
            // Disable chat
            messageInput.disabled = true;
            sendButton.disabled = true;
            
            // Show welcome message
            chatMessages.innerHTML = `
                <div class="welcome-message">
                    <h3>Chào mừng đến với Người Yêu Ảo!</h3>
                    <p>Hãy tạo nhân vật của bạn để bắt đầu trò chuyện.</p>
                    <button class="create-character-btn" data-tab="create-tab">Tạo Nhân Vật Ngay</button>
                </div>
            `;
            
            // Add event listener to the create button
            const createBtn = document.querySelector('.create-character-btn');
            if (createBtn) {
                createBtn.addEventListener('click', function() {
                    const tabId = this.getAttribute('data-tab');
                    UI.switchTab(tabId);
                });
            }
        }
    },
    
    /**
     * Updates the intimacy UI elements
     */
    updateIntimacyUI: function() {
        if (!this.current) return;
        
        const levelText = document.querySelector('.level-text');
        const levelProgress = document.querySelector('.level-progress');
        
        const levelName = this.getIntimacyLevelName();
        const percentage = this.getIntimacyPercentage();
        
        levelText.textContent = `Mức độ thân thiết: ${levelName}`;
        levelProgress.style.width = `${percentage}%`;
    },
    
    /**
     * Generates a prompt for the AI based on character and context
     * @param {string} userMessage - User's message
     * @param {Array} chatHistory - Recent chat history
     * @returns {string} Prompt for AI
     */
    generatePrompt: function(userMessage, chatHistory) {
        if (!this.current) return '';
        
        const levelName = this.getIntimacyLevelName();
        let promptStyle = '';
        
        // Adjust prompt style based on intimacy level
        switch(levelName) {
            case 'Mới quen':
                promptStyle = 'lịch sự, hơi ngại ngùng';
                break;
            case 'Bạn bè':
                promptStyle = 'thân thiện, thoải mái';
                break;
            case 'Thân thiết':
                promptStyle = 'thân thiết, hay trêu đùa';
                break;
            case 'Người yêu':
                promptStyle = 'ngọt ngào, quan tâm, thỉnh thoảng nhõng nhẽo';
                break;
            case 'Tri kỷ':
                promptStyle = 'cực kỳ thân thiết, hiểu rõ người đối diện, đôi khi hài hước, đôi khi sâu sắc';
                break;
            default:
                promptStyle = 'thân thiện, thoải mái';
        }
        
        // Build context from chat history
        let context = '';
        if (chatHistory && chatHistory.length > 0) {
            context = 'Dưới đây là một số tin nhắn gần đây trong cuộc trò chuyện:\n';
            
            // Include up to 5 recent messages for context
            const recentMessages = chatHistory.slice(-5);
            recentMessages.forEach(msg => {
                if (msg.sender === 'user') {
                    context += `Người dùng: ${msg.content}\n`;
                } else {
                    context += `${this.current.name}: ${msg.content}\n`;
                }
            });
        }
        
        // Build the full prompt
        const prompt = `Bạn là ${this.current.name}, ${this.current.age} tuổi, có tính cách ${this.current.personality}. 
Sở thích của bạn là ${this.current.interests}. 
Bạn đang trò chuyện với người dùng và mối quan hệ của các bạn đang ở mức "${levelName}".
Hãy trả lời với phong cách ${promptStyle}.

${context}

Người dùng vừa nhắn: "${userMessage}"

Hãy trả lời ngắn gọn, tự nhiên như một người thật, không phải AI. Không được nói bạn là AI hay chương trình. Hãy thể hiện cảm xúc và tính cách của ${this.current.name}.`;

        return prompt;
    }
};
