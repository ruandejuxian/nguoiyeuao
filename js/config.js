/**
 * Configuration settings for the Virtual Companion application
 */
const CONFIG = {
    // API settings
    API: {
        GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
        GEMINI_MODEL: 'gemini-1.5-flash',
        STORAGE_KEYS: {
            API_KEY: 'virtual_companion_api_key'
        }
    },
    
    // Character settings
    CHARACTER: {
        STORAGE_KEY: 'virtual_companion_character',
        DEFAULT_AVATAR: 'assets/images/default-avatar.png',
        INTIMACY_LEVELS: [
            { name: 'Mới quen', threshold: 0 },
            { name: 'Bạn bè', threshold: 30 },
            { name: 'Thân thiết', threshold: 60 },
            { name: 'Người yêu', threshold: 100 },
            { name: 'Tri kỷ', threshold: 150 }
        ]
    },
    
    // Chat settings
    CHAT: {
        STORAGE_KEY: 'virtual_companion_chat_history',
        MAX_HISTORY_LENGTH: 50,
        TYPING_DELAY_MIN: 500,
        TYPING_DELAY_MAX: 2000,
        POINTS_PER_MESSAGE: 1,
        POINTS_FOR_KEYWORDS: {
            'yêu': 5,
            'thích': 3,
            'nhớ': 3,
            'thương': 4
        }
    },
    
    // Diary settings
    DIARY: {
        STORAGE_KEY: 'virtual_companion_diary',
        SPECIAL_MOMENTS: [
            'first_chat',
            'first_love_word',
            'high_intimacy'
        ]
    },
    
    // Google API settings
    GOOGLE_API: {
        CLIENT_ID: '536864309230-uh3862et3pemo34k2lr3fhks4db3k5a7.apps.googleusercontent.com', // Replace with your Google Client ID
        API_KEY: 'AIzaSyDSih_kVKFSbPaak6lHIfp1V6fOkCty0rM', // Replace with your Google API Key
        SCOPES: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets',
        DISCOVERY_DOCS: [
            'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
            'https://sheets.googleapis.com/$discovery/rest?version=v4'
        ],
        BACKUP_FILENAME: 'virtual_companion_backup.json',
        SPREADSHEET_TITLE: 'Virtual Companion Data'
    }
};
