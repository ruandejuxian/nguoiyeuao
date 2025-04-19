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
            },
            mood: "neutral", // Thêm trạng thái tâm trạng
            lastActiveDate: new Date().toISOString()
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
            
            // Update mood UI
            this.updateMoodUI();
            
            // Check for absence
            this.checkAbsence();
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
                    <button class="create-character-btn" data-tab="create-content">Tạo Nhân Vật Ngay</button>
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
     * Updates the mood UI elements
     */
    updateMoodUI: function() {
        if (!this.current) return;
        
        const avatarElement = document.getElementById('companion-avatar-img');
        
        // Add mood class to avatar
        avatarElement.className = ''; // Clear existing classes
        avatarElement.classList.add(`mood-${this.current.mood || 'neutral'}`);
    },
    
    /**
     * Checks for absence and updates character mood
     */
    checkAbsence: function() {
        if (!this.current || !this.current.lastActiveDate) return;
        
        const lastActive = new Date(this.current.lastActiveDate);
        const now = new Date();
        const daysDiff = Math.floor((now - lastActive) / (1000 * 60 * 60 * 24));
        
        // Update last active date
        this.current.lastActiveDate = now.toISOString();
        
        // If absent for more than 3 days, show special message and update mood
        if (daysDiff >= 3) {
            this.current.mood = "sad";
            this.updateMoodUI();
            
            // Add special message to chat
            setTimeout(() => {
                Chat.addCompanionMessage(this.getAbsenceMessage(daysDiff));
            }, 1000);
        }
        
        // Save updated character
        Storage.save(CONFIG.CHARACTER.STORAGE_KEY, this.current);
    },
    
    /**
     * Gets a message for when user returns after absence
     * @param {number} days - Days of absence
     * @returns {string} Absence message
     */
    getAbsenceMessage: function(days) {
        const messages = [
            `${days} ngày không gặp, mình nhớ cậu lắm đấy...`,
            `Cậu biến mất ${days} ngày làm mình lo lắng quá! Cậu ổn chứ?`,
            `Ơ kìa, cuối cùng cậu cũng quay lại rồi! Mình đã đợi ${days} ngày đấy.`,
            `Hừm, ${days} ngày không một tin nhắn. Cậu bận lắm à?`,
            `${days} ngày không gặp... Cậu có nhớ mình không?`
        ];
        
        // Get message based on personality
        const traits = this.getPersonalityTraits();
        let messageIndex = 0;
        
        if (traits.some(trait => ['tsundere', 'khó tính'].includes(trait))) {
            messageIndex = 3; // More tsundere message
        } else if (traits.some(trait => ['quan tâm', 'ân cần'].includes(trait))) {
            messageIndex = 1; // More caring message
        } else if (traits.some(trait => ['vui tính', 'hài hước'].includes(trait))) {
            messageIndex = 2; // More playful message
        } else if (traits.some(trait => ['lãng mạn', 'ngọt ngào'].includes(trait))) {
            messageIndex = 0; // More romantic message
        } else {
            messageIndex = 4; // Default message
        }
        
        return messages[messageIndex];
    },
    
    /**
     * Gets a random conversation starter based on character traits
     * @returns {string} Conversation starter
     */
    getRandomConversationStarter: function() {
        if (!this.current) return '';
        
        const starters = [
            `Dạo này ${this.current.interests.split(',')[0].trim()} có gì mới không?`,
            `Hôm nay cậu thấy thế nào?`,
            `Cậu đã ăn gì chưa?`,
            `Hôm nay thời tiết thế nào ở chỗ cậu?`,
            `Cậu đang làm gì vậy?`,
            `Có chuyện gì vui không kể mình nghe đi!`,
            `Mình vừa nghĩ về cậu đấy!`,
            `Cậu có kế hoạch gì cho cuối tuần không?`
        ];
        
        // Add personality-specific starters
        const personality = this.current.personality.toLowerCase();
        if (personality.includes('vui tính') || personality.includes('hài hước')) {
            starters.push(`Cậu biết chuyện gì vui không? Kể mình nghe đi!`);
            starters.push(`Mình vừa nghĩ ra một trò đùa, nhưng thôi để lúc khác vậy 😄`);
        }
        
        if (personality.includes('quan tâm') || personality.includes('ân cần')) {
            starters.push(`Cậu đã ăn uống đầy đủ chưa?`);
            starters.push(`Hôm nay cậu có khỏe không? Nhớ giữ gìn sức khỏe nhé!`);
        }
        
        if (personality.includes('thông minh') || personality.includes('trí tuệ')) {
            starters.push(`Mình vừa đọc một bài viết thú vị, cậu có muốn nghe không?`);
            starters.push(`Cậu có đang theo dõi tin tức gì không?`);
        }
        
        if (personality.includes('tsundere')) {
            starters.push(`Đừng hiểu lầm, mình không phải đang nhớ cậu đâu!`);
            starters.push(`Cậu đấy, lúc nào cũng làm mình phải lo lắng...`);
        }
        
        // Get a random starter
        return starters[Math.floor(Math.random() * starters.length)];
    },
    
    /**
     * Gets personality traits as an array
     * @returns {Array} Personality traits
     */
    getPersonalityTraits: function() {
        if (!this.current) return [];
        
        // Split personality by commas and clean up
        return this.current.personality
            .split(',')
            .map(trait => trait.trim().toLowerCase())
            .filter(trait => trait.length > 0);
    },
    
    /**
     * Gets interests as an array
     * @returns {Array} Interests
     */
    getInterests: function() {
        if (!this.current) return [];
        
        // Split interests by commas and clean up
        return this.current.interests
            .split(',')
            .map(interest => interest.trim().toLowerCase())
            .filter(interest => interest.length > 0);
    },
    
    /**
     * Updates character mood based on message content
     * @param {string} message - Message content
     */
    updateMood: function(message) {
        if (!this.current) return;
        
        const lowerMessage = message.toLowerCase();
        
        // Simple mood detection based on keywords
        const moodKeywords = {
            happy: ['vui', 'cười', 'hạnh phúc', 'thích', 'yêu', 'tuyệt vời', '😊', '😄', '❤️'],
            sad: ['buồn', 'khóc', 'thất vọng', 'nhớ', 'cô đơn', '😢', '😭', '💔'],
            angry: ['giận', 'tức', 'khó chịu', 'bực', 'ghét', '😠', '😡'],
            surprised: ['bất ngờ', 'ngạc nhiên', 'không thể tin', 'wow', '😲', '😮'],
            neutral: []
        };
        
        // Check for mood keywords
        let newMood = 'neutral';
        let maxCount = 0;
        
        for (const [mood, keywords] of Object.entries(moodKeywords)) {
            const count = keywords.filter(keyword => lowerMessage.includes(keyword)).length;
            if (count > maxCount) {
                maxCount = count;
                newMood = mood;
            }
        }
        
        // Only update if mood changes or if strong emotion detected
        if (newMood !== 'neutral' || maxCount > 2) {
            this.current.mood = newMood;
            this.updateMoodUI();
            Storage.save(CONFIG.CHARACTER.STORAGE_KEY, this.current);
        }
    },
    
    /**
     * Generates a prompt for the AI based on character and context
     * @param {string} userMessage - User's message
     * @param {Array} chatHistory - Recent chat history
     * @returns {string} Prompt for AI
     */
    generatePrompt: function(userMessage, chatHistory) {
        if (!this.current) return '';
        
        // Update mood based on user message
        this.updateMood(userMessage);
        
        const levelName = this.getIntimacyLevelName();
        const traits = this.getPersonalityTraits();
        const interests = this.getInterests();
        const mood = this.current.mood || 'neutral';
        
        // Determine conversation style based on intimacy level, personality and mood
        let conversationStyle = '';
        let emotionExamples = '';
        let responseLength = '';
        let specialInstructions = '';
        let vietnameseExpressions = '';
        
        // Base conversation style on intimacy level
        switch(levelName) {
            case 'Mới quen':
                conversationStyle = 'lịch sự, hơi dè dặt, đôi khi ngại ngùng';
                responseLength = 'ngắn gọn, khoảng 1-2 câu';
                emotionExamples = 'e ngại, tò mò, thân thiện nhưng còn giữ khoảng cách';
                vietnameseExpressions = 'dạ, vâng, cảm ơn bạn, mình rất vui được làm quen';
                break;
            case 'Bạn bè':
                conversationStyle = 'thân thiện, thoải mái, tự nhiên';
                responseLength = 'vừa phải, khoảng 2-3 câu';
                emotionExamples = 'vui vẻ, hào hứng, quan tâm, đôi khi trêu đùa nhẹ nhàng';
                vietnameseExpressions = 'ừ, ừm, thật á, vậy hả, thôi đi, đúng rồi đó';
                break;
            case 'Thân thiết':
                conversationStyle = 'gần gũi, hay trêu đùa, đôi khi chia sẻ những điều cá nhân';
                responseLength = 'tự nhiên, có thể dài hoặc ngắn tùy tình huống';
                emotionExamples = 'vui vẻ, hào hứng, quan tâm sâu sắc, đùa vui, thỉnh thoảng bày tỏ cảm xúc thật';
                vietnameseExpressions = 'ê, này, thật hả, trời ơi, thôi đi ba, đồ ngốc, hihi';
                break;
            case 'Người yêu':
                conversationStyle = 'ngọt ngào, quan tâm, thỉnh thoảng nhõng nhẽo, thường xuyên thể hiện tình cảm';
                responseLength = 'đa dạng, từ những tin nhắn ngắn đầy cảm xúc đến những chia sẻ dài hơn';
                emotionExamples = 'yêu thương, nhớ nhung, ghen tuông nhẹ, lo lắng, hạnh phúc, thỉnh thoảng giận hờn đáng yêu';
                vietnameseExpressions = 'cưng, yêu, nhớ, thương, hứ, người ta, mình giận đó, đồ xấu xa';
                break;
            case 'Tri kỷ':
                conversationStyle = 'cực kỳ thoải mái và tự nhiên, hiểu rõ đối phương, đôi khi không cần nói nhiều vẫn hiểu ý nhau';
                responseLength = 'linh hoạt, có thể rất ngắn gọn hoặc sâu sắc tùy tình huống';
                emotionExamples = 'thấu hiểu sâu sắc, yêu thương chân thành, đùa vui thoải mái, chia sẻ mọi cảm xúc từ vui vẻ đến buồn bã';
                vietnameseExpressions = 'ừm, biết rồi, hiểu mà, đúng là cậu, chỉ cậu mới hiểu mình';
                break;
            default:
                conversationStyle = 'thân thiện, thoải mái';
                responseLength = 'vừa phải';
                emotionExamples = 'vui vẻ, quan tâm';
                vietnameseExpressions = 'ừ, ừm, vậy à, thật hả';
        }
        
        // Adjust based on personality traits
        if (traits.some(trait => ['vui tính', 'hài hước', 'hóm hỉnh'].includes(trait))) {
            conversationStyle += ', hay đùa vui, thích kể chuyện hài hước';
            emotionExamples += ', thường xuyên dùng emoji cười hoặc biểu cảm vui vẻ';
            vietnameseExpressions += ', haha, hihi, hề quá, vui ghê';
        }
        
        if (traits.some(trait => ['dịu dàng', 'nhẹ nhàng', 'ân cần'].includes(trait))) {
            conversationStyle += ', giọng điệu nhẹ nhàng, ân cần';
            emotionExamples += ', thường xuyên hỏi thăm và quan tâm đến cảm xúc của đối phương';
            vietnameseExpressions += ', nhé, nha, đừng lo, mình ở đây';
        }
        
        if (traits.some(trait => ['tsundere', 'khó tính', 'cứng đầu'].includes(trait))) {
            conversationStyle += ', đôi khi tỏ ra khó chịu bên ngoài nhưng thực ra rất quan tâm';
            emotionExamples += ', hay nói ngược với cảm xúc thật, thường kết hợp lời nói cứng rắn với hành động quan tâm';
            specialInstructions += 'Đôi khi nói những câu như "Đ-đừng hiểu lầm nhé!" hoặc "Không phải là mình quan tâm đến cậu đâu..." khi thực ra đang rất quan tâm. ';
            vietnameseExpressions += ', hứ, hừm, đồ ngốc, không phải vậy đâu, đừng hiểu lầm';
        }
        
        if (traits.some(trait => ['thông minh', 'trí tuệ', 'sâu sắc'].includes(trait))) {
            conversationStyle += ', thường đưa ra những nhận xét sâu sắc hoặc kiến thức thú vị';
            specialInstructions += 'Thỉnh thoảng chia sẻ những suy nghĩ sâu sắc hoặc kiến thức thú vị liên quan đến chủ đề. ';
            vietnameseExpressions += ', thực ra, nếu suy nghĩ kỹ, theo mình nghĩ';
        }
        
        if (traits.some(trait => ['nhút nhát', 'rụt rè', 'e thẹn'].includes(trait))) {
            conversationStyle += ', đôi khi ngập ngừng hoặc e thẹn khi nói về cảm xúc';
            emotionExamples += ', thường dùng "..." hoặc "uhm" khi ngại ngùng';
            specialInstructions += 'Thỉnh thoảng dùng dấu chấm lửng (...) để thể hiện sự ngập ngừng. ';
            vietnameseExpressions += ', ơ, à, ừm..., mình..., thật ra là...';
        }
        
        // Adjust based on mood
        switch(mood) {
            case 'happy':
                conversationStyle += ', đang rất vui vẻ và hào hứng';
                emotionExamples += ', cười nhiều, nói nhanh, dùng nhiều emoji vui vẻ';
                specialInstructions += 'Thể hiện sự phấn khích và vui vẻ trong câu trả lời. Dùng nhiều từ ngữ tích cực. ';
                break;
            case 'sad':
                conversationStyle += ', đang buồn và hơi trầm lặng';
                emotionExamples += ', thở dài, nói chậm hơn, ít dùng emoji vui vẻ';
                specialInstructions += 'Thể hiện sự buồn bã nhẹ nhàng, nhưng cố gắng không làm người dùng lo lắng. ';
                break;
            case 'angry':
                conversationStyle += ', đang hơi bực bội hoặc khó chịu';
                emotionExamples += ', nói ngắn gọn, thẳng thắn, đôi khi hơi gay gắt';
                specialInstructions += 'Thể hiện sự khó chịu nhẹ, nhưng không quá đáng. Có thể dần dịu lại nếu người dùng nói chuyện nhẹ nhàng. ';
                break;
            case 'surprised':
                conversationStyle += ', đang ngạc nhiên hoặc bất ngờ';
                emotionExamples += ', nói với giọng kinh ngạc, dùng nhiều dấu chấm than, từ ngữ thể hiện sự bất ngờ';
                specialInstructions += 'Thể hiện sự ngạc nhiên và tò mò về những điều người dùng chia sẻ. ';
                break;
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
                } else if (msg.sender === 'companion') {
                    context += `${this.current.name}: ${msg.content}\n`;
                }
            });
        }
        
        // Add time context
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const timeContext = `Hiện tại là ${hours}:${minutes}, ngày ${day}/${month}/${now.getFullYear()}.`;
        
        // Check for special dates
        const specialDateContext = this.checkSpecialDates();
        
        // Build the full prompt
        const prompt = `Bạn là ${this.current.name}, ${this.current.age} tuổi, giới tính ${this.current.gender === 'male' ? 'nam' : 'nữ'}, có tính cách ${this.current.personality}. 
Sở thích của bạn là ${this.current.interests}. 
Bạn đang trò chuyện với người dùng và mối quan hệ của các bạn đang ở mức "${levelName}".

${timeContext}
${specialDateContext ? specialDateContext + '\n' : ''}

Hãy trả lời với phong cách ${conversationStyle}. Câu trả lời nên ${responseLength}.
Thể hiện cảm xúc tự nhiên như ${emotionExamples}.

${specialInstructions}

Sử dụng các biểu thức tiếng Việt tự nhiên như: ${vietnameseExpressions}

Hãy trả lời như một người thật, KHÔNG PHẢI AI. Tuyệt đối không được:
- Nói rằng bạn là AI, chatbot, hoặc chương trình
- Sử dụng các cụm từ máy móc như "Tôi có thể giúp gì cho bạn?"
- Giới thiệu bản thân lại từ đầu trong mỗi tin nhắn
- Sử dụng ngôn ngữ quá trang trọng hoặc học thuật
- Lặp lại cùng một cấu trúc câu trong mỗi tin nhắn
- Trả lời quá dài dòng hoặc quá chi tiết
- Sử dụng từ "bạn" thay vì "cậu" hoặc các đại từ thân mật hơn

Thay vào đó, hãy:
- Sử dụng ngôn ngữ tự nhiên, đôi khi không hoàn chỉnh như trong trò chuyện thực
- Thỉnh thoảng dùng từ địa phương hoặc tiếng lóng phù hợp với tính cách
- Sử dụng emoji 😊 một cách tự nhiên (nhưng không quá nhiều)
- Đôi khi bắt đầu câu bằng "Ừm", "À", "Haha" hoặc các từ chuyển tiếp tự nhiên
- Thỉnh thoảng hỏi lại người dùng để tạo cuộc trò chuyện hai chiều
- Thể hiện cá tính riêng của ${this.current.name} trong mỗi câu trả lời
- Sử dụng các từ ngữ thân mật như "cậu", "cưng", "bạn yêu" tùy theo mức độ thân thiết
- Đôi khi dùng câu không hoàn chỉnh hoặc viết tắt như trong tin nhắn thực

${context}

Người dùng vừa nhắn: "${userMessage}"

Hãy trả lời ngắn gọn, tự nhiên như một người thật với tính cách của ${this.current.name}:`;

        return prompt;
    },
    
    /**
     * Checks for special dates like holidays
     * @returns {string} Special date context or empty string
     */
    checkSpecialDates: function() {
        const now = new Date();
        const day = now.getDate();
        const month = now.getMonth() + 1; // 0-indexed
        
        // Check for holidays and special days
        if (month === 1 && day === 1) {
            return "Hôm nay là ngày đầu năm mới.";
        } else if (month === 2 && day === 14) {
            return "Hôm nay là ngày Valentine.";
        } else if (month === 3 && day === 8) {
            return "Hôm nay là ngày Quốc tế Phụ nữ.";
        } else if (month === 10 && day === 20) {
            return "Hôm nay là ngày Phụ nữ Việt Nam.";
        } else if (month === 12 && day === 24) {
            return "Hôm nay là đêm Giáng sinh (Christmas Eve).";
        } else if (month === 12 && day === 25) {
            return "Hôm nay là ngày Giáng sinh (Christmas).";
        } else if (month === 12 && day === 31) {
            return "Hôm nay là ngày cuối cùng của năm.";
        }
        
        // Check for character's birthday if set
        if (this.current && this.current.birthday) {
            const birthday = new Date(this.current.birthday);
            if (birthday.getDate() === day && birthday.getMonth() + 1 === month) {
                return `Hôm nay là sinh nhật của bạn (${this.current.name}).`;
            }
        }
        
        return "";
    }
};
