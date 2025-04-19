/**
 * Configuration for the Virtual Companion application
 */
const CONFIG = {
    /**
     * Character configuration
     */
    CHARACTER: {
        /**
         * Storage key for character data
         */
        STORAGE_KEY: 'virtual-companion-character',
        
        /**
         * Default avatar
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
        STORAGE_KEY: 'virtual-companion-chat',
        
        /**
         * Maximum number of messages to keep in history
         */
        MAX_HISTORY: 1000,
        
        /**
         * Maximum number of messages to include in context
         */
        MAX_CONTEXT: 20,
        
        /**
         * Maximum file size for uploads (in bytes)
         * Default: 5MB
         */
        MAX_FILE_SIZE: 5 * 1024 * 1024
    },
    
    /**
     * Diary configuration
     */
    DIARY: {
        /**
         * Storage key for diary entries
         */
        STORAGE_KEY: 'virtual-companion-diary',
        
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
        STORAGE_KEY: 'virtual-companion-game',
        
        /**
         * Quiz configuration
         */
        QUIZ: {
            /**
             * Number of questions per round
             */
            QUESTIONS_PER_ROUND: 5,
            
            /**
             * Intimacy points per correct answer
             */
            POINTS_PER_CORRECT: 2
        },
        
        /**
         * Memory game configuration
         */
        MEMORY: {
            /**
             * Grid size
             */
            GRID_SIZE: 4,
            
            /**
             * Intimacy points for completion
             */
            COMPLETION_POINTS: 5
        }
    },
    
    /**
     * API configuration
     */
    API: {
        /**
         * Storage keys for API settings
         */
        STORAGE_KEYS: {
            API_KEY: 'virtual-companion-api-key',
            API_TYPE: 'virtual-companion-api-type'
        },
        
        /**
         * Default model for OpenAI
         */
        DEFAULT_MODEL: 'gpt-3.5-turbo',
        
        /**
         * Character.AI character ID
         */
        CHARACTER_AI_ID: 'default-character-id'
    },
    
    /**
     * Google API configuration
     */
    GOOGLE_API: {
        /**
         * Client ID for Google API
         */
        CLIENT_ID: '123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com',
        
        /**
         * API scopes
         */
        SCOPES: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
        
        /**
         * Backup filename
         */
        BACKUP_FILENAME: 'nguoi-yeu-ao-backup.json',
        
        /**
         * Google Sheets API scope
         */
        SHEETS_SCOPE: 'https://www.googleapis.com/auth/spreadsheets'
    },
    
    /**
     * Theme configuration
     */
    THEME: {
        /**
         * Storage key for theme settings
         */
        STORAGE_KEY: 'virtual-companion-theme',
        
        /**
         * Available themes
         */
        THEMES: ['light', 'dark']
    },
    
    /**
     * Notification configuration
     */
    NOTIFICATION: {
        /**
         * Storage key for notification settings
         */
        STORAGE_KEY: 'virtual-companion-notification',
        
        /**
         * Default notification schedule (in hours)
         */
        DEFAULT_SCHEDULE: 24
    },
    
    /**
     * Special events configuration
     */
    SPECIAL_EVENTS: {
        /**
         * Valentine's Day
         */
        VALENTINES_DAY: {
            month: 2,
            day: 14
        },
        
        /**
         * Christmas
         */
        CHRISTMAS: {
            month: 12,
            day: 25
        },
        
        /**
         * New Year
         */
        NEW_YEAR: {
            month: 1,
            day: 1
        }
    }
};
