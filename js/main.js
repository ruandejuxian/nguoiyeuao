/**
 * Main application initialization for the Virtual Companion application
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize modules
    initApp();
});

/**
 * Initializes the application
 */
function initApp() {
    // Initialize UI first
    UI.init();
    
    // Check for API key
    const apiKey = Storage.load(CONFIG.API.STORAGE_KEYS.API_KEY);
    
    // Update connection status
    UI.updateConnectionStatus(!!apiKey);
    
    // Initialize Character
    const characterLoaded = Character.init();
    
    // Initialize Chat
    const chatLoaded = Chat.init();
    
    try {
        // Initialize Chat Features (only if the function exists)
        if (typeof Chat.initChatFeatures === 'function') {
            Chat.initChatFeatures();
        }
    } catch (e) {
        console.error('Error initializing chat features:', e);
    }
    
    try {
        // Initialize Diary
        Diary.init();
        
        // Initialize Game
        Game.init();
        
        // Initialize Google API
        GoogleAPI.init();
    } catch (e) {
        console.error('Error initializing modules:', e);
    }
    
    // If no character exists, show create tab
    if (!characterLoaded) {
        UI.switchTab('create-content');
    }
    
    // Add default avatars for all environments
    createDefaultAvatars();
    
    console.log('Virtual Companion application initialized');
}

/**
 * Creates default avatars
 */
function createDefaultAvatars() {
    // Create default avatar if it doesn't exist or if images are missing
    const defaultAvatar = new Image();
    defaultAvatar.src = CONFIG.CHARACTER.DEFAULT_AVATAR;
    
    // Always create the avatars to ensure they exist
    createAvatars();
    
    function createAvatars() {
        console.log('Creating default avatars');
        
        try {
            // Create canvas for default avatar
            const canvas = document.createElement('canvas');
            canvas.width = 200;
            canvas.height = 200;
            const ctx = canvas.getContext('2d');
            
            // Draw default avatar
            ctx.fillStyle = '#FF6B6B';
            ctx.beginPath();
            ctx.arc(100, 100, 100, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = 'white';
            ctx.font = '80px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('?', 100, 100);
            
            // Save as data URL
            const dataUrl = canvas.toDataURL('image/png');
            
            // Create avatar elements
            const avatarOptions = document.querySelectorAll('.avatar-option');
            
            if (avatarOptions && avatarOptions.length > 0) {
                avatarOptions.forEach((option, index) => {
                    const img = option.querySelector('img');
                    if (!img) return;
                    
                    // Create a unique colored avatar for each option
                    const avatarCanvas = document.createElement('canvas');
                    avatarCanvas.width = 200;
                    avatarCanvas.height = 200;
                    const avatarCtx = avatarCanvas.getContext('2d');
                    
                    // Use different colors for each avatar
                    const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#6B5B95'];
                    avatarCtx.fillStyle = colors[index % colors.length];
                    avatarCtx.beginPath();
                    avatarCtx.arc(100, 100, 100, 0, Math.PI * 2);
                    avatarCtx.fill();
                    
                    // Add a simple face
                    avatarCtx.fillStyle = 'white';
                    
                    // Eyes
                    avatarCtx.beginPath();
                    avatarCtx.arc(70, 80, 10, 0, Math.PI * 2);
                    avatarCtx.arc(130, 80, 10, 0, Math.PI * 2);
                    avatarCtx.fill();
                    
                    // Mouth (different for each avatar)
                    avatarCtx.beginPath();
                    if (index === 0) {
                        // Smile
                        avatarCtx.arc(100, 110, 30, 0, Math.PI);
                    } else if (index === 1) {
                        // Straight
                        avatarCtx.rect(70, 120, 60, 5);
                    } else if (index === 2) {
                        // Surprised
                        avatarCtx.arc(100, 120, 15, 0, Math.PI * 2);
                    } else {
                        // Smirk
                        avatarCtx.arc(100, 110, 30, 0, Math.PI / 2);
                    }
                    avatarCtx.fill();
                    
                    // Set the image source
                    img.src = avatarCanvas.toDataURL('image/png');
                });
            }
            
            // Set default avatar
            const defaultAvatarImg = document.getElementById('companion-avatar-img');
            if (defaultAvatarImg) {
                defaultAvatarImg.src = dataUrl;
            }
        } catch (e) {
            console.error('Error creating avatars:', e);
        }
    }
}
