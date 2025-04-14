/**
 * Chat extensions functionality for the Virtual Companion application
 * Adds emoji picker and file sharing capabilities
 */
const ChatExtensions = {
    /**
     * Current file to upload
     */
    currentFile: null,
    
    /**
     * Initializes chat extensions
     */
    init: function() {
        // Add CSS link to head
        this.addCssLink();
        
        // Add emoji picker to chat
        this.initEmojiPicker();
        
        // Add file upload functionality
        this.initFileUpload();
        
        // Add image viewer
        this.initImageViewer();
        
        console.log('Chat extensions initialized');
    },
    
    /**
     * Adds CSS link to head
     */
    addCssLink: function() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'css/chat-extensions.css';
        document.head.appendChild(link);
    },
    
    /**
     * Initializes emoji picker
     */
    initEmojiPicker: function() {
        // Create emoji picker container
        const emojiPicker = document.createElement('div');
        emojiPicker.className = 'emoji-picker';
        emojiPicker.id = 'emoji-picker';
        
        // Create emoji categories
        const categories = [...new Set(EMOJI_DATA.map(emoji => emoji.category))];
        const emojiCategories = document.createElement('div');
        emojiCategories.className = 'emoji-categories';
        
        categories.forEach((category, index) => {
            const categoryEl = document.createElement('div');
            categoryEl.className = `emoji-category ${index === 0 ? 'active' : ''}`;
            categoryEl.setAttribute('data-category', category);
            categoryEl.textContent = this.getCategoryIcon(category);
            categoryEl.addEventListener('click', () => this.switchEmojiCategory(category));
            emojiCategories.appendChild(categoryEl);
        });
        
        emojiPicker.appendChild(emojiCategories);
        
        // Create emoji grid
        const emojiGrid = document.createElement('div');
        emojiGrid.className = 'emoji-grid';
        emojiGrid.id = 'emoji-grid';
        
        // Add emojis to grid (initially show first category)
        const firstCategory = categories[0];
        const firstCategoryEmojis = EMOJI_DATA.filter(emoji => emoji.category === firstCategory);
        
        firstCategoryEmojis.forEach(emoji => {
            const emojiItem = document.createElement('div');
            emojiItem.className = 'emoji-item';
            emojiItem.textContent = emoji.emoji;
            emojiItem.title = emoji.name;
            emojiItem.addEventListener('click', () => this.insertEmoji(emoji.emoji));
            emojiGrid.appendChild(emojiItem);
        });
        
        emojiPicker.appendChild(emojiGrid);
        
        // Add emoji picker to chat container
        const chatContainer = document.querySelector('.chat-container');
        if (chatContainer) {
            chatContainer.appendChild(emojiPicker);
        }
        
        // Add toolbar to chat input
        this.addChatInputToolbar();
    },
    
    /**
     * Gets icon for emoji category
     * @param {string} category - Category name
     * @returns {string} Category icon
     */
    getCategoryIcon: function(category) {
        switch (category) {
            case 'smileys': return '😊';
            case 'symbols': return '❤️';
            case 'gestures': return '👍';
            case 'food': return '🍕';
            case 'nature': return '🌹';
            case 'objects': return '🎁';
            default: return '😊';
        }
    },
    
    /**
     * Switches emoji category
     * @param {string} category - Category to switch to
     */
    switchEmojiCategory: function(category) {
        // Update active category
        const categories = document.querySelectorAll('.emoji-category');
        categories.forEach(cat => {
            if (cat.getAttribute('data-category') === category) {
                cat.classList.add('active');
            } else {
                cat.classList.remove('active');
            }
        });
        
        // Update emoji grid
        const emojiGrid = document.getElementById('emoji-grid');
        emojiGrid.innerHTML = '';
        
        const categoryEmojis = EMOJI_DATA.filter(emoji => emoji.category === category);
        
        categoryEmojis.forEach(emoji => {
            const emojiItem = document.createElement('div');
            emojiItem.className = 'emoji-item';
            emojiItem.textContent = emoji.emoji;
            emojiItem.title = emoji.name;
            emojiItem.addEventListener('click', () => this.insertEmoji(emoji.emoji));
            emojiGrid.appendChild(emojiItem);
        });
    },
    
    /**
     * Adds toolbar to chat input
     */
    addChatInputToolbar: function() {
        const chatInput = document.querySelector('.chat-input');
        if (!chatInput) return;
        
        // Create toolbar
        const toolbar = document.createElement('div');
        toolbar.className = 'chat-input-toolbar';
        
        // Add emoji button
        const emojiButton = document.createElement('button');
        emojiButton.className = 'toolbar-button emoji-button';
        emojiButton.innerHTML = '<i class="far fa-smile"></i>';
        emojiButton.title = 'Chọn emoji';
        emojiButton.addEventListener('click', this.toggleEmojiPicker.bind(this));
        
        // Add file upload button
        const fileButton = document.createElement('button');
        fileButton.className = 'toolbar-button file-button';
        fileButton.innerHTML = '<i class="far fa-image"></i>';
        fileButton.title = 'Gửi hình ảnh';
        fileButton.addEventListener('click', () => document.getElementById('file-input').click());
        
        // Add file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.id = 'file-input';
        fileInput.className = 'file-input';
        fileInput.accept = 'image/*';
        fileInput.addEventListener('change', this.handleFileSelect.bind(this));
        
        // Add buttons to toolbar
        toolbar.appendChild(emojiButton);
        toolbar.appendChild(fileButton);
        toolbar.appendChild(fileInput);
        
        // Add file upload preview
        const filePreview = document.createElement('div');
        filePreview.className = 'file-upload-preview';
        filePreview.id = 'file-preview';
        
        // Insert toolbar before the message input
        chatInput.insertBefore(toolbar, chatInput.firstChild);
        
        // Add file preview after the toolbar
        chatInput.insertBefore(filePreview, toolbar.nextSibling);
    },
    
    /**
     * Toggles emoji picker visibility
     */
    toggleEmojiPicker: function() {
        const emojiPicker = document.getElementById('emoji-picker');
        const emojiButton = document.querySelector('.emoji-button');
        
        if (emojiPicker.classList.contains('active')) {
            emojiPicker.classList.remove('active');
            emojiButton.classList.remove('active');
        } else {
            emojiPicker.classList.add('active');
            emojiButton.classList.add('active');
        }
    },
    
    /**
     * Inserts emoji into message input
     * @param {string} emoji - Emoji to insert
     */
    insertEmoji: function(emoji) {
        const messageInput = document.getElementById('message-input');
        if (!messageInput) return;
        
        // Get cursor position
        const start = messageInput.selectionStart;
        const end = messageInput.selectionEnd;
        
        // Insert emoji at cursor position
        const text = messageInput.value;
        messageInput.value = text.substring(0, start) + emoji + text.substring(end);
        
        // Set cursor position after emoji
        messageInput.selectionStart = messageInput.selectionEnd = start + emoji.length;
        
        // Focus input
        messageInput.focus();
        
        // Hide emoji picker
        this.toggleEmojiPicker();
    },
    
    /**
     * Initializes file upload functionality
     */
    initFileUpload: function() {
        // Add event listener to send button to handle file uploads
        const sendButton = document.getElementById('send-button');
        if (sendButton) {
            const originalClickHandler = sendButton.onclick;
            
            sendButton.onclick = (e) => {
                // If there's a file to upload, handle it
                if (this.currentFile) {
                    this.sendFileMessage();
                    return;
                }
                
                // Otherwise, use the original click handler
                if (originalClickHandler) {
                    originalClickHandler.call(sendButton, e);
                }
            };
        }
    },
    
    /**
     * Handles file selection
     * @param {Event} e - Change event
     */
    handleFileSelect: function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        // Store file
        this.currentFile = file;
        
        // Show file preview
        this.showFilePreview(file);
    },
    
    /**
     * Shows file preview
     * @param {File} file - File to preview
     */
    showFilePreview: function(file) {
        const filePreview = document.getElementById('file-preview');
        if (!filePreview) return;
        
        // Clear previous preview
        filePreview.innerHTML = '';
        
        // Create preview content
        const previewContent = document.createElement('div');
        previewContent.className = 'file-preview-content';
        
        // Add file icon
        const fileIcon = document.createElement('div');
        fileIcon.className = 'file-preview-icon';
        fileIcon.innerHTML = this.getFileIcon(file.type);
        previewContent.appendChild(fileIcon);
        
        // Add file info
        const fileInfo = document.createElement('div');
        fileInfo.className = 'file-preview-info';
        
        const fileName = document.createElement('div');
        fileName.className = 'file-preview-name';
        fileName.textContent = file.name;
        fileInfo.appendChild(fileName);
        
        const fileSize = document.createElement('div');
        fileSize.className = 'file-preview-size';
        fileSize.textContent = this.formatFileSize(file.size);
        fileInfo.appendChild(fileSize);
        
        previewContent.appendChild(fileInfo);
        
        // Add actions
        const actions = document.createElement('div');
        actions.className = 'file-preview-actions';
        
        const removeButton = document.createElement('button');
        removeButton.innerHTML = '<i class="fas fa-times"></i>';
        removeButton.title = 'Hủy';
        removeButton.addEventListener('click', this.cancelFileUpload.bind(this));
        actions.appendChild(removeButton);
        
        previewContent.appendChild(actions);
        
        // Add preview content to preview container
        filePreview.appendChild(previewContent);
        
        // Show preview
        filePreview.classList.add('active');
        
        // If it's an image, show image preview
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'file-preview-image';
                filePreview.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    },
    
    /**
     * Gets icon for file type
     * @param {string} fileType - MIME type
     * @returns {string} Icon HTML
     */
    getFileIcon: function(fileType) {
        if (fileType.startsWith('image/')) {
            return '<i class="far fa-image"></i>';
        } else if (fileType.startsWith('video/')) {
            return '<i class="far fa-file-video"></i>';
        } else if (fileType.startsWith('audio/')) {
            return '<i class="far fa-file-audio"></i>';
        } else if (fileType.includes('pdf')) {
            return '<i class="far fa-file-pdf"></i>';
        } else if (fileType.includes('word') || fileType.includes('document')) {
            return '<i class="far fa-file-word"></i>';
        } else if (fileType.includes('excel') || fileType.includes('sheet')) {
            return '<i class="far fa-file-excel"></i>';
        } else {
            return '<i class="far fa-file"></i>';
        }
    },
    
    /**
     * Formats file size
     * @param {number} bytes - File size in bytes
     * @returns {string} Formatted file size
     */
    formatFileSize: function(bytes) {
        if (bytes < 1024) {
            return bytes + ' B';
        } else if (bytes < 1024 * 1024) {
            return (bytes / 1024).toFixed(1) + ' KB';
        } else {
            return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
        }
    },
    
    /**
     * Cancels file upload
     */
    cancelFileUpload: function() {
        // Clear file input
        const fileInput = document.getElementById('file-input');
        if (fileInput) {
            fileInput.value = '';
        }
        
        // Hide preview
        const filePreview = document.getElementById('file-preview');
        if (filePreview) {
            filePreview.classList.remove('active');
            filePreview.innerHTML = '';
        }
        
        // Clear current file
        this.currentFile = null;
    },
    
    /**
     * Sends file message
     */
    sendFileMessage: function() {
        if (!this.currentFile || !Character.current) return;
        
        const file = this.currentFile;
        
        // Create message content based on file type
        if (file.type.startsWith('image/')) {
            // For images, create a message with the image
            this.sendImageMessage(file);
        } else {
            // For other files, create a message with file info
            this.sendFileInfoMessage(file);
        }
        
        // Clear file upload
        this.cancelFileUpload();
    },
    
    /**
     * Sends image message
     * @param {File} file - Image file
     */
    sendImageMessage: function(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageData = e.target.result;
            
            // Create message with image
            const message = `<div class="message-image-container"><img src="${imageData}" class="message-image" data-filename="${file.name}" onclick="ChatExtensions.openImageViewer(this)"></div>`;
            
            // Send message
            Chat.addMessage('user', message);
            
            // Trigger AI response
            Chat.sendMessage('Tôi đã gửi một hình ảnh cho bạn.');
        };
        reader.readAsDataURL(file);
    },
    
    /**
     * Sends file info message
     * @param {File} file - File
     */
    sendFileInfoMessage: function(file) {
        // Create message with file info
        const message = `
            <div class="message-file">
                <div class="message-file-icon">${this.getFileIcon(file.type)}</div>
                <div class="message-file-info">
                    <div class="message-file-name">${file.name}</div>
                    <div class="message-file-size">${this.formatFileSize(file.size)}</div>
                </div>
            </div>
        `;
        
        // Send message
        Chat.addMessage('user', message);
        
        // Trigger AI response
        Chat.sendMessage('Tôi đã gửi một tệp tin cho bạn.');
    },
    
    /**
     * Initializes image viewer
     */
    initImageViewer: function() {
        // Create image viewer
        const imageViewer = document.createElement('div');
        imageViewer.className = 'image-viewer';
        imageViewer.id = 'image-viewer';
        
        // Create image container
        const imageContainer = document.createElement('div');
        imageContainer.className = 'image-viewer-content';
        imageViewer.appendChild(imageContainer);
        
        // Create close button
        const closeButton = document.createElement('div');
        closeButton.className = 'image-viewer-close';
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', this.closeImageViewer);
        imageViewer.appendChild(closeButton);
        
        // Add image viewer to body
        document.body.appendChild(imageViewer);
        
        // Add click event to close viewer when clicking outside the image
        imageViewer.addEventListener('click', (e) => {
            if (e.target === imageViewer) {
                this.closeImageViewer();
            }
        });
    },
    
    /**
     * Opens image viewer
     * @param {HTMLElement} imgElement - Image element
     */
    openImageViewer: function(imgElement) {
        const imageViewer = document.getElementById('image-viewer');
        const imageContainer = imageViewer.querySelector('.image-viewer-content');
        
        // Clear previous image
        imageContainer.innerHTML = '';
        
        // Create image element
        const img = document.createElement('img');
        img.src = imgElement.src;
        img.alt = imgElement.getAttribute('data-filename') || 'Image';
        
        // Add image to container
        imageContainer.appendChild(img);
        
        // Show viewer
        imageViewer.classList.add('active');
        
        // Prevent scrolling
        document.body.style.overflow = 'hidden';
    },
    
    /**
     * Closes image viewer
     */
    closeImageViewer: function() {
        const imageViewer = document.getElementById('image-viewer');
        imageViewer.classList.remove('active');
        
        // Restore scrolling
        document.body.style.overflow = '';
    }
};

// Add global reference for image viewer
window.ChatExtensions = ChatExtensions;
