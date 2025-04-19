/**
 * Configuration for the Virtual Companion application
 */
const CONFIG = {
    /**
     * API configuration
     */
    API: {
        /**
         * API endpoint for chat
         */
        ENDPOINT: 'https://api.openai.com/v1/chat/completions',
        
        /**
         * Storage keys for API
         */
        STORAGE_KEYS: {
            API_KEY: 'openai_api_key'
        },
        
        /**
         * Default model to use
         */
        DEFAULT_MODEL: 'gpt-3.5-turbo'
    },
    
    /**
     * Character configuration
     */
    CHARACTER: {
        /**
         * Storage key for character data
         */
        STORAGE_KEY: 'virtual_companion_character',
        
        /**
         * Default avatar URL
         */
        DEFAULT_AVATAR: 'img/default-avatar.png',
        
        /**
         * Intimacy levels
         */
        INTIMACY_LEVELS: [
            { name: 'Mới quen', threshold: 0 },
            { name: 'Bạn bè', threshold: 10 },
            { name: 'Thân thiết', threshold: 30 },
            { name: 'Người yêu', threshold: 60 },
            { name: 'Tri kỷ', threshold: 100 }
        ]
    },
    
    /**
     * Chat configuration
     */
    CHAT: {
        /**
         * Storage key for chat history
         */
        STORAGE_KEY: 'virtual_companion_chat',
        
        /**
         * Maximum number of messages to keep in history
         */
        MAX_HISTORY: 100,
        
        /**
         * Maximum number of messages to include in context
         */
        MAX_CONTEXT: 10,
        
        /**
         * Typing speed (characters per second)
         */
        TYPING_SPEED: 20,
        
        /**
         * Maximum file size for uploads (in bytes)
         */
        MAX_FILE_SIZE: 5 * 1024 * 1024 // 5MB
    },
    
    /**
     * Diary configuration
     */
    DIARY: {
        /**
         * Storage key for diary entries
         */
        STORAGE_KEY: 'virtual_companion_diary',
        
        /**
         * Maximum number of entries to keep
         */
        MAX_ENTRIES: 100
    },
    
    /**
     * Game configuration
     */
    GAME: {
        /**
         * Storage key for game data
         */
        STORAGE_KEY: 'virtual_companion_game'
    },
    
    /**
     * Google API configuration
     */
    GOOGLE_API: {
        /**
         * Google API key
         */
        API_KEY: '',
        
        /**
         * Google client ID
         */
        CLIENT_ID: '',
        
        /**
         * Google API scopes
         */
        SCOPES: 'https://www.googleapis.com/auth/drive.file',
        
        /**
         * Google API discovery docs
         */
        DISCOVERY_DOCS: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
        
        /**
         * Backup filename
         */
        BACKUP_FILENAME: 'virtual_companion_backup.json'
    }
};
