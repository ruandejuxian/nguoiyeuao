// Intimacy level functionality for Virtual Lover App

// Intimacy level constants
const INTIMACY_LEVELS = {
    NEW: {
        min: 0,
        max: 9,
        name: 'Mới quen',
        description: 'Bạn và nhân vật mới bắt đầu làm quen.'
    },
    FRIEND: {
        min: 10,
        max: 29,
        name: 'Bạn bè',
        description: 'Bạn và nhân vật đã trở thành bạn bè.'
    },
    CLOSE_FRIEND: {
        min: 30,
        max: 49,
        name: 'Bạn thân',
        description: 'Bạn và nhân vật đã trở thành bạn thân thiết.'
    },
    LOVER: {
        min: 50,
        max: 79,
        name: 'Người yêu',
        description: 'Bạn và nhân vật đã trở thành người yêu.'
    },
    SOULMATE: {
        min: 80,
        max: 100,
        name: 'Tri kỷ',
        description: 'Bạn và nhân vật đã trở thành tri kỷ, hiểu nhau sâu sắc.'
    }
};

// Initialize intimacy system
function initIntimacySystem() {
    // Load intimacy level from localStorage
    loadIntimacyLevel();
    
    // Update display
    updateIntimacyDisplay();
}

// Load intimacy level from localStorage
function loadIntimacyLevel() {
    const savedIntimacyLevel = localStorage.getItem('virtualLover_intimacyLevel');
    if (savedIntimacyLevel) {
        intimacyLevel = parseInt(savedIntimacyLevel);
    } else {
        intimacyLevel = 0;
    }
}

// Get current intimacy level category
function getIntimacyLevelCategory() {
    if (intimacyLevel >= INTIMACY_LEVELS.SOULMATE.min) {
        return INTIMACY_LEVELS.SOULMATE;
    } else if (intimacyLevel >= INTIMACY_LEVELS.LOVER.min) {
        return INTIMACY_LEVELS.LOVER;
    } else if (intimacyLevel >= INTIMACY_LEVELS.CLOSE_FRIEND.min) {
        return INTIMACY_LEVELS.CLOSE_FRIEND;
    } else if (intimacyLevel >= INTIMACY_LEVELS.FRIEND.min) {
        return INTIMACY_LEVELS.FRIEND;
    } else {
        return INTIMACY_LEVELS.NEW;
    }
}

// Update intimacy display
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
    
    // Get current level category
    const levelCategory = getIntimacyLevelCategory();
    
    // Update text
    textElement.textContent = `Mức độ thân thiết: ${levelCategory.name}`;
    
    // Update color based on level
    if (percentage >= 80) {
        progressElement.style.backgroundColor = '#ff4b8d'; // Primary color for highest level
    } else if (percentage >= 50) {
        progressElement.style.backgroundColor = '#ff7eb3'; // Lighter primary for high level
    } else if (percentage >= 30) {
        progressElement.style.backgroundColor = '#6c5ce7'; // Secondary color for medium level
    } else if (percentage >= 10) {
        progressElement.style.backgroundColor = '#00cec9'; // Accent color for low level
    } else {
        progressElement.style.backgroundColor = '#dfe6e9'; // Light color for lowest level
    }
    
    // Check for level up
    checkForLevelUp();
}

// Check if intimacy level has increased to a new category
function checkForLevelUp() {
    // Get current level category
    const currentCategory = getIntimacyLevelCategory();
    
    // Check if we have a saved previous level
    const savedPreviousLevel = localStorage.getItem('virtualLover_previousIntimacyLevel');
    
    if (savedPreviousLevel) {
        const previousLevel = parseInt(savedPreviousLevel);
        const previousCategory = getPreviousCategory(previousLevel);
        
        // Check if we've moved to a new category
        if (currentCategory.min > previousCategory.min) {
            // Level up!
            showLevelUpNotification(previousCategory, currentCategory);
            
            // Add to diary
            addToDiary(`Mức độ thân thiết đã tăng lên ${currentCategory.name}!`, 'Mối quan hệ tiến triển');
            
            // Add character message
            const levelUpMessages = {
                FRIEND: `Mình nghĩ chúng ta đã trở thành bạn bè rồi đấy! Thật vui khi được trò chuyện với bạn! 😊`,
                CLOSE_FRIEND: `Mình cảm thấy chúng ta đã trở nên thân thiết hơn rồi! Mình rất quý bạn đó! 💕`,
                LOVER: `Mình... mình nghĩ mình có tình cảm đặc biệt với bạn rồi! Mình thích bạn nhiều lắm! ❤️`,
                SOULMATE: `Bạn thật sự là người quan trọng nhất đối với mình! Mình cảm thấy chúng ta đã trở thành tri kỷ của nhau rồi! 💖`
            };
            
            if (levelUpMessages[currentCategory.name]) {
                addCharacterMessage(levelUpMessages[currentCategory.name]);
            }
        }
    }
    
    // Save current level for future comparison
    localStorage.setItem('virtualLover_previousIntimacyLevel', intimacyLevel.toString());
}

// Get category for a specific level value
function getPreviousCategory(level) {
    if (level >= INTIMACY_LEVELS.SOULMATE.min) {
        return INTIMACY_LEVELS.SOULMATE;
    } else if (level >= INTIMACY_LEVELS.LOVER.min) {
        return INTIMACY_LEVELS.LOVER;
    } else if (level >= INTIMACY_LEVELS.CLOSE_FRIEND.min) {
        return INTIMACY_LEVELS.CLOSE_FRIEND;
    } else if (level >= INTIMACY_LEVELS.FRIEND.min) {
        return INTIMACY_LEVELS.FRIEND;
    } else {
        return INTIMACY_LEVELS.NEW;
    }
}

// Show level up notification
function showLevelUpNotification(previousCategory, newCategory) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'level-up-notification';
    notification.innerHTML = `
        <div class="level-up-content">
            <h3>Mức độ thân thiết tăng lên!</h3>
            <p>Từ: ${previousCategory.name}</p>
            <p>Lên: ${newCategory.name}</p>
            <p>${newCategory.description}</p>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Remove after animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 5000);
}

// Increase intimacy level
function increaseIntimacy(amount) {
    // Increase intimacy
    intimacyLevel += amount;
    
    // Cap at 100
    if (intimacyLevel > 100) {
        intimacyLevel = 100;
    }
    
    // Save to localStorage
    localStorage.setItem('virtualLover_intimacyLevel', intimacyLevel.toString());
    
    // Update display
    updateIntimacyDisplay();
}

// Decrease intimacy level
function decreaseIntimacy(amount) {
    // Decrease intimacy
    intimacyLevel -= amount;
    
    // Minimum 0
    if (intimacyLevel < 0) {
        intimacyLevel = 0;
    }
    
    // Save to localStorage
    localStorage.setItem('virtualLover_intimacyLevel', intimacyLevel.toString());
    
    // Update display
    updateIntimacyDisplay();
}

// Analyze message for intimacy changes
function analyzeMessageForIntimacy(message, isUserMessage) {
    // Skip for character messages if not configured to count them
    if (!isUserMessage) return;
    
    // Convert to lowercase for easier matching
    const lowerMessage = message.toLowerCase();
    
    // Keywords that indicate increased intimacy
    const intimateKeywords = [
        'yêu', 'thương', 'nhớ', 'thích', 'cưng', 'bae', 'honey', 'darling', 
        'bạn gái', 'bạn trai', 'người yêu', 'vợ', 'chồng', 'em iu', 'anh iu',
        'bé iu', 'cưng', 'mãi mãi', 'hôn', 'ôm', 'nắm tay', 'hẹn hò'
    ];
    
    // Keywords that indicate decreased intimacy
    const negativeKeywords = [
        'ghét', 'chán', 'bực', 'khó chịu', 'phiền', 'dở', 'xấu', 'tệ',
        'không thích', 'chia tay', 'bye', 'tạm biệt'
    ];
    
    // Check for intimate keywords
    let intimacyChange = 1; // Base increase for any message
    
    // Check positive keywords
    for (const keyword of intimateKeywords) {
        if (lowerMessage.includes(keyword)) {
            intimacyChange += 2;
            break; // Only count once even if multiple keywords
        }
    }
    
    // Check negative keywords
    for (const keyword of negativeKeywords) {
        if (lowerMessage.includes(keyword)) {
            intimacyChange = -2;
            break; // Only count once even if multiple keywords
        }
    }
    
    // Special phrases for bigger increases
    if (lowerMessage.includes('anh yêu em') || 
        lowerMessage.includes('em yêu anh') || 
        lowerMessage.includes('i love you')) {
        intimacyChange = 5;
    }
    
    // Apply intimacy change
    if (intimacyChange > 0) {
        increaseIntimacy(intimacyChange);
    } else if (intimacyChange < 0) {
        decreaseIntimacy(Math.abs(intimacyChange));
    }
    
    // Check for diary-worthy moments
    if (intimacyChange > 3 || 
        lowerMessage.includes('yêu') || 
        (intimacyLevel % 10 === 0 && intimacyLevel > 0)) {
        addToDiary(message, 'Khoảnh khắc đáng nhớ');
    }
}

// Initialize intimacy system on page load
document.addEventListener('DOMContentLoaded', function() {
    initIntimacySystem();
    
    // Add CSS for level up notification
    const style = document.createElement('style');
    style.textContent = `
        .level-up-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: var(--primary-color);
            color: white;
            padding: 15px;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow);
            z-index: 1000;
            transform: translateX(120%);
            transition: transform 0.5s ease;
        }
        
        .level-up-notification.show {
            transform: translateX(0);
        }
        
        .level-up-content h3 {
            margin-top: 0;
            margin-bottom: 10px;
        }
        
        .level-up-content p {
            margin: 5px 0;
        }
    `;
    document.head.appendChild(style);
});
