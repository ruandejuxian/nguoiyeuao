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
     * User profile information
     */
    userProfile: null,
    
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
        
        // Set up sync type selector
        const syncTypeSelect = document.getElementById('sync-type');
        const sheetsOptions = document.getElementById('sheets-options');
        
        if (syncTypeSelect && sheetsOptions) {
            syncTypeSelect.addEventListener('change', () => {
                if (syncTypeSelect.value === 'sheets') {
                    sheetsOptions.style.display = 'block';
                } else {
                    sheetsOptions.style.display = 'none';
                }
            });
        }
        
        // Set up backup and restore buttons
        const backupBtn = document.getElementById('backup-data');
        const restoreBtn = document.getElementById('restore-data');
        const createSheetBtn = document.getElementById('create-sheet');
        
        if (backupBtn) {
            backupBtn.addEventListener('click', () => {
                const syncType = document.getElementById('sync-type').value;
                if (syncType === 'sheets') {
                    this.backupToSheets();
                } else {
                    this.backupData();
                }
            });
        }
        
        if (restoreBtn) {
            restoreBtn.addEventListener('click', () => {
                const syncType = document.getElementById('sync-type').value;
                if (syncType === 'sheets') {
                    this.restoreFromSheets();
                } else {
                    this.restoreData();
                }
            });
        }
        
        if (createSheetBtn) {
            createSheetBtn.addEventListener('click', () => {
                this.createSheet();
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
                    this.updateUserProfile(null);
                    
                    // Disable backup/restore buttons
                    this.updateBackupButtons(false);
                });
            } else {
                this.updateAuthStatus(false);
                this.updateUserProfile(null);
                
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
            
            // Get user profile
            this.fetchUserProfile(tokenResponse.access_token);
        } catch (e) {
            console.error('Error handling auth success:', e);
            this.updateAuthStatus(false, 'Lỗi xử lý xác thực thành công');
        }
    },
    
    /**
     * Fetches user profile information
     * @param {string} accessToken - Access token
     */
    fetchUserProfile: function(accessToken) {
        try {
            // Fetch user profile
            fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Update user profile
                this.userProfile = {
                    id: data.sub,
                    name: data.name,
                    email: data.email,
                    picture: data.picture
                };
                
                // Update UI
                this.updateUserProfile(this.userProfile);
            })
            .catch(error => {
                console.error('Error fetching user profile:', error);
            });
        } catch (e) {
            console.error('Error fetching user profile:', e);
        }
    },
    
    /**
     * Updates user profile display
     * @param {Object} profile - User profile
     */
    updateUserProfile: function(profile) {
        const userProfileEl = document.getElementById('user-profile');
        const userAvatarEl = document.getElementById('google-user-avatar');
        const userNameEl = document.getElementById('google-user-name');
        const userEmailEl = document.getElementById('google-user-email');
        
        if (userProfileEl && userAvatarEl && userNameEl && userEmailEl) {
            if (profile) {
                userProfileEl.style.display = 'flex';
                userAvatarEl.src = profile.picture;
                userNameEl.textContent = profile.name;
                userEmailEl.textContent = profile.email;
            } else {
                userProfileEl.style.display = 'none';
                userAvatarEl.src = '';
                userNameEl.textContent = 'Chưa đăng nhập';
                userEmailEl.textContent = '';
            }
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
    },
    
    /**
     * Creates a new Google Sheet
     */
    createSheet: function() {
        try {
            if (!this.isSignedIn) {
                Utils.showModal('alert-modal', {
                    title: 'Chưa đăng nhập',
                    message: 'Vui lòng đăng nhập với Google trước khi tạo Sheet.'
                });
                return;
            }
            
            // Show loading modal
            Utils.showModal('loading-modal', {
                message: 'Đang tạo Google Sheet...'
            });
            
            // Create sheet metadata
            const metadata = {
                properties: {
                    title: 'Người Yêu Ảo - Dữ liệu'
                },
                sheets: [
                    {
                        properties: {
                            title: 'Nhân vật',
                            gridProperties: {
                                rowCount: 10,
                                columnCount: 10
                            }
                        }
                    },
                    {
                        properties: {
                            title: 'Tin nhắn',
                            gridProperties: {
                                rowCount: 1000,
                                columnCount: 5
                            }
                        }
                    },
                    {
                        properties: {
                            title: 'Nhật ký',
                            gridProperties: {
                                rowCount: 100,
                                columnCount: 5
                            }
                        }
                    }
                ]
            };
            
            // Create sheet
            fetch('https://sheets.googleapis.com/v4/spreadsheets', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + this.tokenClient.access_token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(metadata)
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
                
                // Set sheet ID
                const sheetIdInput = document.getElementById('sheet-id');
                if (sheetIdInput) {
                    sheetIdInput.value = data.spreadsheetId;
                }
                
                // Show success message
                Utils.showModal('alert-modal', {
                    title: 'Tạo Sheet thành công',
                    message: `Google Sheet đã được tạo thành công. ID: ${data.spreadsheetId}`
                });
            })
            .catch(error => {
                console.error('Error creating sheet:', error);
                
                // Hide loading modal
                Utils.hideModal('loading-modal');
                
                // Show error message
                Utils.showModal('alert-modal', {
                    title: 'Lỗi tạo Sheet',
                    message: 'Có lỗi xảy ra khi tạo Google Sheet: ' + error.message
                });
            });
        } catch (e) {
            console.error('Error creating sheet:', e);
            
            // Hide loading modal
            Utils.hideModal('loading-modal');
            
            // Show error message
            Utils.showModal('alert-modal', {
                title: 'Lỗi tạo Sheet',
                message: 'Có lỗi xảy ra khi tạo Google Sheet: ' + e.message
            });
        }
    },
    
    /**
     * Backs up data to Google Sheets
     */
    backupToSheets: function() {
        try {
            if (!this.isSignedIn) {
                Utils.showModal('alert-modal', {
                    title: 'Chưa đăng nhập',
                    message: 'Vui lòng đăng nhập với Google trước khi sao lưu dữ liệu.'
                });
                return;
            }
            
            // Get sheet ID
            const sheetId = document.getElementById('sheet-id').value;
            
            if (!sheetId) {
                Utils.showModal('alert-modal', {
                    title: 'Thiếu Sheet ID',
                    message: 'Vui lòng nhập ID của Google Sheet hoặc tạo Sheet mới.'
                });
                return;
            }
            
            // Show loading modal
            Utils.showModal('loading-modal', {
                message: 'Đang sao lưu dữ liệu vào Google Sheets...'
            });
            
            // Collect data
            const characterData = Storage.load(CONFIG.CHARACTER.STORAGE_KEY);
            const chatData = Storage.load(CONFIG.CHAT.STORAGE_KEY) || [];
            const diaryData = Storage.load(CONFIG.DIARY.STORAGE_KEY) || [];
            
            // Prepare character data
            const characterValues = [];
            if (characterData) {
                characterValues.push(['Tên', 'Giới tính', 'Tuổi', 'Tính cách', 'Sở thích', 'Mức độ thân thiết']);
                characterValues.push([
                    characterData.name,
                    characterData.gender,
                    characterData.age,
                    characterData.personality,
                    characterData.interests,
                    characterData.intimacy || 0
                ]);
            }
            
            // Prepare chat data
            const chatValues = [];
            if (chatData.length > 0) {
                chatValues.push(['Thời gian', 'Người gửi', 'Nội dung']);
                chatData.forEach(msg => {
                    chatValues.push([
                        new Date(msg.timestamp).toLocaleString(),
                        msg.role === 'user' ? 'Người dùng' : (msg.role === 'assistant' ? 'Nhân vật' : 'Hệ thống'),
                        msg.content
                    ]);
                });
            }
            
            // Prepare diary data
            const diaryValues = [];
            if (diaryData.length > 0) {
                diaryValues.push(['Thời gian', 'Tiêu đề', 'Nội dung']);
                diaryData.forEach(entry => {
                    diaryValues.push([
                        new Date(entry.timestamp).toLocaleString(),
                        entry.title,
                        entry.content
                    ]);
                });
            }
            
            // Define batch update request
            const requests = [];
            
            // Character data
            if (characterValues.length > 0) {
                requests.push({
                    updateCells: {
                        start: {
                            sheetId: 0,
                            rowIndex: 0,
                            columnIndex: 0
                        },
                        rows: characterValues.map(row => ({
                            values: row.map(cell => ({
                                userEnteredValue: {
                                    stringValue: String(cell)
                                }
                            }))
                        })),
                        fields: 'userEnteredValue'
                    }
                });
            }
            
            // Chat data
            if (chatValues.length > 0) {
                requests.push({
                    updateCells: {
                        start: {
                            sheetId: 1,
                            rowIndex: 0,
                            columnIndex: 0
                        },
                        rows: chatValues.map(row => ({
                            values: row.map(cell => ({
                                userEnteredValue: {
                                    stringValue: String(cell)
                                }
                            }))
                        })),
                        fields: 'userEnteredValue'
                    }
                });
            }
            
            // Diary data
            if (diaryValues.length > 0) {
                requests.push({
                    updateCells: {
                        start: {
                            sheetId: 2,
                            rowIndex: 0,
                            columnIndex: 0
                        },
                        rows: diaryValues.map(row => ({
                            values: row.map(cell => ({
                                userEnteredValue: {
                                    stringValue: String(cell)
                                }
                            }))
                        })),
                        fields: 'userEnteredValue'
                    }
                });
            }
            
            // Execute batch update
            fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}:batchUpdate`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + this.tokenClient.access_token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    requests: requests
                })
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
                    message: 'Dữ liệu đã được sao lưu thành công vào Google Sheets.'
                });
            })
            .catch(error => {
                console.error('Error backing up to sheets:', error);
                
                // Hide loading modal
                Utils.hideModal('loading-modal');
                
                // Show error message
                Utils.showModal('alert-modal', {
                    title: 'Lỗi sao lưu',
                    message: 'Có lỗi xảy ra khi sao lưu dữ liệu vào Google Sheets: ' + error.message
                });
            });
        } catch (e) {
            console.error('Error backing up to sheets:', e);
            
            // Hide loading modal
            Utils.hideModal('loading-modal');
            
            // Show error message
            Utils.showModal('alert-modal', {
                title: 'Lỗi sao lưu',
                message: 'Có lỗi xảy ra khi sao lưu dữ liệu vào Google Sheets: ' + e.message
            });
        }
    },
    
    /**
     * Restores data from Google Sheets
     */
    restoreFromSheets: function() {
        try {
            if (!this.isSignedIn) {
                Utils.showModal('alert-modal', {
                    title: 'Chưa đăng nhập',
                    message: 'Vui lòng đăng nhập với Google trước khi khôi phục dữ liệu.'
                });
                return;
            }
            
            // Get sheet ID
            const sheetId = document.getElementById('sheet-id').value;
            
            if (!sheetId) {
                Utils.showModal('alert-modal', {
                    title: 'Thiếu Sheet ID',
                    message: 'Vui lòng nhập ID của Google Sheet để khôi phục dữ liệu.'
                });
                return;
            }
            
            // Show loading modal
            Utils.showModal('loading-modal', {
                message: 'Đang khôi phục dữ liệu từ Google Sheets...'
            });
            
            // Fetch sheet data
            Promise.all([
                // Character data
                fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Nhân%20vật!A1:F10`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + this.tokenClient.access_token
                    }
                }),
                
                // Chat data
                fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Tin%20nhắn!A1:C1000`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + this.tokenClient.access_token
                    }
                }),
                
                // Diary data
                fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Nhật%20ký!A1:C100`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + this.tokenClient.access_token
                    }
                })
            ])
            .then(responses => {
                // Check for errors
                responses.forEach(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                });
                
                // Parse responses
                return Promise.all(responses.map(response => response.json()));
            })
            .then(([characterData, chatData, diaryData]) => {
                // Process character data
                if (characterData.values && characterData.values.length > 1) {
                    const headerRow = characterData.values[0];
                    const dataRow = characterData.values[1];
                    
                    // Find column indices
                    const nameIndex = headerRow.indexOf('Tên');
                    const genderIndex = headerRow.indexOf('Giới tính');
                    const ageIndex = headerRow.indexOf('Tuổi');
                    const personalityIndex = headerRow.indexOf('Tính cách');
                    const interestsIndex = headerRow.indexOf('Sở thích');
                    const intimacyIndex = headerRow.indexOf('Mức độ thân thiết');
                    
                    // Create character object
                    const character = {
                        name: nameIndex >= 0 ? dataRow[nameIndex] : '',
                        gender: genderIndex >= 0 ? dataRow[genderIndex] : 'female',
                        age: ageIndex >= 0 ? parseInt(dataRow[ageIndex]) : 20,
                        personality: personalityIndex >= 0 ? dataRow[personalityIndex] : '',
                        interests: interestsIndex >= 0 ? dataRow[interestsIndex] : '',
                        intimacy: intimacyIndex >= 0 ? parseInt(dataRow[intimacyIndex]) : 0,
                        avatar: CONFIG.CHARACTER.DEFAULT_AVATAR
                    };
                    
                    // Save character
                    Storage.save(CONFIG.CHARACTER.STORAGE_KEY, character);
                }
                
                // Process chat data
                if (chatData.values && chatData.values.length > 1) {
                    const headerRow = chatData.values[0];
                    const dataRows = chatData.values.slice(1);
                    
                    // Find column indices
                    const timestampIndex = headerRow.indexOf('Thời gian');
                    const roleIndex = headerRow.indexOf('Người gửi');
                    const contentIndex = headerRow.indexOf('Nội dung');
                    
                    // Create chat messages
                    const chatMessages = dataRows.map(row => {
                        // Determine role
                        let role = 'user';
                        if (roleIndex >= 0) {
                            const roleText = row[roleIndex];
                            if (roleText === 'Nhân vật') {
                                role = 'assistant';
                            } else if (roleText === 'Hệ thống') {
                                role = 'system';
                            }
                        }
                        
                        return {
                            timestamp: timestampIndex >= 0 ? new Date(row[timestampIndex]).toISOString() : new Date().toISOString(),
                            role: role,
                            content: contentIndex >= 0 ? row[contentIndex] : ''
                        };
                    });
                    
                    // Save chat history
                    Storage.save(CONFIG.CHAT.STORAGE_KEY, chatMessages);
                }
                
                // Process diary data
                if (diaryData.values && diaryData.values.length > 1) {
                    const headerRow = diaryData.values[0];
                    const dataRows = diaryData.values.slice(1);
                    
                    // Find column indices
                    const timestampIndex = headerRow.indexOf('Thời gian');
                    const titleIndex = headerRow.indexOf('Tiêu đề');
                    const contentIndex = headerRow.indexOf('Nội dung');
                    
                    // Create diary entries
                    const diaryEntries = dataRows.map(row => {
                        return {
                            timestamp: timestampIndex >= 0 ? new Date(row[timestampIndex]).toISOString() : new Date().toISOString(),
                            title: titleIndex >= 0 ? row[titleIndex] : '',
                            content: contentIndex >= 0 ? row[contentIndex] : ''
                        };
                    });
                    
                    // Save diary entries
                    Storage.save(CONFIG.DIARY.STORAGE_KEY, diaryEntries);
                }
                
                // Hide loading modal
                Utils.hideModal('loading-modal');
                
                // Show success message
                Utils.showModal('alert-modal', {
                    title: 'Khôi phục thành công',
                    message: 'Dữ liệu đã được khôi phục thành công từ Google Sheets. Trang sẽ được tải lại.',
                    onClose: () => {
                        window.location.reload();
                    }
                });
            })
            .catch(error => {
                console.error('Error restoring from sheets:', error);
                
                // Hide loading modal
                Utils.hideModal('loading-modal');
                
                // Show error message
                Utils.showModal('alert-modal', {
                    title: 'Lỗi khôi phục',
                    message: 'Có lỗi xảy ra khi khôi phục dữ liệu từ Google Sheets: ' + error.message
                });
            });
        } catch (e) {
            console.error('Error restoring from sheets:', e);
            
            // Hide loading modal
            Utils.hideModal('loading-modal');
            
            // Show error message
            Utils.showModal('alert-modal', {
                title: 'Lỗi khôi phục',
                message: 'Có lỗi xảy ra khi khôi phục dữ liệu từ Google Sheets: ' + e.message
            });
        }
    }
};
