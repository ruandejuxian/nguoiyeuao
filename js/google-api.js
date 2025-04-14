/**
 * Google API integration for the Virtual Companion application
 */
const GoogleAPI = {
    /**
     * Whether the user is authenticated with Google
     */
    isAuthenticated: false,
    
    /**
     * Google API client
     */
    gapiClient: null,
    
    /**
     * Initializes Google API
     */
    init: function() {
        // Load the Google API client library
        this.loadGapiScript()
            .then(() => {
                // Initialize the Google API client
                gapi.load('client:auth2', this.initClient.bind(this));
            })
            .catch(error => {
                console.error('Error loading Google API:', error);
                this.updateAuthStatus('Không thể tải Google API');
            });
    },
    
    /**
     * Loads the Google API client script
     * @returns {Promise} Promise that resolves when script is loaded
     */
    loadGapiScript: function() {
        return new Promise((resolve, reject) => {
            // Check if script is already loaded
            if (window.gapi) {
                resolve();
                return;
            }
            
            // Create script element
            const script = document.createElement('script');
            script.src = 'https://apis.google.com/js/api.js';
            script.async = true;
            script.defer = true;
            
            script.onload = () => {
                resolve();
            };
            
            script.onerror = () => {
                reject(new Error('Failed to load Google API script'));
            };
            
            // Add script to document
            document.body.appendChild(script);
        });
    },
    
    /**
     * Initializes the Google API client
     */
    initClient: function() {
        gapi.client.init({
            apiKey: CONFIG.GOOGLE_API.API_KEY,
            clientId: CONFIG.GOOGLE_API.CLIENT_ID,
            discoveryDocs: CONFIG.GOOGLE_API.DISCOVERY_DOCS,
            scope: CONFIG.GOOGLE_API.SCOPES
        }).then(() => {
            // Listen for sign-in state changes
            gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus.bind(this));
            
            // Handle the initial sign-in state
            this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
            
            // Set up sign-in button
            document.getElementById('google-auth-btn').addEventListener('click', this.handleAuthClick.bind(this));
            
            // Set up backup/restore buttons
            document.getElementById('backup-data').addEventListener('click', this.backupData.bind(this));
            document.getElementById('restore-data').addEventListener('click', this.restoreData.bind(this));
            
            this.gapiClient = gapi.client;
        }).catch(error => {
            console.error('Error initializing Google API client:', error);
            this.updateAuthStatus('Lỗi khởi tạo Google API');
        });
    },
    
    /**
     * Updates the sign-in status
     * @param {boolean} isSignedIn - Whether user is signed in
     */
    updateSigninStatus: function(isSignedIn) {
        this.isAuthenticated = isSignedIn;
        
        // Update UI
        const authBtn = document.getElementById('google-auth-btn');
        const backupBtn = document.getElementById('backup-data');
        const restoreBtn = document.getElementById('restore-data');
        
        if (isSignedIn) {
            authBtn.innerHTML = '<i class="fab fa-google"></i> Đăng xuất';
            backupBtn.disabled = false;
            restoreBtn.disabled = false;
            this.updateAuthStatus('Đã đăng nhập');
        } else {
            authBtn.innerHTML = '<i class="fab fa-google"></i> Đăng nhập với Google';
            backupBtn.disabled = true;
            restoreBtn.disabled = true;
            this.updateAuthStatus('Chưa đăng nhập');
        }
    },
    
    /**
     * Updates the authentication status display
     * @param {string} status - Status message
     */
    updateAuthStatus: function(status) {
        const authStatus = document.getElementById('google-auth-status');
        authStatus.textContent = status;
    },
    
    /**
     * Handles authentication button click
     */
    handleAuthClick: function() {
        if (this.isAuthenticated) {
            // Sign out
            gapi.auth2.getAuthInstance().signOut();
        } else {
            // Sign in
            gapi.auth2.getAuthInstance().signIn();
        }
    },
    
    /**
     * Backs up data to Google Drive
     */
    backupData: async function() {
        if (!this.isAuthenticated) {
            Utils.showModal('alert-modal', {
                title: 'Chưa đăng nhập',
                message: 'Vui lòng đăng nhập với Google trước khi sao lưu dữ liệu.'
            });
            return;
        }
        
        try {
            Utils.showModal('loading-modal', {
                message: 'Đang sao lưu dữ liệu...'
            });
            
            // Collect data to backup
            const backupData = {
                character: Storage.load(CONFIG.CHARACTER.STORAGE_KEY),
                chatHistory: Storage.load(CONFIG.CHAT.STORAGE_KEY),
                diary: Storage.load(CONFIG.DIARY.STORAGE_KEY),
                version: '1.0',
                timestamp: new Date().toISOString()
            };
            
            // Convert to JSON
            const backupContent = JSON.stringify(backupData, null, 2);
            
            // Check if backup file already exists
            let fileId = await this.findBackupFile();
            
            if (fileId) {
                // Update existing file
                await this.updateDriveFile(fileId, backupContent);
            } else {
                // Create new file
                await this.createDriveFile(backupContent);
            }
            
            Utils.hideModal('loading-modal');
            
            Utils.showModal('alert-modal', {
                title: 'Sao lưu thành công',
                message: 'Dữ liệu đã được sao lưu vào Google Drive của bạn.'
            });
        } catch (error) {
            console.error('Error backing up data:', error);
            
            Utils.hideModal('loading-modal');
            
            Utils.showModal('alert-modal', {
                title: 'Lỗi sao lưu',
                message: 'Có lỗi xảy ra khi sao lưu dữ liệu: ' + error.message
            });
        }
    },
    
    /**
     * Restores data from Google Drive
     */
    restoreData: async function() {
        if (!this.isAuthenticated) {
            Utils.showModal('alert-modal', {
                title: 'Chưa đăng nhập',
                message: 'Vui lòng đăng nhập với Google trước khi khôi phục dữ liệu.'
            });
            return;
        }
        
        try {
            Utils.showModal('loading-modal', {
                message: 'Đang khôi phục dữ liệu...'
            });
            
            // Find backup file
            const fileId = await this.findBackupFile();
            
            if (!fileId) {
                Utils.hideModal('loading-modal');
                
                Utils.showModal('alert-modal', {
                    title: 'Không tìm thấy bản sao lưu',
                    message: 'Không tìm thấy bản sao lưu nào trong Google Drive của bạn.'
                });
                return;
            }
            
            // Get file content
            const backupContent = await this.readDriveFile(fileId);
            
            if (!backupContent) {
                throw new Error('Không thể đọc nội dung bản sao lưu');
            }
            
            // Parse backup data
            const backupData = JSON.parse(backupContent);
            
            // Confirm restore
            Utils.hideModal('loading-modal');
            
            Utils.showModal('confirm-modal', {
                title: 'Xác nhận khôi phục',
                message: `Bạn có chắc chắn muốn khôi phục dữ liệu từ bản sao lưu ngày ${new Date(backupData.timestamp).toLocaleDateString('vi-VN')}? Dữ liệu hiện tại sẽ bị ghi đè.`,
                onConfirm: () => {
                    // Restore data
                    if (backupData.character) {
                        Storage.save(CONFIG.CHARACTER.STORAGE_KEY, backupData.character);
                    }
                    
                    if (backupData.chatHistory) {
                        Storage.save(CONFIG.CHAT.STORAGE_KEY, backupData.chatHistory);
                    }
                    
                    if (backupData.diary) {
                        Storage.save(CONFIG.DIARY.STORAGE_KEY, backupData.diary);
                    }
                    
                    // Reload page to apply changes
                    Utils.showModal('alert-modal', {
                        title: 'Khôi phục thành công',
                        message: 'Dữ liệu đã được khôi phục thành công. Trang sẽ được tải lại để áp dụng thay đổi.',
                        onClose: () => {
                            window.location.reload();
                        }
                    });
                }
            });
        } catch (error) {
            console.error('Error restoring data:', error);
            
            Utils.hideModal('loading-modal');
            
            Utils.showModal('alert-modal', {
                title: 'Lỗi khôi phục',
                message: 'Có lỗi xảy ra khi khôi phục dữ liệu: ' + error.message
            });
        }
    },
    
    /**
     * Finds the backup file in Google Drive
     * @returns {string|null} File ID or null if not found
     */
    findBackupFile: async function() {
        try {
            const response = await this.gapiClient.drive.files.list({
                q: `name='${CONFIG.GOOGLE_API.BACKUP_FILENAME}' and trashed=false`,
                fields: 'files(id, name, modifiedTime)',
                spaces: 'drive'
            });
            
            const files = response.result.files;
            
            if (files && files.length > 0) {
                // Return the first matching file
                return files[0].id;
            }
            
            return null;
        } catch (error) {
            console.error('Error finding backup file:', error);
            return null;
        }
    },
    
    /**
     * Creates a new backup file in Google Drive
     * @param {string} content - File content
     * @returns {string} Created file ID
     */
    createDriveFile: async function(content) {
        const metadata = {
            name: CONFIG.GOOGLE_API.BACKUP_FILENAME,
            mimeType: 'application/json'
        };
        
        const file = new Blob([content], {type: 'application/json'});
        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
        form.append('file', file);
        
        const accessToken = gapi.auth.getToken().access_token;
        
        const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
            body: form
        });
        
        const data = await response.json();
        return data.id;
    },
    
    /**
     * Updates an existing file in Google Drive
     * @param {string} fileId - File ID to update
     * @param {string} content - New file content
     */
    updateDriveFile: async function(fileId, content) {
        const file = new Blob([content], {type: 'application/json'});
        
        const accessToken = gapi.auth.getToken().access_token;
        
        await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`, {
            method: 'PATCH',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            body: file
        });
    },
    
    /**
     * Reads a file from Google Drive
     * @param {string} fileId - File ID to read
     * @returns {string} File content
     */
    readDriveFile: async function(fileId) {
        const accessToken = gapi.auth.getToken().access_token;
        
        const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        });
        
        return await response.text();
    }
};
