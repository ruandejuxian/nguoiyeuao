// Google API integration for Virtual Lover App

// Google API client ID
let googleClientId = '';

// Google API scopes
const GOOGLE_API_SCOPES = 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets';

// Google API loaded flag
let googleApiLoaded = false;

// Initialize Google API
function initGoogleApi(clientId) {
    if (!clientId) {
        console.error('Google Client ID not provided');
        return;
    }
    
    googleClientId = clientId;
    
    // Load Google API script
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = loadGoogleApiClient;
    script.onerror = handleGoogleApiError;
    document.body.appendChild(script);
}

// Load Google API client
function loadGoogleApiClient() {
    gapi.load('client:auth2', initGoogleApiClient);
}

// Initialize Google API client
async function initGoogleApiClient() {
    try {
        await gapi.client.init({
            clientId: googleClientId,
            scope: GOOGLE_API_SCOPES,
            discoveryDocs: [
                'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
                'https://sheets.googleapis.com/$discovery/rest?version=v4'
            ]
        });
        
        // Set loaded flag
        googleApiLoaded = true;
        
        // Update UI
        updateGoogleApiStatus();
        
        // Listen for sign-in changes
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
        
        // Handle initial sign-in state
        updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        
        console.log('Google API initialized successfully');
    } catch (error) {
        console.error('Error initializing Google API client:', error);
        handleGoogleApiError(error);
    }
}

// Handle Google API error
function handleGoogleApiError(error) {
    console.error('Google API error:', error);
    
    // Update UI
    const statusElement = document.getElementById('google-api-status');
    if (statusElement) {
        statusElement.textContent = 'Lỗi kết nối Google API';
        statusElement.className = 'text-danger';
    }
    
    // Show error message
    alert('Không thể kết nối với Google API. Vui lòng kiểm tra kết nối mạng và thử lại sau.');
}

// Update Google API status in UI
function updateGoogleApiStatus() {
    const statusElement = document.getElementById('google-api-status');
    if (!statusElement) return;
    
    if (googleApiLoaded) {
        if (isSignedIn()) {
            statusElement.textContent = 'Đã kết nối';
            statusElement.className = 'text-success';
        } else {
            statusElement.textContent = 'Chưa đăng nhập';
            statusElement.className = 'text-warning';
        }
    } else {
        statusElement.textContent = 'Chưa kết nối';
        statusElement.className = 'text-danger';
    }
}

// Update sign-in status
function updateSignInStatus(isSignedIn) {
    const signInButton = document.getElementById('google-sign-in');
    const signOutButton = document.getElementById('google-sign-out');
    const syncButton = document.getElementById('sync-to-google');
    
    if (!signInButton || !signOutButton || !syncButton) return;
    
    if (isSignedIn) {
        signInButton.style.display = 'none';
        signOutButton.style.display = 'block';
        syncButton.disabled = false;
    } else {
        signInButton.style.display = 'block';
        signOutButton.style.display = 'none';
        syncButton.disabled = true;
    }
    
    // Update status
    updateGoogleApiStatus();
}

// Sign in to Google
function signInToGoogle() {
    if (!googleApiLoaded) {
        alert('Google API chưa được tải. Vui lòng thử lại sau.');
        return;
    }
    
    gapi.auth2.getAuthInstance().signIn();
}

// Sign out from Google
function signOutFromGoogle() {
    if (!googleApiLoaded) return;
    
    gapi.auth2.getAuthInstance().signOut();
}

// Check if signed in
function isSignedIn() {
    return googleApiLoaded && gapi.auth2.getAuthInstance().isSignedIn.get();
}

// Save data to Google Drive
async function saveToGoogleDrive(data, filename) {
    if (!isSignedIn()) {
        alert('Vui lòng đăng nhập Google trước khi lưu dữ liệu.');
        return null;
    }
    
    try {
        // Convert data to JSON string
        const content = JSON.stringify(data);
        
        // Check if file already exists
        const existingFile = await findFile(filename);
        
        if (existingFile) {
            // Update existing file
            const response = await gapi.client.drive.files.update({
                fileId: existingFile.id,
                media: {
                    mimeType: 'application/json',
                    body: content
                }
            });
            
            console.log('File updated:', response);
            return existingFile.id;
        } else {
            // Create new file
            const response = await gapi.client.drive.files.create({
                resource: {
                    name: filename,
                    mimeType: 'application/json'
                },
                media: {
                    mimeType: 'application/json',
                    body: content
                }
            });
            
            console.log('File created:', response);
            return response.result.id;
        }
    } catch (error) {
        console.error('Error saving to Google Drive:', error);
        alert('Lỗi khi lưu dữ liệu lên Google Drive. Vui lòng thử lại sau.');
        return null;
    }
}

// Load data from Google Drive
async function loadFromGoogleDrive(filename) {
    if (!isSignedIn()) {
        alert('Vui lòng đăng nhập Google trước khi tải dữ liệu.');
        return null;
    }
    
    try {
        // Find file
        const file = await findFile(filename);
        
        if (!file) {
            console.log('File not found:', filename);
            return null;
        }
        
        // Get file content
        const response = await gapi.client.drive.files.get({
            fileId: file.id,
            alt: 'media'
        });
        
        console.log('File loaded:', response);
        
        // Parse JSON data
        return JSON.parse(response.body);
    } catch (error) {
        console.error('Error loading from Google Drive:', error);
        alert('Lỗi khi tải dữ liệu từ Google Drive. Vui lòng thử lại sau.');
        return null;
    }
}

// Find file by name
async function findFile(filename) {
    try {
        const response = await gapi.client.drive.files.list({
            q: `name='${filename}'`,
            spaces: 'drive',
            fields: 'files(id, name)'
        });
        
        const files = response.result.files;
        
        if (files && files.length > 0) {
            return files[0];
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error finding file:', error);
        return null;
    }
}

// Save data to Google Sheets
async function saveToGoogleSheets(data, sheetId, sheetName) {
    if (!isSignedIn()) {
        alert('Vui lòng đăng nhập Google trước khi lưu dữ liệu.');
        return false;
    }
    
    try {
        // Check if spreadsheet exists
        let spreadsheetId = sheetId;
        
        if (!spreadsheetId) {
            // Create new spreadsheet
            const response = await gapi.client.sheets.spreadsheets.create({
                properties: {
                    title: 'Virtual Lover Data'
                },
                sheets: [
                    {
                        properties: {
                            title: sheetName || 'Data'
                        }
                    }
                ]
            });
            
            spreadsheetId = response.result.spreadsheetId;
            console.log('Spreadsheet created:', spreadsheetId);
        }
        
        // Convert data to array format for sheets
        const values = [];
        
        // Add headers
        const headers = Object.keys(data[0] || {});
        values.push(headers);
        
        // Add data rows
        for (const item of data) {
            const row = headers.map(header => item[header] || '');
            values.push(row);
        }
        
        // Update sheet
        const response = await gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: spreadsheetId,
            range: `${sheetName || 'Data'}!A1`,
            valueInputOption: 'RAW',
            resource: {
                values: values
            }
        });
        
        console.log('Sheet updated:', response);
        return true;
    } catch (error) {
        console.error('Error saving to Google Sheets:', error);
        alert('Lỗi khi lưu dữ liệu lên Google Sheets. Vui lòng thử lại sau.');
        return false;
    }
}

// Load data from Google Sheets
async function loadFromGoogleSheets(sheetId, sheetName) {
    if (!isSignedIn()) {
        alert('Vui lòng đăng nhập Google trước khi tải dữ liệu.');
        return null;
    }
    
    try {
        // Get sheet data
        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: `${sheetName || 'Data'}`
        });
        
        const values = response.result.values;
        
        if (!values || values.length === 0) {
            console.log('No data found in sheet');
            return [];
        }
        
        // Convert to object array
        const headers = values[0];
        const data = [];
        
        for (let i = 1; i < values.length; i++) {
            const row = values[i];
            const item = {};
            
            for (let j = 0; j < headers.length; j++) {
                item[headers[j]] = row[j] || '';
            }
            
            data.push(item);
        }
        
        console.log('Sheet loaded:', data);
        return data;
    } catch (error) {
        console.error('Error loading from Google Sheets:', error);
        alert('Lỗi khi tải dữ liệu từ Google Sheets. Vui lòng thử lại sau.');
        return null;
    }
}

// Sync data with Google
async function syncWithGoogle() {
    if (!isSignedIn()) {
        alert('Vui lòng đăng nhập Google trước khi đồng bộ dữ liệu.');
        return false;
    }
    
    try {
        // Save character data
        const characterId = await saveToGoogleDrive(
            { character: currentCharacter },
            'virtual_lover_character.json'
        );
        
        // Save chat history
        const chatId = await saveToGoogleDrive(
            { chatHistory: chatHistory },
            'virtual_lover_chat.json'
        );
        
        // Save diary entries
        const diaryId = await saveToGoogleDrive(
            { diaryEntries: diaryEntries },
            'virtual_lover_diary.json'
        );
        
        // Save intimacy data
        const intimacyId = await saveToGoogleDrive(
            { 
                intimacyLevel: getIntimacyLevel(),
                diaryMilestones: diaryMilestones
            },
            'virtual_lover_intimacy.json'
        );
        
        console.log('Data synced with Google Drive');
        alert('Đồng bộ dữ liệu thành công!');
        return true;
    } catch (error) {
        console.error('Error syncing with Google:', error);
        alert('Lỗi khi đồng bộ dữ liệu. Vui lòng thử lại sau.');
        return false;
    }
}

// Load data from Google
async function loadFromGoogle() {
    if (!isSignedIn()) {
        alert('Vui lòng đăng nhập Google trước khi tải dữ liệu.');
        return false;
    }
    
    try {
        // Load character data
        const characterData = await loadFromGoogleDrive('virtual_lover_character.json');
        if (characterData && characterData.character) {
            currentCharacter = characterData.character;
            updateCharacterInfo();
        }
        
        // Load chat history
        const chatData = await loadFromGoogleDrive('virtual_lover_chat.json');
        if (chatData && chatData.chatHistory) {
            chatHistory = chatData.chatHistory;
            displayChatHistory();
        }
        
        // Load diary entries
        const diaryData = await loadFromGoogleDrive('virtual_lover_diary.json');
        if (diaryData && diaryData.diaryEntries) {
            diaryEntries = diaryData.diaryEntries;
            displayDiaryEntries();
        }
        
        // Load intimacy data
        const intimacyData = await loadFromGoogleDrive('virtual_lover_intimacy.json');
        if (intimacyData) {
            if (intimacyData.intimacyLevel) {
                setIntimacyLevel(intimacyData.intimacyLevel);
            }
            if (intimacyData.diaryMilestones) {
                diaryMilestones = intimacyData.diaryMilestones;
            }
        }
        
        // Save to localStorage
        saveToLocalStorage();
        
        console.log('Data loaded from Google Drive');
        alert('Tải dữ liệu thành công!');
        return true;
    } catch (error) {
        console.error('Error loading from Google:', error);
        alert('Lỗi khi tải dữ liệu. Vui lòng thử lại sau.');
        return false;
    }
}
