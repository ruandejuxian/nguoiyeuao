// Google API integration for Virtual Lover App

// Google API credentials
const GOOGLE_CLIENT_ID = ''; // To be filled by user
const GOOGLE_API_KEY = ''; // To be filled by user

// Google API scopes
const GOOGLE_SCOPES = [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/spreadsheets'
];

// Load Google API
function loadGoogleAPI() {
    // This function will be called when the Google API script is loaded
    console.log('Loading Google API...');
    
    // Create script element
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = initGoogleAPILibrary;
    document.head.appendChild(script);
}

// Initialize Google API library
function initGoogleAPILibrary() {
    console.log('Google API script loaded, initializing...');
    
    // Load auth2 library
    gapi.load('client:auth2', initGoogleClient);
}

// Initialize Google API client
function initGoogleClient() {
    console.log('Initializing Google API client...');
    
    // Check if client ID is set
    if (!GOOGLE_CLIENT_ID) {
        console.warn('Google Client ID not set');
        return;
    }
    
    // Initialize client
    gapi.client.init({
        apiKey: GOOGLE_API_KEY,
        clientId: GOOGLE_CLIENT_ID,
        scope: GOOGLE_SCOPES.join(' ')
    }).then(() => {
        // Listen for sign-in state changes
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        
        // Handle the initial sign-in state
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        
        console.log('Google API client initialized');
    }).catch(error => {
        console.error('Error initializing Google API client:', error);
    });
}

// Update sign-in status
function updateSigninStatus(isSignedIn) {
    console.log('Sign-in status changed:', isSignedIn);
    
    if (isSignedIn) {
        // User is signed in
        const googleAuth = gapi.auth2.getAuthInstance();
        const googleUser = googleAuth.currentUser.get();
        const profile = googleUser.getBasicProfile();
        
        // Update user info
        updateUserInfo(profile);
        
        // Enable cloud buttons
        document.getElementById('save-to-cloud').disabled = false;
        document.getElementById('load-from-cloud').disabled = false;
        document.getElementById('logout-google').disabled = false;
    } else {
        // User is signed out
        clearUserInfo();
        
        // Disable cloud buttons
        document.getElementById('save-to-cloud').disabled = true;
        document.getElementById('load-from-cloud').disabled = true;
        document.getElementById('logout-google').disabled = true;
    }
}

// Update user info
function updateUserInfo(profile) {
    if (!profile) return;
    
    // Update global variables
    googleUser = {
        id: profile.getId(),
        name: profile.getName(),
        email: profile.getEmail(),
        imageUrl: profile.getImageUrl()
    };
    
    isLoggedIn = true;
    
    // Update UI
    const loginStatus = document.getElementById('login-status');
    loginStatus.textContent = `Đã đăng nhập: ${googleUser.email}`;
    loginStatus.style.color = 'green';
}

// Clear user info
function clearUserInfo() {
    // Reset global variables
    googleUser = null;
    isLoggedIn = false;
    
    // Update UI
    const loginStatus = document.getElementById('login-status');
    loginStatus.textContent = 'Chưa đăng nhập';
    loginStatus.style.color = 'inherit';
}

// Actual Google sign-in function
function handleGoogleSignIn() {
    if (!gapi || !gapi.auth2) {
        console.error('Google API not loaded');
        alert('Google API không được tải. Vui lòng kiểm tra kết nối internet và thử lại.');
        return;
    }
    
    const googleAuth = gapi.auth2.getAuthInstance();
    googleAuth.signIn().catch(error => {
        console.error('Error signing in:', error);
        alert('Đăng nhập không thành công. Vui lòng thử lại.');
    });
}

// Google sign-out function
function handleGoogleSignOut() {
    if (!gapi || !gapi.auth2) {
        console.error('Google API not loaded');
        return;
    }
    
    const googleAuth = gapi.auth2.getAuthInstance();
    googleAuth.signOut().then(() => {
        console.log('User signed out');
        clearUserInfo();
    }).catch(error => {
        console.error('Error signing out:', error);
    });
}

// Create a new Google Sheet
function createGoogleSheet(title) {
    return gapi.client.sheets.spreadsheets.create({
        properties: {
            title: title
        }
    }).then(response => {
        console.log('Sheet created:', response.result.spreadsheetId);
        return response.result.spreadsheetId;
    }).catch(error => {
        console.error('Error creating sheet:', error);
        throw error;
    });
}

// Save data to Google Sheet
function saveDataToSheet(sheetId, data) {
    // Prepare data for sheet
    const sheetData = [
        ['Character Name', 'Character Age', 'Character Personality', 'Character Interests', 'Speaking Style', 'Intimacy Level'],
        [
            data.character.name,
            data.character.age || '',
            data.character.personality,
            data.character.interests,
            data.character.speakingStyle || '',
            data.intimacyLevel
        ]
    ];
    
    // Add chat history
    sheetData.push(['Chat History']);
    sheetData.push(['Type', 'Content', 'Timestamp']);
    
    data.chatHistory.forEach(msg => {
        sheetData.push([msg.type, msg.content, msg.timestamp]);
    });
    
    // Add diary entries
    sheetData.push(['Diary Entries']);
    sheetData.push(['Title', 'Content', 'Date']);
    
    data.diaryEntries.forEach(entry => {
        sheetData.push([entry.title, entry.content, entry.date]);
    });
    
    // Update sheet
    return gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: 'Sheet1',
        valueInputOption: 'RAW',
        resource: {
            values: sheetData
        }
    }).then(response => {
        console.log('Sheet updated:', response.result);
        return response.result;
    }).catch(error => {
        console.error('Error updating sheet:', error);
        throw error;
    });
}

// Load data from Google Sheet
function loadDataFromSheet(sheetId) {
    return gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: 'Sheet1'
    }).then(response => {
        console.log('Sheet data loaded:', response.result);
        
        // Parse data
        const values = response.result.values;
        
        if (!values || values.length < 2) {
            throw new Error('Invalid sheet data');
        }
        
        // Parse character data
        const characterData = values[1];
        const character = {
            name: characterData[0],
            age: characterData[1],
            personality: characterData[2],
            interests: characterData[3],
            speakingStyle: characterData[4],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        const intimacyLevel = parseInt(characterData[5]) || 0;
        
        // Find chat history section
        let chatHistoryIndex = -1;
        for (let i = 0; i < values.length; i++) {
            if (values[i][0] === 'Chat History') {
                chatHistoryIndex = i;
                break;
            }
        }
        
        // Parse chat history
        const chatHistory = [];
        if (chatHistoryIndex > 0 && chatHistoryIndex + 2 < values.length) {
            for (let i = chatHistoryIndex + 2; i < values.length; i++) {
                if (values[i][0] === 'Diary Entries') {
                    break;
                }
                
                if (values[i].length >= 3) {
                    chatHistory.push({
                        type: values[i][0],
                        content: values[i][1],
                        timestamp: values[i][2]
                    });
                }
            }
        }
        
        // Find diary entries section
        let diaryEntriesIndex = -1;
        for (let i = 0; i < values.length; i++) {
            if (values[i][0] === 'Diary Entries') {
                diaryEntriesIndex = i;
                break;
            }
        }
        
        // Parse diary entries
        const diaryEntries = [];
        if (diaryEntriesIndex > 0 && diaryEntriesIndex + 2 < values.length) {
            for (let i = diaryEntriesIndex + 2; i < values.length; i++) {
                if (values[i].length >= 3) {
                    diaryEntries.push({
                        id: Date.now() + i,
                        title: values[i][0],
                        content: values[i][1],
                        date: values[i][2]
                    });
                }
            }
        }
        
        return {
            character,
            chatHistory,
            intimacyLevel,
            diaryEntries
        };
    }).catch(error => {
        console.error('Error loading sheet data:', error);
        throw error;
    });
}

// Create a file in Google Drive
function createDriveFile(name, content, mimeType) {
    const metadata = {
        name: name,
        mimeType: mimeType
    };
    
    const blob = new Blob([content], { type: mimeType });
    const file = new File([blob], name, { type: mimeType });
    
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);
    
    return fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + gapi.auth.getToken().access_token
        }),
        body: form
    }).then(response => response.json())
    .then(data => {
        console.log('File created:', data);
        return data.id;
    }).catch(error => {
        console.error('Error creating file:', error);
        throw error;
    });
}

// Load file from Google Drive
function loadDriveFile(fileId) {
    return gapi.client.drive.files.get({
        fileId: fileId,
        alt: 'media'
    }).then(response => {
        console.log('File loaded:', response.result);
        return response.result;
    }).catch(error => {
        console.error('Error loading file:', error);
        throw error;
    });
}

// Initialize Google API on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if client ID is set in settings
    const clientId = localStorage.getItem('virtualLover_googleClientId');
    if (clientId) {
        GOOGLE_CLIENT_ID = clientId;
        loadGoogleAPI();
    }
});
