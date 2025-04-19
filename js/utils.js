/**
 * Utility functions for the Virtual Companion application
 */
const Utils = {
    /**
     * Formats a date
     * @param {Date} date - Date to format
     * @returns {string} Formatted date
     */
    formatDate: function(date) {
        if (!date) return '';
        
        try {
            return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}, ${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        } catch (e) {
            console.error('Error formatting date:', e);
            return '';
        }
    },
    
    /**
     * Escapes HTML
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml: function(text) {
        if (!text) return '';
        
        try {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        } catch (e) {
            console.error('Error escaping HTML:', e);
            return text;
        }
    },
    
    /**
     * Checks if an image exists
     * @param {string} url - Image URL
     * @returns {Promise<boolean>} Whether image exists
     */
    imageExists: function(url) {
        return new Promise((resolve) => {
            if (!url) {
                resolve(false);
                return;
            }
            
            const img = new Image();
            
            img.onload = () => {
                resolve(true);
            };
            
            img.onerror = () => {
                resolve(false);
            };
            
            img.src = url;
        });
    },
    
    /**
     * Creates a fallback image
     * @param {string} initial - Initial letter
     * @returns {string} Data URL of fallback image
     */
    createFallbackImage: function(initial) {
        try {
            // Create canvas
            const canvas = document.createElement('canvas');
            canvas.width = 100;
            canvas.height = 100;
            
            // Get context
            const ctx = canvas.getContext('2d');
            
            // Draw background
            ctx.fillStyle = '#ff6b6b';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw text
            ctx.fillStyle = 'white';
            ctx.font = 'bold 50px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(initial, canvas.width / 2, canvas.height / 2);
            
            // Return data URL
            return canvas.toDataURL('image/png');
        } catch (e) {
            console.error('Error creating fallback image:', e);
            return '';
        }
    },
    
    /**
     * Shows a modal
     * @param {string} modalId - Modal ID
     * @param {Object} options - Modal options
     */
    showModal: function(modalId, options = {}) {
        const modal = document.getElementById(modalId);
        
        if (!modal) return;
        
        // Set title
        const titleEl = modal.querySelector(`#${modalId.replace('modal', 'title')}`);
        if (titleEl && options.title) {
            titleEl.textContent = options.title;
        }
        
        // Set message
        const messageEl = modal.querySelector(`#${modalId.replace('modal', 'message')}`);
        if (messageEl && options.message) {
            messageEl.textContent = options.message;
        }
        
        // Set up close button
        const closeBtn = modal.querySelector(`#${modalId.replace('modal', 'close')}`);
        if (closeBtn) {
            // Remove existing event listeners
            const newCloseBtn = closeBtn.cloneNode(true);
            closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
            
            // Add new event listener
            newCloseBtn.addEventListener('click', () => {
                this.hideModal(modalId);
                
                // Call onClose callback
                if (options.onClose) {
                    options.onClose();
                }
            });
        }
        
        // Set up confirm button
        const confirmBtn = modal.querySelector(`#${modalId.replace('modal', 'ok')}`);
        if (confirmBtn) {
            // Remove existing event listeners
            const newConfirmBtn = confirmBtn.cloneNode(true);
            confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
            
            // Add new event listener
            newConfirmBtn.addEventListener('click', () => {
                this.hideModal(modalId);
                
                // Call onConfirm callback
                if (options.onConfirm) {
                    options.onConfirm();
                }
            });
        }
        
        // Set up cancel button
        const cancelBtn = modal.querySelector(`#${modalId.replace('modal', 'cancel')}`);
        if (cancelBtn) {
            // Remove existing event listeners
            const newCancelBtn = cancelBtn.cloneNode(true);
            cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
            
            // Add new event listener
            newCancelBtn.addEventListener('click', () => {
                this.hideModal(modalId);
                
                // Call onCancel callback
                if (options.onCancel) {
                    options.onCancel();
                }
            });
        }
        
        // Show modal
        modal.style.display = 'block';
    },
    
    /**
     * Hides a modal
     * @param {string} modalId - Modal ID
     */
    hideModal: function(modalId) {
        const modal = document.getElementById(modalId);
        
        if (!modal) return;
        
        // Hide modal
        modal.style.display = 'none';
    },
    
    /**
     * Checks if a special event is today
     * @param {Object} event - Event object with month and day
     * @returns {boolean} Whether event is today
     */
    isSpecialEventToday: function(event) {
        if (!event || !event.month || !event.day) return false;
        
        try {
            const today = new Date();
            return today.getMonth() + 1 === event.month && today.getDate() === event.day;
        } catch (e) {
            console.error('Error checking special event:', e);
            return false;
        }
    },
    
    /**
     * Gets current special event
     * @returns {string|null} Special event name or null
     */
    getCurrentSpecialEvent: function() {
        try {
            // Check Valentine's Day
            if (this.isSpecialEventToday(CONFIG.SPECIAL_EVENTS.VALENTINES_DAY)) {
                return 'valentines';
            }
            
            // Check Christmas
            if (this.isSpecialEventToday(CONFIG.SPECIAL_EVENTS.CHRISTMAS)) {
                return 'christmas';
            }
            
            // Check New Year
            if (this.isSpecialEventToday(CONFIG.SPECIAL_EVENTS.NEW_YEAR)) {
                return 'newyear';
            }
            
            return null;
        } catch (e) {
            console.error('Error getting current special event:', e);
            return null;
        }
    },
    
    /**
     * Gets device type
     * @returns {string} Device type (mobile, tablet, desktop)
     */
    getDeviceType: function() {
        try {
            const width = window.innerWidth;
            
            if (width < 768) {
                return 'mobile';
            } else if (width < 1024) {
                return 'tablet';
            } else {
                return 'desktop';
            }
        } catch (e) {
            console.error('Error getting device type:', e);
            return 'desktop';
        }
    },
    
    /**
     * Checks if browser supports speech recognition
     * @returns {boolean} Whether speech recognition is supported
     */
    isSpeechRecognitionSupported: function() {
        try {
            return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
        } catch (e) {
            console.error('Error checking speech recognition support:', e);
            return false;
        }
    },
    
    /**
     * Checks if browser supports speech synthesis
     * @returns {boolean} Whether speech synthesis is supported
     */
    isSpeechSynthesisSupported: function() {
        try {
            return 'speechSynthesis' in window;
        } catch (e) {
            console.error('Error checking speech synthesis support:', e);
            return false;
        }
    },
    
    /**
     * Gets speech recognition instance
     * @returns {Object|null} Speech recognition instance or null
     */
    getSpeechRecognition: function() {
        try {
            if ('SpeechRecognition' in window) {
                return new SpeechRecognition();
            } else if ('webkitSpeechRecognition' in window) {
                return new webkitSpeechRecognition();
            } else {
                return null;
            }
        } catch (e) {
            console.error('Error getting speech recognition:', e);
            return null;
        }
    },
    
    /**
     * Analyzes text sentiment
     * @param {string} text - Text to analyze
     * @returns {number} Sentiment score (-1 to 1)
     */
    analyzeSentiment: function(text) {
        if (!text) return 0;
        
        try {
            // Simple sentiment analysis based on keywords
            const positiveWords = [
                'happy', 'good', 'great', 'excellent', 'wonderful', 'amazing', 'love', 'like', 'enjoy',
                'vui', 'tốt', 'tuyệt vời', 'xuất sắc', 'yêu', 'thích', 'thú vị', 'hạnh phúc'
            ];
            
            const negativeWords = [
                'sad', 'bad', 'terrible', 'awful', 'horrible', 'hate', 'dislike', 'angry',
                'buồn', 'tệ', 'kinh khủng', 'ghét', 'giận', 'khó chịu'
            ];
            
            // Count positive and negative words
            let positiveCount = 0;
            let negativeCount = 0;
            
            // Convert to lowercase for case-insensitive matching
            const lowerText = text.toLowerCase();
            
            // Check positive words
            positiveWords.forEach(word => {
                const regex = new RegExp('\\b' + word + '\\b', 'g');
                const matches = lowerText.match(regex);
                if (matches) {
                    positiveCount += matches.length;
                }
            });
            
            // Check negative words
            negativeWords.forEach(word => {
                const regex = new RegExp('\\b' + word + '\\b', 'g');
                const matches = lowerText.match(regex);
                if (matches) {
                    negativeCount += matches.length;
                }
            });
            
            // Calculate sentiment score
            if (positiveCount === 0 && negativeCount === 0) {
                return 0;
            } else {
                return (positiveCount - negativeCount) / (positiveCount + negativeCount);
            }
        } catch (e) {
            console.error('Error analyzing sentiment:', e);
            return 0;
        }
    },
    
    /**
     * Gets mood emoji based on sentiment
     * @param {number} sentiment - Sentiment score (-1 to 1)
     * @returns {string} Mood emoji
     */
    getMoodEmoji: function(sentiment) {
        try {
            if (sentiment >= 0.5) {
                return '😄';
            } else if (sentiment >= 0.2) {
                return '🙂';
            } else if (sentiment >= -0.2) {
                return '😐';
            } else if (sentiment >= -0.5) {
                return '🙁';
            } else {
                return '😢';
            }
        } catch (e) {
            console.error('Error getting mood emoji:', e);
            return '😐';
        }
    },
    
    /**
     * Generates a random ID
     * @returns {string} Random ID
     */
    generateId: function() {
        try {
            return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        } catch (e) {
            console.error('Error generating ID:', e);
            return Date.now().toString();
        }
    },
    
    /**
     * Debounces a function
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    debounce: function(func, wait) {
        let timeout;
        
        return function(...args) {
            const context = this;
            
            clearTimeout(timeout);
            
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }
};
