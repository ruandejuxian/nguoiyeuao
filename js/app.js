// Main Application JavaScript for Virtual Lover App

// Global variables
let currentCharacter = null;
let chatHistory = [];
let intimacyLevel = 0;
let diaryEntries = [];
let isLoggedIn = false;
let geminiApiKey = '';
let currentTab = 'chat';
let typingTimeout = null;

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
    
    // Set up event listeners
    setupEventListeners();
});

// Initialize the application
function initApp() {
    console.log('Initializing Virtual Lover App...');
    
    // Load data from localStorage
    loadFromLocalStorage();
    
    // Check if first time setup is needed
    if (!currentCharacter || !geminiApiKey) {
        showSetupModal();
    } else {
        // Update UI with character info
        updateCharacterInfo();
        
        // Load chat history
        displayChatHistory();
        
        // Load diary entries
        displayDiaryEntries();
        
        // Update intimacy level display
        updateIntimacyDisplay();
    }
}

// Set up event listeners
function setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
    
    // Character form submission
    document.getElementById('character-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveCharacter();
    });
    
    // Quick setup form submission
    document.getElementById('quick-setup-form').addEventListener('submit', function(e) {
        e.preventDefault();
        quickSetupCharacter();
    });
    
    // Send message button
    document.getElementById('send-btn').addEventListener('click', sendMessage);
    
    // Enter key in chat input
    document.getElementById('chat-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Emoji button
    document.getElementById('emoji-btn').addEventListener('click', toggleEmojiPicker);
    
    // Image upload button
    document.getElementById('image-btn').addEventListener('click', function() {
        document.getElementById('image-upload').click();
    });
    
    // Image file selected
    document.getElementById('image-upload').addEventListener('change', handleImageUpload);
    
    // Google login buttons
    document.getElementById('login-google').addEventListener('click', loginWithGoogle);
    document.getElementById('login-google-settings').addEventListener('click', loginWithGoogle);
    
    // Cloud storage buttons
    document.getElementById('save-to-cloud').addEventListener('click', saveToCloud);
    document.getElementById('load-from-cloud').addEventListener('click', loadFromCloud);
    
    // Data management buttons
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', importData);
    document.getElementById('clear-data').addEventListener('click', confirmClearData);
    
    // API key save button
    document.getElementById('save-api-key').addEventListener('click', saveApiKey);
    
    // Mini-game buttons
    document.getElementById('guess-preference-game').addEventListener('click', startGuessPreferenceGame);
    document.getElementById('trivia-game').addEventListener('click', startTriviaGame);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('setup-modal');
        if (e.target === modal) {
            // Don't close if it's the first setup
            if (currentCharacter && geminiApiKey) {
                modal.style.display = 'none';
            }
        }
    });
}

// Switch between tabs
function switchTab(tabName) {
    // Update active tab
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`.tab[data-tab="${tabName}"]`).classList.add('active');
    
    // Update active content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Update current tab
    currentTab = tabName;
    
    // Scroll chat to bottom when switching to chat tab
    if (tabName === 'chat') {
        scrollChatToBottom();
    }
}

// Show setup modal for first-time users
function showSetupModal() {
    document.getElementById('setup-modal').style.display = 'flex';
}

// Quick setup for new character
function quickSetupCharacter() {
    const name = document.getElementById('quick-name').value.trim();
    const personality = document.getElementById('quick-personality').value.trim();
    const interests = document.getElementById('quick-interests').value.trim();
    const apiKey = document.getElementById('gemini-api-key-setup').value.trim();
    
    if (!name || !personality || !interests || !apiKey) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }
    
    // Create new character
    currentCharacter = {
        name: name,
        age: '',
        personality: personality,
        interests: interests,
        speakingStyle: '',
        createdAt: new Date().toISOString()
    };
    
    // Save API key
    geminiApiKey = apiKey;
    
    // Reset other data
    chatHistory = [];
    intimacyLevel = 0;
    diaryEntries = [];
    
    // Save to localStorage
    saveToLocalStorage();
    
    // Update UI
    updateCharacterInfo();
    updateIntimacyDisplay();
    
    // Hide modal
    document.getElementById('setup-modal').style.display = 'none';
    
    // Add welcome message
    addCharacterMessage(`Xin chào! Mình là ${name}. Rất vui được làm quen với bạn! 😊`);
}

// Load data from localStorage
function loadFromLocalStorage() {
    try {
        // Load character
        const savedCharacter = localStorage.getItem('virtualLover_character');
        if (savedCharacter) {
            currentCharacter = JSON.parse(savedCharacter);
        }
        
        // Load chat history
        const savedChatHistory = localStorage.getItem('virtualLover_chatHistory');
        if (savedChatHistory) {
            chatHistory = JSON.parse(savedChatHistory);
        }
        
        // Load intimacy level
        const savedIntimacyLevel = localStorage.getItem('virtualLover_intimacyLevel');
        if (savedIntimacyLevel) {
            intimacyLevel = parseInt(savedIntimacyLevel);
        }
        
        // Load diary entries
        const savedDiaryEntries = localStorage.getItem('virtualLover_diaryEntries');
        if (savedDiaryEntries) {
            diaryEntries = JSON.parse(savedDiaryEntries);
        }
        
        // Load API key
        const savedApiKey = localStorage.getItem('virtualLover_geminiApiKey');
        if (savedApiKey) {
            geminiApiKey = savedApiKey;
        }
        
        console.log('Data loaded from localStorage');
    } catch (error) {
        console.error('Error loading data from localStorage:', error);
    }
}

// Save data to localStorage
function saveToLocalStorage() {
    try {
        // Save character
        if (currentCharacter) {
            localStorage.setItem('virtualLover_character', JSON.stringify(currentCharacter));
        }
        
        // Save chat history
        localStorage.setItem('virtualLover_chatHistory', JSON.stringify(chatHistory));
        
        // Save intimacy level
        localStorage.setItem('virtualLover_intimacyLevel', intimacyLevel.toString());
        
        // Save diary entries
        localStorage.setItem('virtualLover_diaryEntries', JSON.stringify(diaryEntries));
        
        // Save API key
        localStorage.setItem('virtualLover_geminiApiKey', geminiApiKey);
        
        console.log('Data saved to localStorage');
    } catch (error) {
        console.error('Error saving data to localStorage:', error);
    }
}

// Update character info display
function updateCharacterInfo() {
    if (!currentCharacter) return;
    
    document.getElementById('character-name').textContent = currentCharacter.name;
    document.getElementById('character-personality').textContent = currentCharacter.personality;
    document.getElementById('character-interests').textContent = currentCharacter.interests;
    
    // Update form fields
    document.getElementById('name').value = currentCharacter.name;
    document.getElementById('age').value = currentCharacter.age || '';
    document.getElementById('personality').value = currentCharacter.personality;
    document.getElementById('interests').value = currentCharacter.interests;
    document.getElementById('speaking-style').value = currentCharacter.speakingStyle || '';
}

// Update intimacy level display
function updateIntimacyDisplay() {
    const progressElement = document.getElementById('intimacy-progress');
    const textElement = document.getElementById('intimacy-text');
    
    // Calculate percentage (max 100)
    const percentage = Math.min(intimacyLevel, 100);
    
    // Set the old width as a CSS variable for animation
    progressElement.style.setProperty('--from-width', progressElement.style.width || '0%');
    
    // Set the new width as a CSS variable for animation
    progressElement.style.setProperty('--to-width', `${percentage}%`);
    
    // Add animation class
    progressElement.classList.add('animate');
    
    // Set the width directly after a small delay
    setTimeout(() => {
        progressElement.style.width = `${percentage}%`;
    }, 50);
    
    // Remove animation class after animation completes
    setTimeout(() => {
        progressElement.classList.remove('animate');
    }, 1050);
    
    // Update text based on intimacy level
    let relationshipStatus = 'Mới quen';
    if (intimacyLevel >= 80) {
        relationshipStatus = 'Tri kỷ';
    } else if (intimacyLevel >= 50) {
        relationshipStatus = 'Người yêu';
    } else if (intimacyLevel >= 30) {
        relationshipStatus = 'Bạn thân';
    } else if (intimacyLevel >= 10) {
        relationshipStatus = 'Bạn bè';
    }
    
    textElement.textContent = `Mức độ thân thiết: ${relationshipStatus}`;
}

// Toggle emoji picker visibility
function toggleEmojiPicker() {
    const emojiPicker = document.getElementById('emoji-picker');
    
    if (emojiPicker.style.display === 'block') {
        emojiPicker.style.display = 'none';
    } else {
        // If emoji picker is empty, populate it
        if (emojiPicker.children.length === 0) {
            populateEmojiPicker();
        }
        
        emojiPicker.style.display = 'block';
    }
}

// Populate emoji picker with emojis
function populateEmojiPicker() {
    const emojiPicker = document.getElementById('emoji-picker');
    
    // Define emoji categories
    const categories = [
        {
            name: 'Cảm xúc',
            emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕']
        },
        {
            name: 'Trái tim',
            emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟']
        },
        {
            name: 'Cử chỉ',
            emojis: ['👍', '👎', '👊', '✊', '🤛', '🤜', '🤞', '✌️', '🤟', '🤘', '👌', '🤏', '👈', '👉', '👆', '👇', '☝️', '✋', '🤚', '🖐', '🖖', '👋', '🤙', '💪', '🖕', '✍️', '🙏', '🦾', '🦿', '🦶', '🦵', '👂', '🦻', '👃', '👣', '👁', '👀', '🧠', '🗣', '👤', '👥', '👶', '👧', '🧒', '👦', '👩', '🧑', '👨']
        }
    ];
    
    // Create emoji picker HTML
    categories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'emoji-category';
        
        const categoryTitle = document.createElement('div');
        categoryTitle.className = 'emoji-category-title';
        categoryTitle.textContent = category.name;
        categoryDiv.appendChild(categoryTitle);
        
        const emojiGrid = document.createElement('div');
        emojiGrid.className = 'emoji-grid';
        
        category.emojis.forEach(emoji => {
            const emojiSpan = document.createElement('span');
            emojiSpan.className = 'emoji';
            emojiSpan.textContent = emoji;
            emojiSpan.addEventListener('click', () => {
                insertEmoji(emoji);
            });
            emojiGrid.appendChild(emojiSpan);
        });
        
        categoryDiv.appendChild(emojiGrid);
        emojiPicker.appendChild(categoryDiv);
    });
}

// Insert emoji into chat input
function insertEmoji(emoji) {
    const chatInput = document.getElementById('chat-input');
    chatInput.value += emoji;
    chatInput.focus();
    
    // Hide emoji picker
    document.getElementById('emoji-picker').style.display = 'none';
}

// Handle image upload
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file hình ảnh!');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(event) {
        // Add image message to chat
        addUserImageMessage(event.target.result);
        
        // Reset file input
        document.getElementById('image-upload').value = '';
    };
    reader.readAsDataURL(file);
}

// Scroll chat to bottom
function scrollChatToBottom() {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Export data as JSON file
function exportData() {
    const data = {
        character: currentCharacter,
        chatHistory: chatHistory,
        intimacyLevel: intimacyLevel,
        diaryEntries: diaryEntries
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `virtual_lover_backup_${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Import data from JSON file
function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = e => {
        const file = e.target.files[0];
        
        const reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        
        reader.onload = readerEvent => {
            try {
                const content = readerEvent.target.result;
                const data = JSON.parse(content);
                
                // Validate data structure
                if (!data.character || !Array.isArray(data.chatHistory)) {
                    throw new Error('Invalid data format');
                }
                
                // Import data
                currentCharacter = data.character;
                chatHistory = data.chatHistory;
                intimacyLevel = data.intimacyLevel || 0;
                diaryEntries = data.diaryEntries || [];
                
                // Save to localStorage
                saveToLocalStorage();
                
                // Update UI
                updateCharacterInfo();
                displayChatHistory();
                displayDiaryEntries();
                updateIntimacyDisplay();
                
                alert('Dữ liệu đã được nhập thành công!');
            } catch (error) {
                console.error('Error importing data:', error);
                alert('Lỗi khi nhập dữ liệu. Vui lòng kiểm tra file và thử lại.');
            }
        };
    };
    
    input.click();
}

// Confirm before clearing all data
function confirmClearData() {
    if (confirm('Bạn có chắc chắn muốn xóa tất cả dữ liệu? Hành động này không thể hoàn tác.')) {
        clearAllData();
    }
}

// Clear all data
function clearAllData() {
    // Clear data
    currentCharacter = null;
    chatHistory = [];
    intimacyLevel = 0;
    diaryEntries = [];
    
    // Keep API key for convenience
    
    // Clear localStorage
    localStorage.removeItem('virtualLover_character');
    localStorage.removeItem('virtualLover_chatHistory');
    localStorage.removeItem('virtualLover_intimacyLevel');
    localStorage.removeItem('virtualLover_diaryEntries');
    
    // Update UI
    document.getElementById('character-name').textContent = 'Chưa đặt tên';
    document.getElementById('character-personality').textContent = 'Chưa xác định';
    document.getElementById('character-interests').textContent = 'Chưa xác định';
    
    // Clear chat messages
    document.getElementById('chat-messages').innerHTML = '';
    
    // Clear diary entries
    document.getElementById('diary-entries').innerHTML = `
        <div class="empty-diary">
            <p>Chưa có kỷ niệm nào được lưu lại.</p>
            <p>Hãy trò chuyện nhiều hơn để tạo kỷ niệm đáng nhớ!</p>
        </div>
    `;
    
    // Reset intimacy level
    updateIntimacyDisplay();
    
    // Show setup modal
    showSetupModal();
    
    alert('Đã xóa tất cả dữ liệu thành công!');
}

// Save API key
function saveApiKey() {
    const apiKey = document.getElementById('gemini-api-key').value.trim();
    
    if (!apiKey) {
        alert('Vui lòng nhập API key!');
        return;
    }
    
    geminiApiKey = apiKey;
    saveToLocalStorage();
    
    alert('API key đã được lưu thành công!');
}

// Placeholder functions for Google API integration
function loginWithGoogle() {
    alert('Chức năng đăng nhập Google sẽ được triển khai sau khi có Client ID!');
}

function saveToCloud() {
    alert('Chức năng lưu lên Cloud sẽ được triển khai sau khi đăng nhập Google!');
}

function loadFromCloud() {
    alert('Chức năng tải từ Cloud sẽ được triển khai sau khi đăng nhập Google!');
}

// Placeholder functions for mini-games
function startGuessPreferenceGame() {
    if (!currentCharacter) {
        alert('Vui lòng tạo nhân vật trước khi chơi mini-game!');
        return;
    }
    
    const gameArea = document.getElementById('game-area');
    gameArea.style.display = 'block';
    gameArea.innerHTML = `
        <h3>Đoán sở thích của ${currentCharacter.name}</h3>
        <p>Chức năng mini-game sẽ được triển khai trong phiên bản tiếp theo!</p>
        <button class="btn" onclick="document.getElementById('game-area').style.display = 'none';">Đóng</button>
    `;
}

function startTriviaGame() {
    if (!currentCharacter) {
        alert('Vui lòng tạo nhân vật trước khi chơi mini-game!');
        return;
    }
    
    const gameArea = document.getElementById('game-area');
    gameArea.style.display = 'block';
    gameArea.innerHTML = `
        <h3>Câu đố tình yêu với ${currentCharacter.name}</h3>
        <p>Chức năng mini-game sẽ được triển khai trong phiên bản tiếp theo!</p>
        <button class="btn" onclick="document.getElementById('game-area').style.display = 'none';">Đóng</button>
    `;
}
