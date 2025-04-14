/**
 * Avatar animation functionality for the Virtual Companion application
 */
const Avatar = {
    /**
     * Current emotion state
     */
    currentEmotion: 'neutral',
    
    /**
     * Available emotions and their corresponding animations
     */
    emotions: {
        'neutral': {
            class: 'avatar-neutral',
            transitions: {
                'happy': 0.8,
                'sad': 0.5,
                'angry': 0.3,
                'surprised': 0.6,
                'love': 0.7
            }
        },
        'happy': {
            class: 'avatar-happy',
            transitions: {
                'neutral': 0.4,
                'sad': 0.1,
                'angry': 0.1,
                'surprised': 0.5,
                'love': 0.8
            }
        },
        'sad': {
            class: 'avatar-sad',
            transitions: {
                'neutral': 0.5,
                'happy': 0.3,
                'angry': 0.4,
                'surprised': 0.3,
                'love': 0.2
            }
        },
        'angry': {
            class: 'avatar-angry',
            transitions: {
                'neutral': 0.4,
                'happy': 0.2,
                'sad': 0.3,
                'surprised': 0.4,
                'love': 0.1
            }
        },
        'surprised': {
            class: 'avatar-surprised',
            transitions: {
                'neutral': 0.6,
                'happy': 0.5,
                'sad': 0.3,
                'angry': 0.2,
                'love': 0.4
            }
        },
        'love': {
            class: 'avatar-love',
            transitions: {
                'neutral': 0.3,
                'happy': 0.7,
                'sad': 0.1,
                'angry': 0.1,
                'surprised': 0.4
            }
        }
    },
    
    /**
     * Initializes avatar animations
     */
    init: function() {
        // Add CSS for avatar animations
        this.addAnimationStyles();
        
        // Set initial emotion
        this.setEmotion('neutral');
        
        // Start random emotion changes for idle state
        this.startIdleAnimation();
    },
    
    /**
     * Adds CSS styles for avatar animations
     */
    addAnimationStyles: function() {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            /* Avatar container styles */
            .avatar-container {
                position: relative;
                overflow: hidden;
                transition: all 0.3s ease;
            }
            
            /* Base avatar image */
            .avatar-container img {
                transition: all 0.5s ease;
            }
            
            /* Emotion animations */
            .avatar-neutral img {
                transform: scale(1);
                filter: none;
            }
            
            .avatar-happy img {
                transform: scale(1.05);
                filter: brightness(1.1);
            }
            
            .avatar-sad img {
                transform: scale(0.95);
                filter: brightness(0.9) grayscale(0.2);
            }
            
            .avatar-angry img {
                transform: scale(1.05) rotate(-2deg);
                filter: brightness(1.05) saturate(1.2) hue-rotate(-10deg);
            }
            
            .avatar-surprised img {
                transform: scale(1.1);
                filter: brightness(1.15) contrast(1.1);
                animation: pulse 0.5s ease;
            }
            
            .avatar-love img {
                transform: scale(1.05);
                filter: brightness(1.1) saturate(1.3) hue-rotate(10deg);
                animation: heartbeat 1.5s infinite;
            }
            
            /* Animation keyframes */
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.15); }
                100% { transform: scale(1.05); }
            }
            
            @keyframes heartbeat {
                0% { transform: scale(1.05); }
                5% { transform: scale(1.1); }
                10% { transform: scale(1.05); }
                15% { transform: scale(1.1); }
                20% { transform: scale(1.05); }
                100% { transform: scale(1.05); }
            }
            
            /* Emotion indicators */
            .emotion-indicator {
                position: absolute;
                top: -10px;
                right: -10px;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                background-color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                opacity: 0;
                transform: scale(0);
                transition: all 0.3s ease;
            }
            
            .emotion-indicator.visible {
                opacity: 1;
                transform: scale(1);
            }
            
            /* Emotion emojis */
            .emotion-neutral::after { content: "😐"; }
            .emotion-happy::after { content: "😊"; }
            .emotion-sad::after { content: "😢"; }
            .emotion-angry::after { content: "😠"; }
            .emotion-surprised::after { content: "😮"; }
            .emotion-love::after { content: "😍"; }
        `;
        
        document.head.appendChild(styleElement);
    },
    
    /**
     * Sets the avatar emotion
     * @param {string} emotion - Emotion name
     */
    setEmotion: function(emotion) {
        if (!this.emotions[emotion]) {
            emotion = 'neutral';
        }
        
        const avatarContainer = document.querySelector('.avatar-container');
        if (!avatarContainer) return;
        
        // Remove all emotion classes
        Object.keys(this.emotions).forEach(em => {
            avatarContainer.classList.remove(this.emotions[em].class);
        });
        
        // Add new emotion class
        avatarContainer.classList.add(this.emotions[emotion].class);
        
        // Update current emotion
        this.currentEmotion = emotion;
        
        // Update emotion indicator
        this.updateEmotionIndicator(emotion);
    },
    
    /**
     * Updates the emotion indicator
     * @param {string} emotion - Emotion name
     */
    updateEmotionIndicator: function(emotion) {
        // Check if indicator exists
        let indicator = document.querySelector('.emotion-indicator');
        
        // Create indicator if it doesn't exist
        if (!indicator) {
            const avatarContainer = document.querySelector('.avatar-container');
            if (!avatarContainer) return;
            
            indicator = document.createElement('div');
            indicator.className = 'emotion-indicator';
            avatarContainer.appendChild(indicator);
        }
        
        // Remove all emotion classes
        Object.keys(this.emotions).forEach(em => {
            indicator.classList.remove(`emotion-${em}`);
        });
        
        // Add new emotion class
        indicator.classList.add(`emotion-${emotion}`);
        
        // Show indicator
        indicator.classList.add('visible');
        
        // Hide indicator after 3 seconds
        setTimeout(() => {
            indicator.classList.remove('visible');
        }, 3000);
    },
    
    /**
     * Starts idle animation with random emotion changes
     */
    startIdleAnimation: function() {
        // Change emotion randomly every 20-40 seconds
        setInterval(() => {
            // Only change emotion if character exists and not in active conversation
            if (Character.current && !document.querySelector('.typing-indicator')) {
                this.changeRandomEmotion();
            }
        }, Utils.getRandomNumber(20000, 40000));
    },
    
    /**
     * Changes to a random emotion based on transition probabilities
     */
    changeRandomEmotion: function() {
        const currentTransitions = this.emotions[this.currentEmotion].transitions;
        const emotions = Object.keys(currentTransitions);
        
        // Calculate total probability
        const totalProbability = emotions.reduce((sum, emotion) => {
            return sum + currentTransitions[emotion];
        }, 0);
        
        // Generate random value
        const random = Math.random() * totalProbability;
        
        // Select emotion based on probability
        let cumulativeProbability = 0;
        for (const emotion of emotions) {
            cumulativeProbability += currentTransitions[emotion];
            if (random <= cumulativeProbability) {
                this.setEmotion(emotion);
                break;
            }
        }
    },
    
    /**
     * Sets emotion based on message content
     * @param {string} message - Message content
     */
    setEmotionFromMessage: function(message) {
        const emotion = Utils.detectEmotion(message);
        
        if (emotion) {
            this.setEmotion(emotion);
        }
    }
};
