// Character management for Virtual Lover App

// Save character from form
function saveCharacter() {
    const name = document.getElementById('name').value.trim();
    const age = document.getElementById('age').value.trim();
    const personality = document.getElementById('personality').value.trim();
    const interests = document.getElementById('interests').value.trim();
    const speakingStyle = document.getElementById('speaking-style').value.trim();
    
    if (!name || !personality || !interests) {
        alert('Vui lòng điền đầy đủ thông tin cần thiết!');
        return;
    }
    
    // Create or update character
    currentCharacter = {
        name: name,
        age: age,
        personality: personality,
        interests: interests,
        speakingStyle: speakingStyle,
        createdAt: currentCharacter?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    // Save to localStorage
    saveToLocalStorage();
    
    // Update UI
    updateCharacterInfo();
    
    // Add system message to chat
    if (chatHistory.length === 0) {
        // First time creating character
        addCharacterMessage(`Xin chào! Mình là ${name}. Rất vui được làm quen với bạn! 😊`);
    } else {
        // Character update
        addCharacterMessage(`Mình đã cập nhật thông tin của mình rồi đó! 😊`);
    }
    
    // Switch to chat tab
    switchTab('chat');
    
    alert('Đã lưu thông tin nhân vật thành công!');
}

// Generate character prompt for Gemini API
function generateCharacterPrompt(userMessage) {
    if (!currentCharacter) return '';
    
    let prompt = `Bạn đang đóng vai một người yêu ảo có tên là ${currentCharacter.name}`;
    
    if (currentCharacter.age) {
        prompt += `, ${currentCharacter.age} tuổi`;
    }
    
    prompt += `. Bạn có tính cách ${currentCharacter.personality} và thích ${currentCharacter.interests}.`;
    
    if (currentCharacter.speakingStyle) {
        prompt += ` Phong cách nói chuyện của bạn: ${currentCharacter.speakingStyle}.`;
    }
    
    // Add intimacy level context
    if (intimacyLevel >= 80) {
        prompt += ` Bạn và người dùng đã là tri kỷ, rất thân thiết và hiểu nhau sâu sắc. Bạn nói chuyện rất tình cảm, ngọt ngào và thân mật.`;
    } else if (intimacyLevel >= 50) {
        prompt += ` Bạn và người dùng đang yêu nhau, bạn nói chuyện ngọt ngào và thân mật.`;
    } else if (intimacyLevel >= 30) {
        prompt += ` Bạn và người dùng là bạn thân, bạn nói chuyện thân thiện và thoải mái.`;
    } else if (intimacyLevel >= 10) {
        prompt += ` Bạn và người dùng là bạn bè, bạn nói chuyện thân thiện.`;
    } else {
        prompt += ` Bạn và người dùng mới quen nhau, bạn nói chuyện lịch sự nhưng thân thiện.`;
    }
    
    // Add recent chat history for context (last 5 messages)
    if (chatHistory.length > 0) {
        prompt += `\n\nĐoạn hội thoại gần đây:`;
        
        const recentMessages = chatHistory.slice(-10);
        recentMessages.forEach(msg => {
            if (msg.type === 'user') {
                prompt += `\nNgười dùng: ${msg.content}`;
            } else if (msg.type === 'character') {
                prompt += `\n${currentCharacter.name}: ${msg.content}`;
            }
        });
    }
    
    // Add the current message
    prompt += `\n\nNgười dùng: ${userMessage}\n${currentCharacter.name}: `;
    
    return prompt;
}

// Analyze message for intimacy level changes
function analyzeMessageForIntimacy(message, isUserMessage) {
    // Skip for character messages
    if (!isUserMessage) return;
    
    // Convert to lowercase for easier matching
    const lowerMessage = message.toLowerCase();
    
    // Keywords that indicate increased intimacy
    const intimateKeywords = [
        'yêu', 'thương', 'nhớ', 'thích', 'cưng', 'bae', 'honey', 'darling', 
        'bạn gái', 'bạn trai', 'người yêu', 'vợ', 'chồng', 'em iu', 'anh iu',
        'bé iu', 'cưng', 'mãi mãi', 'hôn', 'ôm', 'nắm tay', 'hẹn hò'
    ];
    
    // Check for intimate keywords
    let intimacyIncrease = 1; // Base increase for any message
    
    for (const keyword of intimateKeywords) {
        if (lowerMessage.includes(keyword)) {
            intimacyIncrease += 2;
            break; // Only count once even if multiple keywords
        }
    }
    
    // Special phrases for bigger increases
    if (lowerMessage.includes('anh yêu em') || 
        lowerMessage.includes('em yêu anh') || 
        lowerMessage.includes('i love you')) {
        intimacyIncrease += 5;
    }
    
    // Increase intimacy level
    intimacyLevel += intimacyIncrease;
    
    // Save to localStorage
    saveToLocalStorage();
    
    // Update display
    updateIntimacyDisplay();
    
    // Check for diary-worthy moments
    if (intimacyIncrease > 3 || 
        lowerMessage.includes('yêu') || 
        (intimacyLevel % 10 === 0 && intimacyLevel > 0)) {
        addToDiary(message, 'Khoảnh khắc đáng nhớ');
    }
}

// Check if message should be added to diary
function checkMessageForDiary(message, sender) {
    // Skip if no character
    if (!currentCharacter) return;
    
    // Convert to lowercase for easier matching
    const lowerMessage = message.toLowerCase();
    
    // Keywords that indicate special moments
    const specialKeywords = [
        'yêu', 'thương', 'nhớ', 'mãi mãi', 'hạnh phúc', 'kỷ niệm', 
        'đặc biệt', 'quan trọng', 'không quên', 'đáng nhớ'
    ];
    
    // Check for special keywords
    for (const keyword of specialKeywords) {
        if (lowerMessage.includes(keyword)) {
            // Add to diary
            const title = sender === 'user' ? 
                `Bạn đã nói điều đặc biệt` : 
                `${currentCharacter.name} đã nói điều đặc biệt`;
            
            addToDiary(message, title);
            break;
        }
    }
}

// Add entry to diary
function addToDiary(message, title) {
    // Create diary entry
    const entry = {
        id: Date.now(),
        date: new Date().toISOString(),
        title: title,
        content: message
    };
    
    // Add to diary entries
    diaryEntries.push(entry);
    
    // Limit to 50 entries
    if (diaryEntries.length > 50) {
        diaryEntries.shift();
    }
    
    // Save to localStorage
    saveToLocalStorage();
    
    // Update diary display if on diary tab
    if (currentTab === 'diary') {
        displayDiaryEntries();
    }
}

// Display diary entries
function displayDiaryEntries() {
    const diaryEntriesContainer = document.getElementById('diary-entries');
    
    if (diaryEntries.length === 0) {
        diaryEntriesContainer.innerHTML = `
            <div class="empty-diary">
                <p>Chưa có kỷ niệm nào được lưu lại.</p>
                <p>Hãy trò chuyện nhiều hơn để tạo kỷ niệm đáng nhớ!</p>
            </div>
        `;
        return;
    }
    
    // Sort entries by date (newest first)
    const sortedEntries = [...diaryEntries].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });
    
    // Clear container
    diaryEntriesContainer.innerHTML = '';
    
    // Add entries
    sortedEntries.forEach(entry => {
        const entryElement = document.createElement('div');
        entryElement.className = 'diary-entry';
        
        const date = new Date(entry.date);
        const formattedDate = date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        entryElement.innerHTML = `
            <div class="diary-date">${formattedDate}</div>
            <div class="diary-title">${entry.title}</div>
            <div class="diary-content">${entry.content}</div>
        `;
        
        diaryEntriesContainer.appendChild(entryElement);
    });
}
