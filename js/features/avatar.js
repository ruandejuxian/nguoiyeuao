// Avatar animation functionality for Virtual Lover App

// Default avatar image
const DEFAULT_AVATAR = 'assets/images/default-avatar.png';

// Avatar emotions
const AVATAR_EMOTIONS = {
    happy: 'avatar-happy',
    excited: 'avatar-excited',
    sad: 'avatar-sad',
    angry: 'avatar-angry',
    shy: 'avatar-shy'
};

// Initialize avatar
function initAvatar() {
    // Set default avatar if not already set
    const avatarImg = document.getElementById('avatar-img');
    if (!avatarImg.src || avatarImg.src.endsWith('/')) {
        avatarImg.src = DEFAULT_AVATAR;
    }
    
    // Add click event to avatar
    document.getElementById('avatar').addEventListener('click', handleAvatarClick);
}

// Handle avatar click
function handleAvatarClick() {
    // Trigger a random animation
    const emotions = Object.values(AVATAR_EMOTIONS);
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    
    const avatarImg = document.getElementById('avatar-img');
    
    // Remove all emotion classes
    Object.values(AVATAR_EMOTIONS).forEach(emotion => {
        avatarImg.classList.remove(emotion);
    });
    
    // Add random emotion class
    avatarImg.classList.add(randomEmotion);
    
    // Remove after animation completes
    setTimeout(() => {
        avatarImg.classList.remove(randomEmotion);
    }, 2000);
}

// Set avatar emotion
function setAvatarEmotion(emotion) {
    const avatarImg = document.getElementById('avatar-img');
    
    // Remove all emotion classes
    Object.values(AVATAR_EMOTIONS).forEach(emotionClass => {
        avatarImg.classList.remove(emotionClass);
    });
    
    // Add specified emotion class if valid
    if (AVATAR_EMOTIONS[emotion]) {
        avatarImg.classList.add(AVATAR_EMOTIONS[emotion]);
    }
}

// Update avatar based on message content
function updateAvatarBasedOnMessage(message) {
    // Analyze message for emotion
    const emotion = analyzeEmotion(message);
    
    // Set avatar emotion
    setAvatarEmotion(emotion);
}

// Allow user to upload custom avatar
function setupAvatarUpload() {
    // Create file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    fileInput.id = 'avatar-upload';
    document.body.appendChild(fileInput);
    
    // Add double-click event to avatar for upload
    document.getElementById('avatar').addEventListener('dblclick', () => {
        fileInput.click();
    });
    
    // Handle file selection
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!file.type.startsWith('image/')) {
            alert('Vui lòng chọn file hình ảnh!');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(event) {
            // Set avatar image
            document.getElementById('avatar-img').src = event.target.result;
            
            // Save to localStorage
            localStorage.setItem('virtualLover_avatar', event.target.result);
        };
        reader.readAsDataURL(file);
    });
    
    // Load saved avatar from localStorage
    const savedAvatar = localStorage.getItem('virtualLover_avatar');
    if (savedAvatar) {
        document.getElementById('avatar-img').src = savedAvatar;
    }
}

// Initialize avatar functionality
document.addEventListener('DOMContentLoaded', function() {
    initAvatar();
    setupAvatarUpload();
});
