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
     * Google Identity Services client
     */
    tokenClient: null,
    
    /**
     * Current user profile information
     */
    userProfile: null,
    
    /**
     * Initializes Google API
     */
    init: function() {
        console.log('Initializing Google API...');
        
        // Load the Google API client library
        this.loadGapiScript()
            .then(() => {
                console.log('Google API script loaded');
                // Load the Google Identity Services library
                return this.loadGisScript();
            })
            .then(() => {
                console.log('Google Identity Services script loaded');
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
     * Loads the Google Identity Services script
     * @returns {Promise} Promise that resolves when script is loaded
     */
    loadGisScript: function() {
        return new Promise((resolve, reject) => {
            // Check if script is already loaded
            if (window.google && window.google.accounts) {
                resolve();
                return;
            }
            
            // Create script element
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            
            script.onload = () => {
                resolve();
            };
            
            script.onerror = () => {
                reject(new Error('Failed to load Google Identity Services script'));
            };
            
            // Add script to document
            document.body.appendChild(script);
        });
    },
    
    /**
     * Initializes the Google API client
     */
    initClient: function() {
        console.log('Initializing Google API client...');
        
        gapi.client.init({
            apiKey: CONFIG.GOOGLE_API.API_KEY,
            clientId: CONFIG.GOOGLE_API.CLIENT_ID,
            discoveryDocs: CONFIG.GOOGLE_API.DISCOVERY_DOCS,
            scope: CONFIG.GOOGLE_API.SCOPES
        }).then(() => {
            // Initialize auth2
            this.gapiClient = gapi.client;
            this.auth2 = gapi.auth2.getAuthInstance();
            
            // Listen for sign-in state changes
            this.auth2.isSignedIn.listen(this.updateSigninStatus.bind(this));
            
            // Handle the initial sign-in state
            this.updateSigninStatus(this.auth2.isSignedIn.get());
            
            // Set up sign-in button
            const googleAuthBtn = document.getElementById('google-auth-btn');
            if (googleAuthBtn) {
                googleAuthBtn.addEventListener('click', this.handleAuthClick.bind(this));
            }
            
            // Set up backup/restore buttons
            const backupDataBtn = document.getElementById('backup-data');
            const restoreDataBtn = document.getElementById('restore-data');
            
            if (backupDataBtn) {
                backupDataBtn.addEventListener('click', this.backupData.bind(this));
            }
            
            if (restoreDataBtn) {
                restoreDataBtn.addEventListener('click', this.restoreData.bind(this));
            }
            
            console.log('Google API client initialized');
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
        console.log('Updating sign-in status:', isSignedIn);
        
        this.isAuthenticated = isSignedIn;
        
        // Update UI
        const authBtn = document.getElementById('google-auth-btn');
        const backupBtn = document.getElementById('backup-data');
        const restoreBtn = document.getElementById('restore-data');
        const userInfoContainer = document.getElementById('google-user-info');
        
        if (isSignedIn) {
            // Get user profile
            const user = this.auth2.currentUser.get();
            const profile = user.getBasicProfile();
            
            this.userProfile = {
                id: profile.getId(),
                name: profile.getName(),
                email: profile.getEmail(),
                imageUrl: profile.getImageUrl()
            };
            
            // Update UI with user info
            if (authBtn) {
                authBtn.innerHTML = '<i class="fab fa-google"></i> Chuyển tài khoản';
            }
            
            if (backupBtn) {
                backupBtn.disabled = false;
            }
            
            if (restoreBtn) {
                restoreBtn.disabled = false;
            }
            
            // Display user info
            if (userInfoContainer) {
                userInfoContainer.innerHTML = `
                    <div class="user-profile">
                        <img src="${this.userProfile.imageUrl}" alt="${this.userProfile.name}" class="user-avatar">
                        <div class="user-details">
                            <div class="user-name">${this.userProfile.name}</div>
                            <div class="user-email">${this.userProfile.email}</div>
                        </div>
                    </div>
                    <button id="google-signout-btn" class="secondary-btn">
                        <i class="fas fa-sign-out-alt"></i> Đăng xuất
                    </button>
                `;
                
                // Add sign-out button event listener
                const signoutBtn = document.getElementById('google-signout-btn');
                if (signoutBtn) {
                    signoutBtn.addEventListener('click', this.handleSignoutClick.bind(this));
                }
                
                userInfoContainer.style.display = 'flex';
            }
            
            this.updateAuthStatus('Đã đăng nhập');
        } else {
            if (authBtn) {
                authBtn.innerHTML = '<i class="fab fa-google"></i> Đăng nhập với Google';
            }
            
            if (backupBtn) {
                backupBtn.disabled = true;
            }
            
            if (restoreBtn) {
                restoreBtn.disabled = true;
            }
            
            // Clear user info
            if (userInfoContainer) {
                userInfoContainer.innerHTML = '';
                userInfoContainer.style.display = 'none';
            }
            
            this.userProfile = null;
            this.updateAuthStatus('Chưa đăng nhập');
        }
    },
    
    /**
     * Updates the authentication status display
     * @param {string} status - Status message
     */
    updateAuthStatus: function(status) {
        const authStatus = document.getElementById('google-auth-status');
        if (authStatus) {
            authStatus.textContent = status;
        }
    },
    
    /**
     * Handles authentication button click
     */
    handleAuthClick: function() {
        console.log('Auth button clicked, isAuthenticated:', this.isAuthenticated);
        
        if (this.isAuthenticated) {
            // If already signed in, prompt for account selection
            this.auth2.signIn({
                prompt: 'select_account'
            }).then(() => {
                console.log('Account selection completed');
            }).catch(error => {
                console.error('Error during account selection:', error);
            });
        } else {
            // Sign in with account selection
            this.auth2.signIn({
                prompt: 'select_account'
            }).then(() => {
                console.log('Sign-in completed');
            }).catch(error => {
                console.error('Error during sign-in:', error);
            });
        }
    },
    
    /**
     * Handles sign-out button click
     */
    handleSignoutClick: function() {
        console.log('Sign-out button clicked');
        
        this.auth2.signOut().then(() => {
            console.log('User signed out');
        }).catch(error => {
            console.error('Error during sign-out:', error);
        });
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
                settings: {
                    darkMode: localStorage.getItem('dark_mode'),
                    notifications: {
                        enabled: localStorage.getItem('notifications_enabled'),
                        time: localStorage.getItem('notification_time')
                    },
                    apiType: localStorage.getItem('api_type'),
                    apiKey: localStorage.getItem('api_key')
                },
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
                    
                    // Restore settings
                    if (backupData.settings) {
                        if (backupData.settings.darkMode) {
                            localStorage.setItem('dark_mode', backupData.settings.darkMode);
                        }
                        
                        if (backupData.settings.notifications) {
                            if (backupData.settings.notifications.enabled) {
                                localStorage.setItem('notifications_enabled', backupData.settings.notifications.enabled);
                            }
                            
                            if (backupData.settings.notifications.time) {
                                localStorage.setItem('notification_time', backupData.settings.notifications.time);
                            }
                        }
                        
                        if (backupData.settings.apiType) {
                            localStorage.setItem('api_type', backupData.settings.apiType);
                        }
                        
                        if (backupData.settings.apiKey) {
                            localStorage.setItem('api_key', backupData.settings.apiKey);
                        }
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
        
        const accessToken = this.auth2.currentUser.get().getAuthResponse().access_token;
        
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
        
        const accessToken = this.auth2.currentUser.get().getAuthResponse().access_token;
        
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
        const accessToken = this.auth2.currentUser.get().getAuthResponse().access_token;
        
        const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        });
        
        return await response.text();
    },
    
    /**
     * Exports data to Google Sheets
     * @param {string} sheetName - Name of the sheet
     * @param {Array} data - Data to export
     */
    exportToSheets: async function(sheetName, data) {
        if (!this.isAuthenticated) {
            Utils.showModal('alert-modal', {
                title: 'Chưa đăng nhập',
                message: 'Vui lòng đăng nhập với Google trước khi xuất dữ liệu.'
            });
            return;
        }
        
        try {
            Utils.showModal('loading-modal', {
                message: 'Đang xuất dữ liệu...'
            });
            
            // Check if sheet already exists
            let spreadsheetId = await this.findSpreadsheet(sheetName);
            
            if (!spreadsheetId) {
                // Create new spreadsheet
                spreadsheetId = await this.createSpreadsheet(sheetName);
            }
            
            // Update spreadsheet with data
            await this.updateSpreadsheet(spreadsheetId, data);
            
            Utils.hideModal('loading-modal');
            
            Utils.showModal('alert-modal', {
                title: 'Xuất dữ liệu thành công',
                message: 'Dữ liệu đã được xuất vào Google Sheets của bạn.'
            });
        } catch (error) {
            console.error('Error exporting to Sheets:', error);
            
            Utils.hideModal('loading-modal');
            
            Utils.showModal('alert-modal', {
                title: 'Lỗi xuất dữ liệu',
                message: 'Có lỗi xảy ra khi xuất dữ liệu: ' + error.message
            });
        }
    },
    
    /**
     * Finds a spreadsheet in Google Drive
     * @param {string} sheetName - Name of the spreadsheet
     * @returns {string|null} Spreadsheet ID or null if not found
     */
    findSpreadsheet: async function(sheetName) {
        try {
            const response = await this.gapiClient.drive.files.list({
                q: `name='${sheetName}' and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false`,
                fields: 'files(id, name)',
                spaces: 'drive'
            });
            
            const files = response.result.files;
            
            if (files && files.length > 0) {
                // Return the first matching file
                return files[0].id;
            }
            
            return null;
        } catch (error) {
            console.error('Error finding spreadsheet:', error);
            return null;
        }
    },
    
    /**
     * Creates a new spreadsheet in Google Drive
     * @param {string} sheetName - Name of the spreadsheet
     * @returns {string} Created spreadsheet ID
     */
    createSpreadsheet: async function(sheetName) {
        try {
            const response = await this.gapiClient.sheets.spreadsheets.create({
                properties: {
                    title: sheetName
                }
            });
            
            return response.result.spreadsheetId;
        } catch (error) {
            console.error('Error creating spreadsheet:', error);
            throw error;
        }
    },
    
    /**
     * Updates a spreadsheet with data
     * @param {string} spreadsheetId - Spreadsheet ID
     * @param {Array} data - Data to update
     */
    updateSpreadsheet: async function(spreadsheetId, data) {
        try {
            await this.gapiClient.sheets.spreadsheets.values.update({
                spreadsheetId: spreadsheetId,
                range: 'Sheet1!A1',
                valueInputOption: 'RAW',
                resource: {
                    values: data
                }
            });
        } catch (error) {
            console.error('Error updating spreadsheet:', error);
            throw error;
        }
    }
};
