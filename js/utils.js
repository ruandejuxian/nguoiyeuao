/**
 * Utility functions for the Virtual Companion application
 */
const Utils = {
    /**
     * Shows a modal dialog
     * @param {string} modalId - The ID of the modal to show
     * @param {Object} options - Optional parameters
     */
    showModal: function(modalId, options = {}) {
        const modal = document.getElementById(modalId);
        
        if (modalId === 'loading-modal' && options.message) {
            document.getElementById('loading-message').textContent = options.message;
        } else if (modalId === 'alert-modal') {
            document.getElementById('alert-title').textContent = options.title || 'Thông báo';
            document.getElementById('alert-message').textContent = options.message || '';
        } else if (modalId === 'confirm-modal') {
            document.getElementById('confirm-title').textContent = options.title || 'Xác nhận';
            document.getElementById('confirm-message').textContent = options.message || '';
            
            // Set up confirm callback
            const confirmBtn = document.getElementById('confirm-ok');
            const cancelBtn = document.getElementById('confirm-cancel');
            
            // Remove existing event listeners
            const newConfirmBtn = confirmBtn.cloneNode(true);
            const newCancelBtn = cancelBtn.cloneNode(true);
            confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
            cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
            
            // Add new event listeners
            if (options.onConfirm) {
                newConfirmBtn.addEventListener('click', () => {
                    this.hideModal(modalId);
                    options.onConfirm();
                });
            } else {
                newConfirmBtn.addEventListener('click', () => this.hideModal(modalId));
            }
            
            if (options.onCancel) {
                newCancelBtn.addEventListener('click', () => {
                    this.hideModal(modalId);
                    options.onCancel();
                });
            } else {
                newCancelBtn.addEventListener('click', () => this.hideModal(modalId));
            }
        }
        
        modal.style.display = 'flex';
    },
    
    /**
     * Hides a modal dialog
     * @param {string} modalId - The ID of the modal to hide
     */
    hideModal: function(modalId) {
        const modal = document.getElementById(modalId);
        modal.style.display = 'none';
    },
    
    /**
     * Formats a date to a readable string
     * @param {Date} date - The date to format
     * @returns {string} Formatted date string
     */
    formatDate: function(date) {
        if (!date) date = new Date();
        
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        
        return date.toLocaleDateString('vi-VN', options);
    },
    
    /**
     * Generates a random ID
     * @returns {string} Random ID
     */
    generateId: function() {
        return Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15);
    },
    
    /**
     * Escapes HTML special characters
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml: function(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        
        return text.replace(/[&<>"']/g, m => map[m]);
    },
    
    /**
     * Detects URLs in text and converts them to clickable links
     * @param {string} text - Text to process
     * @returns {string} Text with clickable links
     */
    linkify: function(text) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.replace(urlRegex, url => `<a href="${url}" target="_blank">${url}</a>`);
    },
    
    /**
     * Gets a random number between min and max
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Random number
     */
    getRandomNumber: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    /**
     * Detects emotion keywords in text
     * @param {string} text - Text to analyze
     * @returns {string} Detected emotion or null
     */
    detectEmotion: function(text) {
        const emotions = {
            'happy': ['vui', 'cười', 'hạnh phúc', 'thích', 'yêu', 'tuyệt vời', 'tốt', 'haha', 'hihi'],
            'sad': ['buồn', 'khóc', 'thất vọng', 'hic', 'huhu', 'đau lòng', 'nhớ'],
            'angry': ['giận', 'tức', 'khó chịu', 'bực', 'ghét', 'phiền'],
            'surprised': ['ngạc nhiên', 'bất ngờ', 'wow', 'ồ', 'thật sao', 'không thể tin'],
            'love': ['yêu', 'thương', 'nhớ', 'thích', 'hôn', 'ôm', 'trái tim']
        };
        
        text = text.toLowerCase();
        
        for (const [emotion, keywords] of Object.entries(emotions)) {
            for (const keyword of keywords) {
                if (text.includes(keyword)) {
                    return emotion;
                }
            }
        }
        
        return null;
    },
    
    /**
     * Debounce function to limit how often a function can be called
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    debounce: function(func, wait) {
        let timeout;
        
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};
