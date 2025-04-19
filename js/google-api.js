/**
 * Google API integration for the Virtual Companion application
 */
const GoogleAPI = {
    /**
     * Google API client
     */
    client: null,
    
    /**
     * Google API token client
     */
    tokenClient: null,
    
    /**
     * Whether user is signed in
     */
    isSignedIn: false,
    
    /**
     * Initializes Google API
     */
    init: function() {
        // Load Google API script if not already loaded
        if (!document.getElementById('google-api-script')) {
            this.loadGoogleApiScript();
        }
        
        // Set up Google auth button
        const googleAuthBtn = document.getElementById('google-auth-btn');
        if (googleAuthBtn) {
            googleAuthBtn.addEventListener('click', () => {
                if (this.isSignedIn) {
                    this.signOut();
                } else {
                    this.signIn();
                }
            });
        }
    },
    
    /**
     * Loads Google API script
     */
    loadGoogleApiScript: function() {
        try {
            // Create script element
            const script = document.createElement('script');
            script.id = 'google-api-script';
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            
            // Set up callback
            script.onload = () => {
                this.initGoogleApi();
            };
            
            // Add to document
            document.head.appendChild(script);
        } catch (e) {
            console.error('Error loading Google API script:', e);
            this.updateAuthStatus(false, 'Lỗi khi tải Google API');
        }
    },
    
    /**
     * Initializes Google API client
     */
    initGoogleApi: function() {
        try {
            // Initialize token client
            this.tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: CONFIG.GOOGLE_API.CLIENT_ID,
                scope: CONFIG.GOOGLE_API.SCOPES,
                callback: (tokenResponse) => {
                    if (tokenResponse && tokenResponse.access_token) {
                        this.handleAuthSuccess(tokenResponse);
                    } else {
                        this.handleAuthError('Không thể lấy token truy cập');
                    }
                },
                error_callback: (error) => {
                    this.handleAuthError('Lỗi xác thực: ' + error.message);
                }
            });
        } catch (e) {
            console.error('Error initializing Google API client:', e);
            this.updateAuthStatus(false, 'Lỗi khởi tạo Google API');
        }
    },
    
    /**
     * Signs in with Google
     */
    signIn: function() {
        try {
            if (!this.tokenClient) {
                this.updateAuthStatus(false, 'Google API chưa được khởi tạo');
                return;
            }
            
            // Request token
            this.tokenClient.requestAccessToken();
        } catch (e) {
            console.error('Error signing in with Google:', e);
            this.updateAuthStatus(false, 'Lỗi đăng nhập với Google');
        }
    },
    
    /**
     * Signs out from Google
     */
    signOut: function() {
        try {
            // Revoke token
            if (google.accounts.oauth2.hasGrantedAllScopes(this.tokenClient, CONFIG.GOOGLE_API.SCOPES)) {
                google.accounts.oauth2.revoke(this.tokenClient.access_token, () => {
                    this.updateAuthStatus(false);
                    
                    // Disable backup/restore buttons
                    this.updateBackupButtons(false);
                });
            } else {
                this.updateAuthStatus(false);
                
                // Disable backup/restore buttons
                this.updateBackupButtons(false);
            }
        } catch (e) {
            console.error('Error signing out from Google:', e);
            this.updateAuthStatus(false, 'Lỗi đăng xuất khỏi Google');
        }
    },
    
    /**
     * Handles successful authentication
     * @param {Object} tokenResponse - Token response
     */
    handleAuthSuccess: function(tokenResponse) {
        try {
            // Update auth status
            this.isSignedIn = true;
            this.updateAuthStatus(true);
            
            // Enable backup/restore buttons
            this.updateBackupButtons(true);
        } catch (e) {
            console.error('Error handling auth success:', e);
            this.updateAuthStatus(false, 'Lỗi xử lý xác thực thành công');
        }
    },
    
    /**
     * Handles authentication error
     * @param {string} error - Error message
     */
    handleAuthError: function(error) {
        console.error('Google auth error:', error);
        this.updateAuthStatus(false, error);
    },
    
    /**
     * Updates authentication status display
     * @param {boolean} isSignedIn - Whether user is signed in
     * @param {string} errorMessage - Error message (if any)
     */
    updateAuthStatus: function(isSignedIn, errorMessage) {
        this.isSignedIn = isSignedIn;
        
        const authStatus = document.getElementById('google-auth-status');
        const authButton = document.getElementById('google-auth-btn');
        
        if (authStatus) {
            if (isSignedIn) {
                authStatus.textContent = 'Đã đăng nhập';
                authStatus.className = 'auth-status signed-in';
            } else {
                authStatus.textContent = errorMessage || 'Chưa đăng nhập';
                authStatus.className = 'auth-status';
            }
        }
        
        if (authButton) {
            if (isSignedIn) {
                authButton.innerHTML = '<i class="fab fa-google"></i> Đăng xuất khỏi Google';
            } else {
                authButton.innerHTML = '<i class="fab fa-google"></i> Đăng nhập với Google';
            }
        }
    },
    
    /**
     * Updates backup/restore buttons state
     * @param {boolean} enabled - Whether buttons should be enabled
     */
    updateBackupButtons: function(enabled) {
        const backupBtn = document.getElementById('backup-data');
        const restoreBtn = document.getElementById('restore-data');
        
        if (backupBtn) {
            backupBtn.disabled = !enabled;
        }
        
        if (restoreBtn) {
            restoreBtn.disabled = !enabled;
        }
    },
    
    /**
     * Backs up data to Google Drive
     */
    backupData: function() {
        try {
            if (!this.isSignedIn) {
                Utils.showModal('alert-modal', {
                    title: 'Chưa đăng nhập',
                    message: 'Vui lòng đăng nhập với Google trước khi sao lưu dữ liệu.'
                });
                return;
            }
            
            // Show loading modal
            Utils.showModal('loading-modal', {
                message: 'Đang sao lưu dữ liệu...'
            });
            
            // Collect data
            const backupData = {
                character: Storage.load(CONFIG.CHARACTER.STORAGE_KEY),
                chat: Storage.load(CONFIG.CHAT.STORAGE_KEY),
                diary: Storage.load(CONFIG.DIARY.STORAGE_KEY),
                game: Storage.load(CONFIG.GAME.STORAGE_KEY),
                timestamp: new Date().toISOString()
            };
            
            // Convert to JSON
            const backupJson = JSON.stringify(backupData);
            
            // Create file metadata
            const metadata = {
                name: CONFIG.GOOGLE_API.BACKUP_FILENAME,
                mimeType: 'application/json'
            };
            
            // Create file content
            const content = new Blob([backupJson], { type: 'application/json' });
            
            // Create form data
            const formData = new FormData();
            formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
            formData.append('file', content);
            
            // Upload to Google Drive
            fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + this.tokenClient.access_token
                },
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Hide loading modal
                Utils.hideModal('loading-modal');
                
                // Show success message
                Utils.showModal('alert-modal', {
                    title: 'Sao lưu thành công',
                    message: 'Dữ liệu đã được sao lưu thành công lên Google Drive.'
                });
            })
            .catch(error => {
                console.error('Error backing up data:', error);
                
                // Hide loading modal
                Utils.hideModal('loading-modal');
                
                // Show error message
                Utils.showModal('alert-modal', {
                    title: 'Lỗi sao lưu',
                    message: 'Có lỗi xảy ra khi sao lưu dữ liệu: ' + error.message
                });
            });
        } catch (e) {
            console.error('Error backing up data:', e);
            
            // Hide loading modal
            Utils.hideModal('loading-modal');
            
            // Show error message
            Utils.showModal('alert-modal', {
                title: 'Lỗi sao lưu',
                message: 'Có lỗi xảy ra khi sao lưu dữ liệu: ' + e.message
            });
        }
    },
    
    /**
     * Restores data from Google Drive
     */
    restoreData: function() {
        try {
            if (!this.isSignedIn) {
                Utils.showModal('alert-modal', {
                    title: 'Chưa đăng nhập',
                    message: 'Vui lòng đăng nhập với Google trước khi khôi phục dữ liệu.'
                });
                return;
            }
            
            // Show loading modal
            Utils.showModal('loading-modal', {
                message: 'Đang khôi phục dữ liệu...'
            });
            
            // Search for backup file
            fetch(`https://www.googleapis.com/drive/v3/files?q=name='${CONFIG.GOOGLE_API.BACKUP_FILENAME}'`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + this.tokenClient.access_token
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (!data.files || data.files.length === 0) {
                    throw new Error('Không tìm thấy file sao lưu');
                }
                
                // Get file ID
                const fileId = data.files[0].id;
                
                // Download file
                return fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + this.tokenClient.access_token
                    }
                });
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(backupData => {
                // Restore data
                if (backupData.character) {
                    Storage.save(CONFIG.CHARACTER.STORAGE_KEY, backupData.character);
                }
                
                if (backupData.chat) {
                    Storage.save(CONFIG.CHAT.STORAGE_KEY, backupData.chat);
                }
                
                if (backupData.diary) {
                    Storage.save(CONFIG.DIARY.STORAGE_KEY, backupData.diary);
                }
                
                if (backupData.game) {
                    Storage.save(CONFIG.GAME.STORAGE_KEY, backupData.game);
                }
                
                // Hide loading modal
                Utils.hideModal('loading-modal');
                
                // Show success message
                Utils.showModal('alert-modal', {
                    title: 'Khôi phục thành công',
                    message: 'Dữ liệu đã được khôi phục thành công. Trang sẽ được tải lại.',
                    onClose: () => {
                        window.location.reload();
                    }
                });
            })
            .catch(error => {
                console.error('Error restoring data:', error);
                
                // Hide loading modal
                Utils.hideModal('loading-modal');
                
                // Show error message
                Utils.showModal('alert-modal', {
                    title: 'Lỗi khôi phục',
                    message: 'Có lỗi xảy ra khi khôi phục dữ liệu: ' + error.message
                });
            });
        } catch (e) {
            console.error('Error restoring data:', e);
            
            // Hide loading modal
            Utils.hideModal('loading-modal');
            
            // Show error message
            Utils.showModal('alert-modal', {
                title: 'Lỗi khôi phục',
                message: 'Có lỗi xảy ra khi khôi phục dữ liệu: ' + e.message
            });
        }
    }
};
