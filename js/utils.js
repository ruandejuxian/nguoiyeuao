/**
 * Utility functions for the Virtual Companion application
 */
const Utils = {
    /**
     * Generates a random ID
     * @returns {string} Random ID
     */
    generateId: function() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    },
    
    /**
     * Formats a date for display
     * @param {Date} date - Date to format
     * @returns {string} Formatted date
     */
    formatDate: function(date) {
        if (!date) return '';
        
        try {
            if (!(date instanceof Date)) {
                date = new Date(date);
            }
            
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            
            return `${hours}:${minutes}, ${day}/${month}/${year}`;
        } catch (e) {
            console.error('Error formatting date:', e);
            return '';
        }
    },
    
    /**
     * Shows a modal
     * @param {string} modalId - ID of modal to show
     * @param {Object} options - Modal options
     */
    showModal: function(modalId, options = {}) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        // Set title and message if provided
        if (options.title) {
            const titleElement = modal.querySelector(`#${modalId.replace('modal', 'title')}`);
            if (titleElement) {
                titleElement.textContent = options.title;
            }
        }
        
        if (options.message) {
            const messageElement = modal.querySelector(`#${modalId.replace('modal', 'message')}`);
            if (messageElement) {
                messageElement.textContent = options.message;
            }
        }
        
        // Set confirm callback if provided
        if (options.onConfirm && modalId === 'confirm-modal') {
            const confirmButton = document.getElementById('confirm-ok');
            if (confirmButton) {
                // Remove existing event listeners
                const newButton = confirmButton.cloneNode(true);
                confirmButton.parentNode.replaceChild(newButton, confirmButton);
                
                // Add new event listener
                newButton.addEventListener('click', () => {
                    options.onConfirm();
                    this.hideModal(modalId);
                });
            }
        }
        
        // Set close callback if provided
        if (options.onClose) {
            const closeButton = modal.querySelector(`#${modalId.replace('modal', 'close')}`);
            if (closeButton) {
                // Remove existing event listeners
                const newButton = closeButton.cloneNode(true);
                closeButton.parentNode.replaceChild(newButton, closeButton);
                
                // Add new event listener
                newButton.addEventListener('click', () => {
                    options.onClose();
                    this.hideModal(modalId);
                });
            }
        }
        
        // Show modal
        modal.style.display = 'flex';
        
        // Add event listeners for close buttons
        const closeButtons = modal.querySelectorAll('.modal-actions button');
        closeButtons.forEach(button => {
            if (!button.id || !button.id.includes('ok')) {
                button.addEventListener('click', () => {
                    this.hideModal(modalId);
                });
            }
        });
    },
    
    /**
     * Hides a modal
     * @param {string} modalId - ID of modal to hide
     */
    hideModal: function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    },
    
    /**
     * Escapes HTML special characters
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
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    },
    
    /**
     * Converts data URL to Blob
     * @param {string} dataUrl - Data URL
     * @returns {Blob} Blob
     */
    dataUrlToBlob: function(dataUrl) {
        if (!dataUrl) return null;
        
        try {
            const arr = dataUrl.split(',');
            const match = arr[0].match(/:(.*?);/);
            if (!match) return null;
            
            const mime = match[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            
            return new Blob([u8arr], { type: mime });
        } catch (e) {
            console.error('Error converting data URL to Blob:', e);
            return null;
        }
    },
    
    /**
     * Gets file extension from file name
     * @param {string} filename - File name
     * @returns {string} File extension
     */
    getFileExtension: function(filename) {
        if (!filename) return '';
        
        try {
            return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
        } catch (e) {
            console.error('Error getting file extension:', e);
            return '';
        }
    },
    
    /**
     * Checks if a string is a valid URL
     * @param {string} str - String to check
     * @returns {boolean} Whether string is a valid URL
     */
    isValidUrl: function(str) {
        if (!str) return false;
        
        try {
            new URL(str);
            return true;
        } catch (e) {
            return false;
        }
    },
    
    /**
     * Truncates text to a specified length
     * @param {string} text - Text to truncate
     * @param {number} length - Maximum length
     * @returns {string} Truncated text
     */
    truncateText: function(text, length) {
        if (!text) return '';
        if (text.length <= length) return text;
        return text.substring(0, length) + '...';
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
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    },
    
    /**
     * Creates a fallback image
     * @param {string} text - Text to display in image
     * @param {string} color - Background color
     * @returns {string} Data URL of image
     */
    createFallbackImage: function(text = '?', color = '#FF6B6B') {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 200;
            canvas.height = 200;
            const ctx = canvas.getContext('2d');
            
            // Draw background
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(100, 100, 100, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw text
            ctx.fillStyle = 'white';
            ctx.font = '80px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, 100, 100);
            
            return canvas.toDataURL('image/png');
        } catch (e) {
            console.error('Error creating fallback image:', e);
            return '';
        }
    }
};
