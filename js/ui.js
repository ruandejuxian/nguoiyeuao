/**
 * UI management for the Virtual Companion application
 */
const UI = {
    /**
     * Initializes UI components and event listeners
     */
    init: function() {
        // Set up tab navigation
        this.initTabNavigation();
        
        // Set up character form
        this.initCharacterForm();
        
        // Set up chat input
        this.initChatInput();
        
        // Set up settings controls
        this.initSettingsControls();
        
        // Set up modal close buttons
        this.initModalCloseButtons();
        
        // Set up create character button in welcome message
        this.initCreateCharacterButton();
    },
    
    /**
     * Initializes tab navigation
     */
    initTabNavigation: function() {
        const navItems = document.querySelectorAll('.nav-menu li');
        
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const tabId = item.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });
    },
    
    /**
     * Initializes the create character button in welcome message
     */
    initCreateCharacterButton: function() {
        const createCharacterBtn = document.querySelector('.create-character-btn');
        if (createCharacterBtn) {
            createCharacterBtn.addEventListener('click', () => {
                const tabId = createCharacterBtn.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        }
    },
    
    /**
     * Switches to the specified tab
     * @param {string} tabId - ID of tab to switch to
     */
    switchTab: function(tabId) {
        // Update active nav item
        const navItems = document.querySelectorAll('.nav-menu li');
        navItems.forEach(item => {
            if (item.getAttribute('data-tab') === tabId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // Update active tab content
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(tab => {
            if (tab.id === tabId) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
    },
    
    /**
     * Initializes character creation form
     */
    initCharacterForm: function() {
        const characterForm = document.getElementById('character-form');
        const avatarOptions = document.querySelectorAll('.avatar-option');
        
        // Set up avatar selection
        avatarOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Remove selected class from all options
                avatarOptions.forEach(opt => opt.classList.remove('selected'));
                
                // Add selected class to clicked option
                option.classList.add('selected');
            });
        });
        
        // Set up form submission
        if (characterForm) {
            characterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Get form values
                const name = document.getElementById('character-name').value.trim();
                const gender = document.getElementById('character-gender').value;
                const age = parseInt(document.getElementById('character-age').value);
                const personality = document.getElementById('character-personality').value.trim();
                const interests = document.getElementById('character-interests').value.trim();
                
                // Get selected avatar
                const selectedAvatar = document.querySelector('.avatar-option.selected');
                const avatar = selectedAvatar ? 
                    selectedAvatar.getAttribute('data-avatar') : 
                    CONFIG.CHARACTER.DEFAULT_AVATAR;
                
                // Validate form
                if (!name) {
                    Utils.showModal('alert-modal', {
                        title: 'Thiếu thông tin',
                        message: 'Vui lòng nhập tên nhân vật.'
                    });
                    return;
                }
                
                if (!personality) {
                    Utils.showModal('alert-modal', {
                        title: 'Thiếu thông tin',
                        message: 'Vui lòng mô tả tính cách nhân vật.'
                    });
                    return;
                }
                
                // Create character
                Character.create({
                    name,
                    gender,
                    age,
                    personality,
                    interests,
                    avatar
                });
                
                // Switch to chat tab
                this.switchTab('chat-content');
                
                // Show success message
                Utils.showModal('alert-modal', {
                    title: 'Tạo nhân vật thành công',
                    message: `Nhân vật ${name} đã được tạo thành công! Bạn có thể bắt đầu trò chuyện ngay bây giờ.`
                });
            });
        }
    },
    
    /**
     * Initializes chat input
     */
    initChatInput: function() {
        const messageInput = document.getElementById('message-input');
        const sendButton = document.getElementById('send-button');
        
        if (messageInput && sendButton) {
            // Send message on button click
            sendButton.addEventListener('click', () => {
                const message = messageInput.value.trim();
                if (message) {
                    Chat.sendMessage(message);
                    messageInput.value = '';
                }
            });
            
            // Send message on Enter key (but allow Shift+Enter for new line)
            messageInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendButton.click();
                }
            });
            
            // Auto-resize textarea
            messageInput.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = (this.scrollHeight) + 'px';
            });
        }
    },
    
    /**
     * Initializes settings controls
     */
    initSettingsControls: function() {
        // API Key save button
        const saveApiKeyBtn = document.getElementById('save-api-key');
        if (saveApiKeyBtn) {
            saveApiKeyBtn.addEventListener('click', () => {
                const apiKey = document.getElementById('api-key').value.trim();
                
                if (!apiKey) {
                    Utils.showModal('alert-modal', {
                        title: 'Thiếu thông tin',
                        message: 'Vui lòng nhập API Key của OpenAI.'
                    });
                    return;
                }
                
                // Save API key
                Storage.save(CONFIG.API.STORAGE_KEYS.API_KEY, apiKey);
                
                // Update connection status
                this.updateConnectionStatus(true);
                
                // Show success message
                Utils.showModal('alert-modal', {
                    title: 'Lưu API Key thành công',
                    message: 'API Key đã được lưu thành công.'
                });
            });
        }
        
        // Clear chat button
        const clearChatBtn = document.getElementById('clear-chat');
        if (clearChatBtn) {
            clearChatBtn.addEventListener('click', () => {
                Utils.showModal('confirm-modal', {
                    title: 'Xác nhận xóa',
                    message: 'Bạn có chắc chắn muốn xóa toàn bộ lịch sử chat?',
                    onConfirm: () => {
                        Chat.clearHistory();
                        Utils.showModal('alert-modal', {
                            title: 'Xóa thành công',
                            message: 'Lịch sử chat đã được xóa.'
                        });
                    }
                });
            });
        }
        
        // Reset character button
        const resetCharBtn = document.getElementById('delete-character');
        if (resetCharBtn) {
            resetCharBtn.addEventListener('click', () => {
                Utils.showModal('confirm-modal', {
                    title: 'Xác nhận xóa',
                    message: 'Bạn có chắc chắn muốn xóa nhân vật hiện tại?',
                    onConfirm: () => {
                        Character.delete();
                        Utils.showModal('alert-modal', {
                            title: 'Xóa thành công',
                            message: 'Nhân vật đã được xóa.'
                        });
                    }
                });
            });
        }
        
        // Reset all button
        const resetAllBtn = document.getElementById('reset-all');
        if (resetAllBtn) {
            resetAllBtn.addEventListener('click', () => {
                Utils.showModal('confirm-modal', {
                    title: 'Xác nhận xóa',
                    message: 'Bạn có chắc chắn muốn xóa tất cả dữ liệu? Hành động này không thể hoàn tác.',
                    onConfirm: () => {
                        Storage.clear();
                        Utils.showModal('alert-modal', {
                            title: 'Xóa thành công',
                            message: 'Tất cả dữ liệu đã được xóa. Trang sẽ được tải lại.',
                            onClose: () => {
                                window.location.reload();
                            }
                        });
                    }
                });
            });
        }
    },
    
    /**
     * Initializes modal close buttons
     */
    initModalCloseButtons: function() {
        // Alert modal close button
        const alertCloseBtn = document.getElementById('alert-close');
        if (alertCloseBtn) {
            alertCloseBtn.addEventListener('click', () => {
                document.getElementById('alert-modal').style.display = 'none';
            });
        }
        
        // Confirm modal cancel button
        const confirmCancelBtn = document.getElementById('confirm-cancel');
        if (confirmCancelBtn) {
            confirmCancelBtn.addEventListener('click', () => {
                document.getElementById('confirm-modal').style.display = 'none';
            });
        }
        
        // Image view close button
        const closeImageViewBtn = document.getElementById('close-image-view');
        if (closeImageViewBtn) {
            closeImageViewBtn.addEventListener('click', () => {
                document.getElementById('image-view-modal').style.display = 'none';
            });
        }
    },
    
    /**
     * Updates the connection status display
     * @param {boolean} isConnected - Whether API is connected
     */
    updateConnectionStatus: function(isConnected) {
        const statusIndicator = document.querySelector('.status-indicator');
        const statusText = document.querySelector('.status-text');
        
        if (statusIndicator && statusText) {
            if (isConnected) {
                statusIndicator.classList.remove('offline');
                statusIndicator.classList.add('online');
                statusText.textContent = 'Đã kết nối API';
            } else {
                statusIndicator.classList.remove('online');
                statusIndicator.classList.add('offline');
                statusText.textContent = 'Chưa kết nối API';
            }
        }
    }
};
